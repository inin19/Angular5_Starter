import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'relationPipe'
})
export class RelationPipe implements PipeTransform {

  transform(value: string, countryCode: string): string {
    switch (countryCode) {
      case 'ISO2_GB':
        return (RelationPipeGB.translate[value] === undefined ) ? value : RelationPipeGB.translate[value];
      case 'ISO2_IT':
        return (RelationPipeIT.translate[value] === undefined ) ? value : RelationPipeGB.translate[value];

    }
  }
}


class RelationPipeGB {
  public static translate = {
    'RELATION_DEPENDENT': 'Dependent',
    'RELATION_EMPLOYEE': 'Employee',
    'RELATION_SPOUSE': 'Spouse'
  };
}

class RelationPipeIT {
  public static translate = {
    'RELATION_DEPENDENT': 'Dependent',
    'RELATION_OTHER': 'Other',
    'RELATION_SPOUSE': 'Spouse',
    'RELATION_EMPLOYEE': 'Employee'
  };
}



