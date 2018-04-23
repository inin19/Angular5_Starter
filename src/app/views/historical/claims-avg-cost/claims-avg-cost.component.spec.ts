import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClaimsAvgCostComponent } from './claims-avg-cost.component';

describe('ClaimsAvgCostComponent', () => {
  let component: ClaimsAvgCostComponent;
  let fixture: ComponentFixture<ClaimsAvgCostComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClaimsAvgCostComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClaimsAvgCostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
