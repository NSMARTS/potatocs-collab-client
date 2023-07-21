import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IndexComponent } from './index.component';

@NgModule({
    // 사용하고 싶은 라이브러리를 사용하고 싶은 곳(컴포넌트)을 선언
    declarations: [IndexComponent],
    // 사용하고 싶은 라이브러리를 등록
    imports: [
      CommonModule, 
    ],
})
export class IndexModule {}
