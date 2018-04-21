import * as crossfilter from 'crossfilter';
import * as d3 from 'd3';
import { Selector } from '../utils/selector.model';

export class WaterfallData {

  private conditionGroup: string[];

  private ndx: crossfilter.Crossfilter<any>;


  private conditionGroupingDimension: crossfilter.Dimension<any, any>;
  private conditionGroupingDimensionGroup: crossfilter.Group<any, any, any>;



  // output
  private claimsAggregateData: ClaimsAggregateData[];
  private claimsAggregateDataTotal: ClaimsAggregateData;

  private conditionGroupData: WaterfallBar[];
  private conditionGroupPrevYearData: WaterfallBar;
  private conditionGroupCurrYearData: WaterfallBar;

  private conditionGroupDataCombined: any[];
  private graphData: any[];




  private selectorValues: SelectorValue[];
  private dimensions: Dimension[];

  private currYearMemberCount: number;
  private prevYearMemberCount: number;

  // claimData: any[], totalMemberCount: any, ConditionGroup: string[]

  constructor(claimJsonData: any[], totalMemberCount: any, conditoinGroups: string[], selectorNames: string[], type: string) {
    this.conditionGroup = conditoinGroups;
    this.currYearMemberCount = totalMemberCount.currentYear;
    this.prevYearMemberCount = totalMemberCount.previousYear;

    // todo
    if (this.prevYearMemberCount === 0) {
      this.prevYearMemberCount = this.currYearMemberCount;
    }

    this.createDimensionGroup(claimJsonData, selectorNames);
    this.updateData(conditoinGroups);
    this.createWaterfallData('default', type);
  }



  private createDimensionGroup(claimJsonData: any[], selectorNames: string[]) {
    claimJsonData.forEach(element => {
      // proposal issue
      if (element.conditionGrouping === 'CONDITION_GROUPING_ MENTAL_DISORDERS') {
        element.conditionGrouping = 'CONDITION_GROUPING_MENTAL_DISORDERS';
      }
      if (element.conditionGrouping === 'CONDITION_GROUPING_ NEOPLASMS') {
        element.conditionGrouping = 'CONDITION_GROUPING_NEOPLASMS';
      }
      if (element.conditionGrouping === 'CONDITION_GROUPING_ SS_&_IDC') {
        element.conditionGrouping = 'CONDITION_GROUPING_SS_&_IDC';
      }
      if (element.relation === 'RELATION_TYPE_EMPLOYEE') {
        element.relation = 'RELATION_EMPLOYEE';
      }
      if (element.relation === 'RELATION_TYPE_DEPENDANT') {
        element.relation = 'RELATION_DEPENDANT';
      }
      if (element.region === 'REGION_CENTTRAL_LONDON') {
        element.region = 'REGION_CENTRAL_LONDON';
      }
      // benchmark issue
      if (element.conditionGrouping === 'CONDITION_SS_&_IDC') {
        element.conditionGrouping = 'CONDITION_GROUPING_SS_&_IDC';
      }
    });

    // create crossfilter object
    this.ndx = crossfilter(claimJsonData);

    // create dimension, get unique selector values
    this.dimensions = [];
    this.selectorValues = [];
    for (const item of selectorNames) {
      const currDimension: Dimension = {
        dimensionName: item,
        dimension: this.ndx.dimension((d) => d[item])
      };
      this.dimensions.push(currDimension);

      const selector: SelectorValue = {
        selectorName: item,
        selectorValues: currDimension.dimension.group().reduceCount().all().map(d => d.key)
      };
      this.selectorValues.push(selector);
    }


    this.conditionGroupingDimension = this.ndx.dimension((d) => d.conditionGrouping);
    this.conditionGroupingDimensionGroup = this.conditionGroupingDimension.group();
  }


