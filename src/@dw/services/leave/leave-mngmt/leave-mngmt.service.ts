import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { shareReplay, tap } from 'rxjs/operators';
import { MyRequestLeaveStorageService } from 'src/@dw/store/my-request-leave-storage.service';
import { CommonService } from '../../common/common.service';

@Injectable({
	providedIn: 'root'
})
export class LeaveMngmtService {

	constructor(
		private http: HttpClient,
		private myRequestLeaveStorage: MyRequestLeaveStorageService,
		private commonService : CommonService
	) { }

	/* -----------------------------------------------
		Request Leave Component
	----------------------------------------------- */
	requestLeave(leaveData) {
		return this.http.post('/api/v1/leave/request-leave', leaveData)
	}

	/* -----------------------------------------------
		Leave Request Detail Component
	----------------------------------------------- */
	cancelMyRequestLeave(data){
		return this.http.put('/api/v1/leave/cancel-my-request-leave', data)
	}

	/* -----------------------------------------------
		Main Component
	----------------------------------------------- */
	getMyLeaveStatus() {
		return this.http.get('/api/v1/leave/my-status');
	}

	/* -----------------------------------------------
		Main Component
	----------------------------------------------- */
	getMyLeaveList() {
		return this.http.get('/api/v1/leave/my-request');
	}

	/* -----------------------------------------------
		Request Leave List Component
	----------------------------------------------- */
	getMyLeaveListSearch(data){
		return this.http.get('/api/v1/leave/my-request-search', { params: data }).pipe(
			shareReplay(1),
			tap(
				(res: any) => {
					console.log(res);

					data = res.map((item)=> {
						item.leave_start_date = this.commonService.dateFormatting(item.leave_start_date, 'timeZone');
						item.leave_end_date = this.commonService.dateFormatting(item.leave_end_date, 'timeZone');
						return item;
					});
					this.myRequestLeaveStorage.updateMyRequestLeave(data);
					return res.message;
				}
			)
		);
	}


}	