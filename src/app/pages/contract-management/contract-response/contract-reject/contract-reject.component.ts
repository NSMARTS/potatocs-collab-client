import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { DialogService } from 'src/@dw/dialog/dialog.service';
import { ContractMngmtService } from 'src/@dw/services/contract-mngmt/contract/contract-mngmt.service';

@Component({
    selector: 'app-contract-reject',
    templateUrl: './contract-reject.component.html',
    styleUrls: ['./contract-reject.component.scss']
})
export class ContractRejectComponent implements OnInit {

    private unsubscribe$ = new Subject<void>();


    reject = new FormGroup({
        rejectReason: new FormControl()
    });

    constructor(
        private dialogService: DialogService,
        public dialogRef: MatDialogRef<ContractRejectComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,

        private contractMngmtService: ContractMngmtService,
    ) { }

    ngOnInit(): void {
    }

    rejectLeave() {
        const rejectReason = this.reject.value.rejectReason;
        this.data.rejectReason = rejectReason;




        this.dialogService.openDialogConfirm(`Do you reject the contract request?`).subscribe(result => {
            if (result) {
                console.log(this.data)
                	this.contractMngmtService.rejectContract(this.data).subscribe(
                		(data: any) => {
                			console.log('[[ reject contract >>>', data);
                			if (data.message == 'rejected') {
                				this.dialogService.openDialogPositive('Successfully, the request has been rejected');
                				// this.approvalMngmtService.getLeaveRequest().subscribe(
                				// 	(data: any) => {

                				// 	},
                				// 	(err: any) => {
                				// 		this.dialogService.openDialogNegative(err.message);
                				// 	}
                				// )
                			}
                		}
                	);
            }
            
            this.dialogRef.close();
        });

    }

}
