import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContractListComponent } from './contract-list/contract-list.component';
import { ContractResponseComponent } from './contract-response/contract-response.component';

const routes: Routes = [
    {
		path: '',
		children: [
			{
				path: 'contract-list',
				component: ContractListComponent,
			},
            {
				path: 'contract-sign/:id',
				component: ContractResponseComponent,
			},
		]
	},
    // 잘못된 URL을 사용했을때 메인으로 보냄
    {
        path: '**',
        redirectTo: '',
        pathMatch: 'full'
    },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContractManagementRoutingModule { }
