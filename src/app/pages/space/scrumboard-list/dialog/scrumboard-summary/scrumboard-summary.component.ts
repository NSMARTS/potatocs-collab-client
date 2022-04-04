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
import { MeetingDetailComponent } from '../../../document/doc-tab/doc-meeting/meeting-detail/meeting-detail.component';
import { Router } from '@angular/router';

export interface PeriodicElementFile {
    FileName: String,
    Uploader: String,
}

export interface PeriodicElementMeeting {
    Meeting: String;
    Date: Date;
    // Time: String,
}

@Component({
    selector: 'app-scrumboard-summary',
    templateUrl: './scrumboard-summary.component.html',
    styleUrls: ['./scrumboard-summary.component.scss']
})

export class ScrumboardSummaryComponent implements OnInit {

    pageSizeOptions
    displayedFile: string[] = ['name', 'creator', 'download', 'delete'];
    @ViewChild(MatPaginator) paginator: MatPaginator;

    displayedMeeting: string[] = ['meetingTitle', 'start_date', 'start_time'];
    @ViewChild(MatPaginator) paginatorMeeting: MatPaginator;


    creator;
    basicProfile = '/assets/image/person.png';
    filesArray;
    chatArray;
    meetingArray;

    private unsubscribe$ = new Subject<void>();

    constructor(
        public dialogRef: MatDialogRef<ScrumboardSummaryComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private docService: DocumentService,
        private ddsService: DocDataStorageService,
        private commonService: CommonService,
        private meetingListStorageService: MeetingListStorageService,
        private dialogService: DialogService,
        public dialog: MatDialog,
        private router: Router,
    ) {
        this.getUploadFileList(this.data.document.doc_id);
    }

    ngOnInit(): void {
        console.log(this.data);

        // extracting creator data from injected data 
        for (let index = 0; index < this.data.member.length; index++) {
            const member_id = this.data.member[index]._id;

            if (member_id == this.data.document.creator) {
                this.creator = this.data.member[index];
            }
        }

        // upload file data
        
        this.ddsService.file$.pipe(takeUntil(this.unsubscribe$)).subscribe(
            (data: any) => {
                console.log(data);
                this.filesArray = data;
                // this.filesArray = new MatTableDataSource<PeriodicElementFile>(data);
                this.filesArray.paginator = this.paginator;
                console.log(this.filesArray);
            }
        );
        

        // comment data
        this.getChatInDoc(this.data.document.doc_id);

        // meeting data
        this.getMeetingList(this.data.document.doc_id);
        this.meetingListStorageService.meeting$.pipe(takeUntil(this.unsubscribe$)).subscribe(
            (data: any) => {
                this.meetingArray = data;
                console.log(this.meetingArray);
                // this.meetingArray = new MatTableDataSource<PeriodicElementMeeting>(this.meetingArray);
                this.meetingArray.paginatorMeeting = this.paginatorMeeting;
            }
        )

    }
    ngOnDestroy() {
        // unsubscribe all subscription
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }


    ////////////// upload file///////////////////
    // get upload file data and save storage
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
    fileDownload(data) {
        // saveAs("/uploads/upload_file/" + fileData.filename, fileData.originalname, { type: fileData.fileType });
        this.docService.fileDownload(data._id).subscribe(res => {
            console.log(res)
            const blob = res;
            saveAs(blob, data.originalname);
        });
        // console.log(fileData)
        //this.dialogService.openDialogPositive('succeed file download!');
    }

    deleteUploadFile(fileId, docId) {
        console.log('delete upload fileeeee');
        // const result = confirm('파일을 삭제하시겠습니까?');
        // if(result){
        console.log(fileId)
        this.dialogService.openDialogConfirm('Do you want to delete the file?').subscribe(result => {
            if (result) {
                this.docService.deleteUploadFile({ fileId }).subscribe(
                    (data: any) => {
                        console.log(data);
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
    ////////////// upload file///////////////////

    // get comment data
    getChatInDoc(docId) {
        const today = new Date();
        this.docService.getChatInDoc({ docId }).subscribe(
            (data: any) => {
                // console.log(data);
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
                console.log(this.chatArray);
            },
            (err: any) => {
                console.log(err);
            }
        )
    }

    // get meeting data
    getMeetingList(docId) {
        let data = {
            docId: docId,
        };
        this.docService.getMeetingList(data).subscribe(
            (data: any) => {

            },
            (err: any) => {
                console.log(err);
            },
        );
    }

    // 미팅 디테일 오픈
    openDialogMeetingDetail(data) {

        const dialogRef = this.dialog.open(MeetingDetailComponent, {

            data: {
                _id: data._id,
                docId: data.docId,
                meetingTitle: data.meetingTitle,
                manager: data.manager,
                createdAt: data.createdAt,
                enlistedMembers: data.enlistedMembers,
                start_date: data.start_date,
                start_time: data.start_time,
                status: data.status,
                space_id: this.data.space_id,
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            console.log('dialog close');
            // this.getMeetingList();
        });
    }

    moveDetail(){
        this.router.navigate(['collab/space/'+this.data.space_id+'/doc'], { queryParams: this.data.document.doc_id });
    }
}
