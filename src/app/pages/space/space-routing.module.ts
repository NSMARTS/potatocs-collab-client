import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CalendarListComponent } from './calendar-list/calendar-list.component';
import { DocumentComponent } from './document/document.component';
import { EditorComponent } from './editor/editor.component';
import { SpaceComponent } from './space.component';

const routes: Routes = [
 {
    path: 'space/:spaceTime',
    component: SpaceComponent
  },
  {
    path: 'editor/ctDoc',
    component: EditorComponent
  },
  {
    path: 'space/:spaceTime/doc',
    component: DocumentComponent
  },
  {
    path: 'space/calendar',
    component: CalendarListComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SpaceRoutingModule { }
