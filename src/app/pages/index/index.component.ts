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

    // back
    isBackActive: boolean = false;

    // swiper releaseOnEdges
    isReleaseOnEdges: boolean = true;

    showDiv = false;

    @ViewChild('swiperVertical', { static: false }) swiperVertical?: SwiperComponent;

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

    constructor(private renderer: Renderer2, private elementRef: ElementRef) {}

    // vertical Scroll 자연스럽게 변경
    // https://lpla.tistory.com/69
    // onReachEnd(e) {
    //     // console.log(e[0].params.mousewheel);

    //     setTimeout(() => {
    //         console.log('reach End');
    //         e[0].params.mousewheel.releaseOnEdges = true;
    //         e[0].params.touchReleaseOnEdges = true; // touch는  check.
    //         // this.swiperVertical.swiperRef.params.mousewheel = {releaseOnEdges : true};
    //     }, 500);
    // }

    // onReachBeginning(e) {
    //     // console.log(e);
    //     setTimeout(() => {
    //         console.log('reach Beginning');
    //         e[0].params.mousewheel.releaseOnEdges = true;
    //         e[0].params.touchReleaseOnEdges = true;
    //         // this.swiperVertical.swiperRef.params.mousewheel = {releaseOnEdges : true};
    //     }, 500);
    // }

    // onSlideChangeVertical(e) {
    //     // console.log(e);
    //     console.log('vertical change');
    //     e[0].params.mousewheel.releaseOnEdges = false;
    //     e[0].params.touchReleaseOnEdges = false;
    //     // this.swiperVertical.swiperRef.params.mousewheel = {releaseOnEdges : false};
    // }

    onSlideChangeStartVertical(e) {
        console.log('START');
        e[0].params.touchReleaseOnEdges = e[0].params.mousewheel.releaseOnEdges = false;
    }
    onSlideChangeEndVertical(e) {
        console.log('END');
        e[0].params.touchReleaseOnEdges = e[0].params.mousewheel.releaseOnEdges =
            e[0].activeIndex === 0 || e[0].activeIndex === e[0].slides.length - 1;
    }

    @HostListener('window:scroll', [])
    onScroll() {
        const nowScrollTop = window.scrollY || document.documentElement.scrollTop || 0;

        if (nowScrollTop > this.prevScrollTop) {
            this.isHeaderActive = true;
        } else {
            this.isHeaderActive = false;
        }

        this.showScrollButton = nowScrollTop >= 500;

        this.prevScrollTop = nowScrollTop;

        const attendance = document.querySelector('.attendance');

        if (attendance) {
            const rect = attendance.getBoundingClientRect();
            const windowHeight = window.innerHeight || document.documentElement.clientHeight;
            const topVisible = rect.top >= 0 && rect.top <= windowHeight;
            const bottomVisible = rect.bottom >= 0 && rect.bottom <= windowHeight;

            if (topVisible || bottomVisible) {
                this.renderer.addClass(document.body, 'background-changed');
            } else {
                this.renderer.removeClass(document.body, 'background-changed');
            }
        }

        this.checkVisibility();
    }

    @ViewChild('yourDivElement') yourDivElement: ElementRef;

    checkVisibility() {
        if (!this.yourDivElement) return;

        const element = this.yourDivElement.nativeElement;
        const rect = element.getBoundingClientRect();
        const screenHeight = window.innerHeight;
        const visibilityThreshold = screenHeight * 1;

        console.log('visibilityThreshold: ' + visibilityThreshold);
        console.log('rect.top: ' + rect.top);
        console.log('rect.bottom: ' + rect.bottom);

        if (rect.top >= 0 && rect.bottom <= visibilityThreshold + 102) {
            // div가 화면에 100% 이상 보이는 경우에 대한 로직을 수행합니다.
            this.swiperVertical.swiperRef.enable();
            console.log('10000000000');
        } else {
            this.swiperVertical.swiperRef.disable();
        }
    }
}
