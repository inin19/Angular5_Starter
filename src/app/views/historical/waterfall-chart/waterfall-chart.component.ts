import { WaterfallChartConfig } from './../../../model/chart-config';
import { WaterfallD3Chart } from './../../../model/waterfall-d3-chart.model';
import {
  Component, Input, ViewChild, ViewEncapsulation, ElementRef, HostListener, OnInit, OnDestroy, OnChanges
} from '@angular/core';
import { WaterfallData, WaterfallBar, ClaimsJSONInput, DemographicSummaryJSONInput, ChartUpdateParameters } from './../../../model/waterfallData';
import { MinimizeService } from '../../../services/minimize.service';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { Selector } from '../../../model/utils/selector.model';


@Component({
  selector: 'app-waterfall-chart',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './waterfall-chart.component.html',
  styleUrls: ['./waterfall-chart.component.scss']
})
export class WaterfallChartComponent implements OnInit, OnDestroy, OnChanges {

  // temp
  private static stackColor = {
    Base: '#FFFFFF',
    Fall: '#FFA500',
    Rise: '#0000FF'
  };


  private static conditionGroupTranslation = {
    'PREVYEAR': '2015',
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
    'CURRYEAR': '2016'
  };

  private static UKConditionGroupKeys = Object.keys(WaterfallChartComponent.conditionGroupTranslation).filter(d => ['CURRYEAR', 'PREVYEAR'].indexOf(d) === -1);


  sortingForm: FormGroup;

  @Input() private benchmarkClaimsJSON: ClaimsJSONInput[];
  @Input() private benchmakrTotalMemberCount: DemographicSummaryJSONInput[];

  @Input() private proposalClaimsJSON: ClaimsJSONInput[];
  @Input() private proposalTotalMemberCount: DemographicSummaryJSONInput[];



  // for tooltip
  @ViewChild('waterfallContainer') private waterfallContainer: ElementRef;

  // for svg container
  @ViewChild('proposalWaterfall') private proposalWaterfall: ElementRef;
  @ViewChild('benchmarkWaterfall') private benchmarkWaterfall: ElementRef;



  private benchmarkClaim: WaterfallData;
  private benchmarkConditionGroupData: WaterfallBar[];
  private benchmarkGraphData: any[];

  private proposalClaim: WaterfallData;
  private proposalConditionGroupData: WaterfallBar[];
  private proposalGraphData: any[];


  private benchmarkD3Chart: WaterfallD3Chart;
  private proposalD3Chart: WaterfallD3Chart;


  private margin: any = { top: 60, right: 20, bottom: 80, left: 50 };


  // UK
  private regionSelector: Selector;
  private relationSelector: Selector;
  private claimTypeSelector: Selector;
  private genderSelector: Selector;
  private ageGroupSelector: Selector;

  dropdownStatus = {
    regionDropdown: false,
    relationDropdown: false,
    claimTypeDropdown: false,
    genderDropdown: false,
    ageGroupDropdown: false
  };



  zoom = false;


  private xDomainDisplay = Object.keys(WaterfallChartComponent.conditionGroupTranslation).map(key => WaterfallChartComponent.conditionGroupTranslation[key]);



  // UK
  private allRegionCombined: string[];
  private allRelationCombined: string[];
  private allGenderComined: string[];
  private allAgeGroupCombined: string[];
  private allClaimTypeCombined: string[];

  constructor(private formBuilder: FormBuilder, private minimizeService: MinimizeService) { }




  ngOnInit() {

    // console.log(this.xDomainDisplay);

    // console.log(Object.keys(WaterfallChartComponent.conditionGroupTranslation).filter(d => ['CURRYEAR', 'PREVYEAR'].indexOf(d) === -1));

    console.log('waterfall init');
    this.sortingForm = this.formBuilder.group({ sorting: 'Default' });
    this.zoom = false;
    this.onSortingFormChanges();


    this.minimizeService.events$.forEach(event => {
      setTimeout(() => {
        console.log('trigger');
        this.updateChart_benchmark();
        if (this.proposalClaimsJSON) {
          this.updateChart_proposal();
        }
      }, 400);
    })

  }

