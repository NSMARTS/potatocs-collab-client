import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { shareReplay, tap } from 'rxjs/operators';
import { RequestLeaveStorage } from '../../../store/request-leave-storage.service';

@Injectable({
	providedIn: 'root'
})
export class ApprovalMngmtService {

	constructor(
		private http: HttpClient,
		private requestLeaveStorage: RequestLeaveStorage
	) { }

	getLeaveRequest() {
		return this.http.get('/api/v1/leave/pending-leave-request').pipe(
			shareReplay(1),
			tap(
				(res: any) => {
					console.log(res);
					// this.pendingCompReqStorageService.updatePendingRequest(res.pendingCompanyData);
					this.requestLeaveStorage.updateReqLeaveData(res.pendingLeaveReqList);
					return res.message;
				}
			)
		);;
	}

	approvedLeaveRequest(id) {
		return this.http.put('/api/v1/leave/approve-leave-request', { id })
	}

	deleteLeaveRequest(data){
		return this.http.put('/api/v1/leave/delete-request' ,data)
	}


    /* -----------------------------------------------
		The manager cancels the employee's approved leave
	----------------------------------------------- */
	cancelEmployeeApproveLeave(leaveData) {
		return this.http.put('/api/v1/leave/cancel-Employee-Approve-Leave', leaveData)
	}
	
	// Get a list of Members who has submitted a RD request to be confirmed.
	getConfirmRdRequest() {
		return this.http.get('/api/v1/leave/getConfirmRdRequest');
	}
}