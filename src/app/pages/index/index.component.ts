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

    @HostListener('window:scroll', ['$event'])
    onScroll(event: any) {
        const works1Element = document.querySelector('.works1');
        const not1Element = document.querySelector('.not1');
        const not2Element = document.querySelector('.not2');
        const not3Element = document.querySelector('.not3');

        if (works1Element) {
            const works1Offset = works1Element.getBoundingClientRect().top;

            // Check if works1 is in the viewport
            this.isSticky = works1Offset <= 0;

            if (not1Element) {
                this.currentSection = 1;
            } else if (not2Element) {
                this.currentSection = 2;
            } else {
                this.currentSection = 3;
            }
            // // Determine which section is in view
            // const windowHeight = window.innerHeight;
            // const not1Offset = not1Element?.getBoundingClientRect().top || 0;
            // const not2Offset = not2Element?.getBoundingClientRect().top || 0;
            // const not3Offset = not3Element?.getBoundingClientRect().top || 0;

            // if (not1Offset >= 0 && not1Offset < windowHeight) {
            //     this.currentSection = 1;
            // } else if (not2Offset >= 0 && not2Offset < windowHeight) {
            //     this.currentSection = 2;
            // } else if (not3Offset >= 0 && not3Offset < windowHeight) {
            //     this.currentSection = 3;
            // }
        }
    }
}
