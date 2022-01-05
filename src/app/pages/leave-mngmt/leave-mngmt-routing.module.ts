import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
// import { LeaveMngmtComponent } from './leave-mngmt.component';
import { MainComponent } from './pages/main/main.component';
import { RequestLeaveListComponent } from './pages/request-leave-list/request-leave-list.component';
import { RequestLeaveComponent } from './pages/request-leave/request-leave.component';
import { MngGuard } from 'src/@dw/services/leave/employee-mngmt/mng.guard';

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
	{
		path: 'employee-mngmt', canActivate: [ MngGuard ],
		loadChildren: () => import('./pages/employee-management/employee-management.module').then(m => m.EmployeeManagementModule)
	},
	{
		path: 'approval-mngmt', canActivate: [ MngGuard ],
		loadChildren: () => import('./pages/approval-management/approval-management.module').then(m => m.ApprovalManagementModule)
	},
	
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class LeaveMngmtRoutingModule { }
