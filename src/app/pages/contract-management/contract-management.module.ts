import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ContractManagementRoutingModule } from './contract-management-routing.module';
import { ContractListComponent } from './contract-list/contract-list.component';
import { NgMaterialUIModule } from 'src/app/ng-material-ui/ng-material-ui.module';


@NgModule({
  declarations: [
    ContractListComponent
  ],
  imports: [
    CommonModule,
    ContractManagementRoutingModule,
    NgMaterialUIModule
    // IconModule
  ]
})
export class ContractManagementModule { }
