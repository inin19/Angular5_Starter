import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoricalItComponent } from './historical-it.component';

describe('HistoricalItComponent', () => {
  let component: HistoricalItComponent;
  let fixture: ComponentFixture<HistoricalItComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HistoricalItComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HistoricalItComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
