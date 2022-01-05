import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// import { LeaveMngmtComponent } from './leave-mngmt.component';
import { MainComponent } from './main/main.component';
import { RequestLeaveListComponent } from './request-leave-list/request-leave-list.component';
import { RequestLeaveComponent } from './request-leave/request-leave.component';

const routes: Routes = [
	{
		path: 'my-status',
		component: MainComponent
	},
	{
		path: 'request-leave-list',
		component: RequestLeaveListComponent
	},
	{
		path: 'request-leave',
		component: RequestLeaveComponent
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class LeaveMngmtRoutingModule { }
