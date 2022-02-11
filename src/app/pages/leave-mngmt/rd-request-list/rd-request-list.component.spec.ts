import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RdRequestListComponent } from './rd-request-list.component';

describe('RdRequestListComponent', () => {
  let component: RdRequestListComponent;
  let fixture: ComponentFixture<RdRequestListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RdRequestListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RdRequestListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
