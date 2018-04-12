import * as crossfilter from 'crossfilter2';
import { ClaimDataService } from './../services/claims.service';
import * as d3 from 'd3';


export class WaterfallData {

  // delete later
  static UK_ConditionGrouping = [
    'CONDITION_GROUPING_CIRCULATORY',
    'CONDITION_GROUPING_DIGESTIVE',
    'CONDITION_GROUPING_INJURY_&_ACCIDENT',
    'CONDITION_GROUPING_MENTAL_DISORDERS',
    'CONDITION_GROUPING_MUSCULOSKELETAL',
    'CONDITION_GROUPING_NEOPLASMS',
    'CONDITION_GROUPING_PREGNANCY',
    'CONDITION_GROUPING_RESPIRATORY',
    'CONDITION_GROUPING_SS_&_IDC',
    'CONDITION_GROUPING_OTHER',
  ];




  private conditionGroup: string[];


  private ndx: crossfilter.Crossfilter<ClaimsJSONInput>;
  // dimensions
  private relationDimension: crossfilter.Dimension<any, any>;
  private regionDimension: crossfilter.Dimension<any, any>;
  private genderDimension: crossfilter.Dimension<any, any>;
  private ageGroupDimension: crossfilter.Dimension<any, any>;
  private claimTypeDimension: crossfilter.Dimension<any, any>;
  private conditionGroupingDimension: crossfilter.Dimension<any, any>;

  // groups

  private conditionGroupingDimensionGroup: crossfilter.Group<any, any, any>;

  // output
  private claimsAggregateData: any[];
  private claimsAggregateDataTotal: any;

  private conditionGroupData: WaterfallBar[];
  private conditionGroupPrevYearData: WaterfallBar;
  private conditionGroupCurrYearData: WaterfallBar;

  private conditionGroupDataCombined: any[];
  private graphData: any[];



  // selctor
  private allRegion: string[];
  private allRelation: string[];
  private allClaimStatus: string[];
  private allPlanClass: string[];
  private allClaimType: string[];
  private allIndustry: string[];
  private allOperatorType: string[];
  private allGender: string[];
  private allAgeGroup: string[];

  private currYearMemberCount: number;
  private prevYearMemberCount: number;

  constructor(claimData: ClaimsJSONInput[], totalMemberCount: DemographicSummaryJSONInput[], ConditionGroup?: string) {

    this.conditionGroupData = [];
    this.conditionGroupDataCombined = [];

    this.createDimensionGroup(claimData);
    this.createGraphData(totalMemberCount);
  }


  createDimensionGroup(data: ClaimsJSONInput[]) {
    this.ndx = crossfilter(data);
    this.regionDimension = this.ndx.dimension((d) => d.region);
    this.relationDimension = this.ndx.dimension((d) => d.relation);
    this.genderDimension = this.ndx.dimension((d) => d.gender);
    this.claimTypeDimension = this.ndx.dimension((d) => d.claimType);
    this.ageGroupDimension = this.ndx.dimension((d) => d.ageGroup);
    this.conditionGroupingDimension = this.ndx.dimension((d) => d.conditionGrouping);

    this.conditionGroupingDimensionGroup = this.conditionGroupingDimension.group();

    // get uniuqe groups values  this.conditionGroupingDimensionGroup.reduceCount().all()
    // across all countries

    this.allRegion = data.map(item => item.region).filter((value, index, self) => self.indexOf(value) === index);
    this.allRelation = data.map(item => item.relation).filter((value, index, self) => self.indexOf(value) === index);

  }


