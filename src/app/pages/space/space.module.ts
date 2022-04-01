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
import { FileUploadDetailsComponent } from './document/doc-tab/doc-file-upload/file-upload-details/file-upload-details.component';
import { MeetingDetailComponent } from './document/doc-tab/doc-meeting/meeting-detail/meeting-detail.component';
import { CalendarListComponent } from './calendar-list/calendar-list.component';
import { CalendarEditComponent } from './calendar-list/calendar-edit/calendar-edit.component';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { FlatpickrModule } from 'angularx-flatpickr';
import { FormsModule } from '@angular/forms';
import { WhiteBoardComponent } from './document/doc-tab/white-board/white-board.component';
import { WbDialogComponent } from './document/doc-tab/white-board/wb-dialog/wb-dialog.component';
import { WbDetailComponent } from './document/doc-tab/white-board/wb-detail/wb-detail.component';
// import { ScrumboardListComponent } from './scrumboard-list/scrumboard-list.component';

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
    FileUploadDescriptionComponent,
    FileUploadDetailsComponent,
    MeetingDetailComponent,
    CalendarListComponent,
    CalendarEditComponent,
    WhiteBoardComponent,
    WbDialogComponent,
    WbDetailComponent
    // ScrumboardListComponent
  ],
  imports: [
    CommonModule,
    SpaceRoutingModule,
    NgMaterialUIModule,
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory
    }),
    FlatpickrModule.forRoot(),
    FormsModule
  ]
})
export class SpaceModule { }
