import * as crossfilter from 'crossfilter';
import { ClaimDataService } from './../services/claims.service';
import * as d3 from 'd3';


export class WaterfallData {

  private conditionGroup: string[];

  private ndx: crossfilter.Crossfilter<any>;
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

  constructor(claimData: any[], totalMemberCount: any, ConditionGroup: string[]) {

    this.conditionGroupData = [];
    this.conditionGroupDataCombined = [];
    this.createDimensionGroup(claimData);
    this.createGraphData(totalMemberCount, ConditionGroup);
  }


  createDimensionGroup(data: any[]) {

    // data issue
    data.forEach(element => {
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
    this.allClaimType = data.map(item => item.claimType).filter((value, index, self) => self.indexOf(value) === index);
    this.allAgeGroup = data.map(item => item.ageGroup).filter((value, index, self) => self.indexOf(value) === index);
    this.allGender = data.map(item => item.gender).filter((value, index, self) => self.indexOf(value) === index);
  }


  createGraphData(totalMemberCount: any, conditionGroup: string[]) {


    // console.log(this.conditionGroupingDimensionGroup.all());

    // aggregate data by condition_group
    this.claimsAggregateData = this.conditionGroupingDimensionGroup.reduce(this.reduceAdd, this.reduceRemove, this.reduceInit).all();


    // this.claimsAggregateData = [];



    // this.claimsAggregateData = [];

    // this.conditionGroupingDimensionGroup.reduceSum(d => d.currYearClaimCount).all().forEach(element => {
    //   const item = {
    //     key: element.key,
    //     value: { currYearClaimCount_sum: element.value }
    //   };
    //   this.claimsAggregateData.push(item);
    // });
    // this.conditionGroupingDimensionGroup.reduceSum(d => d.prevYearClaimCount).all().forEach(element => {
    //   const item = this.claimsAggregateData.find(d => d.key === element.key);
    //   item.value.prevYearClaimCount_sum = element.value;
    // });
    // this.conditionGroupingDimensionGroup.reduceSum(d => d.currYearTotalClaimCostAmount).all().forEach(element => {
    //   const item = this.claimsAggregateData.find(d => d.key === element.key);
    //   item.value.currYeartotalClaimCostAmount_sum = element.value;
    // });
    // this.conditionGroupingDimensionGroup.reduceSum(d => d.prevYearTotalClaimCostAmount).all().forEach(element => {
    //   const item = this.claimsAggregateData.find(d => d.key === element.key);
    //   item.value.prevYeartotalClaimCostAmount_sum = element.value;
    // });


    // this.currYearMemberCount = totalMemberCount.filter((d) => d.year === 'currentYear')[0].memberCount;
    // this.prevYearMemberCount = totalMemberCount.filter((d) => d.year === 'previousYear')[0].memberCount;



    this.currYearMemberCount = totalMemberCount.currentYear;
    this.prevYearMemberCount = totalMemberCount.previousYear;

    // todo
    if (this.prevYearMemberCount === 0) {
      this.prevYearMemberCount = this.currYearMemberCount;
    }



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
    conditionGroup.forEach(element => {

      // console.log(element);
      // const item = this.claimsAggregateData.filter((val) => val.key === element);
      const item = this.claimsAggregateData.find((val) => val.key === element);


      // console.log(item, element);



      this.conditionGroupData.push({
        key: element,
        Base: 0,
        Fall: 0,
        Rise: 0,
        Per_Capita: (item === undefined) ? 0 : item.currYearPerCapitalClaimCost - item.prevYearPerCapitalClaimCost
      });


      // if (item === undefined) {
      //   console.log('undefined');
      //   this.conditionGroupData.push({
      //     key: element,
      //     Base: 0,
      //     Fall: 0,
      //     Rise: 0,
      //     Per_Capita: 0
      //   });

      // } else {
      //   this.conditionGroupData.push({
      //     key: element,
      //     Base: 0,
      //     Fall: 0,
      //     Rise: 0,
      //     Per_Capita: item.currYearPerCapitalClaimCost - item.prevYearPerCapitalClaimCost
      //   });
      // }

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


    // this.claimsAggregateData = [];

    // this.conditionGroupingDimensionGroup.reduceSum(d => d.currYearClaimCount).all().forEach(element => {
    //   const item = {
    //     key: element.key,
    //     value: { currYearClaimCount_sum: element.value }
    //   };
    //   this.claimsAggregateData.push(item);
    // });
    // this.conditionGroupingDimensionGroup.reduceSum(d => d.prevYearClaimCount).all().forEach(element => {
    //   const item = this.claimsAggregateData.find(d => d.key === element.key);
    //   item.value.prevYearClaimCount_sum = element.value;
    // });
    // this.conditionGroupingDimensionGroup.reduceSum(d => d.currYearTotalClaimCostAmount).all().forEach(element => {
    //   const item = this.claimsAggregateData.find(d => d.key === element.key);
    //   item.value.currYeartotalClaimCostAmount_sum = element.value;
    // });
    // this.conditionGroupingDimensionGroup.reduceSum(d => d.prevYearTotalClaimCostAmount).all().forEach(element => {
    //   const item = this.claimsAggregateData.find(d => d.key === element.key);
    //   item.value.prevYeartotalClaimCostAmount_sum = element.value;
    // });





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


    this.conditionGroupData = [];


    // update.conditionGroupKey


    update.conditionGroupKey.forEach(element => {


      const item = this.claimsAggregateData.find((val) => val.key === element);
      // console.log(item, element);

      this.conditionGroupData.push({
        key: element,
        Base: 0,
        Fall: 0,
        Rise: 0,
        Per_Capita: (item === undefined) ? 0 : item.currYearPerCapitalClaimCost - item.prevYearPerCapitalClaimCost
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

  // getAggregate
  getClaimsAggregateData(): any[] {
    return this.claimsAggregateData;
  }

  // getAggregate Total
  getClaimsAggregateDataTotal(): any {
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

  getAllRelation(): string[] {
    return this.allRelation;
  }


  getAllClaimStatus(): string[] {
    return this.allClaimStatus;
  }

  getClaimType(): string[] {
    return this.allClaimType;
  }

  getAllAgeGroup(): string[] {
    return this.allAgeGroup;
  }

  getAllGender(): string[] {
    return this.allGender;
  }



}


export interface WaterfallBar {
  Base: number;
  Fall: number;
  Rise: number;
  Per_Capita: number;
  key: string;
}




// export interface ClaimsJSONInput1 {
//   region: string;
//   relation: string;
//   claimType: string;
//   conditionGrouping: string;
//   ageGroup: string;
//   gender: string;
//   currYearClaimCount: number;
//   currYeartotalClaimCostAmount: number;
//   prevYearClaimCount: number;
//   prevYeartotalClaimCostAmount: number;
// }

// export interface ClaimsJSONInput {
//   ageGroup: string;
//   region: string;
//   relation: string;
//   claimType: string;
//   conditionGrouping: string;
//   gender: string;
//   planClassKey: string;
//   industryKey: string;
//   operatorTypeKey: string;
//   currYearClaimCount: number;
//   currYeartotalClaimCostAmount: number;
//   prevYearClaimCount: number;
//   prevYeartotalClaimCostAmount: number;
// }


// "ageGroup": "56-60",
// "region": "REGION_WEST_MIDLANDS",
// "relation": "RELATION_TYPE_DEPENDANT",
// "claimType": "CLAIM_TYPE_OUT_PATIENT",
// "conditionGrouping": "CONDITION_GROUPING_ SS_&_IDC",
// "gender": "M",
// "planClassKey": null,
// "industryKey": null,
// "operatorTypeKey": null,
// "currYearClaimCount": 13,
// "currYearTotalClaimCostAmount": 2874.95,
// "prevYearClaimCount": 11,
// "prevYearTotalClaimCostAmount": 490.71


export interface DemographicSummaryJSONInput {
  year: string;
  memberCount: number;
}

// export interface ClaimsAggregateDataOutput {
//   key: string;
//   value: {
//     currYearClaimCount_sum: number,
//     currYeartotalClaimCostAmount_sum: number,
//     prevYearClaimCount_sum: number,
//     prevYeartotalClaimCostAmount_sum: number
//   };
//   currYearClaimFrequency: number;
//   prevYearClaimFrequency: number;
//   currYearPerCapitalClaimCost: number;
//   prevYearPerCapitalClaimCost: number;
//   currYearAvgClaimCost: number;
//   prevYearAvgClaimCost: number;
// }



// all countries
export interface ChartUpdateParameters {
  sortingMethod: string;
  conditionGroupKey?: string[];  // without PREV and CURR
  region?: string[];
  relation?: string[];
  gender?: string[];
  claimType?: string[];
  ageGroup?: string[];
}
