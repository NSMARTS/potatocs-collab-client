import { Component, OnInit, ViewChild } from '@angular/core';

import { MatDialog } from '@angular/material/dialog';
// table page
import { MatPaginator } from '@angular/material/paginator';
import { LeaveRequestDetailsComponent } from '../../../components/leave-request-details/leave-request-details.component';
import { DialogService } from 'src/@dw/dialog/dialog.service';
import { Subject } from 'rxjs';
import { ApprovalMngmtService } from 'src/@dw/services/leave/approval-mngmt/approval-mngmt.service';
import { CommonService } from 'src/@dw/services/common/common.service';


// view table
export interface PeriodicElement {
	Period: Date;
	// to: Date;
	Day: number;
	Type: string;
	Name: string;
	status: string;
}

@Component({
	selector: 'app-employee-rd-request',
	templateUrl: './employee-rd-request.component.html',
	styleUrls: ['./employee-rd-request.component.scss']
})
export class EmployeeRdRequestComponent implements OnInit {
	displayedColumns: string[] = ['period', 'leaveDuration', 'leaveType', 'requestorName', 'status', 'btns'];
	dataSource;

	@ViewChild(MatPaginator) paginator: MatPaginator;

	viewType = {
		'annual_leave': 'Annual Leave',
		'rollover': 'Rollover',
		'sick_leave': 'Sick Leave',
		'replacementday_leave': 'Replacement Day'
	}
	private unsubscribe$ = new Subject<void>();

	constructor(
		private approvalMngmtService: ApprovalMngmtService,
		private commonService: CommonService,
		public dialog: MatDialog,
		public dialogService: DialogService,
	) { }

	ngOnInit(): void {
		this.approvalMngmtService.getConfirmRdRequest().subscribe(
			(data: any) => {
				if(data.message == 'getConfirmRdRequest') {
					data = data.rdConfirmRequests.map ((item)=> {
						item.leave_start_date = this.commonService.dateFormatting(item.leave_start_date, 'timeZone');
						item.leave_end_date = this.commonService.dateFormatting(item.leave_end_date, 'timeZone');
						return item;
					});
				}
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

	// 휴가요청 승인 DB에 추가
	approveLeave(id) {
		console.log('approveLeave');
		// this.dialogService.openDialogConfirm('Do you approved this leave request?').subscribe(result => {
		// 	if (result) {
		// 		console.log(id);
		// 		this.approvalMngmtService.approvedLeaveRequest(id).subscribe(
		// 			(data: any) => {
		// 				console.log('[[ approved leave request >>>', data);
		// 				if (data.message == 'approve') {
		// 					// window.location.reload();
		// 				}
		// 				this.dialogService.openDialogPositive('succeed request approve');
		// 			}
		// 		);
		// 		this.approvalMngmtService.getLeaveRequest().subscribe(
		// 			(data: any) => { }
		// 		)
		// 	}
		// })
	}

	// cancelLeave(id) {
	// 	console.log(id);
	// }

	// 휴가 요청 rejected 
	rejectLeave(data) {
		console.log('rejectLeave');
		// data.reject = true;
		// this.openDialogPendingLeaveDetail(data);
	}

	openDialogPendingLeaveDetail(data) {

		const dialogRef = this.dialog.open(LeaveRequestDetailsComponent, {

			data: {
				_id: data._id,
				requestor: data.requestor,
				requestorName: data.requestorName,
				leaveType: data.leaveType,
				leaveDuration: data.leaveDuration,
				leave_end_date: data.leave_end_date,
				leave_start_date: data.leave_start_date,
				leave_reason: data.leave_reason,
				status: data.status,
				createdAt: data.createdAt,
				reject: data.reject
			}
		});

		dialogRef.afterClosed().subscribe(result => {
			console.log('dialog close');
			data.reject = false;
		});
	}

}