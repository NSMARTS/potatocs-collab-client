import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LeaveMngmtRoutingModule } from './leave-mngmt-routing.module';
import { LeaveMngmtComponent } from './leave-mngmt.component';
import { NgMaterialUIModule } from 'src/app/ng-material-ui/ng-material-ui.module';
import { RequestLeaveListComponent } from './request-leave-list/request-leave-list.component';
import { RequestLeaveComponent } from './request-leave/request-leave.component';
import { MainComponent } from './main/main.component';
import { LeaveRequestDetailsComponent } from '../../components/leave-request-details/leave-request-details.component';


@NgModule({
	declarations: [
		LeaveMngmtComponent,
		RequestLeaveListComponent,
		RequestLeaveComponent,
		MainComponent,
		LeaveRequestDetailsComponent,
	],
	imports: [
		CommonModule,
		NgMaterialUIModule,
		LeaveMngmtRoutingModule,
	],
	providers: [
	]
})
export class LeaveMngmtModule { }