import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IndexComponent } from './index.component';
import { AosComponent } from 'aos'; // AosComponent를 불러옵니다.

@NgModule({
    // 사용하고 싶은 라이브러리를 사용하고 싶은 곳(컴포넌트)을 선언
    declarations: [IndexComponent, AosComponent],
    // 사용하고 싶은 라이브러리를 등록
    imports: [CommonModule],
    bootstrap: [IndexComponent],
})
export class IndexModule {}
