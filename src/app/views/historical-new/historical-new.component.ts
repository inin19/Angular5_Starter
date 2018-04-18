import { Selector } from './../../model/utils/selector.model';
import { WaterfallData, ChartUpdateParameters } from './../../model/waterfallData';
import { SelectorService } from './../../services/selector.service';
import { DemographicComponent } from './demographic/demographic.component';
import { ClaimsComponent } from './claims/claims.component';
import { Component, OnInit, OnDestroy, ViewChild, AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, ElementRef } from '@angular/core';
import { DemographicService } from '../../services/demographic.service';
import { ClaimDataService } from '../../services/claims.service';
import { TabDirective } from 'ngx-bootstrap/tabs';
import { TornadoChartData } from '../../model/tornadoData';
import { TabsetComponent } from 'ngx-bootstrap';

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
  @ViewChild('claimsPerCapita') claimPerCapitaComponent: ClaimsComponent;

  @ViewChild('staticTabs') staticTabs: TabsetComponent;


  constructor(private demographicService: DemographicService, private claimDataService: ClaimDataService) {
  }

  ngOnInit() {
    this.demographicSelectors = new Array<Selector>();
    this.claimsSelectors = new Array<Selector>();

    this.staticTabs.tabs[1].disabled = true;
    this.staticTabs.tabs[2].disabled = true;

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



  // to-do get country code dynamically, or maybe get proposal id
  fetchBenchmarkProposalDemograpic(): void {
    this.demographicService.getBenchmarkProposalDemographicData('ISO2_GB')
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

  // one time
  createDemographicSelectors() {
    if (this.hasClaimData === true) {
      const allRegionCombinedSet = new Set([...this.proposalDemographic.getAllRegion(), ...this.benchmarkDemographic.getAllRegion()]);
      const allRelationCombinedSet = new Set([...this.proposalDemographic.getAllRelation(), ...this.benchmarkDemographic.getAllRelation()]);

      this.demographicSelectors.push(new Selector(Array.from(allRegionCombinedSet).sort(), 'region'));
      this.demographicSelectors.push(new Selector(Array.from(allRelationCombinedSet).sort(), 'relation'));

    } else {
      this.demographicSelectors.push(new Selector(this.benchmarkDemographic.getAllRegion().sort(), 'region'));
      this.demographicSelectors.push(new Selector(this.benchmarkDemographic.getAllRelation().sort(), 'relation'));
    }
  }

  createClaimsSelectors() {
    if (this.hasClaimData === true) {
      const allRegionCombinedSet = new Set([...this.proposalClaim.getAllRegion(), ...this.benchmarkClaim.getAllRegion()]);
      const allRelationCombinedSet = new Set([...this.proposalClaim.getAllRelation(), ...this.benchmarkClaim.getAllRelation()]);
      const allAgeGroupCombinedSet = new Set([...this.proposalClaim.getAllAgeGroup(), ...this.benchmarkClaim.getAllAgeGroup()]);
      const allGenderCombinedSet = new Set([...this.proposalClaim.getAllGender(), ...this.benchmarkClaim.getAllGender()]);
      const allClaimTypeCombinedSet = new Set([...this.proposalClaim.getClaimType(), ...this.benchmarkClaim.getClaimType()]);

      this.claimsSelectors.push(new Selector(Array.from(allRegionCombinedSet).sort(), 'region'));
      this.claimsSelectors.push(new Selector(Array.from(allRelationCombinedSet).sort(), 'relation'));
      this.claimsSelectors.push(new Selector(Array.from(allAgeGroupCombinedSet).sort(), 'ageGroup'));
      this.claimsSelectors.push(new Selector(Array.from(allGenderCombinedSet).sort(), 'gender'));
      this.claimsSelectors.push(new Selector(Array.from(allClaimTypeCombinedSet).sort(), 'claimType'));

    } else {
      this.claimsSelectors.push(new Selector(this.benchmarkClaim.getAllRegion().sort(), 'region'));
      this.claimsSelectors.push(new Selector(this.benchmarkClaim.getAllRelation().sort(), 'relation'));
      this.claimsSelectors.push(new Selector(this.benchmarkClaim.getAllAgeGroup().sort(), 'ageGroup'));
      this.claimsSelectors.push(new Selector(this.benchmarkClaim.getAllGender().sort(), 'gender'));
      this.claimsSelectors.push(new Selector(this.benchmarkClaim.getClaimType().sort(), 'claimType'));
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


  fetchBenchmarkProposalClaimAndMemberCount(): void {
    this.claimDataService.getBenchmarkPropocalClaimsDataTotalMemberCount()
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

          // release the memory.  remove http reponse json
          this.benchmarkClaimData = null;
          this.benchmarkMemberCount = null;
          this.proposalClaimData = null;
          this.proposalMemberCount = null;


          // enable tabs
          this.staticTabs.tabs[1].disabled = false;
          this.staticTabs.tabs[2].disabled = false;

          console.log('done loading claims data');
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

        this.selectorDisplay.ageGroup = true;
        this.selectorDisplay.claimType = true;
        this.selectorDisplay.gender = true;

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


        // reset button
        if (this.checkAllSelectorSeleted() === true) {
          this.resetDisabled = true;
        }

        setTimeout(() => {
          this.updateCurrentTabCharts();
        });

        break;
      }
      case 'claimsFrequency': {
        this.currentTab = data.id;

        this.selectorDisplay.ageGroup = true;
        this.selectorDisplay.claimType = true;
        this.selectorDisplay.gender = true;

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


        // reset button
        if (this.checkAllSelectorSeleted() === true) {
          this.resetDisabled = true;
        }

        setTimeout(() => {
          this.updateCurrentTabCharts();
        });

        break;
      }
      case 'historicalDemographic': {
        this.currentTab = data.id;

        this.selectorDisplay.ageGroup = false;
        this.selectorDisplay.claimType = false;
        this.selectorDisplay.gender = false;

        // pass selectors from claims to demographic

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


        if (this.checkAllSelectorSeleted() === true) {
          this.resetDisabled = true;
        }

        setTimeout(() => {
          this.updateCurrentTabCharts();
        });


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

        this.demographicComponent.updateChartData(this.getDemographicSelector('region').getCurrentSelction(), this.getDemographicSelector('relation').getCurrentSelction());
        this.demographicComponent.updateChart_benchmark();
        if (this.hasClaimData === true) {
          this.demographicComponent.updateChart_proposal();
          this.demographicComponent.updateChart_combined();
        }
        break;
      }
      case 'claimsPerCapita': {
        const params: ChartUpdateParameters = {
          sortingMethod: this.claimPerCapitaComponent.sorting,
          region: this.getClaimsSelector('region').getCurrentSelction(),
          relation: this.getClaimsSelector('relation').getCurrentSelction(),
          claimType: this.getClaimsSelector('claimType').getCurrentSelction(),
          ageGroup: this.getClaimsSelector('ageGroup').getCurrentSelction(),
          gender: this.getClaimsSelector('gender').getCurrentSelction(),
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

  resetAllSelectors() {
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
      default: {
        break;
      }
    }
  }




  // -------------------------to do---------------------------


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


}
