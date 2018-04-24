import { TornadoData } from '../../../../model/D3chartData/tornado-data.model';
import { WaterfallData } from './../../../../model/D3chartData/waterfall-data.model';
import { Component, Input, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { Selector } from '../../../../model/utils/selector.model';
import { DemographicComponent } from '../../demographic/demographic.component';
import { ClaimsPerCapitaComponent } from '../../claims-percapita/claims-percapita.component';
import { DemographicService } from '../../../../providers/charts/demographic.service';
import { ClaimsService } from '../../../../providers/charts/claims.service';
import { TabDirective } from 'ngx-bootstrap/tabs';
import { TabsetComponent } from 'ngx-bootstrap';

@Component({
  selector: 'app-historical-it',
  templateUrl: './historical-it.component.html',
  styleUrls: ['./historical-it.component.scss']
})
export class HistoricalItComponent implements OnInit {

  private static conditionGroups = [
    // 'CONDITION_GROUPING_CIRCULATORY',
    // 'CONDITION_GROUPING_DIGESTIVE',
    // 'CONDITION_GROUPING_INJURY_&_ACCIDENT',
    // 'CONDITION_GROUPING_MENTAL_DISORDERS',
    // 'CONDITION_GROUPING_MUSCULOSKELETAL',
    // 'CONDITION_GROUPING_NEOPLASMS',
    // 'CONDITION_GROUPING_PREGNANCY',
    // 'CONDITION_GROUPING_RESPIRATORY',
    // 'CONDITION_GROUPING_SS_&_IDC',
    // 'CONDITION_GROUPING_OTHER'
  ];


  private static claimDimensions = [
    'region',
    'planClassKey',
    'relation',
    'claimType',
    'ageGroup',
    'gender'
  ];

  private static demographicDimensions = [
    'region',
    'planClassKey',
    'relation'
  ];


  // country varication
  countryCode = 'ISO2_IT';
  ageGroup = ['0-18', '19-23', '24-28', '29-33', '34-38', '39-43', '44-48', '49-53', '54-58', '59-63', '64+'];
  proposalID = '129';
  hasClaimData = true;

  // 0-18
  // 19-23
  // 24-28
  // 29-33
  // 34-38
  // 39-43
  // 44-48
  // 49-53
  // 54-58
  // 59-63
  // 64+


  // Ricovero
  // Ricovero Diaria
  // Spec /Acc Check up
  // Special / Accer
  // Dentarie
  // Lenti
  // Altro


  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////





  constructor(private demographicService: DemographicService, private claimDataService: ClaimsService) { }

  ngOnInit() {

  }



}