  updateData(conditionGroup: string[], selectors?: Selector[]) {

    // apply filters
    if (selectors) {
      for (const selector of selectors) {
        this.getDimensionByName(selector.getSelectorName()).filter((d) => selector.getCurrentSelction().indexOf(d.toString()) !== -1);
      }
    } else {
      for (const item of this.dimensions) {
        item.dimension.filterAll();
      }
    }

    this.claimsAggregateData = [];
    const aggregateData = this.conditionGroupingDimensionGroup.reduce(this.reduceAdd, this.reduceRemove, this.reduceInit).all();

    // aggregation
    for (const item of aggregateData) {
      const temp: ClaimsAggregateData = {
        key: item.key,
        currYearClaimCount: item.value.currYearClaimCount_sum,
        currYeartotalClaimCostAmount: item.value.currYeartotalClaimCostAmount_sum,
        currYearClaimFrequency: item.value.currYearClaimCount_sum / this.currYearMemberCount,
        currYearPerCapitalClaimCost: item.value.currYeartotalClaimCostAmount_sum / this.currYearMemberCount,
        currYearAvgClaimCost: item.value.currYeartotalClaimCostAmount_sum / item.value.currYearClaimCount_sum,

        prevYearClaimCount: item.value.prevYearClaimCount_sum,
        prevYeartotalClaimCostAmount: item.value.prevYeartotalClaimCostAmount_sum,
        prevYearClaimFrequency: item.value.prevYearClaimCount_sum / this.prevYearMemberCount,
        prevYearPerCapitalClaimCost: item.value.prevYeartotalClaimCostAmount_sum / this.prevYearMemberCount,
        prevYearAvgClaimCost: item.value.prevYeartotalClaimCostAmount_sum / item.value.prevYearClaimCount_sum
      };

      this.claimsAggregateData.push(temp);
    }

    // this.claimsAggregateData.forEach(element => {
    //   console.log(element);
    // });


    const total = this.claimsAggregateData.reduce((accumulator, currVal) => {
      return {
        key: 'TOTAL',
        currYearClaimCount: accumulator.currYearClaimCount + currVal.currYearClaimCount,
        currYeartotalClaimCostAmount: accumulator.currYeartotalClaimCostAmount + currVal.currYeartotalClaimCostAmount,
        currYearClaimFrequency: currVal.currYearClaimFrequency + 0,
        currYearPerCapitalClaimCost: currVal.currYearPerCapitalClaimCost + 0,
        currYearAvgClaimCost: currVal.currYearAvgClaimCost + 0,

        prevYearClaimCount: accumulator.prevYearClaimCount + currVal.prevYearClaimCount,
        prevYeartotalClaimCostAmount: accumulator.prevYeartotalClaimCostAmount + currVal.prevYeartotalClaimCostAmount,
        prevYearClaimFrequency: accumulator.prevYearClaimFrequency + 0,
        prevYearPerCapitalClaimCost: accumulator.prevYearPerCapitalClaimCost + 0,
        prevYearAvgClaimCost: accumulator.prevYearAvgClaimCost + 0
      };
    }, {
        key: 'TOTAL',
        currYearClaimCount: 0,
        currYeartotalClaimCostAmount: 0,
        currYearClaimFrequency: 0,
        currYearPerCapitalClaimCost: 0,
        currYearAvgClaimCost: 0,

        prevYearClaimCount: 0,
        prevYeartotalClaimCostAmount: 0,
        prevYearClaimFrequency: 0,
        prevYearPerCapitalClaimCost: 0,
        prevYearAvgClaimCost: 0
      });

    total.currYearClaimFrequency = total.currYearClaimCount / this.currYearMemberCount;
    total.prevYearClaimFrequency = total.prevYearClaimCount / this.prevYearMemberCount;

    total.currYearPerCapitalClaimCost = total.currYeartotalClaimCostAmount / this.currYearMemberCount;
    total.prevYearPerCapitalClaimCost = total.prevYeartotalClaimCostAmount / this.prevYearMemberCount;

    total.currYearAvgClaimCost = total.currYeartotalClaimCostAmount / total.currYearClaimCount;
    total.prevYearAvgClaimCost = total.prevYeartotalClaimCostAmount / total.prevYearClaimCount;

    this.claimsAggregateDataTotal = total;
  }


  createWaterfallData(sorting: string, type: string) {
    // frequency  vs percapita
    this.conditionGroupPrevYearData = {
      key: 'PREVYEAR',
      Base: 0,
      Fall: 0,
      Rise: type === 'percapita' ? this.claimsAggregateDataTotal.prevYearPerCapitalClaimCost : this.claimsAggregateDataTotal.prevYearClaimFrequency,
      value: type === 'percapita' ? this.claimsAggregateDataTotal.prevYearPerCapitalClaimCost : this.claimsAggregateDataTotal.prevYearClaimFrequency
    };

    this.conditionGroupCurrYearData = {
      key: 'CURRYEAR',
      Base: 0,
      Fall: 0,
      Rise: type === 'percapita' ? this.claimsAggregateDataTotal.currYearPerCapitalClaimCost : this.claimsAggregateDataTotal.currYearClaimFrequency,
      value: type === 'percapita' ? this.claimsAggregateDataTotal.currYearPerCapitalClaimCost : this.claimsAggregateDataTotal.currYearClaimFrequency,
    };

    this.conditionGroupData = [];


    // conditionGroup keys
    this.conditionGroup.forEach(element => {
      const item = this.claimsAggregateData.find((val) => val.key === element);

      if (item === undefined) {
        this.conditionGroupData.push({
          key: element,
          Base: 0,
          Fall: 0,
          Rise: 0,
          value: 0
        });
      } else {
        this.conditionGroupData.push({
          key: element,
          Base: 0,
          Fall: 0,
          Rise: 0,
          value: type === 'percapita' ? (item.currYearPerCapitalClaimCost - item.prevYearPerCapitalClaimCost) : (item.currYearClaimFrequency - item.prevYearClaimFrequency)
        });
      }

    });


    this.sortConditionGroupData(sorting, this.conditionGroup);

    this.calculateWaterfallBaseFallRise();
    // graph data is ready
  }


