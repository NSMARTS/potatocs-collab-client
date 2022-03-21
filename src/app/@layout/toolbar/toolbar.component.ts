import { Component, OnInit } from '@angular/core';
import { LayoutService } from '../../../@dw/services/layout.service';
import { Observable, Subject } from 'rxjs';
import { AuthService } from 'src/@dw/services/auth/auth.service';
import { Router } from '@angular/router';
import { ProfileService } from 'src/@dw/services/user/profile.service';
import { DataService } from 'src/@dw/store/data.service';
import { takeUntil } from 'rxjs/operators';
import { NotificationService } from 'src/@dw/services/notification/notification.service';
import { NotificationStorageService } from 'src/@dw/store/notification-storage.service';
import * as moment from 'moment';

@Component({
    selector: 'po-toolbar',
    templateUrl: './toolbar.component.html',
    styleUrls: ['./toolbar.component.scss'],
})
export class ToolbarComponent implements OnInit {
    userProfileData;
    notiItems = [
        // {
        //     notiType: 'leave-request',
        //     isRead: false,
        //     iconText: 'open_in_browser',
        //     notiLabel: 'A new leave request received',
        // },
        // {
        //     notiType: 'company-request',
        //     isRead: false,
        //     iconText: 'work_outline',
        //     notiLabel: 'A new company request received',
        // },
        // {
        //     notiType: 'company-res-y',
        //     isRead: false,
        //     iconText: 'done_outline',
        //     notiLabel: 'The company request has been accepted',
        // },
        // {
        //     notiType: 'leave-res-n',
        //     isRead: false,
        //     iconText: 'block',
        //     notiLabel: 'The leave request has been rejected',
        // },
        // {
        //     notiType: 'company-res-n',
        //     isRead: false,
        //     iconText: 'block',
        //     notiLabel: 'The company request has been rejected',
        // },
        // {
        //     notiType: 'leave-request',
        //     isRead: false,
        //     iconText: 'open_in_browser',
        //     notiLabel: 'A new leave request received',
        // },
        // {
        //     notiType: 'leave-res-y',
        //     isRead: false,
        //     iconText: 'done_outline',
        //     notiLabel: 'A new leave request has been accepted',
        // },
        // {
        //     notiType: 'leave-request',
        //     isRead: false,
        //     iconText: 'open_in_browser',
        //     notiLabel: 'A new leave request received',
        // },
        // {
        //     notiType: 'leave-request',
        //     isRead: false,
        //     iconText: 'open_in_browser',
        //     notiLabel: 'A new leave request received',
        // },
        // {
        //     notiType: 'leave-request',
        //     isRead: false,
        //     iconText: 'open_in_browser',
        //     notiLabel: 'A new leave request received',
        // },
    ];
    notiItemsLength = 0;

    private unsubscribe$ = new Subject<void>();

    constructor(
        private layoutService: LayoutService,
        private authService: AuthService,
        private router: Router,
        private profileService: ProfileService,
        private dataService: DataService,
        private notificationService: NotificationService,
        private notificationStorageService: NotificationStorageService,
    ) {}

    ngOnInit(): void {
        this.profileService.getUserProfile().subscribe((data: any) => {
            if (data.result) {
            }
        });

        this.notificationService.getNotification().subscribe(
            (data: any) => {
                if (data.result) {
                }
            }
        )

        this.getUserProfileData();
        this.getNotificationData();
    }
    ngOnDestroy() {
        // unsubscribe all subscription
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }

    logOut() {
        // console.log('logout');
        this.authService.logOut();
        this.router.navigate(['welcome']);
    }

    getUserProfileData() {
        this.dataService.userProfile.pipe(takeUntil(this.unsubscribe$)).subscribe((res: any) => {
            this.userProfileData = res;
        });
    }

    // notification 가져오기
    getNotificationData() {
        const today = new Date();

        this.notificationStorageService.myNotificationData.pipe(takeUntil(this.unsubscribe$)).subscribe((res: any) =>{
            this.notiItems = res;
            let count = 0;
            for (let index = 0; index < this.notiItems.length; index++) {
                const element = this.notiItems[index].isRead;
                this.notiItems[index].period = moment(this.notiItems[index].createdAt).from(moment(today));
                if(element == false){
                    count++;
                }
            }
            this.notiItemsLength = count
        });
    }

    // notification 눌렀을때 이동
    // 
    moveToPage(item){
        this.notificationService.editNotification(item).subscribe(
            (data: any) => {
                // console.log(data);
            }
        )
        // console.log(navi);
        this.router.navigate([item.navigate]);
    }

    // MARK ALL AS READ 눌렀을때
    allRead(){
        this.notificationService.allReadNotification().subscribe(
            (data: any) => {
                
            }
        )
    }


    /**
     * open side nav
     */
    openSidenav() {
        this.layoutService.openSidenav();
    }
}
