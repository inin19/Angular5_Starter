import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'UKProjectionCategory' })
export class UKPrjectionPipes implements PipeTransform {
  transform(value: string): string {
    return Categories.categoryTranslate[value];
  }
}

@Pipe({ name: 'UKConditionGroups' })
export class UKConditionGroupsPipes implements PipeTransform {
  transform(value: string): string {
    return ConditionGroups.conditionTranslate[value];
  }
}


class Categories {
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


class ConditionGroups {
  public static conditionTranslate = {
    'CONDITION_GROUPING_CIRCULATORY': 'Circulatory',
    'CONDITION_GROUPING_DIGESTIVE': 'Digestive',
    'CONDITION_GROUPING_INJURY_&_ACCIDENT': 'Injury & Accident',
    'CONDITION_GROUPING_MENTAL_DISORDERS': 'Mental Disorders',
    'CONDITION_GROUPING_MUSCULOSKELETAL': 'Musculoskeletal',
    'CONDITION_GROUPING_NEOPLASMS': 'Neoplasms',
    'CONDITION_GROUPING_PREGNANCY': 'Pregnancy',
    'CONDITION_GROUPING_RESPIRATORY': 'Respiratory',
    'CONDITION_GROUPING_SS_&_IDC': 'SS & IDC',
    'CONDITION_GROUPING_OTHER': 'Other',
    'TOTAL': 'total'
  };
}
