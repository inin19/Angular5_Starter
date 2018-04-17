import { WaterfallData, ChartUpdateParameters } from './../../model/waterfallData';
import { SelectorService } from './../../services/selector.service';
import { DemographicComponent } from './demographic/demographic.component';
import { ClaimsComponent } from './claims/claims.component';
import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, ElementRef } from '@angular/core';
import { DemographicService } from '../../services/demographic.service';
import { ClaimDataService } from '../../services/claims.service';
import { TabDirective } from 'ngx-bootstrap/tabs';
import { Selector } from '../../model/utils/selector.model';
// import { Subscription } from 'rxjs/Subscription';
import { TornadoChartData } from '../../model/tornadoData';
// import * as elementResizeDetectorMaker from 'element-resize-detector';


@Component({
  selector: 'app-historical-new',
  templateUrl: './historical-new.component.html',
  styleUrls: ['./historical-new.component.scss']
})
export class HistoricalNewComponent implements OnInit, OnDestroy {


  // to-do get age Group for each country
  ageGroup = ['0-18', '19-25', '26-35', '36-45', '46-55', '56-60', '61-65', '66-70', '71-75', '76+'];


  // to-do hard coded now
  hasClaimData = true;

  // be careful of the reference;
  selectors: Selector[];


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
  proposalClaim: WaterfallData;
  benchmarkClaim: WaterfallData;

  proposalDemographic: TornadoChartData;
  benchmarkDemographic: TornadoChartData;
  // -----------------------------CROSSFILTER DATA----------------------


  // dropdowns
  dropdownStatus = {
    regionDropdown: false,
    relationDropdown: false,
    claimTypeDropdown: false,
    genderDropdown: false,
    ageGroupDropdown: false
  };


  // current tab id
  currentTab: string;

  resetDisabled: boolean;

  @ViewChild('demographic') demographicComponent: DemographicComponent;
  @ViewChild('claimsPerCapita') claimPerCapitaComponent: ClaimsComponent;




  constructor(private demographicService: DemographicService, private claimDataService: ClaimDataService) {
  }

  ngOnInit() {

    this.resetDisabled = true;
    this.selectors = new Array<Selector>();
    this.currentTab = 'historicalDemographic';

    if (this.hasClaimData === true) {
      this.fetchBenchmarkProposalDemograpic();
    } else {
      this.fetchBenchmarkDemograpic();
    }

  }

  ngOnDestroy() {
    console.log('historical destroyed');
  }



  // to-do get country code dynamically, or maybe get proposal id
  fetchBenchmarkProposalDemograpic(): void {
    this.demographicService.getBenchmarkProposalDemographicData('ISO2_GB')
      .subscribe(
        data => {
          this.benchmarkDemographicData = data[0];
          this.proposalDemographicData = data[1];
          this.createDemographicData();
          this.createDemographicSelectors();
          // release memory here
          this.benchmarkDemographicData = null;
          this.proposalDemographicData = null;
        }
      );
  }


  createDemographicSelectors() {
    // reset selectors array
    this.selectors = [];

    if (this.hasClaimData === true) {
      const allRegionCombinedSet = new Set([...this.proposalDemographic.getAllRegion(), ...this.benchmarkDemographic.getAllRegion()]);
      const allRelationCombinedSet = new Set([...this.proposalDemographic.getAllRelation(), ...this.benchmarkDemographic.getAllRelation()]);

      // this.regionSelector = new Selector(Array.from(allRegionCombinedSet).sort(), 'region');
      // this.relationSelector = new Selector(Array.from(allRelationCombinedSet).sort(), 'relation');
      this.selectors.push(new Selector(Array.from(allRegionCombinedSet).sort(), 'region'));
      this.selectors.push(new Selector(Array.from(allRelationCombinedSet).sort(), 'relation'));

    } else {
      // this.relationSelector = new Selector(this.benchmarkDemographic.getAllRelation().sort(), 'relation');

      this.selectors.push(new Selector(this.benchmarkDemographic.getAllRegion().sort(), 'region'));
      this.selectors.push(new Selector(this.benchmarkDemographic.getAllRelation().sort(), 'relation'));

    }
  }

