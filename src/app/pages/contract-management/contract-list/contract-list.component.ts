import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ContractMngmtService } from 'src/@dw/services/contract-mngmt/contract/contract-mngmt.service';
import { ProfileService } from 'src/@dw/services/user/profile.service';
import { DataService } from 'src/@dw/store/data.service';



export interface PeriodicElement {
    startDate: Date;
    endDate: Date;
    name: string;
    leaveType: string;
    duration: number;
    email: string;
}

export interface Employees {
    _id: string;
    name: string;
    email: string;
}


@Component({
  selector: 'app-contract-list',
  templateUrl: './contract-list.component.html',
  styleUrls: ['./contract-list.component.scss']
})
export class ContractListComponent implements OnInit {

    userInfo;



    contractList = new MatTableDataSource;

    private unsubscribe$ = new Subject<void>();

    // auto complete
    myControl = new FormControl();
    options: Employees[];
    filteredOptions: Observable<Employees[]>;

    // view table
    displayedColumns: string[] = ['date', 'title', 'description', 'sender', 'receiver', 'status',];
    dataSource

    contractForm: FormGroup


    searchStr = '';

    viewType = {
        'pending': 'Pending',
        'proceeding': 'Proceeding',
        'complete': 'Complete',
    }

    @ViewChild(MatPaginator) paginator: MatPaginator;

    constructor(
        private router: Router,
        private fb: FormBuilder,
        public dialog: MatDialog,
        private contractMngmtService: ContractMngmtService,
        private profileService: ProfileService,
    ) { }

    ngOnInit(): void {

        this.profileService.getUserProfile().subscribe(
            async (data: any) => {
                console.log(data)

                this.userInfo = data;

                if(this.userInfo.company._id != undefined) {
                    this.getContractList();
                }
            },
            (err: any) => {
                console.log(err);
            }
        )


       

        const startOfMonth = moment().startOf('month').format();
        const endOfMonth = moment().endOf('month').format();

        this.contractForm = this.fb.group({
            type: ['all', [
                Validators.required,
            ]],
            leave_start_date: [startOfMonth, [
                Validators.required,
            ]],
            leave_end_date: [endOfMonth, [
                Validators.required,
            ]],
            emailFind: ['', [
                Validators.required,
            ]]
        });
    }

    ngOnDestroy() {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }



    // 계약서 가져오기
    getContractList() {

        const data = {
            company_id: this.userInfo.company._id,
            receiver_id: this.userInfo.user._id
        }


        console.log(data)

        this.contractMngmtService.getContractList(data).subscribe((data: any) => {
            if (data.message == 'Success find document list') {
                this.contractList = data.documentList;
            }

            console.log(data)

            this.contractList = new MatTableDataSource<PeriodicElement>(data.contractList);
            this.contractList.paginator = this.paginator;
        },
            (err: any) => {
                console.log(err);
            }
        )
    }


    // Go to the page where you sign a contract
    openContractSignPage(data) {
        console.log(data)
        this.router.navigate([`/contract-mngmt/contract-sign/${data._id}`]);
    }
}

