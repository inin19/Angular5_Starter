import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClaimFrequencyComponent } from './claim-frequency.component';

describe('ClaimFrequencyComponent', () => {
  let component: ClaimFrequencyComponent;
  let fixture: ComponentFixture<ClaimFrequencyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClaimFrequencyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClaimFrequencyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
