import { Pipe, PipeTransform } from '@angular/core';
import * as d3 from 'd3';


@Pipe({ name: 'PercentageFormatPipe' })
export class PercentageFormatPipe implements PipeTransform {
  transform(value: number): string {
    const formatFixedPercent = d3.format('.1%');
    return formatFixedPercent(value);
  }
}


@Pipe({ name: 'FixedNumberFormatPipe' })
export class FixedNumberFormatPipe implements PipeTransform {
  transform(value: number): string {
    const formatFixedPercent = d3.format('.1f');
    return formatFixedPercent(value);
  }
}

@Pipe({ name: 'BigNumberFormatPipe' })
export class BigNumberFormatPipe implements PipeTransform {
  transform(value: number, short: boolean): string {

    let format ;
    if (short === true) {
      format = d3.format('.2s');
    } else {
      format = d3.format(',.0f');

    }
    return format(value);
  }
}
