import { Component, HostListener, AfterViewInit } from '@angular/core';

declare var Splitting: any;

@Component({
    selector: 'app-index',
    templateUrl: './index.component.html',
    styleUrls: ['./index.component.scss'],
})
export class IndexComponent implements AfterViewInit {
    isHeaderActive: boolean = false;
    prevScrollTop: number = 0;

    constructor() {
        const nowScrollTop = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0;
    }

    ngAfterViewInit(): void {
        const textToSplitElements = document.getElementsByClassName('textToSplit');
        Array.from(textToSplitElements).forEach(element => {
            // Splitting.js 초기화
            Splitting({ target: element });

            // HTMLElement로 타입 캐스팅
            const charElements = Array.from(element.children) as HTMLElement[];

            // 각 글자에 애니메이션 클래스 추가
            charElements.forEach((charElement, index) => {
                charElement.classList.add('char');
                charElement.style.animationDelay = index * 0.2 + 's'; // 0.2초 간격으로 애니메이션 지연
            });
        });
    }

    @HostListener('scroll', ['$event'])
    onScroll(event) {
        const nowScrollTop = event.target.scrollTop || event.target.scrollY || 0;

        if (nowScrollTop > this.prevScrollTop) {
            this.isHeaderActive = true;
        } else {
            this.isHeaderActive = false;
        }

        this.prevScrollTop = nowScrollTop;
    }
}
