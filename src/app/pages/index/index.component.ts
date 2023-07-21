import { AfterViewInit, Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import Splitting from 'splitting';
declare var Splitting: any;

@Component({
    selector: 'app-index',
    templateUrl: './index.component.html',
    styleUrls: ['./index.component.scss'],
})
export class IndexComponent implements OnInit, AfterViewInit {
    // header
    isHeaderActive: boolean = false;
    prevScrollTop: number = 0;

    // scrolla event
    isVisualActive: boolean = true;
    isContentsActive: boolean = true;
    isworksCardsActive: boolean = false;

    // @ViewChild 데코레이터를 사용하여 변수에 ElementRef를 할당
    @ViewChild('wrapRef', { static: true }) wrapRef: ElementRef;
    @ViewChild('visualRef', { static: true }) visualRef: ElementRef;
    @ViewChild('contentsRef', { static: true }) contentsRef: ElementRef;
    @ViewChild('worksCardRef', { static: true }) worksCardRef: ElementRef;
    @ViewChild('attendanceRef', { static: true }) attendanceRef: ElementRef;
    @ViewChild('securityRef', { static: true }) securityRef: ElementRef;
    @ViewChild('serviceRef', { static: true }) serviceRef: ElementRef;
    @ViewChild('freeCardRef', { static: true }) freeCardRef: ElementRef;
    @ViewChild('descRef', { static: true }) descRef: ElementRef;

    visualTop;
    contentsTop;
    worksCardTop;
    constructor() {}

    ngOnInit() {
        // 섹션별 클래스 추가와 제거
        // nativeElement.getBoundingClientRect() 요소의 좌표값을 찾아줌.
        this.visualTop = this.wrapRef.nativeElement.getBoundingClientRect().top;
        this.contentsTop = this.contentsRef.nativeElement.getBoundingClientRect().top;
        this.worksCardTop = this.worksCardRef.nativeElement.getBoundingClientRect().top;
    }

    ngAfterViewInit(): void {
        const textToSplit = document.getElementsByClassName('textToSplit');
        Splitting({ target: textToSplit });
    }

    @HostListener('scroll', ['$event'])
    onScroll(event) {
        const nowScrollTop = event.target.scrollTop || event.target.scrollY || 0;
        if (nowScrollTop > this.prevScrollTop) {
            this.isHeaderActive = true;
        } else {
            this.isHeaderActive = false;
        }

        this.isVisualActive = nowScrollTop === this.visualTop;
        console.log('this.isVisualActive 클래스 네임 변경', this.isVisualActive);
        console.log('visualTop:', this.visualTop);

        this.isContentsActive = nowScrollTop === this.contentsTop;
        console.log('this.isContentsActive 클래스 네임 변경', this.isContentsActive);
        console.log('contentsTop:', this.contentsTop);

        this.isworksCardsActive = nowScrollTop === this.worksCardTop;
        console.log('this.isworksCardsActive 클래스 네임 변경', this.isworksCardsActive);
        console.log('worksCardTop:', this.worksCardTop);

        console.log('nowScrollTop', nowScrollTop);

        this.prevScrollTop = nowScrollTop;
    }
}
