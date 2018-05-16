import { Pipe, PipeTransform } from '@angular/core';


@Pipe({ name: 'ProjectionCategory' })
export class ProjectionCategoryPipes implements PipeTransform {
  transform(value: string, countryCode: string): string {
    switch (countryCode) {
      case 'ISO2_GB':
        return ProjectionCategoryGB.categoryTranslate[value];
      case 'ISO2_IT':
        return ProjectionCategoryIT.categoryTranslate[value];
    }
  }
}


class ProjectionCategoryGB {
  public static categoryTranslate = {
    TOTAL_LIVES: 'Enrollment',
    TOTAL_COST: 'Total Cost',
    MEMBER_PREMIUM: 'Member Premium Co-Share',
    EMPLOYER_PREMIUM: 'Employer Premium',
    FUNDING_GAP: 'Funding Gap',
    ESTIMATED_MEMBER_OOP_COST: 'Estimated Member Out-of-pocket Cost %',
    TAX: 'Tax',
    FEES: 'Fees'
  };
}

class ProjectionCategoryIT {
  public static categoryTranslate = {
    TOTAL_LIVES: 'Enrollment',
    TOTAL_COST: 'Total Cost',
    MEMBER_PREMIUM: 'Member Premium Co-Share',
    EMPLOYER_PREMIUM: 'Employer Premium',
    FUNDING_GAP: 'Funding Gap',
    ESTIMATED_MEMBER_OOP_COST: 'Estimated Member Out-of-pocket Cost %',
    TAX: 'Tax',
    FEES: 'Fees'
  };
}
