import { Component, Input, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject } from 'rxjs';
import { CalendarEvent, CalendarEventAction, CalendarEventTimesChangedEvent, CalendarView } from 'angular-calendar';
import { addDays, addHours, endOfDay, endOfMonth, isSameDay, isSameMonth, startOfDay, subDays } from 'date-fns';
import { CalendarEditComponent } from './calendar-edit/calendar-edit.component';
import { DocDataStorageService } from 'src/@dw/store/doc-data-storage.service';
import { takeUntil } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl } from '@angular/forms';

@Component({
    selector: 'app-calendar-list',
    templateUrl: './calendar-list.component.html',
    styleUrls: ['./calendar-list.component.scss'],
})
export class CalendarListComponent implements OnInit {

    private unsubscribe$ = new Subject<void>();
    docsArray: any;

    member = new FormControl();
    @Input() memberInSpace: any;

    @ViewChild('modalContent') modalContent: TemplateRef<any>;
    view: CalendarView = CalendarView.Month;
    CalendarView = CalendarView;
    viewDate: Date = new Date();

    modalData: {
        action: string;
        event: CalendarEvent;
    };

    refresh: Subject<any> = new Subject();
    actions: CalendarEventAction[] = [
        {
            label: '<i class="fa fa-fw fa-pencil"></i>',
            onClick: ({ event }: { event: CalendarEvent }): void => {
                this.handleEvent('Edited', event);
            }
        },
    ];
    events: CalendarEvent[] = [];
    tmp: CalendarEvent[] = [];
    activeDayIsOpen = true;

    constructor(
        private dialog: MatDialog,
        private snackbar: MatSnackBar,
        private ddsService: DocDataStorageService,
        private router: Router,
        private route: ActivatedRoute,
    ) { }

    ngOnInit(): void {
        const doc = this.ddsService.docs$.subscribe(
            (data: any) => {
                this.docsArray = data;
                // console.log(this.docsArray);
                this.initializeEvents();
            }
        );
    }
    ngOnDestroy() {
        // unsubscribe all subscription
        this.unsubscribe$.next();
        this.unsubscribe$.complete();

    }
    private initializeEvents(member?) {
        this.events = [];
        if (member){
            for (let index = 0; index < member.length; index++) {
                const memberId = member[index];
                for (let index = 0; index < this.docsArray.length; index++) {
                    if(memberId == this.docsArray[index].creator_id){
                        const docId = this.docsArray[index]._id
                        const title = this.docsArray[index].docTitle;
                        const start = new Date(this.docsArray[index].startDate);
                        const end = new Date(this.docsArray[index].endDate);
                        const color = this.docsArray[index].color;
        
                        const data = {
                            start: start,
                            title: title,
                            end: end,
                            actions: this.actions,
                            docId: docId,
                            color: color,
                            draggable: true
                        }
                        this.events.push(data);
                    }
                }
            }
        }
        else{
            if (this.docsArray != undefined) {
                for (let index = 0; index < this.docsArray.length; index++) {
                    const docId = this.docsArray[index]._id
                    const title = this.docsArray[index].docTitle;
                    const start = new Date(this.docsArray[index].startDate);
                    const end = new Date(this.docsArray[index].endDate);
                    const color = this.docsArray[index].color;
    
                    const data = {
                        start: start,
                        title: title,
                        end: end,
                        actions: this.actions,
                        docId: docId,
                        color: color,
                        draggable: true
                    }
                    this.events.push(data);
                }
            }
            else {
                return;
            }
        }
    }

    // 일 클릭했을때
    dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
        if (isSameMonth(date, this.viewDate)) {
            this.viewDate = date;
            if (
                (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
                events.length === 0
            ) {
                this.activeDayIsOpen = false;
            } else {
                this.activeDayIsOpen = true;
            }
        }
    }

    // doc을 옯길때
    eventTimesChanged({ event, newStart, newEnd }: CalendarEventTimesChangedEvent): void {

        this.events = this.events.map(iEvent => {
            if (iEvent === event) {
                event = {
                    ...event,
                    start: newStart,
                    end: newEnd
                }
                return iEvent;
            }
            return iEvent;
        });
        this.handleEvent('Dropped or resized', event);
    }

    // 옯겨서 다른곳에 놓으면 다이어로그가 열림
    handleEvent(action: string, event: CalendarEvent): void {

        const dialogRef = this.dialog.open(CalendarEditComponent, {
            data: event
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                event = result;
                this.snackbar.open('Updated Event: ' + event.title, 'Close',{
                    duration: 3000,
                    horizontalPosition: "center",
                });
                this.refresh.next();

                this.initializeEvents();
            }
        });
    }

    // doc 을 클릭하면 그 doc으로 이동
    moveToDoc(events) {
        const docQuery = {
			id: events.docId
		}
        const spaceTime = this.route.snapshot.params.spaceTime;
        this.router.navigate(['collab/space/'+spaceTime+'/doc'], { queryParams: docQuery });
    }

    // month week day 보는거
    setView(view: CalendarView) {
        this.view = view;
    }

    closeOpenMonthViewDay() {
        this.activeDayIsOpen = false;
    }

    // 멤버 필터부분
    memberFilter(){
        this.initializeEvents(this.member.value);
    }
}



