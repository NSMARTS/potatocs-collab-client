import { Component, HostListener, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DocumentService } from 'src/@dw/services/collab/space/document.service';
import { ActivatedRoute } from '@angular/router';
import { MemberDataStorageService } from 'src/@dw/store/member-data-storage.service';
import { CommonService } from 'src/@dw/services/common/common.service';

//table page
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { DialogService } from 'src/@dw/dialog/dialog.service';
import { takeUntil } from 'rxjs/operators';
import { fromEvent, Observable, Subject, Subscription } from 'rxjs';

// env
import { environment } from 'src/environments/environment';
import { MeetingDetailComponent } from './meeting-detail/meeting-detail.component'
import { MeetingListStorageService } from 'src/@dw/store/meeting-list-storage.service';

//view table
export interface PeriodicElement {
    Meeting: String;
    Date: Date;
    // Time: String,
}

@Component({
    selector: 'app-meeting-list',
    templateUrl: './meeting-list.component.html',
    styleUrls: ['./meeting-list.component.scss']
})
export class MeetingListComponent implements OnInit {

    mobileWidth: any;
    pageSize;
    pageSizeOptions;

    // 브라우저 크기 변화 체크 ///
    resizeObservable$: Observable<Event>
    resizeSubscription$: Subscription
    ///////////////////////
    pageEvent: PageEvent


    meetingArray;
    spaceTime: any;
    displayedColumns: string[] = ['meetingTitle','meetingDescription', 'start_date', 'start_time'];
    @ViewChild(MatPaginator) paginator: MatPaginator;
    private unsubscribe$ = new Subject<void>();
    
    constructor(
        public dialog: MatDialog,
        private docService: DocumentService,
        private route: ActivatedRoute,
        private commonService: CommonService,
        private dialogService: DialogService,
        private meetingListStorageService: MeetingListStorageService,
        
    ) {

    }

    ngOnInit(): void {

        this.spaceTime = this.route.snapshot.params.spaceTime;
        console.log(this.spaceTime);

        this.getMeetingList();

        this.meetingListStorageService.meeting$.pipe(takeUntil(this.unsubscribe$)).subscribe(
            (data: any) => {
                this.meetingArray = data;
                console.log(this.meetingArray);
                // this.meetingArray = new MatTableDataSource<PeriodicElement>(this.meetingArray);
                // this.onResize();
                this.meetingArray.paginator = this.paginator;
            }
        )
    }
    ngOnDestroy() {
        // unsubscribe all subscription
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
        this.resizeSubscription$.unsubscribe()

    }

    // 미팅 리스트 가져오기
    getMeetingList() {
        let data = {
            spaceId: this.spaceTime,
        };
        this.docService.getMeetingList(data).subscribe(
            (data: any) => {

            },
            (err: any) => {
                console.log(err);
            },
        );
    }
    
