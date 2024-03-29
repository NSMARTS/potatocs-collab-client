import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class MemberDataStorageService {

	private membersSubject$ = new BehaviorSubject({});
	members = this.membersSubject$.asObservable();

	constructor( 
		
	) {

	}

	updateMembers(membersData: any) {
		// console.log('updatedData', profileData);
		this.membersSubject$.next(membersData);
	}
}