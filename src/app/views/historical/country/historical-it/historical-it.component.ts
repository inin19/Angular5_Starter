import { ClaimsFrequencyComponent } from './../../claims-frequency/claims-frequency.component';
import { ToastrService } from 'ngx-toastr';
import { ClaimsAvgCostComponent } from './../../claims-avg-cost/claims-avg-cost.component';
import { TornadoData } from '../../../../model/D3chartData/tornado-data.model';
import { WaterfallData } from './../../../../model/D3chartData/waterfall-data.model';
import { Component, Input, OnInit, OnDestroy, ViewChild, ElementRef, OnChanges } from '@angular/core';
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
export class HistoricalItComponent implements OnInit, OnDestroy {

  private static conditionGroups = [
    'CONDITION_GROUPING_HOSPITALIZATION',
    'CONDITION_GROUPING_DAILY_HOSPITALIZATION',
    'CONDITION_GROUPING_SPEC/ACC_CHECK_UP',
    'CONDITION_GROUPING_SPECIAL/ACCER',
    'CONDITION_GROUPING_DENTAL',
    'CONDITION_GROUPING_LENSES',
    'CONDITION_GROUPING_OTHER'
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



  private static claimMargin: any = { top: 60, right: 20, bottom: 100, left: 50 };

  private static demographicMargin: any = { top: 50, right: 20, bottom: 30, left: 50 };


  private conditionGroupTranslation = {
    'PREVYEAR': '',
    'CONDITION_GROUPING_HOSPITALIZATION': 'Ricovero',
    'CONDITION_GROUPING_DAILY_HOSPITALIZATION': 'Ricovero Diaria',
    'CONDITION_GROUPING_SPEC/ACC_CHECK_UP': 'Spec /Acc Check up',
    'CONDITION_GROUPING_SPECIAL/ACCER': 'Special / Accer',
    'CONDITION_GROUPING_DENTAL': 'Dentarie',
    'CONDITION_GROUPING_LENSES': 'Lenti',
    'CONDITION_GROUPING_OTHER': 'Altro',
    // 'CONDITION_GROUPING_CIRCULATORY': 'Circulatory',
    // 'CONDITION_GROUPING_DIGESTIVE': 'Digestive',
    // 'CONDITION_GROUPING_INJURY_&_ACCIDENT': 'Injury & Accident',
    // 'CONDITION_GROUPING_MENTAL_DISORDERS': 'Mental Disorders',
    // 'CONDITION_GROUPING_MUSCULOSKELETAL': 'Musculoskeletal',
    // 'CONDITION_GROUPING_NEOPLASMS': 'Neoplasms',
    // 'CONDITION_GROUPING_PREGNANCY': 'Pregnancy',
    // 'CONDITION_GROUPING_RESPIRATORY': 'Respiratory',
    // 'CONDITION_GROUPING_SS_&_IDC': 'SS & IDC',
    // 'CONDITION_GROUPING_OTHER': 'Other',
    'CURRYEAR': ''
  };



  // dropdowns
  dropdownStatus = {
    regionDropdown: false,
    relationDropdown: false,
    planClassKeyDropdown: false,
    claimTypeDropdown: false,
    genderDropdown: false,
    ageGroupDropdown: false
  };

  selectorDisplay = {
    region: true,
    relation: true,
    planClassKey: true,
    claimType: false,
    gender: false,
    ageGroup: false
  };





  // country varication
  countryCode = 'ISO2_IT';
  ageGroup = ['0-18', '19-23', '24-28', '29-33', '34-38', '39-43', '44-48', '49-53', '54-58', '59-63', '64+'];
  proposalID = '3';
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
  // -----------------------------HOLD JSON INPUT----------------------


  // -----------------------------CROSSFILTER DATA----------------------
  // keep chart data between claim tabs
  proposalClaimPerCapita: WaterfallData;
  benchmarkClaimPerCapita: WaterfallData;

  proposalClaimFrequency: WaterfallData;
  benchmarkClaimFrequency: WaterfallData;


  proposalClaimAvgCost: WaterfallData;
  benchmarkClaimAvgCost: WaterfallData;



  proposalDemographic: TornadoData;
  benchmarkDemographic: TornadoData;
  // -----------------------------CROSSFILTER DATA----------------------



  // current tab id
  currentTab: string;
  resetDisabled: boolean;

  @ViewChild('demographic') demographicComponent: DemographicComponent;
  @ViewChild('claimsPerCapita') claimPerCapitaComponent: ClaimsPerCapitaComponent;
  @ViewChild('claimsFrequency') claimFrequencyComponent: ClaimsFrequencyComponent;
  @ViewChild('claimsAvgCost') claimAvgCostComponent: ClaimsAvgCostComponent;


  // claimsAvgCost


  @ViewChild('staticTabs') staticTabs: TabsetComponent;


  showSuccess() {
    this.toastr.success('Claims Data loaded!');
  }


  // getConditionGroups()
  private getConditionGroups(): string[] {
    return HistoricalItComponent.conditionGroups;
  }


  private getClaimDimensions(): string[] {
    return HistoricalItComponent.claimDimensions;
  }

  private getDemographicDimensions(): string[] {
    return HistoricalItComponent.demographicDimensions;
  }


  private getClaimMargin() {
    return HistoricalItComponent.claimMargin;
  }

  private getDemographicMargin() {
    return HistoricalItComponent.demographicMargin;
  }


  constructor(private demographicService: DemographicService, private claimDataService: ClaimsService, private toastr: ToastrService) {

  }






  ngOnInit() {

    console.log('in historical IT');

    this.conditionGroupTranslation.PREVYEAR = '2015';
    this.conditionGroupTranslation.CURRYEAR = '2016';


    this.demographicSelectors = new Array<Selector>();
    this.claimsSelectors = new Array<Selector>();

    this.staticTabs.tabs[1].disabled = true;
    this.staticTabs.tabs[2].disabled = true;
    this.staticTabs.tabs[3].disabled = true;


    this.resetDisabled = true;
    this.currentTab = 'historicalDemographic';

    if (this.hasClaimData === true) {
      this.fetchBenchmarkProposalDemograpic();
      this.fetchBenchmarkProposalClaimAndMemberCount();
    } else {
      this.fetchBenchmarkDemograpic();
      this.fetchBenchmarkClaimAndMemberCount();
    }

  }

  ngOnDestroy() {
    console.log('historical destroyed');
  }





  createDemographicSelectors() {
    for (const item of this.getDemographicDimensions()) {
      if (this.hasClaimData === true) {
        const commonElements = new Set([...this.proposalDemographic.getSelectorValuesByName(item).sort(), ...this.benchmarkDemographic.getSelectorValuesByName(item).sort()]);
        this.demographicSelectors.push(new Selector(Array.from(commonElements).sort(), item));
      } else {
        this.demographicSelectors.push(new Selector(this.benchmarkDemographic.getSelectorValuesByName(item).sort(), item));
      }
    }
  }

  createClaimsSelectors() {
    for (const item of this.getClaimDimensions()) {
      if (this.hasClaimData === true) {
        const commonElements = new Set([...this.proposalClaimPerCapita.getSelectorValuesByName(item).sort(), ...this.benchmarkClaimPerCapita.getSelectorValuesByName(item).sort()]);
        this.claimsSelectors.push(new Selector(Array.from(commonElements).sort(), item));
      } else {
        this.claimsSelectors.push(new Selector(this.benchmarkClaimPerCapita.getSelectorValuesByName(item).sort(), item));
      }
    }
  }

  getSelector(selectorName: string): Selector {
    for (const item of this.selectors) {
      if (item.getSelectorName() === selectorName) {
        return item;
      }
    }
    return null;
  }

  getDemographicSelector(selectorName: string): Selector {
    return this.demographicSelectors.find(item => item.getSelectorName() === selectorName);
  }

  getClaimsSelector(seletorName: string): Selector {
    return this.claimsSelectors.find(item => item.getSelectorName() === seletorName);
  }




  // create data instance
  createClaimData() {

    this.benchmarkClaimPerCapita = new WaterfallData(
      this.benchmarkClaimData,
      this.benchmarkMemberCount,
      this.getConditionGroups(),
      this.getClaimDimensions(),
      WaterfallData.type.PERCAPITA
    );


    this.benchmarkClaimFrequency = new WaterfallData(
      this.benchmarkClaimData,
      this.benchmarkMemberCount,
      this.getConditionGroups(),
      this.getClaimDimensions(),
      WaterfallData.type.FREQUENCY
    );



    this.benchmarkClaimAvgCost = new WaterfallData(
      this.benchmarkClaimData,
      this.benchmarkMemberCount,
      this.getConditionGroups(),
      this.getClaimDimensions(),
      WaterfallData.type.AVGCOST
    );

    if (this.hasClaimData === true) {
      this.proposalClaimPerCapita = new WaterfallData(
        this.proposalClaimData,
        this.proposalMemberCount,
        this.getConditionGroups(),
        this.getClaimDimensions(),
        WaterfallData.type.PERCAPITA
      );


      this.proposalClaimFrequency = new WaterfallData(
        this.proposalClaimData,
        this.proposalMemberCount,
        this.getConditionGroups(),
        this.getClaimDimensions(),
        WaterfallData.type.FREQUENCY
      );

      this.proposalClaimAvgCost = new WaterfallData(
        this.proposalClaimData,
        this.proposalMemberCount,
        this.getConditionGroups(),
        this.getClaimDimensions(),
        WaterfallData.type.AVGCOST
      );


    }
  }


  createDemographicData() {
    if (this.hasClaimData === true) {
      this.benchmarkDemographic = new TornadoData(this.benchmarkDemographicData, this.ageGroup.reverse(), this.getDemographicDimensions());
      this.proposalDemographic = new TornadoData(this.proposalDemographicData, this.ageGroup.reverse(), this.getDemographicDimensions());
    } else {
      this.benchmarkDemographic = new TornadoData(this.benchmarkDemographicData, this.ageGroup.reverse(), this.getDemographicDimensions());
    }
  }


  // check tab status
  onSelect(data: TabDirective): void {
    this.unSubscribeToDivResize(this.currentTab);
    switch (data.id) {
      case 'claimsPerCapita': {
        this.selectorDisplay.ageGroup = true;
        this.selectorDisplay.claimType = true;
        this.selectorDisplay.gender = true;
        this.switchToClaimsSelector();
        break;
      }
      case 'claimsFrequency': {
        this.selectorDisplay.ageGroup = true;
        this.selectorDisplay.claimType = true;
        this.selectorDisplay.gender = true;
        this.switchToClaimsSelector();
        break;
      }
      case 'claimsAvgCost': {
        this.selectorDisplay.ageGroup = true;
        this.selectorDisplay.claimType = true;
        this.selectorDisplay.gender = true;
        this.switchToClaimsSelector();
        break;
      }
      case 'historicalDemographic': {
        this.selectorDisplay.ageGroup = false;
        this.selectorDisplay.claimType = false;
        this.selectorDisplay.gender = false;
        this.switchToDemographicSelector();
        break;
      }
      default: {
        break;
      }
    }

    this.currentTab = data.id;

    if (this.checkAllSelectorSeleted() === true) {
      this.resetDisabled = true;
    }

    setTimeout(() => {
      this.updateCurrentTabCharts();
    });

    setTimeout(() => {
      this.subscribeToDivResize(this.currentTab);
    });

  }


  switchToClaimsSelector() {
    if (this.selectors === this.claimsSelectors) {
      console.log('current selector are claims selectors, no need to switch');
    } else {
      console.log('start passing region and relation selectors here');

      const currentRegionSelector: Selector = this.demographicSelectors.find(item => item.getSelectorName() === 'region');
      const currentRelationSelector: Selector = this.demographicSelectors.find(item => item.getSelectorName() === 'relation');

      const claimsRegionSelector: Selector = this.claimsSelectors.find(item => item.getSelectorName() === 'region');
      const claimsRelationelector: Selector = this.claimsSelectors.find(item => item.getSelectorName() === 'relation');


      if (currentRegionSelector.all === true) {
        claimsRegionSelector.resetSelector();
      } else {
        claimsRegionSelector.unSelectAll();
        claimsRegionSelector.setSelection(currentRegionSelector.getCurrentSelction());
        claimsRegionSelector.syncAll();
      }

      if (currentRelationSelector.all === true) {
        claimsRelationelector.resetSelector();
      } else {
        claimsRelationelector.unSelectAll();
        claimsRelationelector.setSelection(currentRelationSelector.getCurrentSelction());
        claimsRelationelector.syncAll();
      }


      this.selectors = this.claimsSelectors;
    }

  }

  switchToDemographicSelector() {
    const currentRegionSelector: Selector = this.claimsSelectors.find(item => item.getSelectorName() === 'region');
    const currentRelationSelector: Selector = this.claimsSelectors.find(item => item.getSelectorName() === 'relation');


    const demographicRegionSelector: Selector = this.demographicSelectors.find(item => item.getSelectorName() === 'region');
    const demographicRelationelector: Selector = this.demographicSelectors.find(item => item.getSelectorName() === 'relation');


    if (currentRegionSelector.all === true) {
      demographicRegionSelector.resetSelector();
    } else {
      demographicRegionSelector.unSelectAll();
      demographicRegionSelector.setSelection(currentRegionSelector.getCurrentSelction());
      demographicRegionSelector.syncAll();
    }

    if (currentRelationSelector.all === true) {
      demographicRelationelector.resetSelector();
    } else {
      demographicRelationelector.unSelectAll();
      demographicRelationelector.setSelection(currentRelationSelector.getCurrentSelction());
      demographicRelationelector.syncAll();
    }

    // repoint UI selector
    this.selectors = this.demographicSelectors;

  }

  toggleDropdown(value: boolean, dropdownName: string) {
    this.dropdownStatus[dropdownName] = value;
  }

  onClickedOutside(e: Event, dropdownName: string) {
    this.dropdownStatus[dropdownName] = false;
  }


  checkIfAllElementSelected(dropdownName: string) {

    if (this.getSelector(dropdownName).checkIfAllChecked()) {
      this.getSelector(dropdownName).all = true;
    } else {
      this.getSelector(dropdownName).all = false;
      this.resetDisabled = false;
    }

    setTimeout(() => {
      this.updateCurrentTabCharts();

    });

    if (this.checkAllSelectorSeleted() === true) {
      this.resetDisabled = true;
    }
  }


  toggleMultiSelectAll(dropdownName: string) {
    for (const item of this.getSelector(dropdownName).selectionItems) {
      item.checked = this.getSelector(dropdownName).all;
    }
    setTimeout(() => {
      this.updateCurrentTabCharts();

    });


    if (this.checkAllSelectorSeleted() === true) {
      this.resetDisabled = true;
    } else {
      this.resetDisabled = false;
    }

  }

  updateCurrentTabCharts() {
    switch (this.currentTab) {
      case 'historicalDemographic': {
        this.demographicComponent.updateChartData(this.demographicSelectors);
        this.demographicComponent.updateChart();
        break;
      }
      case 'claimsPerCapita': {
        this.claimPerCapitaComponent.updateChartData(this.getConditionGroups(), this.claimsSelectors);
        // this.claimPerCapitaComponent.updateChart();
        this.claimPerCapitaComponent.creatOrUpdateChart();
        break;
      }
      case 'claimsFrequency': {
        this.claimFrequencyComponent.updateChartData(this.getConditionGroups(), this.claimsSelectors);
        this.claimFrequencyComponent.creatOrUpdateChart();
        break;
      }
      case 'claimsAvgCost': {
        this.claimAvgCostComponent.updateChartData(this.getConditionGroups(), this.claimsSelectors);
        this.claimAvgCostComponent.updateChart();
        break;
      }

      default: {
        break;
      }
    }
    console.log('updateCurrentTabCharts');
  }



  checkAllSelectorSeleted(): boolean {
    for (const selector of this.selectors) {
      if (selector.checkIfAllChecked() === false) {
        return false;
      }
    }
    return true;
  }

  resetAllSelectors(): void {
    for (const item of this.demographicSelectors) {
      item.resetSelector();
    }
    for (const item of this.claimsSelectors) {
      item.resetSelector();
    }
    this.resetDisabled = true;
    this.updateCurrentTabCharts();
  }

  unSubscribeToDivResize(tabId: string) {
    switch (tabId) {
      case 'historicalDemographic': {
        this.demographicComponent.unListenToDivResize();
        break;
      }
      case 'claimsPerCapita': {
        this.claimPerCapitaComponent.unListenToDivResize();
        break;
      }
      case 'claimsFrequency': {
        this.claimFrequencyComponent.unListenToDivResize();
        break;
      }
      case 'claimsAvgCost': {
        this.claimAvgCostComponent.unListenToDivResize();
        break;
      }
      default: {
        break;
      }
    }
  }

  subscribeToDivResize(tabId: string) {
    switch (tabId) {
      case 'historicalDemographic': {
        this.demographicComponent.listenToDivResize();
        break;
      }
      case 'claimsPerCapita': {
        this.claimPerCapitaComponent.listenToDivResize();
        break;
      }
      case 'claimsFrequency': {
        this.claimFrequencyComponent.listenToDivResize();
        break;
      }
      case 'claimsAvgCost': {
        this.claimAvgCostComponent.listenToDivResize();
        break;
      }
      default: {
        break;
      }
    }
  }





  // HTTP Request

  fetchBenchmarkProposalDemograpic(): void {
    this.demographicService.getBenchmarkProposalDemographicData(this.countryCode, this.proposalID, this.ageGroup)
      .subscribe(
        data => {
          this.benchmarkDemographicData = data[0];
          this.proposalDemographicData = data[1];
        },
        err => console.error(err),
        () => {
          this.createDemographicData();
          this.createDemographicSelectors();

          this.selectors = this.demographicSelectors;

          // release memory here
          this.benchmarkDemographicData = null;
          this.proposalDemographicData = null;
          console.log('done loading demographic data');
        }
      );
  }


  fetchBenchmarkDemograpic(): void {
    this.demographicService.getBenchmarkDemographicData(this.countryCode, this.proposalID, this.ageGroup)
      .subscribe(
        data => {
          this.benchmarkDemographicData = data;
        },
        err => console.error(err),
        () => {
          this.createDemographicData();
          this.createDemographicSelectors();

          this.selectors = this.demographicSelectors;

          // release memory here
          this.benchmarkDemographicData = null;
          this.proposalDemographicData = null;
          console.log('done loading demographic data');
        }
      );
  }


  fetchBenchmarkProposalClaimAndMemberCount(): void {
    this.claimDataService.getBenchmarkPropocalClaimsDataTotalMemberCount(this.countryCode, this.proposalID, this.ageGroup)
      .subscribe(
        data => {

          this.benchmarkClaimData = data[0];
          this.benchmarkMemberCount = data[1];
          this.proposalClaimData = data[2];
          this.proposalMemberCount = data[3];
        },
        err => console.error(err),
        () => {

          this.createClaimData();
          this.createClaimsSelectors();

          // // release the memory.  remove http reponse json
          this.benchmarkClaimData = null;
          this.benchmarkMemberCount = null;
          this.proposalClaimData = null;
          this.proposalMemberCount = null;


          // enable tabs
          this.staticTabs.tabs[1].disabled = false;
          this.staticTabs.tabs[2].disabled = false;
          this.staticTabs.tabs[3].disabled = false;


          this.showSuccess();

          console.log('done loading claims data');
        }
      );
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
          this.createClaimsSelectors();

          this.benchmarkClaimData = null;
          this.benchmarkMemberCount = null;
          // enable claims tabs
          this.staticTabs.tabs[1].disabled = false;
          this.staticTabs.tabs[2].disabled = false;
          this.staticTabs.tabs[3].disabled = false;

          this.showSuccess();
          console.log('done loading claims data for benchmark only');
        }
      );
  }


}
