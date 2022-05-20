import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class ScrumBoardStorageService {


	private scrumBoard$: BehaviorSubject<any>;
	scrum$: Observable<any>

	constructor( 
	) {
		this.scrumBoard$ = new BehaviorSubject([]);
		this.scrum$ = this.scrumBoard$.asObservable();
	}

	updateScrumBoard(scrum: any){
		console.log(scrum);
		this.scrumBoard$.next(scrum);
	}
}