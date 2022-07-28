import { Component, HostListener, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import EditorJS from '@editorjs/editorjs';
import List from '@editorjs/list';
import SimpleImage from '@editorjs/simple-image';
import Quote from '@editorjs/quote';
import Table from '@editorjs/table';
import InlineCode from '@editorjs/inline-code';
import Marker from '@editorjs/marker';
import Header from '@editorjs/header';
import Delimiter from '@editorjs/delimiter';

import { DocumentService } from 'src/@dw/services/collab/space/document.service';
import { fromEvent, Observable, Subject, Subscription } from 'rxjs';
import { DialogService } from 'src/@dw/dialog/dialog.service';
import { SpaceService } from 'src/@dw/services/collab/space/space.service';
import { DataService } from 'src/@dw/store/data.service';
import { FormControl, FormGroup } from '@angular/forms';
import * as _ from "lodash";


@Component({
	selector: 'app-editor',
	templateUrl: './editor.component.html',
	styleUrls: ['./editor.component.scss'],
	encapsulation: ViewEncapsulation.None,

})
export class EditorComponent implements OnInit {

	// 브라우저 크기 변화 체크 ///
	resizeObservable$: Observable<Event>
	resizeSubscription$: Subscription
	mobileWidth: any;
	///////////////////////

	editor: any;
	editorTitle: String;
	selectedStatus: any;
	spaceInfoObj: any;
	spaceTitle: any;
	spaceTime: any;
	startDate = new Date();
	endDate = new Date();

	subscription: Subscription
	refresh = new Subject<void>();

	docStatus;
	member_list: any;
	selectedMember: any;
	memberId: any;


	constructor(
		private route: ActivatedRoute,
		private router: Router,
		private docService: DocumentService,
		private dialogService: DialogService,
		private spaceService: SpaceService,
		private dataService: DataService,
	) {

	}


	////////////////////////////////////
	// 브라우저 크기
	@HostListener('window:resize', ['$event'])
	onResize(event) {
		this.mobileWidth = event.target.innerWidth;
	}
	////////////////////////////////////


	ngOnInit(): void {
		// this.selectedStatus = 'submitted';
		this.route.queryParamMap
			.subscribe(
				(params: any) => {
					this.spaceInfoObj = params.params;
					console.log(this.spaceInfoObj);
					this.spaceTitle = this.spaceInfoObj.spaceTitle;
					this.spaceTime = this.spaceInfoObj.spaceTime;
					this.selectedStatus = this.spaceInfoObj.status
				});



		this.spaceService.getSpaceMembers(this.spaceTime).subscribe(
			(data: any) => {
				console.log(data);
				// console.log(data.spaceMembers[0].docStatus);
				this.docStatus = data.spaceMembers[0].docStatus
				this.member_list = data.spaceMembers[0].memberObjects

				console.log("스페이스멤버:", this.member_list);
				// this.selectedStatus = this.docStatus[0];
			},
			(err: any) => {

			}
		)

		//현재 로그인 되있는 유저 정보 불러오기
		this.dataService.userProfile.subscribe(
			(data: any) => {
				console.log(data.name);
				this.selectedMember = _.clone(data);
				//memberSelect를 호출하지 않고 디폴트값으로 사용할때 멤버아이디 설정해줌	
				 this.memberId = data._id;
			}
		)



		this.editor = new EditorJS({
			autofocus: true,
			/** 
			 * Id of Element that should contain the Editor 
			 */
			holder: 'editorjs',

			/** 
			 * Available Tools list. 
			 * Pass Tool's class or Settings object for each Tool you want to use 
			 */
			tools: {
				header: {
					class: Header,
					inlineToolbar: true,
					config: {
						placeholder: 'Enter a header',
						levels: [2, 3, 4, 5, 6],
						defaultLevel: 3
					}
				},
				list: {
					class: List,
					inlineToolbar: true,
				},
				image: SimpleImage,
				quote: {
					class: Quote,
					inlineToolbar: true,
				},
				inlineCode: {
					class: InlineCode,
					inlineToolbar: true,
				},
				marker: {
					class: Marker,
					inlineToolbar: true,
				},
				table: {
					class: Table,
					inlineToolbar: true,
				},
				delimiter: Delimiter,

			}
		});


		////////////////////////////////////
		// 브라우저 크기 변화 체크
		this.mobileWidth = window.screen.width;
		this.resizeObservable$ = fromEvent(window, 'resize')
		this.resizeSubscription$ = this.resizeObservable$.subscribe(evt => {
			// console.log('event: ', evt)
		})
		////////////////////////////////////



	}


	onSave() {

		this.dialogService.openDialogConfirm('Do you want to save this document?').subscribe(result => {
			if (result) {
				if (this.editorTitle == '' || this.editorTitle == null) {
					return this.dialogService.openDialogNegative('Please write the title down');
					// return alert('please write the title down');
				}

				this.editor
					.save()
					.then((outputData) => {
						//console.log('Article Data: ', outputData);
						const docData = {
							spaceTime: this.spaceTime,
							editorTitle: this.editorTitle,
							status: this.selectedStatus,
							docContent: outputData,
							startDate: this.startDate,
							endDate: this.endDate,
							memberId: this.memberId
						}
						//console.log('Article Data: ', docData);
						this.docCreate(docData);
						this.dialogService.openDialogPositive('Successfully, the document has been saved.');
					})
					.catch((error) => {
						console.log('getting a content data has failed: ', error)
					})
			}
		});
	}

	toBack(): void {
		this.router.navigate(['/collab/space/' + this.spaceTime]);
	}

	//멤버 고르기
	memberSelect(member) {
		console.log("셀렉티드 멤버",this.selectedMember);
		this.memberId = member._id;
	}

	docCreate(docData) {
		console.log(docData)
		this.docService.createDoc(docData).subscribe(
			(data: any) => {
				if (data.message == 'created') {
					this.router.navigate(['/collab/space/' + this.spaceTime]);
				}
			},
			(err: any) => {
				console.log(err);
			}
		);
	}
	ngDestroy(): void {
	}
}
