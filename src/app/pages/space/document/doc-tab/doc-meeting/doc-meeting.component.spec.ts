import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocMeetingComponent } from './doc-meeting.component';

describe('DocMeetingComponent', () => {
  let component: DocMeetingComponent;
  let fixture: ComponentFixture<DocMeetingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocMeetingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocMeetingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
