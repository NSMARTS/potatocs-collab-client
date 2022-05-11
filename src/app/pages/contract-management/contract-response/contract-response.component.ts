import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { ContractMngmtService } from 'src/@dw/services/contract-mngmt/contract/contract-mngmt.service';
import { FileService } from 'src/@dw/services/contract-mngmt/file/file.service';
import { PdfStorageService } from 'src/@dw/services/contract-mngmt/storage/pdf-storage.service';
import { ViewInfoService } from 'src/@dw/services/contract-mngmt/store/view-info.service';
import { ZoomService } from 'src/@dw/services/contract-mngmt/zoom/zoom.service';

@Component({
    selector: 'app-contract-response',
    templateUrl: './contract-response.component.html',
    styleUrls: ['./contract-response.component.scss']
})
export class ContractResponseComponent implements OnInit {

    contractId;


    private unsubscribe$ = new Subject<void>();

    constructor(
        private route: ActivatedRoute,
        private viewInfoService: ViewInfoService,
        private pdfStorageService: PdfStorageService,
        private fileService: FileService,
        private zoomService: ZoomService,
        private contractMngmtService: ContractMngmtService,
    ) { }

    ngOnInit(): void {
        this.contractId = this.route.snapshot.params['id'];

        if(this.contractId != undefined) {
            this.updateDocuments();
        }
        
    }
    ///////////////////////////////////////////////////////////

    ngOnDestroy() {
        // unsubscribe all subscription
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }

    /**
     * Open Local PDF File
     *  - Board File View Component의 @output
     *  - File upload
     *
     * @param newDocumentFile
     */
    async onDocumentOpened(newDocumentFile) {

        this.pdfStorageService.memoryRelease();

        const numPages = await this.fileService.openDoc(newDocumentFile);
        

        // console.log(this.pdfStorageService.pdfVar);
        const obj = {
            isDocLoaded: true,
            loadedDate: new Date().getTime(),
            numPages: numPages,
            currentPage: 1,
            zoomScale: this.zoomService.setInitZoomScale()
        };

        this.viewInfoService.setViewInfo(obj);
    }



    /**
   *
  * 서버에서 meeting id에 따른 document data 수신
  * - 수신 후 필요한 document data download
  * - pdf와 draw event local에 저장
  *
  */
    async updateDocuments() {
            
        console.log('>> do Update Contract');

        const data = {
            _id: this.contractId
        }

        // contract_id에 해당하는 contract 정보 수신
        const result: any = await this.contractMngmtService.getContractInfo(data).toPromise();

        console.log('[API] <----- RX Contract Info : ', result);

        // 문서가 없으면 동작 안함
        if (!result.contractResult || result.contractResult.length == 0) {
            console.log('no Documents');
            return null;
        }

        // 1. get PDF File & Generate Pdf File Buffer
        const contractResult = await this.generatePdfData(result);

        console.log(contractResult)

        // 2. PDF DRAW Storage Update
        await this.updatePdfAndDrawStorage(contractResult);

        // 3. view status update
        this.updateViewInfoStore();
    }



    /**
   * 각 PDF document api 요청 / 수신
   * @param result
   * @returns
   */

    async generatePdfData(result) {

        const pdfArrayVar = this.pdfStorageService.pdfVar;

        // console.log(pdfArrayVar)

        // this._docIdList.push(result.contractResult[i]._id);
        const updatedTime = result.contractResult.updatedAt;

        ////////////////////////////////////////////////////////////////////////
        // PDF File Buffer update
        // pdf가 load된 시간을 비교하여 변경된 경우에만 file 요청)
        // https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Operators/Optional_chaining
        if (pdfArrayVar?.updatedAt !== updatedTime) {
            try {

                const data = {
                    _id: result.contractResult._id
                }


                // PDF File 정보 요청
                const res = await this.contractMngmtService.getPdfFile(data).toPromise()

                // Array buffer로 변환
                const file = await this.fileService.readFile(res);
                result.contractResult.fileBuffer = file;

            } catch (err) {
                console.log(err);
                return err;
            }
        }

        // 이미 있는 filebuffer에 대해서는 기존 array buffer값을 복사
        else {
            result.contractResult.fileBuffer = pdfArrayVar.fileBuffer;
        }
        ////////////////////////////////////////////////////////////////////////

        return result.contractResult;
    }


    /**
   * 수신된 PDF Document 와 Draw Data 저장
   * - pdf 변환
   */
    async updatePdfAndDrawStorage(contractData) {

        console.log(">> do:update Pdf And Draw Storage");

        /*---------------------------------------
          pdf 관련 변수 초기화 : 기존의 pdf clear 및 destroy 수행
        -----------------------------------------*/
        this.pdfStorageService.memoryRelease();

        // 현재 저장된 PDF Array 변수
        let pdfVarArray = this.pdfStorageService.pdfVar;

        //1. Document 별 판서 Event 저장
        // this.drawStorageService.setDrawEventSet(i + 1, documentData[i].drawingEventSet);
        // console.log(this.drawStorageService.drawVarArray)
        // 2. PDF 관련값 저장 및 PDF 변환
        pdfVarArray._id = contractData._id;
        pdfVarArray.fileBuffer = contractData.fileBuffer;
        pdfVarArray.updatedAt = contractData.updatedAt;
        pdfVarArray.fileName = contractData.originalFileName;

        // console.log(contractData)


        // PDF 변환 및 추가 저장
        const result = await this.fileService.pdfConvert(pdfVarArray.fileBuffer);

        pdfVarArray.pdfDestroy = result.pdfDoc;
        pdfVarArray.pdfPages = result.pdfPages;

        //  PDF Docouments storage에 저장
        this.pdfStorageService.setPdfVar(pdfVarArray);
        // console.log(this.drawStorageService.drawVarArray)

        return;
    }



    /**
   *
   * ViewInfo Store update
   * -> document Info 부분 udpate
   *    - document _id, currentPage, numPages, fileName
   *
   * -> currentDocId, current DocNum, currentPage field 초기화
   *
   */

    updateViewInfoStore() {
        const obj = {
            isDocLoaded: true,
            loadedDate: new Date().getTime(),
            numPages: this.pdfStorageService.pdfVar.pdfPages.length,
            currentPage: 1,
            zoomScale: this.zoomService.setInitZoomScale()
        };

        this.viewInfoService.setViewInfo(obj);
    }
    ///////////////////////////////////////////////////////////

}

