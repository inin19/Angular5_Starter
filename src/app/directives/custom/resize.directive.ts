import { Directive, ElementRef, OnInit, Input, HostListener, Output, EventEmitter, OnDestroy } from '@angular/core';
import { ResizeSensor } from 'css-element-queries';
import { ResizedEvent } from './resized-event';

@Directive({
  selector: '[appResize]'
})
export class ResizeDirective implements OnInit, OnDestroy {

  // tslint:disable-next-line:no-output-rename
  @Output('appResize') readonly resized = new EventEmitter<ResizedEvent>();

  private oldWidth: number;
  private oldHeight: number;


  private width: number;
  private height: number;

  private sensor: ResizeSensor;

  constructor(private element: ElementRef) { }

  ngOnInit() {
    this.sensor = new ResizeSensor(this.element.nativeElement, x => this.onResized());
  }


  ngOnDestroy() {
    this.sensor.detach();
  }

  private onResized() {
    const newWidth = this.element.nativeElement.clientWidth;
    const newHeight = this.element.nativeElement.clientHeight;

    if (newWidth === this.oldWidth && newHeight === this.oldHeight) {
      return;
    }

    const event = new ResizedEvent(this.element, newWidth, newHeight, this.oldWidth, this.oldHeight);
    this.oldWidth = this.element.nativeElement.clientWidth;
    this.oldHeight = this.element.nativeElement.clientHeight;
    this.resized.next(event);

  }


}
