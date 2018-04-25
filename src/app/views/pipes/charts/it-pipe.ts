import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'ITProjectionCategory' })
export class ITPrjectionPipes implements PipeTransform {
  transform(value: string): string {
    return Translations.categoryTranslate[value];
  }
}



class Translations {
  public static categoryTranslate = {
    TOTAL_LIVES: 'Enrollment',
    TOTAL_COST: 'Total Cost',
    MEMBER_PREMIUM: 'Member Premium Co-Share',
    EMPLOYER_PREMIUM: 'Employer Premium',
    FUNDING_GAP: 'Funding Gap',
    ESTIMATED_MEMBER_OOP_COST: 'Estimated Member Out-of-pocket Cost %',
  };
}
