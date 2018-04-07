import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DemographicChartComponent } from './demographic-chart.component';

describe('DemographicChartComponent', () => {
  let component: DemographicChartComponent;
  let fixture: ComponentFixture<DemographicChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DemographicChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DemographicChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
