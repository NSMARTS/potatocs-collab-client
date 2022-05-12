import { Component, Input, OnInit } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { DocumentService } from 'src/@dw/services/collab/space/document.service';
import { ScrumBoardStorageService } from 'src/@dw/store/scrumBoard-storage.service';
import { MatDialog } from '@angular/material/dialog';
import { SpaceAddStatusDialogComponent } from './dialog/space-add-status-dialog/space-add-status-dialog.component';
import { DialogService } from 'src/@dw/dialog/dialog.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ScrumboardSummaryComponent } from './dialog/scrumboard-summary/scrumboard-summary.component';
import { Router } from '@angular/router';
import { FormControl } from '@angular/forms';

export interface ScrumboardList {
    // id: number;
    label: string;
    children: ScrumboardDoc[];
}

export interface ScrumboardDoc {
    visible: boolean;
    color: {},
    createdAt: Date,
    creator: string,
    creator_id: string,
    docContent: [],
    docTitle: string,
    endDate: Date,
    spaceTime_id: string,
    startDate: Date,
    status: string,
    doc_id: string,
}

@Component({
    selector: 'app-scrumboard-list',
    templateUrl: './scrumboard-list.component.html',
    styleUrls: ['./scrumboard-list.component.scss']
})



export class ScrumboardListComponent implements OnInit {
    todo = ['Get to work', 'Pick up groceries', 'Go home', 'Fall asleep'];
    done = ['Get up', 'Brush teeth', 'Take a shower', 'Check e-mail', 'Walk dog'];

    docStatusList: ScrumboardList[];
    list: ScrumboardList[];
    basicProfile = '/assets/image/person.png';

    docsArray;
    @Input() spaceInfo: any;
    @Input() memberInSpace: any;

    private unsubscribe$ = new Subject<void>();

    member = new FormControl();
    temp;

    constructor(
        private docService: DocumentService,
        private scrumService: ScrumBoardStorageService,
        public dialog: MatDialog,
        private dialogService: DialogService,
        private snackbar: MatSnackBar,
        private router: Router,
    ) {

        this.list = []
    }

    ngOnInit(): void {
        
        this.scrumService.scrum$.pipe(takeUntil(this.unsubscribe$)).subscribe(
            (data: any) => {
                if(data == [] || data == undefined){
                    return;
                    // this.initializeScrumBoard();
                }
                else{
                    // console.log(data);
                    
                    this.temp = data.scrum;
                    this.docStatusList = this.temp;
                    // this.initializeScrumBoard();
                }
            },
            (err: any) => {
                // console.log(err);
            }
        )
    }

    ngOnDestroy() {
        // unsubscribe all subscription
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }
    ngOnChanges(){
        if(this.memberInSpace == undefined){
            return;
        }

        const checkMemberArray = [];

        for (let index = 0; index < this.memberInSpace.length; index++) {
            checkMemberArray.push(this.memberInSpace[index]._id);
        
            if(index == this.memberInSpace.length-1){
                this.member.setValue(checkMemberArray);
            }
        }

        this.memberFilter();
    }

    dropList(event: CdkDragDrop<ScrumboardList[]>) {
        console.log(this.spaceInfo);
        const data = {
            _id : this.spaceInfo._id,
            swapPre : event.previousIndex,
            swapCur : event.currentIndex,
        };

        this.docService.scrumEditStatusSequence(data).subscribe(
            (data: any) => {
                // console.log(data);
            },
            (err: any) => {
                // console.log(err);
            }
        )

        if (event.previousContainer === event.container) {
            moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
        } else {
            transferArrayItem(event.previousContainer.data,
                event.container.data,
                event.previousIndex,
                event.currentIndex);
        }
        this.snackbar.open('Update list sequence','Close' ,{
            duration: 3000,
            horizontalPosition: "center"
        });
    }

