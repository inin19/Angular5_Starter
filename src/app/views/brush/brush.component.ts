import { Component, OnInit } from '@angular/core';
import { TimeSeriesService } from './../../providers/test/time-series.service';

@Component({
  selector: 'app-brush',
  templateUrl: './brush.component.html',
  styleUrls: ['./brush.component.scss']
})
export class BrushComponent implements OnInit {

  data: any[];

  constructor(private timeSeriesService: TimeSeriesService) { }

  ngOnInit() {
    this.fetchData();
  }



  fetchData(): void {
    this.timeSeriesService.getTimeSeriesData()
      .subscribe(
        data => { this.data = data; }
      );
  }

}