  createGraphData(totalMemberCount: DemographicSummaryJSONInput[]) {
    // aggregate data by condition_group
    this.claimsAggregateData = this.conditionGroupingDimensionGroup.reduce(this.reduceAdd, this.reduceRemove, this.reduceInit).all();

    this.currYearMemberCount = totalMemberCount.filter((d) => d.year === 'currentYear')[0].memberCount;
    this.prevYearMemberCount = totalMemberCount.filter((d) => d.year === 'previousYear')[0].memberCount;

    for (const element of this.claimsAggregateData) {
      element.currYearClaimFrequency = element.value.currYearClaimCount_sum / this.currYearMemberCount;
      element.prevYearClaimFrequency = element.value.prevYearClaimCount_sum / this.prevYearMemberCount;

      element.currYearPerCapitalClaimCost = element.value.currYeartotalClaimCostAmount_sum / this.currYearMemberCount;
      element.prevYearPerCapitalClaimCost = element.value.prevYeartotalClaimCostAmount_sum / this.prevYearMemberCount;

      element.currYearAvgClaimCost = element.value.currYeartotalClaimCostAmount_sum / element.value.currYearClaimCount_sum;
      element.prevYearAvgClaimCost = element.value.prevYeartotalClaimCostAmount_sum / element.value.prevYearClaimCount_sum;
    }

    // adding TOTAL value
    this.claimsAggregateDataTotal = this.claimsAggregateData.reduce((accumulator, currVal) => {
      return {
        key: 'TOTAL',
        value: {
          currYearClaimCount_sum: accumulator.value.currYearClaimCount_sum + currVal.value.currYearClaimCount_sum,
          currYeartotalClaimCostAmount_sum: accumulator.value.currYeartotalClaimCostAmount_sum + currVal.value.currYeartotalClaimCostAmount_sum,
          prevYearClaimCount_sum: accumulator.value.prevYearClaimCount_sum + currVal.value.prevYearClaimCount_sum,
          prevYeartotalClaimCostAmount_sum: accumulator.value.prevYeartotalClaimCostAmount_sum + currVal.value.prevYeartotalClaimCostAmount_sum
        }
      };
    }, {
        key: 'TOTAL',
        value: {
          currYearClaimCount_sum: 0,
          currYeartotalClaimCostAmount_sum: 0,
          prevYearClaimCount_sum: 0,
          prevYeartotalClaimCostAmount_sum: 0
        }
      });

    this.claimsAggregateDataTotal.currYearClaimFrequency = this.claimsAggregateDataTotal.value.currYearClaimCount_sum / this.currYearMemberCount;
    this.claimsAggregateDataTotal.prevYearClaimFrequency = this.claimsAggregateDataTotal.value.prevYearClaimCount_sum / this.prevYearMemberCount;

    this.claimsAggregateDataTotal.currYearPerCapitalClaimCost = this.claimsAggregateDataTotal.value.currYeartotalClaimCostAmount_sum / this.currYearMemberCount;
    this.claimsAggregateDataTotal.prevYearPerCapitalClaimCost = this.claimsAggregateDataTotal.value.prevYeartotalClaimCostAmount_sum / this.prevYearMemberCount;

    this.claimsAggregateDataTotal.currYearAvgClaimCost = this.claimsAggregateDataTotal.value.currYeartotalClaimCostAmount_sum / this.claimsAggregateDataTotal.value.currYearClaimCount_sum;
    this.claimsAggregateDataTotal.prevYearAvgClaimCost = this.claimsAggregateDataTotal.value.prevYeartotalClaimCostAmount_sum / this.claimsAggregateDataTotal.value.prevYearClaimCount_sum;


    // begin populate claimsWaterfallChartData
    this.conditionGroupPrevYearData = {
      key: 'PREVYEAR',
      Base: 0,
      Fall: 0,
      Rise: this.claimsAggregateDataTotal.prevYearPerCapitalClaimCost,
      Per_Capita: this.claimsAggregateDataTotal.prevYearPerCapitalClaimCost
    };

    this.conditionGroupCurrYearData = {
      key: 'CURRYEAR',
      Base: 0,
      Fall: 0,
      Rise: this.claimsAggregateDataTotal.currYearPerCapitalClaimCost,
      Per_Capita: this.claimsAggregateDataTotal.currYearPerCapitalClaimCost
    };


    // need to use passed value later
    WaterfallData.UK_ConditionGrouping.forEach(element => {
      const item = this.claimsAggregateData.filter((val) => val.key === element);
      this.conditionGroupData.push({
        key: element,
        Base: 0,
        Fall: 0,
        Rise: 0,
        Per_Capita: (item) ? (item[0].currYearPerCapitalClaimCost - item[0].prevYearPerCapitalClaimCost) : 0
      });
    });

    this.calculateWaterfallBaseFallRise();
    // create stackdata
    this.conditionGroupDataCombined = (new Array(this.conditionGroupPrevYearData)).concat(this.conditionGroupData).concat(this.conditionGroupCurrYearData);
    // order matters   prev -> groups -> curr
    this.graphData = d3.stack().keys(['Base', 'Fall', 'Rise'])(this.conditionGroupDataCombined);

  }

