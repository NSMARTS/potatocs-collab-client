import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { Component, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import * as moment from 'moment';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DialogService } from 'src/@dw/dialog/dialog.service';
import { CommonService } from 'src/@dw/services/common/common.service';
import { LeaveMngmtService } from 'src/@dw/services/leave/leave-mngmt/leave-mngmt.service';
import { DataService } from 'src/@dw/store/data.service';

@Component({
	selector: 'app-replacement-leave-request',
	templateUrl: './replacement-leave-request.component.html',
	styleUrls: ['./replacement-leave-request.component.scss']
})

export class ReplacementLeaveRequestComponent implements OnInit, OnDestroy {

	// calculate diff
	days: any;
	start_date_sec: any;
	end_date_sec: any;
	millisecondsPerDay: any;
	diff: any;
	weeks: any;
	leaveDays: any;

	@ViewChild(MatPaginator) paginator: MatPaginator;
	// view table
	displayedColumns: string[] = ['name', 'from', 'to', 'type', 'days', 'manager', 'status', 'btns'];

	// replacement day requests
	getInputData;
	rdRequestData;
	rdFormData;

	leaveDuration;
	isHalf: boolean;

	company;
	manager;
	user;

	minDate;
	maxDate
	// form group
	rdLeaveForm: FormGroup;

	// dataSource = ELEMENT_DATA;
	private unsubscribe$ = new Subject<void>();

	constructor(
		private fb: FormBuilder,
		public dataService: DataService,
		public dialogRef: MatDialogRef<ReplacementLeaveRequestComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any,
		private dialogService: DialogService,
		private commonService: CommonService,
		private leaveMngmtService: LeaveMngmtService
	) { }

	ngOnInit(): void {

		this.dataService.userCompanyProfile.pipe(takeUntil(this.unsubscribe$))
			.subscribe(
				(data: any) => {
					this.company = data;
					// console.log(this.company);
					// if(this.company.rollover_max_day != undefined){
					// 	this.isRollover = true;
					// }
				},
				(err: any) => {
					console.log(err);
				}
			)

		this.dataService.userManagerProfile.pipe(takeUntil(this.unsubscribe$))
			.subscribe(
				(data: any) => {
					this.manager = data;
				},
				(err: any) => {
					console.log(err);
				}
			)

		this.dataService.userProfile.pipe(takeUntil(this.unsubscribe$))
			.subscribe(
				(data: any) => {
					this.user = data;
				},
				(err: any) => {
					console.log(err);
				}
			)
		const today = moment(new Date());
		const empStartDate = moment(this.user.emp_start_date);
		const careerYear = (today.diff(empStartDate, 'years'));

		this.minDate = moment(this.data.leave_end_date).format('YYYY-MM-DD');
		this.maxDate = moment(this.minDate).add(this.company.rd_validity_term, "M").subtract(1, 'days').format('YYYY-MM-DD');
		// console.log(this.minDate);
		// console.log(this.maxDate);

		this.getInputData = '';
		this.getInputData = this.data;
		// console.log(this.getInputData);

		this.rdLeaveForm = this.fb.group({
			leaveType1: ['replacement_leave', [Validators.required]],
			leaveType2: ['', [Validators.required]],
			from: ['', [Validators.required]],
			to: ['', [Validators.required]],
			leave_reason: ['', [Validators.required]],
		});

		this.datePickDisabled();

	}

	requestConfirmRd() {
		const formValue = this.rdLeaveForm.value;

		if (this.leaveDuration == 0.5) {
			this.rdRequestData = {
				_id: this.data._id,
				leaveType: formValue.leaveType1,
				leaveDay: formValue.leaveType2,
				leaveDuration: this.leaveDuration,
				leave_start_date: this.commonService.dateFormatting(formValue.from),
				leave_end_date: this.commonService.dateFormatting(formValue.from),
				leave_reason: formValue.leave_reason,
				status: 'pending'
			}

		} else {
			this.rdRequestData = {
				_id: this.data._id,
				leaveType: formValue.leaveType1,
				leaveDay: formValue.leaveType2,
				leaveDuration: this.leaveDuration,
				leave_start_date: this.commonService.dateFormatting(formValue.from),
				leave_end_date: this.commonService.dateFormatting(formValue.to),
				leave_reason: formValue.leave_reason,
				status: 'pending'
			}

		}

		this.leaveMngmtService.requestRdLeave(this.rdRequestData).subscribe(
			(data: any) => {
				if (data.message == 'hihi') {
					//   console.log('hihihi');
					this.dialogService.openDialogPositive('Successfully request leave');
					this.dialogRef.close();
				}
			},
			err => {
				console.log(err);
			}
		);


	}

