import { Component, OnInit,ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonService } from 'src/@dw/services/common/common.service';
import { HttpParams } from '@angular/common/http';

// table page
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
// 자신의 휴가 리스트 가져오기
import { LeaveMngmtService } from 'src/@dw/services/leave/leave-mngmt/leave-mngmt.service';
import { LeaveRequestDetailsComponent } from '../../../components/leave-request-details/leave-request-details.component';
import { MatDialog } from '@angular/material/dialog';
import { DataService } from 'src/@dw/store/data.service';
import * as moment from 'moment';
import { isNgTemplate } from '@angular/compiler';

// view table
export interface PeriodicElement {
	leaveStartDate: Date;
	duration: number;
	leaveType: string;
	approver: string;
	status: string
}

// const ELEMENT_DATA: PeriodicElement[] = [
// 	{ position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H' },
// 	{ position: 2, name: 'Helium', weight: 4.0026, symbol: 'He' },
// 	{ position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li' }
// ];

@Component({
	selector: 'app-request-leave-list',
	templateUrl: './request-leave-list.component.html',
	styleUrls: ['./request-leave-list.component.scss']
})

export class RequestLeaveListComponent implements OnInit {

	// FormGroup
	employeeForm: FormGroup;

	// 자신의 휴가 리스트 받는 변수
	myRequestList;

	// 이번 달 1일, 말일 만드는 변수
	// date = new Date();
	// monthFirst = new Date(this.date.setDate(1));
	// tmp = new Date(this.date.setMonth(this.date.getMonth() + 1));
	// monthLast = new Date(this.tmp.setDate(0));

	date = new Date();
	timezone = this.commonService.dateFormatting(this.date, 'timeZone');

	viewType = {
		'annual_leave': 'Annual Leave',
		'sick_leave': 'Sick Leave',
		'replacementday_leave': 'Replacement Day'
	}

	company;
	manager;
	@ViewChild(MatPaginator) paginator: MatPaginator;

	// select
	myFilter = (d: Date | null): boolean => {
		const day = (d || new Date()).getDay();
		// Prevent Saturday and Sunday from being selected.
		return day !== 0 && day !== 6;
	}

	// view table
	displayedColumns: string[] = ['leaveStartDate', 'duration', 'leaveType', 'approver', 'status'];
	// dataSource = ELEMENT_DATA;

	constructor(
		private router: Router,
		private fb: FormBuilder,
		private commonService: CommonService,
		private leaveMngmtService: LeaveMngmtService,
		public dialog: MatDialog,
		public dataService: DataService
	) { }

	ngOnInit(): void {

    // console.log(this.date.setDate(1));
    // console.log(this.tmp.setDate(0));

		this.dataService.userCompanyProfile.subscribe(
			(data: any) => {
				this.company = data;
			},
			(err: any) => {
				console.log(err);
			}
		)

		this.dataService.userManagerProfile.subscribe(
			(data: any) => {
				this.manager = data;
			},
			(err: any) => {
				console.log(err);
			}
		)



		const startOfMonth = moment().startOf('month').format();
		const endOfMonth   = moment().endOf('month').format();
		
		// console.log(moment());
		// console.log(moment().startOf('month'));
		// console.log(endOfMonth);
		// const startOfMonth = this.commonService.dateFormatting(this.date);
		// const endOfMonth   = this.commonService.dateFormatting(this.date);

		this.employeeForm = this.fb.group({
			type1: ['all', [
				Validators.required,
			]],
			type2: ['all', [
				Validators.required,
			]],
			leave_start_date: [startOfMonth, [
				Validators.required,
			]],
			leave_end_date: [endOfMonth, [
				Validators.required,
			]],
			status: ['all', [
				Validators.required,
			]],
		});
		console.log(this.employeeForm.value);
		this.leaveInfo();
	}

	// 휴가 조회
	leaveInfo() {
		console.log('leaveInfo 버튼')

		let employeeInfo;
		const formValue = this.employeeForm.value;


		employeeInfo = {
			type1: formValue.type1,
			type2: formValue.type2,
			leave_start_date: this.commonService.dateFormatting(formValue.leave_start_date),
			leave_end_date: this.commonService.dateFormatting(formValue.leave_end_date),
			// leave_start_date: formValue.leave_start_date,
			// leave_end_date: formValue.leave_end_date,
			status: formValue.status,
		}

		console.log('[[[ form value check ]]]', employeeInfo);

		// 조건에 따른 자기 휴가 가져오기
		this.leaveMngmtService.getMyLeaveListSearch(employeeInfo).subscribe(
			
			(data: any) => {
				console.log('getMyLEaveListSearch');
				
				data = data.map ((item)=> {
					item.leave_start_date = this.commonService.dateFormatting(item.leave_start_date, 'timeZone');
					item.leave_end_date = this.commonService.dateFormatting(item.leave_end_date, 'timeZone');
					return item;
				});


				console.log(data);
				this.myRequestList = new MatTableDataSource<PeriodicElement>(data);
				this.myRequestList.paginator = this.paginator;
			}
		);
	}

	requestLeave() {
		this.router.navigate(['leave/request-leave']);
	}

	openDialogPendingLeaveDetail(data) {

		const dialogRef = this.dialog.open(LeaveRequestDetailsComponent, {
			// width: '600px',
			// height: '614px',

			data: {
				requestor: data.requestor,
				requestorName: data.requestorName,
				leaveType: data.leaveType,
				leaveDuration: data.leaveDuration,
				leave_end_date: data.leave_end_date,
				leave_start_date: data.leave_start_date,
				leave_reason: data.leave_reason,
				status: data.status,
				createdAt: data.createdAt,
				approver: data.approver,
				rejectReason: data.rejectReason
			}
		});

		dialogRef.afterClosed().subscribe(result => {
			console.log('dialog close');
		})
	}
}