  updateGraphData(update?: ChartUpdateParameters) {
    // Apply filters
    if (update.region) {
      this.regionDimension.filter((d) => update.region.indexOf(d.toString()) !== -1);
    } else {
      this.regionDimension.filterAll();
    }

    if (update.relation) {
      this.relationDimension.filter((d) => update.relation.indexOf(d.toString()) !== -1);
    } else {
      this.relationDimension.filterAll();
    }

    if (update.gender) {
      this.genderDimension.filter((d) => update.gender.indexOf(d.toString()) !== -1);
    } else {
      this.genderDimension.filterAll();
    }

    if (update.claimType) {
      this.claimTypeDimension.filter((d) => update.claimType.indexOf(d.toString()) !== -1);
    } else {
      this.claimTypeDimension.filterAll();
    }

    if (update.ageGroup) {
      this.ageGroupDimension.filter((d) => update.ageGroup.indexOf(d.toString()) !== - 1);
    } else {
      this.ageGroupDimension.filterAll();
    }

    this.claimsAggregateData = this.conditionGroupingDimensionGroup.reduce(this.reduceAdd, this.reduceRemove, this.reduceInit).all();


    for (const element of this.claimsAggregateData) {
      element.currYearClaimFrequency = element.value.currYearClaimCount_sum / this.currYearMemberCount;
      element.prevYearClaimFrequency = element.value.prevYearClaimCount_sum / this.prevYearMemberCount;

      element.currYearPerCapitalClaimCost = element.value.currYeartotalClaimCostAmount_sum / this.currYearMemberCount;
      element.prevYearPerCapitalClaimCost = element.value.prevYeartotalClaimCostAmount_sum / this.prevYearMemberCount;

      element.currYearAvgClaimCost = element.value.currYeartotalClaimCostAmount_sum / element.value.currYearClaimCount_sum;
      element.prevYearAvgClaimCost = element.value.prevYeartotalClaimCostAmount_sum / element.value.prevYearClaimCount_sum;
    }




    // adding TOTAL value
    this.claimsAggregateDataTotal = this.claimsAggregateData.reduce((accumulator, currVal) => {
      return {
        key: 'TOTAL',
        value: {
          currYearClaimCount_sum: accumulator.value.currYearClaimCount_sum + currVal.value.currYearClaimCount_sum,
          currYeartotalClaimCostAmount_sum: accumulator.value.currYeartotalClaimCostAmount_sum + currVal.value.currYeartotalClaimCostAmount_sum,
          prevYearClaimCount_sum: accumulator.value.prevYearClaimCount_sum + currVal.value.prevYearClaimCount_sum,
          prevYeartotalClaimCostAmount_sum: accumulator.value.prevYeartotalClaimCostAmount_sum + currVal.value.prevYeartotalClaimCostAmount_sum
        }
      };
    }, {
        key: 'TOTAL',
        value: {
          currYearClaimCount_sum: 0,
          currYeartotalClaimCostAmount_sum: 0,
          prevYearClaimCount_sum: 0,
          prevYeartotalClaimCostAmount_sum: 0
        }
      });


    this.claimsAggregateDataTotal.currYearClaimFrequency = this.claimsAggregateDataTotal.value.currYearClaimCount_sum / this.currYearMemberCount;
    this.claimsAggregateDataTotal.prevYearClaimFrequency = this.claimsAggregateDataTotal.value.prevYearClaimCount_sum / this.prevYearMemberCount;

    this.claimsAggregateDataTotal.currYearPerCapitalClaimCost = this.claimsAggregateDataTotal.value.currYeartotalClaimCostAmount_sum / this.currYearMemberCount;
    this.claimsAggregateDataTotal.prevYearPerCapitalClaimCost = this.claimsAggregateDataTotal.value.prevYeartotalClaimCostAmount_sum / this.prevYearMemberCount;

    this.claimsAggregateDataTotal.currYearAvgClaimCost = this.claimsAggregateDataTotal.value.currYeartotalClaimCostAmount_sum / this.claimsAggregateDataTotal.value.currYearClaimCount_sum;
    this.claimsAggregateDataTotal.prevYearAvgClaimCost = this.claimsAggregateDataTotal.value.prevYeartotalClaimCostAmount_sum / this.claimsAggregateDataTotal.value.prevYearClaimCount_sum;


    // console.log(this.claimsAggregateDataTotal);


    // begin populate claimsWaterfallChartData
    this.conditionGroupPrevYearData = {
      key: 'PREVYEAR',
      Base: 0,
      Fall: 0,
      Rise: this.claimsAggregateDataTotal.prevYearPerCapitalClaimCost,
      Per_Capita: this.claimsAggregateDataTotal.prevYearPerCapitalClaimCost
    };

    this.conditionGroupCurrYearData = {
      key: 'CURRYEAR',
      Base: 0,
      Fall: 0,
      Rise: this.claimsAggregateDataTotal.currYearPerCapitalClaimCost,
      Per_Capita: this.claimsAggregateDataTotal.currYearPerCapitalClaimCost
    };


    this.conditionGroupData = [];


    // update.conditionGroupKey

    update.conditionGroupKey.forEach(element => {
      const item = this.claimsAggregateData.filter((val) => val.key === element);
      this.conditionGroupData.push({
        key: element,
        Base: 0,
        Fall: 0,
        Rise: 0,
        Per_Capita: (item) ? (item[0].currYearPerCapitalClaimCost - item[0].prevYearPerCapitalClaimCost) : 0
      });
    });

    // sorting here

    this.sortConditionGroupData(update.sortingMethod, update.conditionGroupKey);

    // calculate Fall Rise
    this.calculateWaterfallBaseFallRise();
    // create stackdata
    this.conditionGroupDataCombined = (new Array(this.conditionGroupPrevYearData)).concat(this.conditionGroupData).concat(this.conditionGroupCurrYearData);

    // order matters   prev -> groups -> curr
    this.graphData = d3.stack().keys(['Base', 'Fall', 'Rise'])(this.conditionGroupDataCombined);
  }