	ngOnDestroy() {
		// unsubscribe all subscription
		this.unsubscribe$.next();
		this.unsubscribe$.complete();

	}

	classificationChange(value) {

		this.rdLeaveForm.get('leaveType2').setValue('');
		this.datePickDisabled();
		this.datePickReset();
	}

	typeSecondChange(value) {

		if (value == 'half') {
			this.rdLeaveForm.controls['from'].enable();
			this.rdLeaveForm.controls['to'].disable();

			this.datePickReset();
			this.isHalf = true;
		} else {
			this.rdLeaveForm.controls['from'].enable();
			this.rdLeaveForm.controls['to'].enable();

			this.datePickReset();
			this.isHalf = false;
		}

	}

	checkDateChange(value) {

		const formValue = this.rdLeaveForm.value;
		const start_date = formValue.from;
		const end_date = formValue.to;
		const matchedLeaveDay = this.getInputData.leaveDuration - this.getInputData.taken
		// console.log(matchedLeaveDay);

		if (this.isHalf) {
			this.leaveDuration = 0.5;
			this.rdLeaveForm.get('to').setValue('');

			if (this.leaveDuration > matchedLeaveDay) {
				this.dialogService.openDialogNegative('Wrong period, Try again.');
				// alert('Wrong period, Try again.');
				this.allReset();
				return;
			}

		} else {
			this.leaveDuration = this.calculateDiff(start_date, end_date);
			// console.log(this.leaveDuration);
			if (this.leaveDuration > matchedLeaveDay) {
				this.dialogService.openDialogNegative('Wrong period, Try again.');
				// alert('Wrong period, Try again.');
				this.allReset();
				return;
			}
		}




	}

	datePickChange(dateValue) {
		this.rdLeaveForm.get('to').setValue('');
	}

	calculateDiff(start_date, end_date) {
		this.millisecondsPerDay = 86400 * 1000; // Day in milliseconds
		this.start_date_sec = start_date.setHours(0, 0, 0, 1); // Start just after midnight
		this.end_date_sec = end_date.setHours(23, 59, 59, 999); // End just before midnight
		this.diff = this.end_date_sec - this.start_date_sec; // Milliseconds between datetime objects 
		this.days = Math.ceil(this.diff / this.millisecondsPerDay);

		// Subtract two weekend days for every week in between
		this.weeks = Math.floor(this.days / 7);
		this.days = this.days - (this.weeks * 2);

		// Handle special cases
		this.start_date_sec = start_date.getDay();
		this.end_date_sec = end_date.getDay();

		// Remove weekend not previously removed. 
		// if (this.start_date_sec - this.end_date_sec > 1)
		// 	this.days = this.days - 2;

		// Remove start day if span starts on Sunday but ends before Saturday
		// if (this.start_date_sec == 0 && this.end_date_sec != 6)
		// 	this.days = this.days - 1;

		// Remove end day if span ends on Saturday but starts after Sunday
		// if (this.end_date_sec == 6 && this.start_date_sec != 0) {
		// 	this.days = this.days - 1;
		// }

		this.leaveDays = this.days;

		if (this.leaveDays == 'NaN' || this.leaveDays == '' || this.leaveDays <= '0' || this.leaveDays == 'undefined') {
			this.leaveDays = '';
		} else {
			this.leaveDays = this.days;
		}

		// console.log(this.leaveDays);
		return this.leaveDays;
	}

	datePickReset() {
		this.rdLeaveForm.get('from').setValue('');
		this.rdLeaveForm.get('to').setValue('');
	}

	datePickDisabled() {
		this.rdLeaveForm.controls['from'].disable();
		this.rdLeaveForm.controls['to'].disable();
	}

	allReset() {
		this.rdLeaveForm.get('leaveType1').setValue('');
		this.rdLeaveForm.get('leaveType2').setValue('');
		this.datePickReset();
		this.datePickDisabled();
	}


}