import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WaterfallChartComponent } from './waterfall-chart.component';

describe('WaterfallChartComponent', () => {
  let component: WaterfallChartComponent;
  let fixture: ComponentFixture<WaterfallChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WaterfallChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WaterfallChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
