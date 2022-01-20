import { Injectable, OnInit } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, CanLoad } from '@angular/router';
import { DialogService } from '../../../dialog/dialog.service';
import { DataService } from '../../../store/data.service';
import { AuthService } from '../../auth/auth.service';

@Injectable()
export class MngGuard implements CanActivate, OnInit {

    public profile

    constructor(
        private router: Router,
        private auth: AuthService,
        private dialogService: DialogService,
        private dataService: DataService,
    ) {

    }

    ngOnInit() {
        console.log('mng guard');
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

        const managerFlag: boolean = this.auth.getTokenInfo().isManager;

        if (!managerFlag) {
            this.dialogService.openDialogNegative('You are not a Manager');
            this.router.navigate(['main']);
        }
        else{
            return true;      
        }
    }
}
