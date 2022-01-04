import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class RequestLeaveStorage {
	private reqLeaveData$: BehaviorSubject<any>;
	reqLeave$: Observable<any>;

	constructor() { 
		this.reqLeaveData$ = new BehaviorSubject([]);
		this.reqLeave$ = this.reqLeaveData$.asObservable();
	}

	updateReqLeaveData(reqLeave: any) {
		this.reqLeaveData$.next(reqLeave);
	}

}
