import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectionChartItComponent } from './projection-chart-it.component';

describe('ProjectionChartItComponent', () => {
  let component: ProjectionChartItComponent;
  let fixture: ComponentFixture<ProjectionChartItComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectionChartItComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectionChartItComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
