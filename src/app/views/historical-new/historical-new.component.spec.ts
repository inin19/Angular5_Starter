import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoricalNewComponent } from './historical-new.component';

describe('HistoricalNewComponent', () => {
  let component: HistoricalNewComponent;
  let fixture: ComponentFixture<HistoricalNewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HistoricalNewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HistoricalNewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
