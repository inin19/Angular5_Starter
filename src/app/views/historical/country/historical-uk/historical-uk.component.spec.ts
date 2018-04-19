import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoricalUkComponent } from './historical-uk.component';

describe('HistoricalUkComponent', () => {
  let component: HistoricalUkComponent;
  let fixture: ComponentFixture<HistoricalUkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HistoricalUkComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HistoricalUkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