  ngOnChanges() {
    console.log('waterfall on changes!');

    if (!this.benchmarkD3Chart) {
      this.createChartData();
      this.createChart_benchmark();
      this.updateChart_benchmark();

      if (this.proposalClaimsJSON) {
        this.createChart_proposal();
        this.updateChart_proposal();
      }

      this.createSelector();

      // console.log(this.proposalClaim.getGraphData()[0].map(val => (val.data.key)));
    }
  }

  createChartData() {

    this.benchmarkClaim = new WaterfallData(this.benchmarkClaimsJSON, this.benchmakrTotalMemberCount);
    this.benchmarkConditionGroupData = this.benchmarkClaim.getConditionGroupDataCombined();
    this.benchmarkGraphData = this.benchmarkClaim.getGraphData();

    if (this.proposalClaimsJSON) {
      this.proposalClaim = new WaterfallData(this.proposalClaimsJSON, this.proposalTotalMemberCount);
      this.proposalConditionGroupData = this.proposalClaim.getConditionGroupDataCombined();
      this.proposalGraphData = this.proposalClaim.getGraphData();


      // UK
      const allRegionCombinedSet = new Set([...this.proposalClaim.getAllRegion(), ...this.benchmarkClaim.getAllRegion()]);
      const allRelationCombinedSet = new Set([...this.proposalClaim.getAllRelation(), ...this.benchmarkClaim.getAllRelation()]);
      const allAgeGroupCombinedSet = new Set([...this.proposalClaim.getAllAgeGroup(), ...this.benchmarkClaim.getAllAgeGroup()]);
      const allGenderCombinedSet = new Set([...this.proposalClaim.getAllGender(), ...this.benchmarkClaim.getAllGender()]);
      const allClaimTypeCombinedSet = new Set([...this.proposalClaim.getClaimType(), ...this.benchmarkClaim.getClaimType()]);


      // const

      this.allRegionCombined = Array.from(allRegionCombinedSet).sort();
      this.allRelationCombined = Array.from(allRelationCombinedSet).sort();
      this.allAgeGroupCombined = Array.from(allAgeGroupCombinedSet).sort();
      this.allGenderComined = Array.from(allGenderCombinedSet).sort();
      this.allClaimTypeCombined = Array.from(allClaimTypeCombinedSet).sort();


    } else {
      this.allRegionCombined = this.benchmarkClaim.getAllRegion().sort();
      this.allRelationCombined = this.benchmarkClaim.getAllRelation().sort();
      this.allAgeGroupCombined = this.benchmarkClaim.getAllAgeGroup().sort();
      this.allGenderComined = this.benchmarkClaim.getAllGender().sort();
      this.allClaimTypeCombined = this.benchmarkClaim.getAllGender().sort();

    }



  }


  createChart_benchmark() {
    const config: WaterfallChartConfig = {
      title: 'benchmark Cost Per Capita',
      margin: this.margin,
      chartContainer: this.benchmarkWaterfall,
      domID: '#' + this.benchmarkWaterfall.nativeElement.id,
      xScaleDomain: this.xDomainDisplay,
      yScaleDomain: (this.zoom === false) ? [0, this.benchmarkClaim.getGraphMaxValue()] : [this.benchmarkClaim.getWaterfallMinBaseValue(), this.benchmarkClaim.getGraphMaxValue()],
      conditionGroupTranslation: WaterfallChartComponent.conditionGroupTranslation
    }

    this.benchmarkD3Chart = new WaterfallD3Chart(config);
  }


  createChart_proposal() {
    const config: WaterfallChartConfig = {
      title: 'proposal Cost Per Capita',
      margin: this.margin,
      chartContainer: this.proposalWaterfall,
      domID: '#' + this.proposalWaterfall.nativeElement.id,
      xScaleDomain: this.xDomainDisplay,
      yScaleDomain: (this.zoom === false) ? [0, this.proposalClaim.getGraphMaxValue()] : [this.proposalClaim.getWaterfallMinBaseValue(), this.proposalClaim.getGraphMaxValue()],
      conditionGroupTranslation: WaterfallChartComponent.conditionGroupTranslation
    }
    this.proposalD3Chart = new WaterfallD3Chart(config);
  }

