import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { saveAs } from 'file-saver';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DocumentService } from 'src/@dw/services/collab/space/document.service';
import { CommonService } from 'src/@dw/services/common/common.service';
import { DocDataStorageService } from 'src/@dw/store/doc-data-storage.service';
import { MeetingListStorageService } from 'src/@dw/store/meeting-list-storage.service';
import * as moment from 'moment';
import { MatPaginator } from '@angular/material/paginator';
import { DialogService } from 'src/@dw/dialog/dialog.service';
import { MeetingDetailComponent } from '../../../meeting-list/meeting-detail/meeting-detail.component';
import { Router } from '@angular/router';
import { FileUploadDescriptionComponent } from '../../../document/doc-tab/doc-file-upload/file-upload-description/file-upload-description.component';
import { FileUploadDetailsComponent } from '../../../document/doc-tab/doc-file-upload/file-upload-details/file-upload-details.component';
import { AuthService } from 'src/@dw/services/auth/auth.service';

export interface PeriodicElementFile {
    FileName: String,
    Uploader: String,
}

// export interface PeriodicElementMeeting {
//     Meeting: String;
//     Date: Date;
//     // Time: String,
// }

@Component({
    selector: 'app-scrumboard-summary',
    templateUrl: './scrumboard-summary.component.html',
    styleUrls: ['./scrumboard-summary.component.scss']
})

export class ScrumboardSummaryComponent implements OnInit {

    pageSizeOptions
    displayedFile: string[] = ['name', 'creator', 'download', 'delete'];
    @ViewChild(MatPaginator) paginator: MatPaginator;

    creator;
    user;
    basicProfile = '/assets/image/person.png';
    filesArray;
    chatArray;

    docDescription;
    // meetingArray;
    public fileData: File;
    public fileName = '';

    chatContent

    private unsubscribe$ = new Subject<void>();

    constructor(
        public dialogRef: MatDialogRef<ScrumboardSummaryComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private docService: DocumentService,
        private ddsService: DocDataStorageService,
        private commonService: CommonService,
        private dialogService: DialogService,
        public dialog: MatDialog,
        private router: Router,
        private authService: AuthService
    ) {
        this.getUploadFileList(this.data.document.doc_id);
    }

    ngOnInit(): void {

        this.docService.getInfo(this.data.document.doc_id).subscribe(
            (data: any) => {
                this.docDescription = data.docInfo.docDescription
                // console.log(data.docInfo.docDescription);
            },
            (err: any) => {
                console.log(err);
            }
        )
        
        
        const userId = this.authService.getTokenInfo()._id

        // extracting creator data from injected data 
        for (let index = 0; index < this.data.member.length; index++) {
            const member_id = this.data.member[index]._id;
            console.log(this.data.member[index]);
            if (member_id == this.data.document.creator) {
                this.creator = this.data.member[index];
            }
            if( member_id == userId){
                this.user = this.data.member[index];
            }
        }

        // upload file data
        this.ddsService.file$.pipe(takeUntil(this.unsubscribe$)).subscribe(
            (data: any) => {
                this.filesArray = data;
                // this.filesArray = new MatTableDataSource<PeriodicElementFile>(data);
                this.filesArray.paginator = this.paginator;
            }
        );
        
        // comment data
        this.getChatInDoc(this.data.document.doc_id);
    }

    ngOnDestroy() {
        // unsubscribe all subscription
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }

    ////////////// UPLOAD FILE ///////////////////
    // get upload file data and save storage
    getUploadFileList(docId) {
        this.docService.getUploadFileList({ docId }).subscribe(
            (data: any) => {
                // console.log(data);
                const uploadFileList = data.findFileList
                this.ddsService.updataFiles(uploadFileList);//////////
            },
            (err: any) => {
                console.log(err);
            }
        )
    }

    // upload file change
    fileChangeEvent(data) {
        // console.log(data.target.files[0]);
        this.fileData = data.target.files[0];
        this.fileName = this.fileData.name;
    }

    // upload file cancel
    uploadFileDelete() {
        this.fileName = '';
        this.fileData = undefined;
    }

