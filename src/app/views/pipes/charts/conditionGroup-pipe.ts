import { Pipe, PipeTransform } from '@angular/core';


@Pipe({ name: 'ConditionGroupPipe' })
export class ConditionGroupPipe implements PipeTransform {
  transform(value: string, countryCode: string): string {
    switch (countryCode) {
      case 'ISO2_GB':
        return ConditionGroupsGB.conditionTranslate[value];
      case 'ISO2_IT':
        return ConditionGroupsIT.conditionTranslate[value];
    }


  }
}


class ConditionGroupsGB {
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
    'TOTAL': 'Total'
  };
}


class ConditionGroupsIT {
  public static conditionTranslate = {
    'CONDITION_GROUPING_HOSPITALIZATION': 'Ricovero',
    'CONDITION_GROUPING_DAILY_HOSPITALIZATION': 'Ricovero Diaria',
    'CONDITION_GROUPING_SPEC/ACC_CHECK_UP': 'Spec /Acc Check up',
    'CONDITION_GROUPING_SPECIAL/ACCER': 'Special / Accer',
    'CONDITION_GROUPING_DENTAL': 'Dentarie',
    'CONDITION_GROUPING_LENSES': 'Lenti',
    'CONDITION_GROUPING_OTHER': 'Altro',
    'TOTAL': 'Total'
  };
}
