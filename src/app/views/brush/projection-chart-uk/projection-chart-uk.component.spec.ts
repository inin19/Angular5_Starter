import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectionChartUkComponent } from './projection-chart-uk.component';

describe('ProjectionChartUkComponent', () => {
  let component: ProjectionChartUkComponent;
  let fixture: ComponentFixture<ProjectionChartUkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectionChartUkComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectionChartUkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
