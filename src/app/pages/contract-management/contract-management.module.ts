import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ContractManagementRoutingModule } from './contract-management-routing.module';
import { ContractListComponent } from './contract-list/contract-list.component';
import { NgMaterialUIModule } from 'src/app/ng-material-ui/ng-material-ui.module';
import { ContractSignComponent } from './contract-response/contract-sign/contract-sign.component';
import { ContractResponseComponent } from './contract-response/contract-response.component';
import { BoardCanvasComponent } from './contract-response/white-board/board-canvas/board-canvas.component';
import { BoardNavComponent } from './contract-response/white-board/board-nav/board-nav.component';
import { BoardSlideViewComponent } from './contract-response/white-board/board-slide-view/board-slide-view.component';
import { BoardFabsComponent } from './contract-response/white-board/board-fabs/board-fabs.component';
import { DragScrollDirective } from 'src/@dw/directives/drag-scroll.directive';
import { ContractDetailsComponent } from './contract-response/contract-details/contract-details.component';
import { ContractRejectComponent } from './contract-response/contract-reject/contract-reject.component';


@NgModule({
  declarations: [
    ContractListComponent,
    ContractSignComponent,
    ContractResponseComponent,

    BoardCanvasComponent,
    BoardFabsComponent,
    BoardNavComponent,
    BoardSlideViewComponent,
    DragScrollDirective,
    ContractDetailsComponent,
    ContractRejectComponent,
  ],
  imports: [
    CommonModule,
    ContractManagementRoutingModule,
    NgMaterialUIModule
    // IconModule
  ]
})
export class ContractManagementModule { }
