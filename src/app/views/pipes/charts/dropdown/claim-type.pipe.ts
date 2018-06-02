import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'claimTypePipe'
})
export class ClaimTypePipe implements PipeTransform {

  transform(value: string, countryCode: string): string {
    switch (countryCode) {
      case 'ISO2_GB':
        return (ClaimTypePipeGB.translate[value] === undefined) ? value : ClaimTypePipeGB.translate[value];
      case 'ISO2_IT':
        return (ClaimTypePipeIT.translate[value] === undefined) ? value : ClaimTypePipeIT.translate[value];
    }
  }
}


class ClaimTypePipeGB {
  public static translate = {
    'CLAIM_TYPE_IN_PATIENT': 'In Patient',
    'CLAIM_TYPE_OUT_PATIENT': 'Out Patient',
    'CLAIM_TYPE_DAYCARE': 'Daycare'
  };
}

class ClaimTypePipeIT {
  public static translate = {
    'CLAIM_TYPE_INDIRECT': 'Indirect',
    'CLAIM_TYPE_DIRECT': 'Direct',
    'CLAIM_TYPE_INDIRECT_TICKET' : 'Indirect Ticket'
  };
}



