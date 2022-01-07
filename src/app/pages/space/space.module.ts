import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgMaterialUIModule } from 'src/app/ng-material-ui/ng-material-ui.module';
import { SpaceRoutingModule } from './space-routing.module';

import { DialogSettingSpaceComponent, DialogSpaceMemberComponent, SpaceComponent } from './space.component';
import { DocListComponent } from './doc-list/doc-list.component';
import { EditorComponent } from './editor/editor.component';
import { DocumentComponent } from './document/document.component';
import { DocFileUploadComponent } from './document/doc-tab/doc-file-upload/doc-file-upload.component';
import { DocChatComponent } from './document/doc-tab/doc-chat/doc-chat.component';
import { DialogDocMeetingSetComponent, DocMeetingComponent } from './document/doc-tab/doc-meeting/doc-meeting.component';
import { DialogCreateSpaceComponent } from 'src/@dw/dialog/create-space-dialog/dialog-create-space.component';
import { FileUploadDescriptionComponent } from './document/doc-tab/doc-file-upload/file-upload-description/file-upload-description.component';


@NgModule({
  declarations: [
    SpaceComponent,
    DocListComponent,
    DialogSettingSpaceComponent,
    DialogSpaceMemberComponent,
    EditorComponent,
    DocumentComponent,
    DocFileUploadComponent,
    DocChatComponent,
    DocMeetingComponent,
    DialogDocMeetingSetComponent,
    DialogCreateSpaceComponent,
    FileUploadDescriptionComponent
  ],
  imports: [
    CommonModule,
    SpaceRoutingModule,
    NgMaterialUIModule
  ]
})
export class SpaceModule { }
