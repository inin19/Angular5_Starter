import { Component } from '@angular/core';
import { MinimizeService } from '../../services/minimize.service';

@Component({
  selector: 'app-header',
  templateUrl: './app-header.component.html'
})
export class AppHeaderComponent {

  constructor(private minimizeService: MinimizeService) { }

  scratch() {
    console.log('AppHeaderComponent: scrach');
    this.minimizeService.newEvent('clicked!');

  }

}
