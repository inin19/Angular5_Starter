import { Directive, HostListener, ElementRef, ViewContainerRef, Output, EventEmitter } from '@angular/core';


/**
* Allows the sidebar to be toggled via click.
*/
@Directive({
  selector: '[appSidebarToggler]'
})
export class SidebarToggleDirective {

  @Output() someEvent: EventEmitter<any> = new EventEmitter();

  constructor(private viewContainerRef: ViewContainerRef) { }

  @HostListener('click', ['$event'])
  toggleOpen($event: any) {
    $event.preventDefault();
    document.querySelector('body').classList.toggle('sidebar-hidden');

    this.someEvent.emit('I am Click!');

    console.log('appSidebarToggler');
    // console.log(this.viewContainerRef.injector);
    // console.log(this.viewContainerRef.parentInjector);
  }
}

@Directive({
  selector: '[appSidebarMinimizer]'
})
export class SidebarMinimizeDirective {
  constructor() { }

  @HostListener('click', ['$event'])
  toggleOpen($event: any) {
    $event.preventDefault();
    document.querySelector('body').classList.toggle('sidebar-minimized');
    console.log('appSidebarMinimizer');

  }
}

@Directive({
  selector: '[appBrandMinimizer]'
})
export class BrandMinimizeDirective {
  constructor() { }

  @HostListener('click', ['$event'])
  toggleOpen($event: any) {
    $event.preventDefault();
    document.querySelector('body').classList.toggle('brand-minimized');
    console.log('appBrandMinimizer');

  }
}

@Directive({
  selector: '[appMobileSidebarToggler]'
})
export class MobileSidebarToggleDirective {
  constructor() { }

  // Check if element has class
  private hasClass(target: any, elementClassName: string) {
    return new RegExp('(\\s|^)' + elementClassName + '(\\s|$)').test(target.className);
  }

  @HostListener('click', ['$event'])
  toggleOpen($event: any) {
    $event.preventDefault();
    document.querySelector('body').classList.toggle('sidebar-mobile-show');
    console.log('appMobileSidebarToggler');

  }
}

/**
* Allows the off-canvas sidebar to be closed via click.
*/
@Directive({
  selector: '[appSidebarClose]'
})
export class SidebarOffCanvasCloseDirective {
  constructor() { }

  // Check if element has class
  private hasClass(target: any, elementClassName: string) {
    return new RegExp('(\\s|^)' + elementClassName + '(\\s|$)').test(target.className);
  }

  // Toggle element class
  private toggleClass(elem: any, elementClassName: string) {
    let newClass = ' ' + elem.className.replace(/[\t\r\n]/g, ' ') + ' ';
    if (this.hasClass(elem, elementClassName)) {
      while (newClass.indexOf(' ' + elementClassName + ' ') >= 0) {
        newClass = newClass.replace(' ' + elementClassName + ' ', ' ');
      }
      elem.className = newClass.replace(/^\s+|\s+$/g, '');
    } else {
      elem.className += ' ' + elementClassName;
    }

    console.log('appSidebarClose');

  }

  @HostListener('click', ['$event'])
  toggleOpen($event: any) {
    $event.preventDefault();

    if (this.hasClass(document.querySelector('body'), 'sidebar-off-canvas')) {
      this.toggleClass(document.querySelector('body'), 'sidebar-opened');
    }

    console.log('appSidebarClose');

  }
}

export const SIDEBAR_TOGGLE_DIRECTIVES = [
  SidebarToggleDirective,
  SidebarMinimizeDirective,
  BrandMinimizeDirective,
  SidebarOffCanvasCloseDirective,
  MobileSidebarToggleDirective
];
