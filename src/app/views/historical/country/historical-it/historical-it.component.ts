import { Component, OnInit } from '@angular/core';
import { WaterfallData } from '../../../../model/d3chartData/waterfall-data.model';
import { DemographicService } from '../../../../services/demographic.service';
import { ClaimDataService } from '../../../../services/claims.service';
import { Selector } from '../../../../model/utils/selector.model';

@Component({
  selector: 'app-historical-it',
  templateUrl: './historical-it.component.html',
  styleUrls: ['./historical-it.component.scss']
})
export class HistoricalItComponent implements OnInit {

  private static conditionGroupTranslation = {
    'CONDITION_GROUPING_CIRCULATORY': 'Circulatory',
    'CONDITION_GROUPING_DIGESTIVE': 'Digestive',
    'CONDITION_GROUPING_INJURY_&_ACCIDENT': 'Injury & Accident',
    'CONDITION_GROUPING_MENTAL_DISORDERS': 'Mental Disorders',
    'CONDITION_GROUPING_MUSCULOSKELETAL': 'Musculoskeletal',
    'CONDITION_GROUPING_NEOPLASMS': 'Neoplasms',
    'CONDITION_GROUPING_PREGNANCY': 'Pregnancy',
    'CONDITION_GROUPING_RESPIRATORY': 'Respiratory',
    'CONDITION_GROUPING_SS_&_IDC': 'SS & IDC',
    'CONDITION_GROUPING_OTHER': 'Other'
  };

  private static conditionGroups = [
    'CONDITION_GROUPING_CIRCULATORY',
    'CONDITION_GROUPING_DIGESTIVE',
    'CONDITION_GROUPING_INJURY_&_ACCIDENT',
    'CONDITION_GROUPING_MENTAL_DISORDERS',
    'CONDITION_GROUPING_MUSCULOSKELETAL',
    'CONDITION_GROUPING_NEOPLASMS',
    'CONDITION_GROUPING_PREGNANCY',
    'CONDITION_GROUPING_RESPIRATORY',
    'CONDITION_GROUPING_SS_&_IDC',
    'CONDITION_GROUPING_OTHER'
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
    'ageGroup',
    'gender',
    'planClassKey',
    'relation'
  ];


  // country varication
  countryCode = 'ISO2_GB';
  ageGroup = ['0-18', '19-25', '26-35', '36-45', '46-55', '56-60', '61-65', '66-70', '71-75', '76+'];
  proposalID = '129';
  hasClaimData = true;

  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



  // -----------------------------SELECTORS----------------------
  selectors: Selector[];
  demographicSelectors: Selector[];
  claimsSelectors: Selector[];

  // -----------------------------HOLD JSON INPUT----------------------
  // demographic
  benchmarkDemographicData: any[];
  proposalDemographicData: any[];

  // claims
  proposalClaimData: any[];
  proposalMemberCount: any[];

  benchmarkClaimData: any[];
  benchmarkMemberCount: any[];


  // -----------------------------CROSSFILTER DATA----------------------
  // keep chart data between claim tabs
  benchmarkClaim: WaterfallData;


  constructor(private demographicService: DemographicService, private claimDataService: ClaimDataService) { }

  ngOnInit() {
    this.demographicSelectors = [];
    this.claimsSelectors = [];

    this.fetchBenchmarkClaimAndMemberCount();
  }

  createClaimData() {
    this.benchmarkClaim = new WaterfallData(
      this.benchmarkClaimData,
      this.benchmarkMemberCount,
      HistoricalItComponent.conditionGroups,
      HistoricalItComponent.claimDimensions,
      'percapita'
    );
  }


  createClaimsSelectors() {
    // this.claimsSelectors.push(new Selector(['1', '2', '3'], 'region'));
    // this.claimsSelectors.push(new Selector(['1', '2', '3'], 'relation'));
    // this.claimsSelectors.push(new Selector(['1', '2', '3'], 'plan'));

  }

  fetchBenchmarkClaimAndMemberCount(): void {
    this.claimDataService.getBenchmarkClaimsDataTotalMemberCount(this.countryCode, this.proposalID, this.ageGroup)
      .subscribe(
        data => {
          this.benchmarkClaimData = data[0];
          this.benchmarkMemberCount = data[1];
        },
        err => console.error(err),
        () => {

          this.createClaimData();
          // this.createClaimsSelectors();


          // this.benchmarkClaim.g

          this.benchmarkClaimData = null;
          this.benchmarkMemberCount = null;
          // enable claims tabs
          // this.staticTabs.tabs[1].disabled = false;
          // this.staticTabs.tabs[2].disabled = false;

          console.log('done loading claims data for benchmark only');
        }
      );
  }

}