  updateChart_benchmark() {
    const config: WaterfallChartConfig = {
      chartContainer: this.benchmarkWaterfall,
      domID: '#' + this.benchmarkWaterfall.nativeElement.id,
      tooltipDomID: '#' + 'waterfallTooltip',
      xScaleDomain: this.benchmarkClaim.getGraphData()[0].map(val => (val.data.key)).map(key => WaterfallChartComponent.conditionGroupTranslation[key]),
      yScaleDomain: (this.zoom === false) ? [0, this.benchmarkClaim.getGraphMaxValue()] : [this.benchmarkClaim.getWaterfallMinBaseValue(), this.benchmarkClaim.getGraphMaxValue()],
      stackColor: WaterfallChartComponent.stackColor,
      zoom: this.zoom,
      barData: this.benchmarkGraphData,
      previousYearKey: '2015',
      currentYearKey: '2016',
      toolTipParent: this.waterfallContainer,
      conditionGroupTranslation: WaterfallChartComponent.conditionGroupTranslation
    }

    this.benchmarkD3Chart.updateChart(config);
  }

  updateChart_proposal() {
    const config: WaterfallChartConfig = {
      chartContainer: this.proposalWaterfall,
      domID: '#' + this.proposalWaterfall.nativeElement.id,
      tooltipDomID: '#' + 'waterfallTooltip',
      xScaleDomain: this.proposalClaim.getGraphData()[0].map(val => (val.data.key)).map(key => WaterfallChartComponent.conditionGroupTranslation[key]),
      yScaleDomain: (this.zoom === false) ? [0, this.proposalClaim.getGraphMaxValue()] : [this.proposalClaim.getWaterfallMinBaseValue(), this.proposalClaim.getGraphMaxValue()],
      stackColor: WaterfallChartComponent.stackColor,
      zoom: this.zoom,
      barData: this.proposalGraphData,
      previousYearKey: '2015',
      currentYearKey: '2016',
      toolTipParent: this.waterfallContainer,
      conditionGroupTranslation: WaterfallChartComponent.conditionGroupTranslation

    }

    // this.proposalClaim.getGraphData()[0].map(val => (val.data.key))

    this.proposalD3Chart.updateChart(config);

  }


  ngOnDestroy() {

    // this.resizeDetector.removeAllListeners(this.benchmarkWaterfall.nativeElement);
    // this.resizeDetector.removeAllListeners(this.proposalWaterfall.nativeElement);

    console.log('waterfall is destroyed!');
  }




  onSortingFormChanges() {
    this.sortingForm.get('sorting').valueChanges.subscribe(val => {
      console.log(val);
      if (this.proposalClaimsJSON) {
        this.proposalClaim.sortConditionGroupData(val, Object.keys(WaterfallChartComponent.conditionGroupTranslation));
        this.proposalGraphData = this.proposalClaim.getGraphData();
        this.updateChart_proposal();
      }

      this.benchmarkClaim.sortConditionGroupData(val, Object.keys(WaterfallChartComponent.conditionGroupTranslation));
      this.benchmarkGraphData = this.benchmarkClaim.getGraphData();
      this.updateChart_benchmark();

    });
  }



  toggleSwitch() {
    if (this.proposalClaimsJSON) {
      this.updateChart_proposal();
    }
    this.updateChart_benchmark();
  }

  toggleDropdown(value: boolean, dropdownID: string) {
    this.dropdownStatus[dropdownID] = value;
  }



  createSelector() {
    this.regionSelector = new Selector(this.allRegionCombined);
    this.relationSelector = new Selector(this.allRelationCombined);
    this.genderSelector = new Selector(this.allGenderComined);
    this.ageGroupSelector = new Selector(this.allAgeGroupCombined);
    this.claimTypeSelector = new Selector(this.allClaimTypeCombined);

  }

  // NEW solution
  onClickedOutside(e: Event, dropdownID: string) {
    this.dropdownStatus[dropdownID] = false;
  }


