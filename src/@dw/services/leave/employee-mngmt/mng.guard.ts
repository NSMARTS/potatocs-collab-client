import { Injectable, OnInit } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { DialogService } from '../../../dialog/dialog.service';
import { DataService } from '../../../store/data.service';

@Injectable()
export class MngGuard implements CanActivate, OnInit {

    public profile

    constructor(
        private router: Router,
        private dialogService: DialogService,
        private dataService: DataService,
    ) {

    }

    ngOnInit() {
        console.log('mng guard');
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        this.dataService.userProfile.subscribe(
			(data: any) => {
				this.profile = data;
			}
		);

        if (!this.profile.isManager) {
            this.dialogService.openDialogNegative('Your not Manager');
            this.router.navigate(['main']);
        }
        else{
            return true;      
        }
    }
}
