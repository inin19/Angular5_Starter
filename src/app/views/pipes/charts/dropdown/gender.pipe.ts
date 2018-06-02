import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'genderPipe'
})
export class GenderPipe implements PipeTransform {

  transform(value: string, countryCode: string): string {
    switch (countryCode) {
      case 'ISO2_GB':
        return (GenderPipeGB.translate[value] === undefined) ? value : GenderPipeGB.translate[value];
      case 'ISO2_IT':
        return (GenderPipeIT.translate[value] === undefined) ? value : GenderPipeIT.translate[value];
    }
  }
}


class GenderPipeGB {
  public static translate = {
    'F': 'Female',
    'M': 'Male',
  };
}

class GenderPipeIT {
  public static translate = {
    'F': 'Female',
    'M': 'Male'
  };
}



