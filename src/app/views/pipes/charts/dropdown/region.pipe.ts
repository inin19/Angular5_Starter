import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'regionPipe'
})
export class RegionPipe implements PipeTransform {

  transform(value: string, countryCode: string): string {
    switch (countryCode) {
      case 'ISO2_GB':
        return  (RegionPipeGB.translate[value] === undefined ) ? value : RegionPipeGB.translate[value];
      case 'ISO2_IT':
        return  (RegionPipeIT.translate[value] === undefined ) ? value : RegionPipeIT.translate[value];
    }
  }
}


class RegionPipeGB {
  public static translate = {
    'REGION_WEST_MIDLANDS': 'West Midlands',
    'REGION_SOUTH_EAST': 'South East',
    'REGION_NORTHERN_IRELAND': 'Northern Ireland',
    'REGION_GREATER_LONDON': 'Greater London',
    'REGION_N/A': 'N/A',
    'REGION_CENTRAL_LONDON': 'Central London',
    'REGION_SOUTH_WEST': 'South West',
    'REGION_EAST_MIDLANDS': 'East Midlands',
    'REGION_SCOTLAND': 'Scotland',
    'REGION_NORTH_WEST': 'North West',
    'REGION_WALES': 'Wales',
    'REGION_NORTH_EAST': 'North East'
  };
}

class RegionPipeIT {
  public static translate = {
    'REGION_CENTER': 'Center',
    'REGION_FOREIGN': 'Foreign',
    'REGION_NORTH_EAST': 'North East',
    'REGION_NORTH_WEST': 'North West',
    'REGION_OTHER': 'Other',
    'REGION_SOUTH': 'South'
  };
}



