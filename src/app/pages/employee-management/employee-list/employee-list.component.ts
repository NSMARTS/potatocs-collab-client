import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { CommonService } from 'src/@dw/services/common/common.service';


//table page
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import * as moment from 'moment';
import { DialogService } from 'src/@dw/dialog/dialog.service';
import { EmployeeMngmtService } from 'src/@dw/services/leave/employee-mngmt/employee-mngmt.service';

// view table
export interface PeriodicElement {
	Name: string;
	position: string;
	location: string;
	annual_leave: number;
	sick_leave: number;
	replacement: number;
	start_date: Date;
	end_date: Date;
	tenure_today: Date;
	tenure_end: Date;
}

@Component({
	selector: 'app-employee-list',
	templateUrl: './employee-list.component.html',
	styleUrls: ['./employee-list.component.scss']
})
export class EmployeeListComponent implements OnInit {

	displayedColumns: string[] = ['name', 'position', 'location', 'annual_leave', 'sick_leave', 'replacementday_leave', 'tenure_today'];
	filterValues = {};
	filterSelectObj = [];

	getMyEmployeeList = new MatTableDataSource;

	myRank = window.location.pathname.split('/')[3];
	managerName = '';
	@ViewChild(MatPaginator) paginator: MatPaginator;

	constructor(
		private employeeMngmtService: EmployeeMngmtService,
		private router: Router,
		private commonService: CommonService,
		private dialogService: DialogService,

	) {
		this.filterSelectObj = [
			{
				name: 'LOCATION',
				columnProp: 'location',
				options: []
			},
			// {
			//   name: 'NAME',
			//   columnProp: 'name',
			//   options: []
			// }, {
			//   name: 'USERNAME',
			//   columnProp: 'username',
			//   options: []
			// }, {
			//   name: 'EMAIL',
			//   columnProp: 'email',
			//   options: []
			// }, {
			//   name: 'STATUS',
			//   columnProp: 'status',
			//   options: []
			// }
		]
	}

	ngOnInit(): void {
		console.log(this.myRank);
		this.getMyEmployeeLists();
	}

	getMyEmployeeLists() {
		this.managerName = '';
		this.employeeMngmtService.getMyEmployeeList().subscribe(
			(data: any) => {
				if (data.message == 'found') {
					console.log(data.myEmployeeList);

					// tenure 계산
					this.calculateTenure(data.myEmployeeList);

////////////////
					this.getMyEmployeeList.data = data.myEmployeeList;
					this.filterSelectObj.filter((filter) => {
						filter.options = this.getFilterObject(data.myEmployeeList, filter.columnProp);
						console.log(filter.options);
					});
					console.log(this.filterSelectObj);

					this.getMyEmployeeList.filterPredicate = this.createFilter();
					console.log(this.getMyEmployeeList.filterPredicate);

////////////////

					this.getMyEmployeeList.paginator = this.paginator;
					console.log(this.getMyEmployeeList);
				}
			},
			err => {
				console.log(err);
				this.dialogService.openDialogNegative(err.error.message)
				// alert(err.error.message);
			}
		);
	}

	// getMyManagerEmployeeList(managerID, managerName) {
	// 	this.managerName = managerName;
	// 	this.employeeMngmtService.getMyManagerEmployeeList({ managerID }).subscribe(
	// 		(data: any) => {
	// 			console.log(data.message);
	// 			console.log(data.myManagerEmployeeList);
	// 			this.calculateTenure(data.myManagerEmployeeList);

	// 			this.getMyEmployeeList.data = data.myManagerEmployeeList;
	// 				this.filterSelectObj.filter((filter) => {
	// 					filter.options = this.getFilterObject(data.myManagerEmployeeList, filter.columnProp);
	// 					console.log(filter.options);
	// 				});
	// 				console.log(this.filterSelectObj);

	// 			this.getMyEmployeeList.paginator = this.paginator;
	// 			console.log(this.managerName);
	// 		},
	// 		err => {
	// 			console.log(err);
	// 			alert(err.error.message);


	// 		}
	// 	)
	// }

	calculateTenure(data) {
		console.log('calculateTenure');
		console.log(data);
		for (let index = 0; index < data.length; index++) {

			var date = new Date();

			var start = this.commonService.dateFormatting(data[index].emp_start_date);
			var end = this.commonService.dateFormatting(data[index].emp_end_date);

			var startDate = moment(start, 'YYYY-MM-DD');
			var endDate = moment(end, 'YYYY-MM-DD');
			var today = moment(this.commonService.dateFormatting(date), 'YYYY-MM-DD');


			data[index].tenure_today = this.yearMonth(startDate, today)
			data[index].tenure_end = this.month(startDate, endDate)

		}
		console.log(data);
	}
	yearMonth(start, end) {
		var monthDiffToday = end.diff(start, 'months');
		if (isNaN(monthDiffToday)) {
			return '-'
		}
		var tmp = monthDiffToday
		monthDiffToday = tmp % 12;
		var yearDiffToday = (tmp - monthDiffToday) / 12;

		return yearDiffToday + ' Years ' + monthDiffToday + ' Months'
	}
	month(start, end) {
		var monthDiffToday = end.diff(start, 'months');
		if (isNaN(monthDiffToday)) {
			return '-'
		}
		// var tmp = monthDiffToday
		// monthDiffToday = tmp % 12;
		// var yearDiffToday = (tmp - monthDiffToday) / 12;

		return monthDiffToday + ' Months'
	}

	backManagerList() {
		this.router.navigate(['employee-mngmt/manager-list']);
	}

	editInfo(employeeId) {
		this.router.navigate(['employee-mngmt/edit-info', employeeId]);
	}





	//////////////////////////////
	// Get Uniqu values from columns to build filter
	getFilterObject(fullObj, key) {
		const uniqChk = [];
		fullObj.filter((obj) => {
			if (!uniqChk.includes(obj[key])) {
				uniqChk.push(obj[key]);
			}
			console.log(obj);
			return obj;
		});
		console.log(uniqChk);
		return uniqChk;
	}

	// Called on Filter change
	filterChange(filter, event) {
		//let filterValues = {}
		this.filterValues[filter.columnProp] = event.target.value.trim().toLowerCase()
		this.getMyEmployeeList.filter = JSON.stringify(this.filterValues);
		console.log(this.filterValues);
		console.log(this.getMyEmployeeList.filter);
	}

	// Custom filter method fot Angular Material Datatable
	createFilter() {
		console.log('createFilter');
		let filterFunction = function (data: any, filter: string): boolean {
			let searchTerms = JSON.parse(filter);
			let isFilterSet = false;
			console.log(isFilterSet);
			for (const col in searchTerms) {
				if (searchTerms[col].toString() !== '') {
					isFilterSet = true;
					console.log(isFilterSet);
				} else {
					delete searchTerms[col];
				}
			}

			console.log(searchTerms);

			let nameSearch = () => {
				let found = false;
				if (isFilterSet) {
					for (const col in searchTerms) {
						searchTerms[col].trim().toLowerCase().split(' ').forEach(word => {
							if (data[col].toString().toLowerCase().indexOf(word) != -1 && isFilterSet) {
								found = true
							}
						});
					}
					return found
				} else {
					return true;
				}
			}
			return nameSearch()
		}
		return filterFunction
	}


	// Reset table filters
	resetFilters() {
		this.filterValues = {}
		this.filterSelectObj.forEach((value, key) => {
			value.modelValue = undefined;
		})
		this.getMyEmployeeList.filter = "";
	}

}
