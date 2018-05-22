import { transition, trigger, state, style, animate } from '@angular/animations';

export const showHideTrigger = trigger('showHide', [

  transition(':enter', [
    style({
      opacity: 0
    }),
    animate(1000)
  ]),
  transition(':leave', animate(1000, style({
    opacity: 0
  })))
]);
