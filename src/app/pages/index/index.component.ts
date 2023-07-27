import { Component, ElementRef, HostListener, Renderer2 } from '@angular/core';
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

    // @HostListener('window:scroll', ['$event'])
    // onScroll(event) {
    //     const nowScrollTop = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0;
    //     if (nowScrollTop > this.prevScrollTop) {
    //         this.isHeaderActive = true;
    //     } else {
    //         this.isHeaderActive = false;
    //     }

    //     this.prevScrollTop = nowScrollTop;
    // }

    // @HostListener('window:scroll', [])
    // onWindowScroll() {
    //     const scrollY = window.scrollY || document.documentElement.scrollTop;

    //     // 스크롤 위치가 500px 이상으로 내려갔을 때 스크롤 버튼을 보여줌
    //     this.showScrollButton = scrollY >= 500;
    // }

    isSticky = false;
    currentSection = 1;
    scrollPosition = 0;
    isTest = false;
    isTest2 = false;

    @HostListener('window:scroll', ['$event'])
    onScroll(event: any) {
        const works1Element = document.querySelector('.works1');

        if (works1Element) {
            const works1Offset = works1Element.getBoundingClientRect().top;

            // Check if works1 is in the viewport
            this.isSticky = works1Offset <= 0;
            this.isTest = false;
            this.isTest2 = true;

            this.scrollPosition = window.scrollY;

            if (this.scrollPosition < 3200) {
                // 스크롤이 500px 이상 아래로 내려갔을 때 특정 동작을 실행합니다.
                this.currentSection = 1;
            } else if (this.scrollPosition >= 3200 && this.scrollPosition < 3700) {
                // 스크롤이 500px 이상 아래로 내려갔을 때 특정 동작을 실행합니다.
                this.currentSection = 2;
            } else if (this.scrollPosition >= 3700 && this.scrollPosition < 4200) {
                // 스크롤이 500px 이상 아래로 내려갔을 때 특정 동작을 실행합니다.
                this.currentSection = 3;
            } else if (this.scrollPosition >= 4200) {
                this.isSticky = false;
                this.isTest = true;
                this.isTest2 = false;
            }
        }
    }
}