  createClaimsSelectors() {
    this.selectors = [];
    if (this.hasClaimData === true) {
      const allRegionCombinedSet = new Set([...this.proposalClaim.getAllRegion(), ...this.benchmarkClaim.getAllRegion()]);
      const allRelationCombinedSet = new Set([...this.proposalClaim.getAllRelation(), ...this.benchmarkClaim.getAllRelation()]);
      const allAgeGroupCombinedSet = new Set([...this.proposalClaim.getAllAgeGroup(), ...this.benchmarkClaim.getAllAgeGroup()]);
      const allGenderCombinedSet = new Set([...this.proposalClaim.getAllGender(), ...this.benchmarkClaim.getAllGender()]);
      const allClaimTypeCombinedSet = new Set([...this.proposalClaim.getClaimType(), ...this.benchmarkClaim.getClaimType()]);


      this.selectors.push(new Selector(Array.from(allRegionCombinedSet).sort(), 'region'));
      this.selectors.push(new Selector(Array.from(allRelationCombinedSet).sort(), 'relation'));
      this.selectors.push(new Selector(Array.from(allAgeGroupCombinedSet).sort(), 'ageGroup'));
      this.selectors.push(new Selector(Array.from(allGenderCombinedSet).sort(), 'gender'));
      this.selectors.push(new Selector(Array.from(allClaimTypeCombinedSet).sort(), 'claimType'));

    } else {

      this.selectors.push(new Selector(this.benchmarkClaim.getAllRegion().sort(), 'region'));
      this.selectors.push(new Selector(this.benchmarkClaim.getAllRelation().sort(), 'relation'));
      this.selectors.push(new Selector(this.benchmarkClaim.getAllAgeGroup().sort(), 'ageGroup'));
      this.selectors.push(new Selector(this.benchmarkClaim.getAllGender().sort(), 'gender'));
      this.selectors.push(new Selector(this.benchmarkClaim.getClaimType().sort(), 'claimType'));
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


  fetchBenchmarkDemograpic(): void {
    this.demographicService.getBenchmarkDemographicData('ISO2_GB')
      .subscribe(
        data => {
          this.benchmarkDemographicData = data;
        }
      );
  }

  fetchBenchmarkClaimAndMemberCount(): void {
    this.claimDataService.getBenchmarkClaimsDataTotalMemberCount()
      .subscribe(
        data => {
          this.benchmarkClaimData = data[0];
          this.benchmarkMemberCount = data[1];
        }
      );
  }


  fetchBenchmarkProposalClaimAndMemberCount(): void {
    this.claimDataService.getBenchmarkPropocalClaimsDataTotalMemberCount()
      .subscribe(
        data => {
          this.benchmarkClaimData = data[0];
          this.benchmarkMemberCount = data[1];
          this.proposalClaimData = data[2];
          this.proposalMemberCount = data[3];

          this.createClaimData();
          this.createClaimsSelectors();
          // release the memory.  remove http reponse json
          this.benchmarkClaimData = null;
          this.benchmarkMemberCount = null;
          this.proposalClaimData = null;
          this.proposalMemberCount = null;
        },
        err => console.error(err),
        () => {
          console.log('done loading data');
        }
      );
  }


  createClaimData() {
    if (this.hasClaimData === true) {
      // populate both benchmark and proposal data
      this.benchmarkClaim = new WaterfallData(this.benchmarkClaimData, this.benchmarkMemberCount);
      this.proposalClaim = new WaterfallData(this.proposalClaimData, this.proposalMemberCount);
    } else {
      // populate benchmark only
      this.benchmarkClaim = new WaterfallData(this.benchmarkClaimData, this.benchmarkMemberCount);
    }
  }


  createDemographicData() {
    if (this.hasClaimData === true) {
      this.benchmarkDemographic = new TornadoChartData(this.benchmarkDemographicData, this.ageGroup);
      this.proposalDemographic = new TornadoChartData(this.proposalDemographicData, this.ageGroup);
    } else {
      this.benchmarkDemographic = new TornadoChartData(this.benchmarkDemographicData, this.ageGroup);
    }
  }


  // check tab status
  onSelect(data: TabDirective): void {

    this.unSubscribeToDivResize(this.currentTab);

    switch (data.id) {
      case 'claimsPerCapita': {
        this.currentTab = data.id;
        if (this.benchmarkClaim) {
          this.createClaimsSelectors();
          console.log('has benchmark waterfall data');
        } else {
          this.fetchBenchmarkProposalClaimAndMemberCount();
          console.log('fectched Claim data');
        }
        break;
      }
      case 'claimsFrequency': {
        this.currentTab = data.id;

        if (this.benchmarkClaim) {
          this.createClaimsSelectors();
          console.log('has benchmark waterfall data');
        } else {
          this.fetchBenchmarkProposalClaimAndMemberCount();
          console.log('fectched Claim data');
        }
        break;
      }
      case 'historicalDemographic': {
        this.currentTab = data.id;
        // reset selector
        this.createDemographicSelectors();
        break;
      }
      default: {
        break;
      }
    }

    setTimeout(() => {
      this.subscribeToDivResize(this.currentTab);
    });

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

    this.updateCurrentTabCharts();

    if (this.checkAllSelectorSeleted() === true) {
      this.resetDisabled = true;
    }
  }


  toggleMultiSelectAll(dropdownName: string) {
    for (const item of this.getSelector(dropdownName).selectionItems) {
      item.checked = this.getSelector(dropdownName).all;
    }
    this.updateCurrentTabCharts();

    if (this.checkAllSelectorSeleted() === true) {
      // console.log('i am true');
      this.resetDisabled = true;
    } else {
      this.resetDisabled = false;
    }

  }

  updateCurrentTabCharts() {
    switch (this.currentTab) {
      case 'historicalDemographic': {
        this.demographicComponent.updateChartData(this.getSelector('region').getCurrentSelction(), this.getSelector('relation').getCurrentSelction());
        this.demographicComponent.updateChart_benchmark();
        if (this.hasClaimData === true) {
          this.demographicComponent.updateChart_proposal();
          this.demographicComponent.updateChart_combined();
        }
        break;
      }
      case 'claimsPerCapita': {
        const params: ChartUpdateParameters = {
          sortingMethod: this.claimPerCapitaComponent.sortingForm.controls['sorting'].value,
          region: this.getSelector('region').getCurrentSelction(),
          relation: this.getSelector('relation').getCurrentSelction(),
          claimType: this.getSelector('claimType').getCurrentSelction(),
          ageGroup: this.getSelector('ageGroup').getCurrentSelction(),
          gender: this.getSelector('gender').getCurrentSelction(),
          conditionGroupKey: ClaimsComponent.UKConditionGroupKeys
        };

        this.claimPerCapitaComponent.updateChartData(params);
        // update chart
        this.claimPerCapitaComponent.updateChart_benchmark();
        if (this.hasClaimData === true) {
          this.claimPerCapitaComponent.updateChart_proposal();
        }
        break;
      }

      default: {
        break;
      }
    }

  }



  checkAllSelectorSeleted(): boolean {
    for (const selector of this.selectors) {
      if (selector.checkIfAllChecked() === false) {
        return false;
      }
    }
    return true;
  }

  resetAllSelectors() {
    for (const selector of this.selectors) {
      selector.resetSelector();
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

        break;
      }
      default: {
        break;
      }
    }
  }


}