    drop(event: CdkDragDrop<ScrumboardDoc[]>) {

        const temp = event.previousContainer.data[event.previousIndex];

        console.log(event.previousIndex);
        console.log(event.previousContainer.data.indexOf(event.item.data))
        console.log(event.currentIndex);
        console.log(event.previousContainer.id);
        console.log(event.container.id);

        const data = {
            _id: temp.doc_id,
            status: event.container.id,
            swapPre : event.previousIndex,
            swapCur : event.currentIndex,
        }
        this.docService.scrumEditDocStatus(data).subscribe(
            (data: any) => {
                // console.log(data);
            },
            (err: any) => {
                // console.log(err);
            }
        )

        if (event.previousContainer === event.container) {
            moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
        } else {
            transferArrayItem(
                event.previousContainer.data,
                event.container.data,
                event.previousIndex,
                event.currentIndex,
            );
        }

        this.snackbar.open('Update document status','Close' ,{
            duration: 3000,
            horizontalPosition: "center"
        });
    }

    getConnectedList() {
        return this.docStatusList.map(x => `${x.label}`);
    }

    // status 추가
    addStatus(){
        const dialogRef = this.dialog.open(SpaceAddStatusDialogComponent, {
            data: {
                space_id: this.spaceInfo._id,
                addStatus: '',
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            // result 에 값이 오면 업로드
            if (result) {
                this.docService.scrumAddDocStatus(result).subscribe(
                    (data: any) => {
                        this.snackbar.open('Add list','Close' ,{
                            duration: 3000,
                            horizontalPosition: "center"
                        });
                    },
                    (err: any) => {
                    }
                ) 
            }
        });
        
    }


    // status 삭제
    deleteStatus(status){
        this.dialogService.openDialogConfirm(`If you delete the list, you will also delete the documents in it.\nDo you still want to delete it?`).subscribe((result) => {

            if(result){
                const data = {
                    space_id: this.spaceInfo._id,
                    label: status.label
                }
                this.docService.scrumDeleteDocStatus(data).subscribe(
                    (data: any) =>{
                        this.snackbar.open('Delete list','Close' ,{
                            duration: 3000,
                            horizontalPosition: "center"
                        });
                    },
                    (err: any) => {
                    }
                )
            }
        });
        
    }

    
    openSummary(document, status){

        console.log(document);
        console.log(this.spaceInfo.memberObjects);
        
        const dialogRef = this.dialog.open(ScrumboardSummaryComponent, {
            data: {
                document: document,
                space_id: this.spaceInfo._id,
                docStatus: status,
                member: this.spaceInfo.memberObjects,
            }
        });

        dialogRef.afterClosed().subscribe(result => {
            // result 에 값이 오면 업로드
            if (result) {
                
            }
        });
    }


    createDoc(status) {
        console.log(status);
        console.log(status.label)
		const editorQuery = {
			spaceTime: this.spaceInfo._id,
			spaceTitle: this.spaceInfo.displayName,
            status: status.label
		}
        console.log(editorQuery);
		this.router.navigate(['collab/editor/ctDoc'], { queryParams: editorQuery });
	}

    // 멤버 필터부분
    memberFilter(){
        // console.log(this.member.value.includes(1));
        this.initializeScrumBoard(this.member.value);
    }

    initializeScrumBoard(member?){
        
        if(!member){

            this.docStatusList = this.temp;
            

            for (let i = 0; i < this.docStatusList.length; i++) {
                
                const children = this.docStatusList[i].children


                for (let index = 0; index < children.length; index++) {
                    const creator = this.docStatusList[i].children[index].creator;
                    
                    if(member.includes(creator)){
                        this.docStatusList[i].children[index].visible = true;
                    }
                    else{
                        this.docStatusList[i].children[index].visible = false;
                    }
                }
            }
        }
        else{

            for (let i = 0; i < this.docStatusList.length; i++) {
                
                const children = this.docStatusList[i].children

                for (let index = 0; index < children.length; index++) {
                    const creator = this.docStatusList[i].children[index].creator;

                    if(member.includes(creator)){
                        this.docStatusList[i].children[index].visible = true;
                    }
                    else{
                        this.docStatusList[i].children[index].visible = false;
                    }
                
                }
            }
        }
    }
}
