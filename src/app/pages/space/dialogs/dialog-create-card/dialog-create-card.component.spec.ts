import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogCreateCardComponent } from './dialog-create-card.component';

describe('DialogCreateCardComponent', () => {
  let component: DialogCreateCardComponent;
  let fixture: ComponentFixture<DialogCreateCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogCreateCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogCreateCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