  sortConditionGroupData(sorting: string, conditionGroup: string[]) {
    switch (sorting) {
      case 'Asc':
        this.conditionGroupData.sort((a, b) => a.value - b.value);
        console.log('Sorting Ascs');
        this.calculateWaterfallBaseFallRise();
        // recalculate graph data
        this.conditionGroupDataCombined = (new Array(this.conditionGroupPrevYearData)).concat(this.conditionGroupData).concat(this.conditionGroupCurrYearData);
        this.graphData = d3.stack().keys(['Base', 'Fall', 'Rise'])(this.conditionGroupDataCombined);
        break;
      case 'Desc':
        this.conditionGroupData.sort((a, b) => b.value - a.value);
        this.calculateWaterfallBaseFallRise();
        this.conditionGroupDataCombined = (new Array(this.conditionGroupPrevYearData)).concat(this.conditionGroupData).concat(this.conditionGroupCurrYearData);
        this.graphData = d3.stack().keys(['Base', 'Fall', 'Rise'])(this.conditionGroupDataCombined);
        break;
      default:
        this.conditionGroupData.sort((a, b) =>
          conditionGroup.indexOf(a.key) > conditionGroup.indexOf(b.key) ? 1 : -1);
        this.calculateWaterfallBaseFallRise();
        this.conditionGroupDataCombined = (new Array(this.conditionGroupPrevYearData)).concat(this.conditionGroupData).concat(this.conditionGroupCurrYearData);
        this.graphData = d3.stack().keys(['Base', 'Fall', 'Rise'])(this.conditionGroupDataCombined);
    }
  }

  calculateWaterfallBaseFallRise() {
    let prev = this.conditionGroupPrevYearData;
    this.conditionGroupData.forEach(element => {
      element.Fall = element.value <= 0 ? -element.value : 0;
      element.Rise = element.value > 0 ? element.value : 0;
      element.Base = prev.Base + prev.Rise - element.Fall;
      prev = element;
    });
  }

  getGraphData(): any[] {
    return this.graphData;
  }

  getWaterfallMinBaseValue(): number {
    const min = this.conditionGroupData.reduce((accumulator, curr) => curr.Base < accumulator.Base ? curr : accumulator);
    return min.Base;
  }

  getSelectorValuesByName(selectorName: string): string[] {
    return this.selectorValues.find(item => item.selectorName === selectorName).selectorValues;
  }


  // getAggregate
  getClaimsAggregateData(): ClaimsAggregateData[] {
    return this.claimsAggregateData;
  }

  // getAggregate Total
  getClaimsAggregateDataTotal(): ClaimsAggregateData {
    return this.claimsAggregateDataTotal;
  }

  getWaterfallConditionGroupData(): WaterfallBar[] {
    return this.conditionGroupData;
  }

  getConditionGroupDataCombined(): any[] {
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



  private getDimensionByName(selectorName: string): crossfilter.Dimension<any, any> {
    return this.dimensions.find(item => item.dimensionName === selectorName);
  }


  private reduceAdd = (p, v) => {

    p.currYearClaimCount_sum += v.currYearClaimCount;
    p.prevYearClaimCount_sum += v.prevYearClaimCount;

    p.currYeartotalClaimCostAmount_sum += v.currYearTotalClaimCostAmount;
    p.prevYeartotalClaimCostAmount_sum += v.prevYearTotalClaimCostAmount;

    return p;
  }

  private reduceRemove = (p, v) => {
    p.currYearClaimCount_sum -= v.currYearClaimCount;
    p.prevYearClaimCount_sum -= v.prevYearClaimCount;

    p.currYeartotalClaimCostAmount_sum -= v.currYeartotalClaimCostAmount;
    p.prevYeartotalClaimCostAmount_sum -= v.prevYearTotalClaimCostAmount;
    return p;
  }

  private reduceInit = () => {
    return {
      currYearClaimCount_sum: 0,
      prevYearClaimCount_sum: 0,
      currYeartotalClaimCostAmount_sum: 0,
      prevYeartotalClaimCostAmount_sum: 0
    };
  }

}

export interface SelectorValue {
  selectorName: string;
  selectorValues: string[];
}

export interface Dimension {
  dimensionName: string;
  dimension: crossfilter.Dimension<any, any>;
}

export interface WaterfallBar {
  Base: number;
  Fall: number;
  Rise: number;
  value: number;
  key: string;
}


export interface JSONInput {
  ageGroup: string;
  region: string;
  relation: string;
  claimType: string;
  conditionGrouping: string;
  gender: string;
  planClassKey: string;
  industryKey: string;
  operatorTypeKey: string;
  currYearClaimCount: number;
  currYearTotalClaimCostAmount: number;
  prevYearClaimCount: number;
  prevYearTotalClaimCostAmount: number;
}


export interface ClaimsAggregateData {
  key: string;

  currYearClaimCount: number;
  currYeartotalClaimCostAmount: number;
  currYearClaimFrequency: number;
  currYearPerCapitalClaimCost: number;
  currYearAvgClaimCost: number;

  prevYearClaimCount: number;
  prevYeartotalClaimCostAmount: number;
  prevYearClaimFrequency: number;
  prevYearPerCapitalClaimCost: number;
  prevYearAvgClaimCost: number;

}

