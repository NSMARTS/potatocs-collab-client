import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router} from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DocDataStorageService } from 'src/@dw/store/doc-data-storage.service';
import { CommonService } from 'src/@dw/services/common/common.service';
import { DialogSpaceMemberComponent } from '../space.component';

@Component({
  selector: 'app-doc-list',
  templateUrl: './doc-list.component.html',
  styleUrls: ['./doc-list.component.scss']
})
export class DocListComponent implements OnInit {


	@Input() spaceInfo: any
	private unsubscribe$ = new Subject<void>();
	public spaceTime: String;
	public docsArray: any;
	displayedColumns: string[] = ['status', 'creator','docTitle', 'createdAt'];
	constructor(
		private route: ActivatedRoute,
		private ddsService: DocDataStorageService,
		private router: Router,
		public dialog: MatDialog,
	) { 
		this.spaceTime = this.route.snapshot.params.spaceTime
	}

	ngOnInit(): void {
		this.ddsService.docs$ .pipe(takeUntil(this.unsubscribe$))
			.subscribe(
			(data: any) => {
				this.docsArray = data;
				console.log(this.docsArray);
			}
		);			
	}
	ngOnDestroy() {
		// unsubscribe all subscription
		this.unsubscribe$.next();
		this.unsubscribe$.complete();
	
	}

	openDoc(docId) {

		const docQuery = {
			id: docId
		}
		this.router.navigate(['collab/space/'+this.spaceTime+'/doc'], { queryParams: docQuery });
	}


	sharingDocumentBtn(){
		const editorQuery = {
			spaceTime: this.spaceTime,
			spaceTitle: this.spaceInfo.displayName,
		}

		this.router.navigate(['collab/editor/ctDoc'], { queryParams: editorQuery });
	}

	inviteMemberBtn(): void {
		console.log('openSpaceMemeber');
		const dialogRef = this.dialog.open(DialogSpaceMemberComponent, {
			width: '600px',
			height: '500px',
			data: {
				spaceTime: this.spaceTime,
			}
		});

		dialogRef.afterClosed().subscribe(result => {
			console.log('The dialog setting was closed');
			// this.getMembers();
			// if (result == null || result == '') {

			// } else {

			// }
		});
	}

}