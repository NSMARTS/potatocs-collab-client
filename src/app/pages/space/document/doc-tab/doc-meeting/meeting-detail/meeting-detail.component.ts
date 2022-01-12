import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DialogService } from 'src/@dw/dialog/dialog.service';
import { DocumentService } from 'src/@dw/services/collab/space/document.service';
import { DataService } from 'src/@dw/store/data.service';
import { MeetingListStorageService } from 'src/@dw/store/meeting-list-storage.service';
import { MemberDataStorageService } from 'src/@dw/store/member-data-storage.service';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-meeting-detail',
    templateUrl: './meeting-detail.component.html',
    styleUrls: ['./meeting-detail.component.scss']
})
export class MeetingDetailComponent implements OnInit {

    private API_URL = environment.API_URL;

    isHost: Boolean;
    isMeetingOpen: Boolean;
    meetingStatus;  // 미팅의 status
    meetingInfo;
    enlistedMemberName = [];

    private unsubscribe$ = new Subject<void>();

    constructor(
        public dialogRef: MatDialogRef<MeetingDetailComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,

        private dataService: DataService,
        private mdsService: MemberDataStorageService,
        private docService: DocumentService,
        private dialogService: DialogService,
        private meetingListStorageService: MeetingListStorageService
    ) { }

    ngOnInit(): void {

        this.meetingListStorageService.meeting$.pipe(takeUntil(this.unsubscribe$)).subscribe(
            (data: any) => {
                for (let index = 0; index < data.length; index++) {
                    const element = data[index]._id;
                    if(element == this.data._id){
                        this.meetingInfo = data[index];
                    }   
                }
            }
        )
        console.log(this.meetingInfo);



        // 미팅 status 를 보고 들어갈 수 있는지 없는지 isMeetingOpen
        console.log(this.data.status);
        if (this.data.status == 'pending' || this.data.status == 'Close') {
            this.isMeetingOpen = false;
        }
        else if (this.data.status == 'Open') {
            this.isMeetingOpen = true;
        }

        // space의 멤버 이름을 가져옴
        this.mdsService.members.pipe(takeUntil(this.unsubscribe$)).subscribe(
            (data: any) => {
                for (let index = 0; index < data[0].memberObjects.length; index++) {
                    this.enlistedMemberName.push(data[0].memberObjects[index].name);
                }
            },
            (err: any) => {
                console.log(err);
            }
        );

        // 프로필을 가져와서 내가 이 미팅의 호스트인지를 확인
        this.dataService.userProfile.pipe(takeUntil(this.unsubscribe$)).subscribe(
            (res: any) => {
                console.log(res);

                if (res._id == this.data.manager) {
                    this.isHost = true;
                }
                else {
                    this.isHost = false;
                }
            }
        );
    }

    ngOnDestroy() {
        // unsubscribe all subscription
        this.unsubscribe$.next();
        this.unsubscribe$.complete();

    }

    // 호스트가 미팅을 연다
    openMeeting() {
        let data = {
            _id: this.data._id,
            docId: this.data.docId,
            status: 'Open'
        }
        this.isMeetingOpen = true;
        this.docService.openMeeting(data).subscribe(
            (data: any) => {
                console.log(data);
            },
            (err: any) => {
                console.log(err);
            }
        )
        // 미팅 입장
        // this.enterMeeting();
    }

    // 호스트가 미팅을 닫는다 -> 실시간 회의만 불가능, 업로드 된 파일이나 기록 확인 가능
    closeMeeting() {
        let data = {
            _id: this.data._id,
            docId: this.data.docId,
            status: 'Close'
        }
        this.isMeetingOpen = false;
        this.docService.closeMeeting(data).subscribe(
            (data: any) => {
                console.log(data);
            },
            (err: any) => {
                console.log(err);
            }
        )
    }

    // 호스트가 미팅을 삭제 -> 닫는거와 다르게 다 지워버리고 미팅을 없애버림
    deleteMeeting() {
        const data = this.data;
        this.dialogService.openDialogConfirm('Do you want to delete the meeting?').subscribe(result => {
            if (result) {
      
              // meeting 삭제
              // meeting pdf 삭제
              this.docService.deleteMeetingPdfFile(data).subscribe((data: any) => {
                // console.log(data)
              },
                (err: any) => {
                  console.log(err);
                }
              );
      
              // meeting안에 있는 채팅 삭제
              this.docService.deleteAllOfChat(data).subscribe((data: any) => {
                // console.log(data)
              },
                (err: any) => {
                  console.log(err);
                }
              );
      
              // 미팅 삭제
              this.docService.deleteMeeting(data).subscribe(
                (data: any) => {
                  console.log(data);
                  this.dialogService.openDialogPositive('Successfully,the meeting has been deleted.');
                },
                (err: any) => {
                  console.log(err);
                }
              )
            }
          });
    }

    // 미팅에 참여하는 버튼
    enterMeeting() {
        if( this.isMeetingOpen ) {
            window.open(this.API_URL + '/meeting/room/' + this.data._id);
        }
        else if( !this.isMeetingOpen ){
            this.dialogService.openDialogNegative('The meeting has not been held yet... Ask the host to open meeting ')
        }
        // console.log(data)
        // this.docService.joinMeeting(data);
    }

    // close 버튼
    dialogClose() {
        this.dialogRef.close();
    }
}