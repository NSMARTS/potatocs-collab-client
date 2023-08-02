import { Component, HostListener, Renderer2, OnInit, ElementRef, ViewChild } from '@angular/core';
import AOS from 'aos'; //AOS - 1
import SwiperCore, { Autoplay, Pagination, Navigation, Mousewheel } from 'swiper';
import { SwiperComponent } from 'swiper/angular';
SwiperCore.use([Autoplay, Pagination, Navigation, Mousewheel]);

@Component({
    selector: 'app-index',
    templateUrl: './index.component.html',
    styleUrls: ['./index.component.scss'],
})
export class IndexComponent implements OnInit {
    // header
    isHeaderActive: boolean = false;
    prevScrollTop: number = 0;

    // topbutton
    showScrollButton = false;

    // security
    isUlActive: boolean = false;
    prevScroll: number = 0;

    ngOnInit(): void {
        this.initAOS();
    }

    initAOS(): void {
        setTimeout(() => {
            AOS.init({
                duration: 600,
                once: false,

                // 사용자 정의 애니메이션을 위한 옵션 추가
                useClassNames: true,
                initClassName: 'aos-init',
                animatedClassName: 'aos-animate',
                customClassName: 'fade-in-custom', // 사용자 정의 애니메이션 클래스명
            });
        }, 400);
    }

    // 탑버튼
    scrollToTop(): void {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    }

    //시작하기 누르면 이동
    scroll(element: HTMLElement): void {
        // window.scrollTo(element.yPosition);
        element.scrollIntoView({ behavior: 'smooth' });
    }

    constructor(private renderer: Renderer2) {}

    onSlideChangeStartVertical(e) {
        console.log('START');
        e[0].params.touchReleaseOnEdges = e[0].params.mousewheel.releaseOnEdges = false;
    }
    onSlideChangeEndVertical(e) {
        console.log('END');
        e[0].params.touchReleaseOnEdges = e[0].params.mousewheel.releaseOnEdges =
            e[0].activeIndex === 0 || e[0].activeIndex === e[0].slides.length - 1;
    }

    @HostListener('window:scroll', ['$event'])
    onScroll(event: Event) {
        const nowScrollTop = window.scrollY || document.documentElement.scrollTop || 0;

        if (nowScrollTop > this.prevScrollTop) {
            this.isHeaderActive = true;
        } else {
            this.isHeaderActive = false;
        }

        this.showScrollButton = nowScrollTop >= 500;

        this.prevScrollTop = nowScrollTop;

        // background-color
        const attendance = document.querySelector('.attendance');
        const header = document.querySelector('header');
        const back = document.querySelector('.back');

        if (attendance) {
            const rect = attendance.getBoundingClientRect();
            const windowHeight = window.innerHeight || document.documentElement.clientHeight;
            const topVisible = rect.top >= 0 && rect.top <= windowHeight;
            const bottomVisible = rect.bottom >= 0 && rect.bottom <= windowHeight;

            if (topVisible || bottomVisible) {
                this.renderer.addClass(document.body, 'background-changed');
                this.renderer.addClass(header, 'background-changed');
            } else {
                this.renderer.removeClass(document.body, 'background-changed');
                this.renderer.removeClass(header, 'background-changed');
            }
        }

        if (back) {
            const rect = back.getBoundingClientRect();
            const windowHeight = window.innerHeight || document.documentElement.clientHeight;
            const topVisible = rect.top <= windowHeight;

            if (topVisible) {
                this.renderer.addClass(document.body, 'background-changed2');
                this.renderer.addClass(header, 'background-changed2');
            } else {
                this.renderer.removeClass(document.body, 'background-changed2');
                this.renderer.removeClass(header, 'background-changed2');
            }
        }

        this.checkVisibility();
    }

    @ViewChild('swiperVertical1', { static: false }) swiperVertical1?: SwiperComponent;
    @ViewChild('swiperVertical2', { static: false }) swiperVertical2?: SwiperComponent;
    @ViewChild('swiperVertical3', { static: false }) swiperVertical3?: SwiperComponent;
    @ViewChild('works1Mousewheel') works1Mousewheel: ElementRef;
    @ViewChild('works2Mousewheel') works2Mousewheel: ElementRef;
    @ViewChild('works3Mousewheel') works3Mousewheel: ElementRef;

    checkVisibility() {
        if (!this.works1Mousewheel) return;
        if (!this.works2Mousewheel) return;
        if (!this.works3Mousewheel) return;

        const element1 = this.works1Mousewheel.nativeElement;
        const rect1 = element1.getBoundingClientRect();

        const element2 = this.works2Mousewheel.nativeElement;
        const rect2 = element2.getBoundingClientRect();

        const element3 = this.works3Mousewheel.nativeElement;
        const rect3 = element3.getBoundingClientRect();

        const screenHeight = window.innerHeight;
        const visibilityThreshold = screenHeight * 1;

        if (rect1.top >= 0 && rect1.bottom <= visibilityThreshold) {
            // div가 화면에 100% 이상 보이는 경우에 대한 로직을 수행합니다.
            this.swiperVertical1.swiperRef.enable();
        } else if (rect2.top >= 0 && rect2.bottom <= visibilityThreshold) {
            this.swiperVertical2.swiperRef.enable();
        } else if (rect3.top >= 0 && rect3.bottom <= visibilityThreshold) {
            this.swiperVertical3.swiperRef.enable();
        } else {
            this.swiperVertical1.swiperRef.disable();
            this.swiperVertical2.swiperRef.disable();
            this.swiperVertical3.swiperRef.disable();
        }
    }
}
