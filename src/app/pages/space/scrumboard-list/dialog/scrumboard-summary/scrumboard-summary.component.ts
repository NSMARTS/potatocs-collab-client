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
import { ScrumboardListComponent } from '../../scrumboard-list.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { update } from 'lodash';
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

    creators: any[] = [];
    user;
    basicProfile = '/assets/image/person.png';
    filesArray;
    chatArray;
    docTitle;
    selectedMember;
    selectedMemberData: any[] = [];
    selectedMemberData2: any[] = [];

    docDescription;
    // meetingArray;
    public fileData: File;
    public fileName = '';
    textareaFlag: boolean;
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
        private authService: AuthService,
        private snackbar: MatSnackBar,

    ) {
        this.getUploadFileList(this.data.document.doc_id);
    }

    ngOnInit(): void {
        console.log(this.data);
        this.docTitle = this.data.document.docTitle;
        this.docService.getInfo(this.data.document.doc_id).subscribe(
            (docData: any) => {
                this.docDescription = docData.docInfo.docDescription
                //this.docTitle = docData.docInfo.docTitle;
                
            },
            (err: any) => {
                console.log(err);
            }
        )
        
        //##park
        //default selectedMember를 creator로 초기화시킴
        this.selectedMember = this.data.document.creator.map(a=>a._id);


        const userId = this.authService.getTokenInfo()._id

        // extracting creator data from injected data 
        for (let index = 0; index < this.data.member.length; index++) {
            const member_id = this.data.member[index]._id;
            //스페이스의 멤버 
            // console.log(member_id)
            // console.log(this.data.document.creator);
            // console.log(this.data.document.creator[0]._id.includes(member_id));
            // console.log(this.data.member[index]);
            //이 member_id가 크리에이터 안에 있을때
            if (this.data.document.creator[0]._id.includes(member_id)) {
                this.creators?.push(this.data.member[index]);
            }

            //로그인된 아이디가 멤버아이디와 같을때
            if( member_id == userId){
                this.user = this.data.member[index];
            }
        }
       console.log(this.data.document.creator);

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

    ngOnChanges(){
        console.log(this.data);
        this.docService.getInfo(this.data.document.doc_id).subscribe(
            (data: any) => {
                this.docDescription = data.docInfo.docDescription
                console.log("aa");
            },
            (err: any) => {
                console.log(err);
            }
        )
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

    //타이틀 변경 텍스트 에리어 활성화
    textareaAble() {
        this.textareaFlag = true;
    }

    //타이틀 변경 텍스트 에리어 비활성화
    textareaDisable() {
        this.textareaFlag = false;
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


    // 문서 삭제하기
    deleteDoc() {
		// const result = confirm('문서에 업로드 된 파일도 모두 삭제됩니다. 그래도 삭제하시겠습니까?');

		// if (result) {

		this.dialogService.openDialogConfirm('All files uploaded to the document will also be deleted. Do you still want to delete this document?').subscribe(result => {
			if (result) {
				const docId = this.data.document.doc_id;
               
				this.docService.deleteDoc({ docId }).subscribe(
					(data: any) => {
						this.dialogService.openDialogPositive('Successfully,the document has been deleted.');
                        this.dialogRef.close();
					},
					(err: any) => {
						console.log(err);
					}
				)
			}
			// else {
			// 	console.log('문서 삭제 취소')
			// }
		});
	}


    //문서 타이틀 바꾸기
    titleChange(value){        
        if(value.replace(/\s/g, "").length === 0){
            this.dialogService.openDialogNegative('Please');
            return;
        }
        const data = {
            doc_id: this.data.document.doc_id,
            space_id : this.data.document.space_id,
            changeTitle: value,
        }
        


        this.data.document.docTitle = value;
        this.docService.titleChange(data).subscribe(
            (data: any) => {
                this.snackbar.open('doc title change', 'Close', {
                    duration: 3000,
                    horizontalPosition: "center"
                });
                
                this.textareaFlag = false;
            },
            (err: any) => {

            }
        )
        
        this.ngOnInit();
        this.textareaDisable();
    }


    //#park
    //creator 변경하기
    memberSelect(){

        const updateDocEntry = {
            doc_id: this.data.document.doc_id,
            _id: this.selectedMember,

        }
        const temp = [];

        if(this.selectedMember.length === 0){
            this.selectedMember= [this.data.document.creator[0]._id];
            this.dialogService.openDialogNegative('Please one people');
            return;
        }
        for(const member of this.data.member ){
            if(this.selectedMember.includes(member._id)){
                temp.push(member);
            }
        }
        
        this.data.document.creator=temp        


        this.docService.updateDocEntry(updateDocEntry).subscribe(
            (data: any) => {
                if (data.message == 'updated') {
                    // this.dialogService.openDialogPositive('succeed document save!');
                    // this.router.navigate(['/collab/space/' + this.spaceTime]);
                }
            },
            (err: any) => {
                console.log(err);
            }
        );
    }
}
