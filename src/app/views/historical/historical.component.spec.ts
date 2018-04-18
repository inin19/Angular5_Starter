import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoricalComponent } from './historical.component';

describe('HistoricalNewComponent', () => {
  let component: HistoricalComponent;
  let fixture: ComponentFixture<HistoricalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HistoricalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HistoricalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
