import { Component, HostListener, Renderer2, OnInit } from '@angular/core';
import AOS from 'aos'; //AOS - 1
import SwiperCore, { Autoplay, Pagination, Navigation, Mousewheel } from 'swiper';
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

    //이동
    scroll(element: HTMLElement): void {
        // window.scrollTo(element.yPosition);
        element.scrollIntoView({ behavior: 'smooth' });
    }

    // vertical Scroll 자연스럽게 변경
    // https://lpla.tistory.com/69
    onReachEnd(e) {
        // console.log(e[0].params.mousewheel);

        setTimeout(() => {
            console.log('reach End');
            e[0].params.mousewheel.releaseOnEdges = true;
            e[0].params.touchReleaseOnEdges = true; // touch는  check.
            // this.swiperVertical.swiperRef.params.mousewheel = {releaseOnEdges : true};
        }, 500);
    }

    onReachBeginning(e) {
        // console.log(e);
        setTimeout(() => {
            console.log('reach Beginning');
            e[0].params.mousewheel.releaseOnEdges = true;
            e[0].params.touchReleaseOnEdges = true;
            // this.swiperVertical.swiperRef.params.mousewheel = {releaseOnEdges : true};
        }, 500);
    }

    onSlideChangeVertical(e) {
        // console.log(e);
        console.log('vertical change');
        e[0].params.mousewheel.releaseOnEdges = false;
        e[0].params.touchReleaseOnEdges = false;
        // this.swiperVertical.swiperRef.params.mousewheel = {releaseOnEdges : false};
    }

    @HostListener('window:scroll', ['$event'])
    onScroll(event) {
        const nowScrollTop = window.scrollY || document.documentElement.scrollTop || 0;

        if (nowScrollTop > this.prevScrollTop) {
            this.isHeaderActive = true;
        } else {
            this.isHeaderActive = false;
        }

        this.showScrollButton = nowScrollTop >= 500;

        this.prevScrollTop = nowScrollTop;
    }
}
