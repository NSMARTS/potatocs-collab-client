import { Component, HostListener, Renderer2, OnInit } from '@angular/core';
import AOS from 'aos'; //AOS - 1

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

    constructor(private renderer: Renderer2) {}

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

    // // slick
    // items = [
    //     {
    //         title: '출결 상태 실시간 파악',
    //         description: '팀원들의 휴가 상태와 근무 일정을 실시간으로 파악하고 효율적으로 조율할 수 있습니다.',
    //         imageSrc: 'assets/image/realTime.png',
    //     },
    //     {
    //         title: '휴가 신청 및 승인 과정 간소화',
    //         description:
    //             '휴가 종류와 기간을 선택하여 휴가를 등록할 수 있습니다. 관리자에게 알림이 전송되고 승인 또는 거절됩니다.',
    //         imageSrc: 'assets/image/simple.png',
    //     },
    //     {
    //         title: '휴가 설정',
    //         description: '국가별 공휴일, 회사 기념일, 개인별로 설정된 연차나 이월, 휴가 일정을 지정할 수 있습니다.',
    //         imageSrc: 'assets/image/vacation.png',
    //     },
    //     // Add more items as needed
    // ];

    // slideConfig = {
    //     slidesToShow: 1,
    //     slidesToScroll: 1,
    //     dots: true,
    //     infinite: true,
    //     autoplay: true,
    //     autoplaySpeed: 2000,
    //     // Add more configuration options as needed
    // };

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