  calculateWaterfallBaseFallRise() {
    let prev = this.conditionGroupPrevYearData;

    this.conditionGroupData.forEach(element => {
      element.Fall = element.Per_Capita <= 0 ? -element.Per_Capita : 0;
      element.Rise = element.Per_Capita > 0 ? element.Per_Capita : 0;
      element.Base = prev.Base + prev.Rise - element.Fall;
      prev = element;
    });
  }

  private reduceAdd = (p, v) => {
    p.currYearClaimCount_sum += v.currYearClaimCount;
    p.currYeartotalClaimCostAmount_sum += v.currYeartotalClaimCostAmount;
    p.prevYearClaimCount_sum += v.prevYearClaimCount;
    p.prevYeartotalClaimCostAmount_sum += v.prevYeartotalClaimCostAmount;
    return p;
  }

  private reduceRemove = (p, v) => {
    p.currYearClaimCount_sum -= v.currYearClaimCount;
    p.currYeartotalClaimCostAmount_sum -= v.currYeartotalClaimCostAmount;
    p.prevYearClaimCount_sum -= v.prevYearClaimCount;
    p.prevYeartotalClaimCostAmount_sum -= v.prevYeartotalClaimCostAmount;
    return p;

  }

  private reduceInit = () => {
    return {
      currYearClaimCount_sum: 0, currYeartotalClaimCostAmount_sum: 0,
      prevYearClaimCount_sum: 0, prevYeartotalClaimCostAmount_sum: 0
    };
  }

  // getAggregate
  getClaimsAggregateData(): ClaimsAggregateDataOutput[] {
    return this.claimsAggregateData;
  }

  // getAggregate Total
  getClaimsAggregateDataTotal(): ClaimsAggregateDataOutput {
    return this.claimsAggregateDataTotal;
  }

