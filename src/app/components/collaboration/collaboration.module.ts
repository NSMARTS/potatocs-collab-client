// MODULE
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CollaborationRoutingModule } from './collaboration-routing.module';
import { NgMaterialUIModule } from 'src/app/ng-material-ui/ng-material-ui.module';

// SERVICE

// COMPONENT
import { CollaborationComponent } from './collaboration.component';
import {  DialogCreateSpaceComponent,  } from '../../../@dw/dialog/create-space-dialog/dialog-create-space.component';
import { MainComponent } from './pages/main/main.component';
import { DialogSettingSpaceComponent, SpaceComponent } from './pages/space/space.component';
import { DocumentComponent } from './pages/document/document.component';
import { EditorComponent } from './pages/editor/editor.component';
import { DocListComponent } from './pages/space/doc-list/doc-list.component';
import { DocFileUploadComponent } from './pages/document/doc-file-upload/doc-file-upload.component';
// import { DialogFileUploadComponent } from './pages/document/doc-file-upload/doc-file-upload.component';
import { DialogSpaceMemberComponent } from './pages/space/space.component';
import { DocChatComponent } from './pages/document/doc-chat/doc-chat.component';
import { DocMeetingComponent, DialogDocMeetingSetComponent } from './pages/document/doc-tabs/doc-meeting/doc-meeting.component';
import { ManagerComponent } from './pages/main/main.component';
import { CompanyComponent } from './pages/main/main.component';

import { ToolbarModule } from './shared/components/layout/toolbar/toolbar.module';
import { SidenavModule } from './shared/components/layout/sidenav/sidenav.module';
import { ProfileEditComponent } from './pages/profile-edit/profile-edit.component';


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
