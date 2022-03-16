import { Component, Input, OnInit } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { MemberDataStorageService } from 'src/@dw/store/member-data-storage.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { DocDataStorageService } from 'src/@dw/store/doc-data-storage.service';

export interface ScrumboardList {
    id: number;
    label: string;
    children: ScrumboardDoc[];
}

export interface ScrumboardDoc {
id: number;
title: string;
description?: string;
}

@Component({
    selector: 'app-scrumboard-list',
    templateUrl: './scrumboard-list.component.html',
    styleUrls: ['./scrumboard-list.component.scss']
})



export class ScrumboardListComponent implements OnInit {
    todo = ['Get to work', 'Pick up groceries', 'Go home', 'Fall asleep'];
    done = ['Get up', 'Brush teeth', 'Take a shower', 'Check e-mail', 'Walk dog'];

    docStatusList : ScrumboardList;


    docsArray;
    @Input() spaceInfo: any;
    private unsubscribe$ = new Subject<void>();

    constructor(
        private mdsService: MemberDataStorageService,
        private ddsService: DocDataStorageService,
    ) { }

    ngOnInit(): void {
        this.mdsService.members.pipe(takeUntil(this.unsubscribe$)).subscribe(
            async (data: any) => {
                console.log(data);
                this.docStatusList = data[0]?.docStatus;
                console.log(this.docStatusList);
            })

        this.ddsService.docs$.pipe(takeUntil(this.unsubscribe$))
            .subscribe(
                (data: any) => {
                    this.docsArray = data;
                    console.log(this.docsArray);
                    for (let i = 0; i < this.docsArray.length; i++) {
                        const doc = this.docsArray[i];
                        console.log(doc);
                        // for (let j = 0; j < this.docStatusList.length; j++) {
                        //     const status = this.docStatusList[j];
                        //     console.log(status);
                        //     if(doc.status == status){
                        //         this.docStatusList[j].doc=doc;
                        //     }
                        // }
                    }
                    console.log(this.docStatusList);
                },
                (err: any) => {
                    return;
                }
            );
    }

    ngOnDestroy() {
        // unsubscribe all subscription
        this.unsubscribe$.next();
        this.unsubscribe$.complete();

    }


    drop(event: CdkDragDrop<string[]>) {
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

}
