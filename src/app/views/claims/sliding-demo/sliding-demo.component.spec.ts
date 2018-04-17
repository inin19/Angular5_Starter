import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SlidingDemoComponent } from './sliding-demo.component';

describe('SlidingDemoComponent', () => {
  let component: SlidingDemoComponent;
  let fixture: ComponentFixture<SlidingDemoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SlidingDemoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SlidingDemoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
