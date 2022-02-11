import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DataService } from 'src/@dw/store/data.service';
import { ReplacementDayRequestComponent } from '../replacement-day-request/replacement-day-request.component';

@Component({
    selector: 'app-rd-request-list',
    templateUrl: './rd-request-list.component.html',
    styleUrls: ['./rd-request-list.component.scss'],
})
export class RdRequestListComponent implements OnInit {

    @ViewChild(MatPaginator) paginator: MatPaginator;
    // view table
    displayedColumns: string[] = ['name', 'from', 'to', 'type', 'days', 'manager', 'status', 'btns'];
    ELEMENT_DATA = [
        {
            name: 'Jun',
            from: '2022-02-11',
            to: '2022-02-11',
            type: 'Replacement Day(full)',
            days: 1,
            manager: 'Jimmy Choo',
            status: 0,
        },
    ];

    viewStatus = {
        0: 'pending',
        1: 'approved',
        2: 'rejected',
    };
    // replacement day requests
    rdRequestList;

    company;
    manager;

    // dataSource = ELEMENT_DATA;
    private unsubscribe$ = new Subject<void>();

    constructor(
		public dataService: DataService,
		public dialog: MatDialog,
	) {}

    ngOnInit(): void {
        this.dataService.userCompanyProfile.pipe(takeUntil(this.unsubscribe$)).subscribe(
            (data: any) => {
                this.company = data;
                // if(this.company.rollover_max_day != undefined){
                // 	this.isRollover = true;
                // }
            },
            (err: any) => {
                console.log(err);
            },
        );

        this.dataService.userManagerProfile.pipe(takeUntil(this.unsubscribe$)).subscribe(
            (data: any) => {
                this.manager = data;
            },
            (err: any) => {
                console.log(err);
            },
        );
		
		this.dataService.userProfile.pipe(takeUntil(this.unsubscribe$)).subscribe(
			(data: any) => {
				console.log(data);
			},
			(err: any) => {
				console.log(err);
			}
		)

        this.rdRequestList = this.ELEMENT_DATA;
    }

    openRdRequest() {
        const dialogRef = this.dialog.open(ReplacementDayRequestComponent, {

			data: {
				name: 'Jun'
			}
		});

		dialogRef.afterClosed().subscribe(result => {
			console.log('dialog close');
		})
    }

    ngOnDestroy() {
        // unsubscribe all subscription
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }
}
