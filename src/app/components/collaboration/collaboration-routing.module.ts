import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SignInGuard } from 'src/@dw/guard/signIn.guard';
import { ProfileEditComponent } from './pages/profile-edit/profile-edit.component';

import { CollaborationComponent } from './collaboration.component';
import { DocumentComponent } from './pages/document/document.component';
import { EditorComponent } from './pages/editor/editor.component';
import { MainComponent } from './pages/main/main.component';
import { SpaceComponent } from './pages/space/space.component';

const routes: Routes = [
  	{
		path: '',
		redirectTo: 'welcome',
		pathMatch: 'full'
	},
  	{
		path: '',
		component: CollaborationComponent,
		canActivate: [SignInGuard],
		children: [
			{
				path: 'main',
				component: MainComponent
			},
			{
				path: 'leave',
				loadChildren: () => import('src/app/components/leave-mngmt/leave-mngmt.module').then(m => m.LeaveMngmtModule),
			},
			{
				path: 'collab/space/:spaceTime',
				component: SpaceComponent
			},
			{
				path: 'profile',
				component: ProfileEditComponent
			},
			{
				path: 'collab/editor/ctDoc',
				component: EditorComponent
			},
			{
				path: 'collab/space/:spaceTime/doc',
				component: DocumentComponent
			}
		]

    },
	
	{
		path: 'collab/space/:spaceTime/doc',
		component: DocumentComponent
	}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  
  exports: [RouterModule]
})
export class CollaborationRoutingModule { }