    // file upload btn
    fileUpload() {
        if (!this.fileData) {
            this.dialogService.openDialogNegative('Please, select a file to upload.');
        }
        else {
            this.openFileUploadDescription();
        }
    }

    // 업로드 다이어로그 description 넣는 곳
    openFileUploadDescription() {
        const dialogRef = this.dialog.open(FileUploadDescriptionComponent, {
            data: {
                fileData: this.fileData,
                docId: this.data.document.doc_id
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            console.log('the file upload description dialog closed');
            // result 에 값이 오면 업로드
            if (result) {
                this.docService.fileUpload(result.fileData, result.docId, result.description).subscribe(
                    (data: any) => {
                        if (data.message == 'filesend') {
                            this.getUploadFileList(this.data.document.doc_id);
                            console.log('connected');
                            this.dialogService.openDialogPositive('Successfully, the file has been uploaded.');
                        }
                    },
                    (err: any) => {
                        console.log(err);
                    }
                );
            }
        })
    }

    // file upload detail / file name 누르면 나오는 dialog
    openFileUploadDetail(fileData) {
        // console.log(fileData);
        const dialogRef = this.dialog.open(FileUploadDetailsComponent, {
            data: {
                fileData: fileData
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            console.log('the file upload detail dialog closed');

        })
    }

    // table 에서 다운로드 누르면 다운로드
    fileDownload(data) {
        this.docService.fileDownload(data._id).subscribe(res => {
            const blob = res;
            saveAs(blob, data.originalname);
        });
    }

    // table 에서 휴지통 누르면 삭제
    deleteUploadFile(fileId, docId) {
        // console.log('delete upload fileeeee');
        this.dialogService.openDialogConfirm('Do you want to delete the file?').subscribe(result => {
            if (result) {
                this.docService.deleteUploadFile({ fileId }).subscribe(
                    (data: any) => {
                        // console.log(data);
                        this.getUploadFileList(docId);
                        this.dialogService.openDialogPositive('Successfully, the file has been deleted.')
                    },
                    (err: any) => {
                        console.log(err)
                    }
                )
            }
        });
    }
    ////////////// UPLOAD FILE ///////////////////

    ////////////// COMMENT //////////////////////
    // get comment data
    getChatInDoc(docId) {
        const data = {
            docId: docId,
            from : 'scrum'
        }
        const today = new Date();
        this.docService.getChatInDoc(data).subscribe(
            (data: any) => {
                this.chatArray = data.getChatInDoc;

                for (let i = 0; i < this.chatArray.length; i++) {
                    const date = this.commonService.dateFormatting(this.chatArray[i].createdAt, 'chatDate');
                    this.chatArray[i].createdAt = moment(date).from(moment(today));;

                    for (let j = 0; j < this.data.member.length; j++) {
                        const memberId = this.data.member[j]._id;
                        if(this.chatArray[i].chatMemberId == memberId){
                            this.chatArray[i].profile_img = this.data.member[j].profile_img;
                        }
                    }
                }
            },
            (err: any) => {
                console.log(err);
            }
        )
    }

    createComment(){
        // console.log(this.chatContent);
        let docId = this.data.document.doc_id;
        var data = {
            docId: docId,
            chatContent: this.chatContent,
            isDialog: true
        }

        this.docService.createChat(data).subscribe(
            (data: any) => {
                this.getChatInDoc(docId);
                this.chatContent = '';
            },
            (err: any) => {
                console.log(err);
            }
        )
    }
    ////////////// COMMENT //////////////////////

    // description
    // https://rottk.tistory.com/entry/Angular-%EA%B8%B0%EC%B4%88%EB%93%A4-%EC%82%AC%EC%9A%A9%EC%9E%90%EC%9E%85%EB%A0%A5#toc2
    description(value){
        console.log(value);
        const data = {
            docId : this.data.document.doc_id,
            docDescription : value
        }
        // console.log(data);
        this.docService.editDocDescription(data).subscribe(
            (data: any) => {
                console.log(data);
            },
            (err: any) => {
                console.log(err);
            }
        )

    }


    // detail 버튼
    moveDetail(){
        const docQuery = {
			id: this.data.document.doc_id
		}
        this.router.navigate(['collab/space/'+this.data.space_id+'/doc'], { queryParams: docQuery });
    }
}