  toggleMultiSelectAll(dropdownID: string) {
    switch (dropdownID) {
      case 'regionDropdown': {
        for (const item of this.regionSelector.selectionItems) {
          item.checked = this.regionSelector.all;
        }
        break;
      }
      case 'relationDropdown': {
        for (const item of this.relationSelector.selectionItems) {
          item.checked = this.relationSelector.all;
        }
        break;
      }
      case 'claimTypeDropdown': {
        for (const item of this.claimTypeSelector.selectionItems) {
          item.checked = this.claimTypeSelector.all;
        }
        break;
      }

      case 'ageGroupDropdown': {
        for (const item of this.ageGroupSelector.selectionItems) {
          item.checked = this.ageGroupSelector.all;
        }
        break;
      }

      case 'genderDropdown': {
        for (const item of this.genderSelector.selectionItems) {
          item.checked = this.genderSelector.all;
        }
        break;
      }
      default: {

        break;
      }
    }


    const params: ChartUpdateParameters = {
      sortingMethod: this.sortingForm.controls['sorting'].value,
      region: this.regionSelector.getCurrentSelction(),
      relation: this.relationSelector.getCurrentSelction(),
      claimType: this.claimTypeSelector.getCurrentSelction(),
      ageGroup: this.ageGroupSelector.getCurrentSelction(),
      gender: this.genderSelector.getCurrentSelction(),
      conditionGroupKey: WaterfallChartComponent.UKConditionGroupKeys
    }



    // update chart data
    // this.updateChartData(this.regionSelector.getCurrentSelction());

    this.updateChartData(params);

    // update chart
    this.updateChart_benchmark();
    if (this.proposalClaimsJSON) {
      this.updateChart_proposal();
    }

  }


  checkIfAllElementSelected(dropdownID: string) {
    switch (dropdownID) {
      case 'regionDropdown': {
        if (this.regionSelector.checkIfAllChecked()) {
          this.regionSelector.all = true;
        } else {
          this.regionSelector.all = false;
        }
        break;
      }
      case 'relationDropdown': {
        if (this.relationSelector.checkIfAllChecked()) {
          this.relationSelector.all = true;
        } else {
          this.relationSelector.all = false;
        }
        break;
      }
      case 'claimTypeDropdown': {
        if (this.claimTypeSelector.checkIfAllChecked()) {
          this.claimTypeSelector.all = true;
        } else {
          this.claimTypeSelector.all = false;
        }
        break;
      }
      case 'ageGroupDropdown': {
        if (this.ageGroupSelector.checkIfAllChecked()) {
          this.ageGroupSelector.all = true;
        } else {
          this.ageGroupSelector.all = false;
        }
        break;
      }

      case 'genderDropdown': {
        if (this.genderSelector.checkIfAllChecked()) {
          this.genderSelector.all = true;
        } else {
          this.genderSelector.all = false;
        }
        break;
      }
      default: {

        break;
      }
    }


    // reset sort button to default
    // this.sortingForm.controls['sorting'].setValue('Default');

    const params: ChartUpdateParameters = {
      sortingMethod: this.sortingForm.controls['sorting'].value,
      region: this.regionSelector.getCurrentSelction(),
      relation: this.relationSelector.getCurrentSelction(),
      claimType: this.claimTypeSelector.getCurrentSelction(),
      ageGroup: this.ageGroupSelector.getCurrentSelction(),
      gender: this.genderSelector.getCurrentSelction(),
      conditionGroupKey: WaterfallChartComponent.UKConditionGroupKeys
    }



    // update chart data
    this.updateChartData(params);


    // update chart
    this.updateChart_benchmark();
    if (this.proposalClaimsJSON) {
      this.updateChart_proposal();
    }

  }







  updateChartData(params: ChartUpdateParameters) {
    this.benchmarkClaim.updateGraphData(params);
    this.benchmarkConditionGroupData = this.benchmarkClaim.getConditionGroupDataCombined();
    this.benchmarkGraphData = this.benchmarkClaim.getGraphData();

    if (this.proposalClaimsJSON) {
      this.proposalClaim.updateGraphData(params);
      this.proposalConditionGroupData = this.proposalClaim.getConditionGroupDataCombined();
      this.proposalGraphData = this.proposalClaim.getGraphData();
    }
  }



}
