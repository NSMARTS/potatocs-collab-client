import { Component, HostListener } from '@angular/core';
import AOS from 'aos'; //AOS - 1

@Component({
    selector: 'app-index',
    templateUrl: './index.component.html',
    styleUrls: ['./index.component.scss'],
})
export class IndexComponent {
    // header
    isHeaderActive: boolean = false;
    prevScrollTop: number = 0;

    // topbutton
    showScrollButton = false;

    ngAfterViewInit(): void {
        setTimeout(() => {
            AOS.init({
                duration: 400,
                once: false,
            });
        }, 400);
    }

    scrollToTop(): void {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    }

    @HostListener('window:scroll', ['$event'])
    onScroll(event) {
        const nowScrollTop = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0;
        if (nowScrollTop > this.prevScrollTop) {
            this.isHeaderActive = true;
        } else {
            this.isHeaderActive = false;
        }

        this.prevScrollTop = nowScrollTop;
    }

    @HostListener('window:scroll', [])
    onWindowScroll() {
        const scrollY = window.scrollY || document.documentElement.scrollTop;

        // 스크롤 위치가 500px 이상으로 내려갔을 때 스크롤 버튼을 보여줌
        this.showScrollButton = scrollY >= 500;
    }
}
