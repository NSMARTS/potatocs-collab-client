import { Component, Input, OnInit } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { DocumentService } from 'src/@dw/services/collab/space/document.service';
import { ScrumBoardStorageService } from 'src/@dw/store/scrumBoard-storage.service';
import { MatDialog } from '@angular/material/dialog';
import { SpaceAddStatusDialogComponent } from './dialog/space-add-status-dialog/space-add-status-dialog.component';

export interface ScrumboardList {
    // id: number;
    label: string;
    children: ScrumboardDoc[];
}

export interface ScrumboardDoc {

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

    docsArray;
    @Input() spaceInfo: any;
    private unsubscribe$ = new Subject<void>();

    constructor(
        private docService: DocumentService,
        private scrumService: ScrumBoardStorageService,
        public dialog: MatDialog,
    ) {

        this.list = []
    }

    ngOnInit(): void {
        this.initializeScrumBoard();
    }

    ngOnDestroy() {
        // unsubscribe all subscription
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }

    initializeScrumBoard() {

        this.scrumService.scrum$.pipe(takeUntil(this.unsubscribe$)).subscribe(
            (data: any) => {
                // if(data == undefined){
                //     return;
                // }
                // else{
                    console.log(data);
                    this.docStatusList = data.scrum;
                    console.log(this.docStatusList);
                // }
            },
            (err: any) => {
                console.log(err);
            }
        )
    }


    dropList(event: CdkDragDrop<ScrumboardList[]>) {

        const data = {
            _id : this.spaceInfo._id,
            swapPre : event.previousIndex,
            swapCur : event.currentIndex,
        };

        this.docService.scrumEditStatusSequence(data).subscribe(
            (data: any) => {
                console.log(data);
            },
            (err: any) => {
                console.log(err);
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
    }

    drop(event: CdkDragDrop<ScrumboardDoc[]>, status) {

        console.log(event.previousIndex);
        console.log(event.currentIndex);
        const temp = event.previousContainer.data[event.previousIndex];

        const data = {
            _id: temp.doc_id,
            status: event.container.id,
            swapPre : event.previousIndex,
            swapCur : event.currentIndex,
        }
        this.docService.scrumEditDocStatus(data).subscribe(
            (data: any) => {
                console.log(data);
            },
            (err: any) => {
                console.log(err);
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
    }

    getConnectedList() {
        return this.docStatusList.map(x => `${x.label}`);
    }


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
                        console.log(data);
                        this.initializeScrumBoard();
                    },
                    (err: any) => {
                        console.log(err);
                    }
                ) 
            }
        })
    }

    deleteStatus(status){

        console.log(status);

        const data = {
            space_id: this.spaceInfo._id,
            label: status.label
        }
        this.docService.scrumDeleteDocStatus(data).subscribe(
            (data: any) =>{
                console.log(data);
            },
            (err: any) => {
                console.log(err);
            }
        )
    }
}
