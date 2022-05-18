import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractResponseComponent } from './contract-response.component';

describe('ContractResponseComponent', () => {
  let component: ContractResponseComponent;
  let fixture: ComponentFixture<ContractResponseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContractResponseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContractResponseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