  getWaterfallConditionGroupData(): WaterfallBar[] {
    return this.conditionGroupData;
  }



  sortConditionGroupData(sortingMethod: string, conditionGroupDefaultOrder?: string[]) {

    switch (sortingMethod) {
      case 'Asc':
        this.conditionGroupData.sort((a, b) => a.Per_Capita - b.Per_Capita);
        console.log('Sorting Ascs');
        this.calculateWaterfallBaseFallRise();
        // recalculate graph data
        this.conditionGroupDataCombined = (new Array(this.conditionGroupPrevYearData)).concat(this.conditionGroupData).concat(this.conditionGroupCurrYearData);
        this.graphData = d3.stack().keys(['Base', 'Fall', 'Rise'])(this.conditionGroupDataCombined);
        break;
      case 'Desc':
        this.conditionGroupData.sort((a, b) => b.Per_Capita - a.Per_Capita);
        this.calculateWaterfallBaseFallRise();
        this.conditionGroupDataCombined = (new Array(this.conditionGroupPrevYearData)).concat(this.conditionGroupData).concat(this.conditionGroupCurrYearData);
        this.graphData = d3.stack().keys(['Base', 'Fall', 'Rise'])(this.conditionGroupDataCombined);
        break;
      default:
        this.conditionGroupData.sort((a, b) =>
          conditionGroupDefaultOrder.indexOf(a.key) > conditionGroupDefaultOrder.indexOf(b.key) ? 1 : -1);
        this.calculateWaterfallBaseFallRise();
        this.conditionGroupDataCombined = (new Array(this.conditionGroupPrevYearData)).concat(this.conditionGroupData).concat(this.conditionGroupCurrYearData);
        this.graphData = d3.stack().keys(['Base', 'Fall', 'Rise'])(this.conditionGroupDataCombined);
    }
  }

  getWaterfallMinBaseValue(): number {
    const min = this.conditionGroupData.reduce((accumulator, curr) => curr.Base < accumulator.Base ? curr : accumulator);
    return min.Base;
  }

  getGraphData(): any[] {
    return this.graphData;
  }

  getConditionGroupDataCombined(): WaterfallBar[] {
    return this.conditionGroupDataCombined;
  }

  getGraphMaxValue(): number {
    const maxValue = this.graphData.reduce((accumulator, currVal) => {
      const temp = currVal.reduce((acc, curr) => {
        return curr[1] > acc ? curr[1] : acc;
      }, Number.NEGATIVE_INFINITY);
      return temp > accumulator ? temp : accumulator;
    }, Number.NEGATIVE_INFINITY);
    return maxValue;
  }


  getAllRegion(): string[] {
    return this.allRegion;
  }

}


export interface WaterfallBar {
  Base: number,
  Fall: number,
  Rise: number,
  Per_Capita: number,
  key: string
}




export interface ClaimsJSONInput {
  region: string,
  relation: string,
  claimType: string,
  conditionGrouping: string,
  ageGroup: string,
  gender: string,
  currYearClaimCount: number,
  currYeartotalClaimCostAmount: number,
  prevYearClaimCount: number,
  prevYeartotalClaimCostAmount: number
}



export interface DemographicSummaryJSONInput {
  year: string,
  memberCount: number,
}

export interface ClaimsAggregateDataOutput {
  key: string,
  value: {
    currYearClaimCount_sum: number,
    currYeartotalClaimCostAmount_sum: number,
    prevYearClaimCount_sum: number,
    prevYeartotalClaimCostAmount_sum: number
  },
  currYearClaimFrequency: number,
  prevYearClaimFrequency: number,
  currYearPerCapitalClaimCost: number,
  prevYearPerCapitalClaimCost: number,
  currYearAvgClaimCost: number,
  prevYearAvgClaimCost: number
}



// all countries
export interface ChartUpdateParameters {
  sortingMethod: string,
  conditionGroupKey?: string[],  // without PREV and CURR
  region?: string[],
  relation?: string[],
  gender?: string[],
  claimType?: string[],
  ageGroup?: string[]
}
