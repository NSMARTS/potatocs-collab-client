import { Component, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject } from 'rxjs';
import { CalendarEvent, CalendarEventAction, CalendarEventTimesChangedEvent, CalendarView } from 'angular-calendar';
import { addDays, addHours, endOfDay, endOfMonth, isSameDay, isSameMonth, startOfDay, subDays } from 'date-fns';
import { CalendarEditComponent } from './calendar-edit/calendar-edit.component';

const colors: any = {
    blue: {
        primary: '#5c77ff',
        secondary: '#FFFFFF'
    },
    yellow: {
        primary: '#ffc107',
        secondary: '#FDF1BA'
    },
    red: {
        primary: '#f44336',
        secondary: '#FFFFFF'
    }
};


@Component({
    selector: 'app-calendar-list',
    templateUrl: './calendar-list.component.html',
    styleUrls: ['./calendar-list.component.scss'],
})
export class CalendarListComponent {

    private yesterday: Date;
    @ViewChild('modalContent') modalContent: TemplateRef<any>;
    view: CalendarView = CalendarView.Month;
    CalendarView = CalendarView;
    viewDate: Date = new Date();

    modalData: {
        action: string;
        event: CalendarEvent;
    };

    actions: CalendarEventAction[] = [
        {
            label: '<i class="fa fa-fw fa-pencil"></i>',
            onClick: ({ event }: { event: CalendarEvent }): void => {
                this.handleEvent('Edited', event);
            }
        },
        {
            label: '<i class="fa fa-fw fa-times"></i>',
            onClick: ({ event }: { event: CalendarEvent }): void => {
                this.events = this.events.filter(iEvent => iEvent !== event);
                this.handleEvent('Deleted', event);
            }
        }
    ];

    refresh: Subject<any> = new Subject();
    events: CalendarEvent[];
    activeDayIsOpen: boolean = true;

    constructor() {
        this.initializeYesterday();
        this.initializeEvents();
    }

    private initializeYesterday() {
        this.yesterday = new Date();
        this.yesterday.setDate(this.yesterday.getDate() - 1);
    }

    private initializeEvents() {
        this.events = [
            {
                title: 'Editable event',
                color: colors.yellow,
                start: this.yesterday,
                actions: [
                    {
                        label: '<i class="fa fa-fw fa-pencil"></i>',
                        onClick: ({ event }: { event: CalendarEvent }): void => {
                            console.log('Edit event', event);
                        }
                    }
                ]
            },
            {
                title: 'Deletable event',
                color: colors.blue,
                start: this.yesterday,
                actions: [
                    {
                        label: '<i class="fa fa-fw fa-times"></i>',
                        onClick: ({ event }: { event: CalendarEvent }): void => {
                            this.events = this.events.filter(iEvent => iEvent !== event);
                            console.log('Event deleted', event);
                        }
                    }
                ]
            },
            {
                title: 'Non editable and deletable event',
                color: colors.red,
                start: this.yesterday
            }
        ];
    }

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

    eventTimesChanged({
        event,
        newStart,
        newEnd
    }: CalendarEventTimesChangedEvent): void {
        this.events = this.events.map(iEvent => {
            if (iEvent === event) {
                return {
                    ...event,
                    start: newStart,
                    end: newEnd
                };
            }
            return iEvent;
        });
        this.handleEvent('Dropped or resized', event);
    }

    handleEvent(action: string, event: CalendarEvent): void {
        this.modalData = { event, action };
        // this.modal.open(this.modalContent, { size: 'lg' });
    }

    addEvent(): void {
        this.events = [
            ...this.events,
            {
                title: 'New event',
                start: startOfDay(new Date()),
                end: endOfDay(new Date()),
                color: colors.red,
                draggable: true,
                resizable: {
                    beforeStart: true,
                    afterEnd: true
                }
            }
        ];
    }

    deleteEvent(eventToDelete: CalendarEvent) {
        this.events = this.events.filter(event => event !== eventToDelete);
    }

    setView(view: CalendarView) {
        this.view = view;
    }

    closeOpenMonthViewDay() {
        this.activeDayIsOpen = false;
    }
}



