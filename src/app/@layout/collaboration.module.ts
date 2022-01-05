// MODULE
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CollaborationRoutingModule } from './collaboration-routing.module';
import { NgMaterialUIModule } from 'src/app/ng-material-ui/ng-material-ui.module';

// SERVICE

// COMPONENT
import { CollaborationComponent } from './collaboration.component';
import {  DialogCreateSpaceComponent,  } from '../../@dw/dialog/create-space-dialog/dialog-create-space.component';
import { MainComponent } from '../../app/components/collaboration/pages/main/main.component';
import { DialogSettingSpaceComponent, SpaceComponent } from '../../app/components/collaboration/pages/space/space.component';
import { DocumentComponent } from '../../app/components/collaboration/pages/document/document.component';
import { EditorComponent } from '../../app/components/collaboration/pages/editor/editor.component';
import { DocListComponent } from '../../app/components/collaboration/pages/space/doc-list/doc-list.component';
import { DocFileUploadComponent } from '../../app/components/collaboration/pages/document/doc-file-upload/doc-file-upload.component';
// import { DialogFileUploadComponent } from './pages/document/doc-file-upload/doc-file-upload.component';
import { DialogSpaceMemberComponent } from '../../app/components/collaboration/pages/space/space.component';
import { DocChatComponent } from '../../app/components/collaboration/pages/document/doc-chat/doc-chat.component';
import { DocMeetingComponent, DialogDocMeetingSetComponent } from '../../app/components/collaboration/pages/document/doc-tabs/doc-meeting/doc-meeting.component';
import { ManagerComponent } from '../../app/components/collaboration/pages/main/main.component';
import { CompanyComponent } from '../../app/components/collaboration/pages/main/main.component';
import { ProfileEditComponent } from '../../app/components/collaboration/pages/profile-edit/profile-edit.component';

import { ToolbarModule } from '../@layout/toolbar/toolbar.module';
import { SidenavModule } from '../@layout/sidenav/sidenav.module';


@NgModule({
  declarations: [
    CollaborationComponent,
    MainComponent,
    DialogCreateSpaceComponent,
    SpaceComponent,
    DialogSettingSpaceComponent,
    DocumentComponent,
    EditorComponent,
    DocListComponent,
    DocFileUploadComponent,
    // DialogFileUploadComponent,
    DialogSpaceMemberComponent,
    DocChatComponent,
    DocMeetingComponent,
    DialogDocMeetingSetComponent,
    ManagerComponent,
    CompanyComponent,
    ProfileEditComponent
  ],
  imports: [
    CommonModule,
    NgMaterialUIModule,
    CollaborationRoutingModule,
    ToolbarModule,
    SidenavModule,
    // PoModule
  ],
  entryComponents: [
    DialogCreateSpaceComponent,
    DialogSettingSpaceComponent
  ]
})
export class CollaborationModule { }
