import { Component, Input, OnInit } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { DocumentService } from 'src/@dw/services/collab/space/document.service';
import { ScrumBoardStorageService } from 'src/@dw/store/scrumBoard-storage.service';

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
                this.docStatusList = data.scrum;
                console.log(this.docStatusList);
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
        const data = {
            _id : this.spaceInfo._id,
        }
        this.docService.scrumAddDocStatus(data).subscribe(
            (data: any) => {
                console.log(data);
            },
            (err: any) => {
                console.log(err);
            }
        )
    }
}
