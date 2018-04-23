import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClaimsFrequencyComponent } from './claims-frequency.component';

describe('ClaimFrequencyComponent', () => {
  let component: ClaimsFrequencyComponent;
  let fixture: ComponentFixture<ClaimsFrequencyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClaimsFrequencyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClaimsFrequencyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
