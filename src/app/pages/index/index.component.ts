import { Component, HostListener, OnInit} from '@angular/core';
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

    ngOnInit() {
        AOS.init();
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
