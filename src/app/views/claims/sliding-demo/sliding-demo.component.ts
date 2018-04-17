import { ChangeDetectionStrategy, Component, OnInit, Input } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';

type PaneType = 'left' | 'right';

// type mytype = 'a' | 123 | 234;

@Component({
  selector: 'app-sliding-demo',
  templateUrl: './sliding-demo.component.html',
  styleUrls: ['./sliding-demo.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('slide', [
      state('left', style({ transform: 'translateX(0)' })),
      state('right', style({ transform: 'translateX(-50%)' })),
      transition('* => *', animate(300))
    ])
  ]
})
export class SlidingDemoComponent implements OnInit {

  @Input() activePane: PaneType = 'left';


  constructor() { }

  ngOnInit() {
    console.log(this.activePane);
  }

}
