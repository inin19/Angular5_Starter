import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TornadoChartComponent } from './tornado-chart.component';

describe('TornadoChartComponent', () => {
  let component: TornadoChartComponent;
  let fixture: ComponentFixture<TornadoChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TornadoChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TornadoChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
