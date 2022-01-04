import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogService } from 'src/@dw/dialog/dialog.service';
import { ApprovalMngmtService } from 'src/@dw/services/leave/approval-mngmt/approval-mngmt.service';
@Component({
	selector: 'app-leave-request-details',
	templateUrl: './leave-request-details.component.html',
	styleUrls: ['./leave-request-details.component.scss']
})
export class LeaveRequestDetailsComponent implements OnInit {

	viewType = {
		'annual_leave': 'Annual Leave',
		'sick_leave': 'Sick Leave',
		'replacementday_leave': 'Replacement Day'
	}

	reject = new FormGroup({
		rejectReason: new FormControl()
	});

	constructor(
		public dialogRef: MatDialogRef<LeaveRequestDetailsComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any,
		public approvalMngmtService: ApprovalMngmtService,
		private dialogService: DialogService
	) { }

	ngOnInit(): void {
		console.log(this.data);
	}

	// 휴가 reject
	rejectLeave() {

		const formValue = this.reject.value;
		const rejectReason = formValue.rejectReason;
		this.data.rejectReason = rejectReason;

		// const result = confirm(`Will you be reject employee's manager?`);
		// if (result) {

		this.dialogService.openDialogConfirm(`Do you reject the leave request?`).subscribe(result => {
			if (result) {
				this.approvalMngmtService.deleteLeaveRequest(this.data).subscribe(
					(data: any) => {
						console.log('[[ delete leave request >>>', data);
						if (data.message == 'delete') {
							this.dialogService.openDialogPositive('Successfully the request has been rejected')
						}
					}
				);
				this.approvalMngmtService.getLeaveRequest().subscribe(
					(data: any) => {

					},
					(err: any) => {
						this.dialogService.openDialogNegative(err.message);
					}
				)
			}
			this.dialogRef.close();
		});
	}

}