    // 미팅 생성 
    openDialogDocMeetingSet() {
        const dialogRef = this.dialog.open(DialogMeetingSetComponent, {
            data: {
                spaceId: this.spaceTime
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            console.log('dialog close');
            // this.getMeetingList();
        });
    }

    // 미팅 디테일 오픈
    openDialogMeetingDetail(data){
        const dialogRef = this.dialog.open(MeetingDetailComponent, {

            data: {
                _id: data._id,
                spaceId: data.spaceId,
                meetingTitle: data.meetingTitle,
                meetingDescription: data.meetingDescription,
                manager: data.manager,
                createdAt: data.createdAt,
                enlistedMembers: data.enlistedMembers,
                // isDone: false,
                start_date: data.start_date,
                start_time: data.start_time,
                status: data.status,
                space_id: this.spaceTime,
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            console.log('dialog close');
            // this.getMeetingList();
        });
    }
    
}






///////////////////////////////////////////////////////////
// 미팅 생성하는 dialog
@Component({
    selector: 'app-meeting-set',
    templateUrl: './dialog/meeting-set.html',
    styleUrls: ['./meeting-list.component.scss']
})
export class DialogMeetingSetComponent implements OnInit {

    today = new Date()
    // defaultHour: String = String(this.today.getHours() + 1);

    setMeetingForm = new FormGroup({
        startDate: new FormControl(this.today),
        meetingTitle: new FormControl(),
        meetingDescription: new FormControl(),
        startHour: new FormControl('12'),
        startMin: new FormControl('00'),
        startUnit: new FormControl('PM'),
    });


    hourList = [
        { value: '1' }, { value: '2' }, { value: '3' }, { value: '4' }, { value: '5' }, { value: '6' },
        { value: '7' }, { value: '8' }, { value: '9' }, { value: '10' }, { value: '11' }, { value: '12' },
    ];
    minList = [
        { value: '00' }, { value: '15' }, { value: '30' }, { value: '45' },
    ];
    timeUnit = [
        { value: 'PM' }, { value: 'AM' }
    ]

    spaceId;
    enlistedMember = [];
    enlistedMemberName = [];
    private unsubscribe$ = new Subject<void>();
    constructor(
        public dialogRef: MatDialogRef<DialogMeetingSetComponent>,
        private docService: DocumentService,
        private route: ActivatedRoute,
        private mdsService: MemberDataStorageService,
        private dialogService: DialogService,
        @Inject(MAT_DIALOG_DATA) public data: any,
    ) {

        this.spaceId = data.spaceId
        // console.log(this.spaceId);

        this.mdsService.members.pipe(takeUntil(this.unsubscribe$)).subscribe(
            (data: any) => {
                // console.log(data);
                for (let index = 0; index < data[0].memberObjects.length; index++) {
                    this.enlistedMember.push(data[0].memberObjects[index]._id);
                }
            },
            (err: any) => {
                console.log(err);
            }
        );
    }

    ngOnInit(): void {
        console.log(this.today.getHours() + 1)
    }


    ngOnDestroy() {
        // unsubscribe all subscription
        this.unsubscribe$.next();
        this.unsubscribe$.complete();

    }


    // 미팅 만들기
    createMeeting() {

        this.dialogService.openDialogConfirm('Do you want to set up a meeting?').subscribe(result => {
            if (result) {

                // currentMember 만들기 -> 실시간 미팅에서 쓰임
                let currentMember = new Array();
                for (let index = 0; index < this.enlistedMember.length; index++) {
                    const element = {
                        member_id: this.enlistedMember[index],
                        role: 'Presenter',
                        online: false
                    }
                    currentMember.push(element);
                }

                const formValue = this.setMeetingForm.value;

                let setMeeting = {
                    spaceId: this.spaceId,
                    meetingTitle: formValue.meetingTitle,
                    meetingDescription : formValue.meetingDescription,
                    startDate: formValue.startDate,
                    startTime: formValue.startUnit + ' ' + formValue.startHour + ' : ' + formValue.startMin,
                    enlistedMembers: this.enlistedMember,
                    currentMembers: currentMember,
                    status: 'pending',
                }
                console.log(setMeeting);

                if (setMeeting.startDate == null || setMeeting.meetingTitle == null) {
                    this.dialogService.openDialogNegative('Please, check the meeting title and date.')
                    // alert('Please, check the meeting title and date.');
                }
                else {
                    this.docService.createMeeting(setMeeting).subscribe(
                        (data: any) => {
                            console.log(data);
                            this.dialogRef.close();
                            this.dialogService.openDialogPositive('Successfully, the meeting has been set up.');
                        },
                        (err: any) => {
                            console.log(err)
                        }
                    )
                }
            }
        });
    }
    // 달력 필터
    myFilter = (d: Date | null): boolean => {
        const day = (d || new Date()).getDay();
        // Prevent Saturday and Sunday from being selected.
        return day !== 0 && day !== 6;
    }
}
