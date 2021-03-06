import { Component, Input, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { DemographicComponent } from '../../demographic/demographic.component';
import { ClaimsPerCapitaComponent } from '../../claims-percapita/claims-percapita.component';
import { ClaimsAvgCostComponent } from './../../claims-avg-cost/claims-avg-cost.component';
import { DemographicService } from '../../../../providers/charts/demographic.service';
import { ClaimsService } from '../../../../providers/charts/claims.service';
import { TabDirective } from 'ngx-bootstrap/tabs';
import { TabsetComponent } from 'ngx-bootstrap';
import { Selector } from './../../../../model/utils/selector.model';
import { TornadoData } from './../../../../model/D3chartData/tornado-data.model';
import { WaterfallData } from './../../../../model/D3chartData/waterfall-data.model';
import { ToastrService } from 'ngx-toastr';
import { ClaimsFrequencyComponent } from './../../claims-frequency/claims-frequency.component';
import { ToasterService, ToasterConfig } from 'angular2-toaster/angular2-toaster';

@Component({
  selector: 'app-historical-uk',
  templateUrl: './historical-uk.component.html',
  styleUrls: ['./historical-uk.component.scss']

})
export class HistoricalUkComponent implements OnInit, OnDestroy {

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
    'region',
    'relation'
  ];



  private static claimMargin: any = { top: 20, right: 20, bottom: 120, left: 50 };

  private static demographicMargin: any = { top: 20, right: 20, bottom: 50, left: 50 };


  conditionGroupTranslation = {
    'PREVYEAR': '',
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
    'CURRYEAR': ''
  };



  // to-do get age Group for each country
  countryCode = 'ISO2_GB';
  ageGroup = ['0-18', '19-25', '26-35', '36-45', '46-55', '56-60', '61-65', '66-70', '71-75', '76+'];
  proposalID = '3';
  hasClaimData = true;
  // hasClaimData = false;
  hasDemographicData: boolean;

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
  hasDemographicMemberCount: boolean;

  proposalClaimFrequency: WaterfallData;
  benchmarkClaimFrequency: WaterfallData;


  proposalClaimAvgCost: WaterfallData;
  benchmarkClaimAvgCost: WaterfallData;



  proposalDemographic: TornadoData;
  benchmarkDemographic: TornadoData;
  // -----------------------------CROSSFILTER DATA----------------------


  // dropdowns
  dropdownStatus = {
    regionDropdown: false,
    relationDropdown: false,
    claimTypeDropdown: false,
    genderDropdown: false,
    ageGroupDropdown: false
  };

  selectorDisplay = {
    region: true,
    relation: true,
    claimType: false,
    gender: false,
    ageGroup: false
  };


  // current tab id
  currentTab: string;
  resetDisabled: boolean;

  @ViewChild('demographic') demographicComponent: DemographicComponent;
  @ViewChild('claimsPerCapita') claimPerCapitaComponent: ClaimsPerCapitaComponent;
  @ViewChild('claimsFrequency') claimFrequencyComponent: ClaimsFrequencyComponent;
  @ViewChild('claimsAvgCost') claimAvgCostComponent: ClaimsAvgCostComponent;


  // claimsAvgCost


  @ViewChild('staticTabs') staticTabs: TabsetComponent;


  // NEW 531
  claimsLatestYear: any;

  showSuccess() {
    this.toastr.success('Claims Data loaded!');
  }


  // getConditionGroups()
  private getConditionGroups(): string[] {
    return HistoricalUkComponent.conditionGroups;
  }


  private getClaimDimensions(): string[] {
    return HistoricalUkComponent.claimDimensions;
  }

  private getDemographicDimensions(): string[] {
    return HistoricalUkComponent.demographicDimensions;
  }


  private getClaimMargin() {
    return HistoricalUkComponent.claimMargin;
  }

  private getDemographicMargin() {
    return HistoricalUkComponent.demographicMargin;
  }


  constructor(private demographicService: DemographicService, private claimDataService: ClaimsService, private toastr: ToastrService) {

  }



  ngOnInit() {


    this.demographicSelectors = new Array<Selector>();
    this.claimsSelectors = new Array<Selector>();

    this.staticTabs.tabs[1].disabled = true;
    this.staticTabs.tabs[2].disabled = true;
    this.staticTabs.tabs[3].disabled = true;


    this.resetDisabled = true;
    this.currentTab = 'historicalDemographic';

    // if (this.hasClaimData === true) {
    //   this.fetchBenchmarkProposalDemograpic();
    //   this.fetchBenchmarkProposalClaimAndMemberCount();
    // } else {
    //   this.fetchBenchmarkDemograpic();
    //   this.fetchBenchmarkClaimAndMemberCount();
    // }


    // fecth both proposal and benchmark demographic
    this.fetchDemograpic();

    if (this.hasClaimData === true) {
      this.fetchBenchmarkProposalClaimAndMemberCount();
    } else {
      this.fetchBenchmarkClaimAndMemberCount();
    }



  }

  ngOnDestroy() {
    console.log('historical destroyed');
  }




  createDemographicSelectors() {
    for (const item of this.getDemographicDimensions()) {
      if (this.hasDemographicData === true) {
        const commonElements = new Set([...this.proposalDemographic.getSelectorValuesByName(item).sort(), ...this.benchmarkDemographic.getSelectorValuesByName(item).sort()]);
        this.demographicSelectors.push(new Selector(Array.from(commonElements).sort(), item));
      } else {
        this.demographicSelectors.push(new Selector(this.benchmarkDemographic.getSelectorValuesByName(item).sort(), item));
      }
    }
  }

  // this.proposalClaimFrequency

  createClaimsSelectors() {
    for (const item of this.getClaimDimensions()) {
      if (this.hasClaimData === true) {
        const commonElements = new Set([...this.proposalClaimFrequency.getSelectorValuesByName(item).sort(), ...this.proposalClaimFrequency.getSelectorValuesByName(item).sort()]);
        this.claimsSelectors.push(new Selector(Array.from(commonElements).sort(), item));
      } else {
        this.claimsSelectors.push(new Selector(this.proposalClaimFrequency.getSelectorValuesByName(item).sort(), item));
      }
    }
  }

  // createClaimsSelectors() {
  //   for (const item of this.getClaimDimensions()) {
  //     if (this.hasClaimData === true) {
  //       const commonElements = new Set([...this.proposalClaimPerCapita.getSelectorValuesByName(item).sort(), ...this.benchmarkClaimPerCapita.getSelectorValuesByName(item).sort()]);
  //       this.claimsSelectors.push(new Selector(Array.from(commonElements).sort(), item));
  //     } else {
  //       this.claimsSelectors.push(new Selector(this.benchmarkClaimPerCapita.getSelectorValuesByName(item).sort(), item));
  //     }
  //   }
  // }

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

      // 6/3

      // console.log(this.proposalMemberCount);

      if (this.proposalMemberCount['currentYear'] !== 0 && this.proposalMemberCount['previousYear'] !== 0) {

        console.log('oh? created');

        this.hasDemographicMemberCount = true;

        this.proposalClaimPerCapita = new WaterfallData(
          this.proposalClaimData,
          this.proposalMemberCount,
          this.getConditionGroups(),
          this.getClaimDimensions(),
          WaterfallData.type.PERCAPITA
        );

      } else {
        this.hasDemographicMemberCount = false;
      }



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
    // if (this.hasClaimData === true) {
    //   this.benchmarkDemographic = new TornadoData(this.benchmarkDemographicData, this.ageGroup.reverse(), this.getDemographicDimensions());
    //   this.proposalDemographic = new TornadoData(this.proposalDemographicData, this.ageGroup.reverse(), this.getDemographicDimensions());
    // } else {
    //   this.benchmarkDemographic = new TornadoData(this.benchmarkDemographicData, this.ageGroup.reverse(), this.getDemographicDimensions());
    // }

    // 6/3


    // console.log(this.proposalDemographicData);

    if (this.proposalDemographicData.length === 0) {
      // no client demographic data
      this.benchmarkDemographic = new TornadoData(this.benchmarkDemographicData, this.ageGroup.reverse(), this.getDemographicDimensions());
      this.hasDemographicData = false;

    } else {
      this.hasDemographicData = true;
      this.benchmarkDemographic = new TornadoData(this.benchmarkDemographicData, this.ageGroup.reverse(), this.getDemographicDimensions());
      this.proposalDemographic = new TornadoData(this.proposalDemographicData, this.ageGroup.reverse(), this.getDemographicDimensions());
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
        this.demographicComponent.createOrUpdateData(this.demographicSelectors);
        this.demographicComponent.createOrUpdateChart();
        break;
      }
      case 'claimsPerCapita': {
        this.claimPerCapitaComponent.updateGridGraphData(this.getConditionGroups(), this.claimsSelectors);
        this.claimPerCapitaComponent.creatOrUpdateChart();
        break;
      }
      case 'claimsFrequency': {
        this.claimFrequencyComponent.updateGridGraphData(this.getConditionGroups(), this.claimsSelectors);
        this.claimFrequencyComponent.creatOrUpdateChart();
        break;
      }
      case 'claimsAvgCost': {
        this.claimAvgCostComponent.updateGridGraphData(this.getConditionGroups(), this.claimsSelectors);
        this.claimAvgCostComponent.createOrUpdateChart();
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

  fetchDemograpic(): void {
    this.demographicService.getDemographicData(this.countryCode, this.proposalID, this.ageGroup)
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


  // fetchBenchmarkDemograpic(): void {
  //   this.demographicService.getBenchmarkDemographicData(this.countryCode, this.proposalID, this.ageGroup)
  //     .subscribe(
  //       data => {
  //         this.benchmarkDemographicData = data;
  //       },
  //       err => console.error(err),
  //       () => {
  //         this.createDemographicData();
  //         this.createDemographicSelectors();

  //         this.selectors = this.demographicSelectors;

  //         // release memory here
  //         this.benchmarkDemographicData = null;
  //         this.proposalDemographicData = null;
  //         console.log('done loading demographic data');
  //       }
  //     );
  // }


  fetchBenchmarkProposalClaimAndMemberCount(): void {
    this.claimDataService.getBenchmarkPropocalClaimsDataTotalMemberCount(this.countryCode, this.proposalID, this.ageGroup)
      .subscribe(
        data => {

          this.benchmarkClaimData = data[0];
          this.benchmarkMemberCount = data[1];
          this.proposalClaimData = data[2];
          this.proposalMemberCount = data[3];

          this.claimsLatestYear = data[4];

        },
        err => console.error(err),
        () => {

          this.conditionGroupTranslation.PREVYEAR = this.claimsLatestYear['PREVIOUS_YEAR'];
          this.conditionGroupTranslation.CURRYEAR = this.claimsLatestYear['CURRENT_YEAR'];

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

          // new 531
          this.claimsLatestYear = data[2];
        },
        err => console.error(err),
        () => {

          this.conditionGroupTranslation.PREVYEAR = this.claimsLatestYear['PREVIOUS_YEAR'];
          this.conditionGroupTranslation.CURRYEAR = this.claimsLatestYear['CURRENT_YEAR'];

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
