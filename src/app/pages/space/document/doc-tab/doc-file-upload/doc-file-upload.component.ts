import { Component, Input, OnInit, ViewChild } from '@angular/core';

import { DocDataStorageService } from 'src/@dw/store/doc-data-storage.service';
import { DocumentService } from 'src/@dw/services/collab/space/document.service';
import { saveAs } from 'file-saver';
import { DialogService } from 'src/@dw/dialog/dialog.service';
// table page
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { FileUploadDescriptionComponent } from './file-upload-description/file-upload-description.component';

// view table
export interface PeriodicElement {
  FileName: String,
  Uploader: String,
}
@Component({
  selector: 'app-doc-file-upload',
  templateUrl: './doc-file-upload.component.html',
  styleUrls: ['./doc-file-upload.component.scss']
})
export class DocFileUploadComponent implements OnInit {

  @Input() docId: string;
  private unsubscribe$ = new Subject<void>();
  constructor(
    // public dialog: MatDialog,
    private docService: DocumentService,
    private ddsService: DocDataStorageService,
    private dialogService: DialogService,
    public dialog: MatDialog,
  ) {

  }

  displayedColumns: string[] = ['name', 'creator', 'download', 'delete'];
  public fileData: File;
  public fileName = '';
  public uploadFileInfo;
  public filesArray: any;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngOnInit(): void {
    this.getUploadFileList(this.docId);
    this.ddsService.file$.pipe(takeUntil(this.unsubscribe$))
      .subscribe(
        (data: any) => {
          console.log(data);
          this.filesArray = new MatTableDataSource<PeriodicElement>(data);
          this.filesArray.paginator = this.paginator;
        }
      );
  }
  ngOnDestroy() {
    // unsubscribe all subscription
    this.unsubscribe$.next();
    this.unsubscribe$.complete();

  }

  fileChangeEvent(data) {
    console.log(data.target.files[0]);
    this.fileData = data.target.files[0];
    this.fileName = this.fileData.name;
  }
  uploadFileDelete() {
    this.fileName = '';
    this.fileData = undefined;
  }

  fileUpload() {
    if (!this.fileData) {
      this.dialogService.openDialogNegative('Please, select a file to upload.');
      // alert('Please, select a file to upload.');
    }
    else {

      this.openFileUploadDescription();
      
      
    }
  }
  openFileUploadDescription(){
    const dialogRef = this.dialog.open(FileUploadDescriptionComponent, {
      data: {
				fileData: this.fileData,
				docId: this.docId
			}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      console.log('the file upload description dialog closed');
      if(result){
        this.docService.fileUpload(result.fileData, result.docId, result.description).subscribe(
          (data: any) => {
            if (data.message == 'filesend') {
              this.getUploadFileList(this.docId);
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

  getUploadFileList(docId) {
    this.docService.getUploadFileList({ docId }).subscribe(
      (data: any) => {
        console.log(data);
        const uploadFileList = data.findFileList
        this.ddsService.updataFiles(uploadFileList);//////////
      },
      (err: any) => {
        console.log(err);
      }
    )
  }

  // https://stackoverflow.com/questions/50039015/how-to-download-a-pdf-file-from-an-url-in-angular-5
  fileDownload(data) {
    // saveAs("/uploads/upload_file/" + fileData.filename, fileData.originalname, { type: fileData.fileType });
    this.docService.fileDownload(data._id).subscribe(res =>{
      console.log(res)
      const blob = res;
			saveAs(blob,data.originalname);
    });
    // console.log(fileData)
    //this.dialogService.openDialogPositive('succeed file download!');
  }

  deleteUploadFile(fileId) {
    console.log('delete upload fileeeee');
    // const result = confirm('파일을 삭제하시겠습니까?');
    // if(result){
    console.log(fileId)
    this.dialogService.openDialogConfirm('Do you want to delete the file?').subscribe(result => {
      if (result) {
        this.docService.deleteUploadFile({ fileId }).subscribe(
          (data: any) => {
            console.log(data);
            this.getUploadFileList(this.docId);
            this.dialogService.openDialogPositive('Successfully,the file has been deleted.')
          },
          (err: any) => {
            console.log(err)
          }
        )
      }
    });
  }
}