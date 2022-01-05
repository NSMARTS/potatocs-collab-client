import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { JwtModule } from '@auth0/angular-jwt';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { NgMaterialUIModule } from './ng-material-ui/ng-material-ui.module';

// Module
import { AuthModule } from './components/auth/auth.module';
import { ApproutingModule } from './app-routing.module';

// Config
import { ENV } from '../@dw/config/config';

// Guard
import { SignInGuard } from '../@dw/guard/signIn.guard';
import { MngGuard } from '../@dw/services/leave/employee-mngmt/mng.guard';

// Component
import { AppComponent } from './app.component';
import { IndexComponent } from './components/index/index.component';
import { LeaveMngmtModule } from './components/leave-mngmt/leave-mngmt.module';
import { CollaborationModule } from '../app/@layout/collaboration.module'
import { DialogModule } from '../@dw/dialog/dialog.modules'


export function tokenGetter() {
	return localStorage.getItem(ENV.tokenName);
}
@NgModule({
    declarations: [
      AppComponent,
      IndexComponent,
    ],
    imports: [
      BrowserModule,
      BrowserAnimationsModule,
      NgMaterialUIModule,
      FormsModule,
      HttpClientModule,
      JwtModule.forRoot({
        config: {
          tokenGetter: tokenGetter,
          disallowedRoutes: [
            '/api/v1/auth/sign-in',
		        '/api/v1/auth/sign-up',
          ]
        }
      }),
      AuthModule,
      CollaborationModule,
      LeaveMngmtModule,
      ApproutingModule,
      DialogModule,
    ],
    providers: [SignInGuard, MngGuard],
    bootstrap: [AppComponent]
})
export class AppModule { }


