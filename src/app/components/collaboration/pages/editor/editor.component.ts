import { Component, OnInit } from '@angular/core';
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
import { Subscription } from 'rxjs';
import { DialogService } from 'src/@dw/dialog/dialog.service';

@Component({
	selector: 'app-editor',
	templateUrl: './editor.component.html',
	styleUrls: ['./editor.component.scss']
})
export class EditorComponent implements OnInit {

	editor: any;
	editorTitle: String;
	selectedStatus: any;
	spaceInfoObj: any;
	spaceTitle: any;
	spaceTime: any;

	subscription: Subscription

	constructor(
		private route: ActivatedRoute,
		private router: Router,
		private docService: DocumentService,
		private dialogService: DialogService
	) { }

	ngOnInit(): void {
		this.selectedStatus = 'submitted';
		this.route.queryParamMap
			.subscribe(
				(params: any) => {
					this.spaceInfoObj = params.params;
					this.spaceTitle = this.spaceInfoObj.spaceTitle;
					this.spaceTime = this.spaceInfoObj.spaceTime;
				});

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
	}

	onSave() {
		// const result = confirm('Do you want to save document?');
		// if (result) {

		this.dialogService.openDialogConfirm('Do you want to save this document?').subscribe(result => {
			if (result) {
				if (this.editorTitle == '' || this.editorTitle == null) {
					return this.dialogService.openDialogNegative('Please write the title down');
					// return alert('please write the title down');
				}

				this.editor
					.save()
					.then((outputData) => {
						console.log('Article Data: ', outputData);
						const docData = {
							spaceTime: this.spaceTime,
							editorTitle: this.editorTitle,
							status: this.selectedStatus,
							docContent: outputData
						}
						// console.log('Article Data: ', docData);
						this.docCreate(docData);
						this.dialogService.openDialogPositive('Successfully,the document has been saved.');
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
