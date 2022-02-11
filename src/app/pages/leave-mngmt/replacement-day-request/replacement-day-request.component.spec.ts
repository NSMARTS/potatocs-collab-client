import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReplacementDayRequestComponent } from './replacement-day-request.component';

describe('ReplacementDayRequestComponent', () => {
  let component: ReplacementDayRequestComponent;
  let fixture: ComponentFixture<ReplacementDayRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReplacementDayRequestComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReplacementDayRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
