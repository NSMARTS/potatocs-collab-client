import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DocumentService } from 'src/@dw/services/collab/space/document.service';
import { ActivatedRoute } from '@angular/router';
import { MemberDataStorageService } from 'src/@dw/store/member-data-storage.service';
import { CommonService } from 'src/@dw/services/common/common.service';

//table page
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { DialogService } from 'src/@dw/dialog/dialog.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

//view table
export interface PeriodicElement {
  Meeting: String,
  Date: Date,
  // Time: String,
}

@Component({
  selector: 'app-doc-meeting',
  templateUrl: './doc-meeting.component.html',
  styleUrls: ['./doc-meeting.component.scss']
})
export class DocMeetingComponent implements OnInit {

  constructor(
    public dialog: MatDialog,
    private docService: DocumentService,
    private route: ActivatedRoute,
    private commonService: CommonService,
    private dialogService: DialogService
  ) { }

  docId;
  meetingArray;
  displayedColumns: string[] = ['meetingTitle', 'start_date', 'Enter', 'Delete'];
  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngOnInit(): void {
    this.route.queryParamMap
      .subscribe(
        (params: any) => {
          this.docId = params.params.id;
        }
      );
    this.getMeetingList();
  }

  openDialogDocMeetingSet() {
    const dialogRef = this.dialog.open(DialogDocMeetingSetComponent, {
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('dialog close');
      this.getMeetingList();
    })
  }

  // 미팅 리스트 가져오기
  getMeetingList() {
    let data = {
      docId: this.docId
    }
    this.docService.getMeetingList(data).subscribe(
      (data: any) => {
        console.log(data);
        this.meetingArray = data.meetingInDoc;
        // 날짜형식 바꾸기
        for (let index = 0; index < this.meetingArray.length; index++) {
          this.meetingArray[index].start_date = this.commonService.dateFormatting(this.meetingArray[index].start_date), 'dateOnly';
        }
        this.meetingArray = new MatTableDataSource<PeriodicElement>(this.meetingArray);
        this.meetingArray.paginator = this.paginator;
      },
      (err: any) => {
        console.log(err);
      }
    )
  }

  joinMeeting(data) {
    console.log(data)
    window.open('https://potatocs.com/meeting/room/' + data._id);
    this.docService.joinMeeting(data);
  }

  // 미팅 삭제
  deleteMeeting(data) {
    console.log(data);
    // const result = confirm('미팅을 삭제하시겠습니까?');
    // if (result) {
    this.dialogService.openDialogConfirm('Do you want to delete the meeting?').subscribe(result => {
      if (result) {
        this.docService.deleteMeeting(data).subscribe(
          (data: any) => {
            console.log(data);
            this.getMeetingList();
            this.dialogService.openDialogPositive('Successfully,the meeting has been deleted.');
          },
          (err: any) => {
            console.log(err);
          }
        )
      }
    });
  }
}

@Component({
  selector: 'app-doc-meeting-set',
  templateUrl: './dialog/doc-meeting-set.html',
  styleUrls: ['./doc-meeting.component.scss']
})
export class DialogDocMeetingSetComponent implements OnInit {

  setMeetingForm = new FormGroup({
    startDate: new FormControl(new Date()),
    meetingTitle: new FormControl(),
    startTime: new FormControl(),
  })
  docId;
  enlistedMember = [];
  private unsubscribe$ = new Subject<void>();
  constructor(
    public dialogRef: MatDialogRef<DialogDocMeetingSetComponent>,
    private docService: DocumentService,
    private route: ActivatedRoute,
    private mdsService: MemberDataStorageService,
    private dialogService: DialogService
  ) {
    // docid 가져오기
    this.route.queryParamMap
      .subscribe(
        (params: any) => {
          this.docId = params.params.id;
        }
      );

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
  }
  

  ngOnDestroy() {
    // unsubscribe all subscription
    this.unsubscribe$.next();
    this.unsubscribe$.complete();

  }


  // 미팅 만들기
  createMeeting() {
    // const result = confirm('Do you want to create meeting?');
    // if (result) {

    this.dialogService.openDialogConfirm('Do you want to set up a meeting?').subscribe(result => {
      if (result) {

        const formValue = this.setMeetingForm.value;
        console.log(formValue);
        let setMeeting = {
          docId: this.docId,
          meetingTitle: formValue.meetingTitle,
          startDate: formValue.startDate,
          startTime: formValue.startTime,
          enlistedMembers: this.enlistedMember
        }

        if (setMeeting.startDate == null || setMeeting.meetingTitle == null) {
          this.dialogService.openDialogNegative('Please, check the meeting title and date.')
          // alert('Please, check the meeting title and date.');
        }
        else {
          this.docService.createMeeting(setMeeting).subscribe(
            (data: any) => {
              console.log(data);
              this.dialogRef.close();
              this.dialogService.openDialogPositive('Successfully,the meeting has been set up.');
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
