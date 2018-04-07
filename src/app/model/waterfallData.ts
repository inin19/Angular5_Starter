import * as crossfilter from 'crossfilter2';
import { ClaimDataService } from './../services/claims.service';
import * as d3 from 'd3';


export class WaterfallData {

    static UK_ConditionGrouping = [
        'CONDITION_GROUPING_CIRCULATORY',
        'CONDITION_GROUPING_DIGESTIVE',
        'CONDITION_GROUPING_INJURY_&_ACCIDENT',
        'CONDITION_GROUPING_MENTAL_DISORDERS',
        'CONDITION_GROUPING_MUSCULOSKELETAL',
        'CONDITION_GROUPING_NEOPLASMS',
        'CONDITION_GROUPING_OTHER',
        'CONDITION_GROUPING_PREGNANCY',
        'CONDITION_GROUPING_RESPIRATORY',
        'CONDITION_GROUPING_SS_&_IDC',
    ];


    static UK_ConditionGrouping_NEW = [
        'PREYEAR',
        'CONDITION_GROUPING_CIRCULATORY',
        'CONDITION_GROUPING_DIGESTIVE',
        'CONDITION_GROUPING_INJURY_&_ACCIDENT',
        'CONDITION_GROUPING_MENTAL_DISORDERS',
        'CONDITION_GROUPING_MUSCULOSKELETAL',
        'CONDITION_GROUPING_NEOPLASMS',
        'CONDITION_GROUPING_OTHER',
        'CONDITION_GROUPING_PREGNANCY',
        'CONDITION_GROUPING_RESPIRATORY',
        'CONDITION_GROUPING_SS_&_IDC',
        'CURRYEAR'
    ];

    static UK_ConditionGroupingTEST = [
        'Circulatory',
        'Digestive',
        'Injury & Accident',
        'Mental Disorders',
        'Musculoskeletal',
        'Neoplasms',
        'Pregnancy',
        'Respiratory',
        'SS & IDC',
        'Other'
    ];



    static UK_ConditionGroupingTEST_NEW = [
        '2015',
        'Circulatory',
        'Digestive',
        'Injury & Accident',
        'Mental Disorders',
        'Musculoskeletal',
        'Neoplasms',
        'Pregnancy',
        'Respiratory',
        'SS & IDC',
        'Other',
        '2016'
    ];

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




    private conditionGroupData_NEW: WaterfallBar[];

    constructor(claimData: any[], totalMemberCount: any[]) {

        this.conditionGroupData = [];
        this.createDimensionGroup(claimData);
        this.processGraphData(totalMemberCount);
    }


    createDimensionGroup(data: Array<any>) {
        this.ndx = crossfilter(data);
        this.regionDimension = this.ndx.dimension((d) => d.region);
        this.relationDimension = this.ndx.dimension((d) => d.relation);
        this.genderDimension = this.ndx.dimension((d) => d.gender);
        this.claimTypeDimension = this.ndx.dimension((d) => d.claimType);
        this.ageGroupDimension = this.ndx.dimension((d) => d.ageGroup);
        this.conditionGroupingDimension = this.ndx.dimension((d) => d.conditionGrouping);

        this.conditionGroupingDimensionGroup = this.conditionGroupingDimension.group();

        // get uniuqe groups values  this.conditionGroupingDimensionGroup.reduceCount().all()
    }

    processGraphData(totalMemeberCount: any[], region?: string[], relation?: string[],
        gender?: string[], claimType?: string[], ageGroup?: string[]) {
        // Apply filters
        if (region) {
            this.regionDimension.filter((d) => region.indexOf(d.toString()) !== -1);
        } else {
            this.regionDimension.filterAll();
        }

        if (relation) {
            this.relationDimension.filter((d) => relation.indexOf(d.toString()) !== -1);
        } else {
            this.relationDimension.filterAll();
        }

        if (gender) {
            this.genderDimension.filter((d) => gender.indexOf(d.toString()) !== -1);
        } else {
            this.genderDimension.filterAll();
        }

        if (claimType) {
            this.claimTypeDimension.filter((d) => claimType.indexOf(d.toString()) !== -1);
        } else {
            this.claimTypeDimension.filterAll();
        }

        if (ageGroup) {
            this.ageGroupDimension.filter((d) => ageGroup.indexOf(d.toString()) !== - 1);
        } else {
            this.ageGroupDimension.filterAll();
        }



        this.claimsAggregateData = this.conditionGroupingDimensionGroup.reduce(this.reduceAdd, this.reduceRemove, this.reduceInit).all();


        // CONDITION_GROUPING_CIRCULATORY
        // Object { currYearClaimCount_sum: 15272,
        // currYeartotalClaimCostAmount_sum: 876222,
        // prevYearClaimCount_sum: 15629,
        // prevYeartotalClaimCostAmount_sum: 1006810 }

        const currYearMemeberCount = totalMemeberCount.filter((d) => d.year === 'currentYear')[0].memeberCount;
        const prevYearMemeberCount = totalMemeberCount.filter((d) => d.year === 'previousYear')[0].memeberCount;

        // this.claimsAggregateData.forEach(element => {
        //     element.currYearClaimFrequency = element.value.currYearClaimCount_sum / currYearMemeberCount;
        //     element.prevYearClaimFrequency = element.value.prevYearClaimCount_sum / prevYearMemeberCount;

        //     element.currYearPerCapitalClaimCost = element.value.currYeartotalClaimCostAmount_sum / currYearMemeberCount;
        //     element.prevYearPerCapitalClaimCost = element.value.prevYeartotalClaimCostAmount_sum / prevYearMemeberCount;

        //     element.currYearAvgClaimCost = element.value.currYeartotalClaimCostAmount_sum / element.value.currYearClaimCount_sum;
        //     element.prevYearAvgClaimCost = element.value.prevYeartotalClaimCostAmount_sum / element.value.prevYearClaimCount_sum;
        // });


        for (const element of this.claimsAggregateData) {
            element.currYearClaimFrequency = element.value.currYearClaimCount_sum / currYearMemeberCount;
            element.prevYearClaimFrequency = element.value.prevYearClaimCount_sum / prevYearMemeberCount;

            element.currYearPerCapitalClaimCost = element.value.currYeartotalClaimCostAmount_sum / currYearMemeberCount;
            element.prevYearPerCapitalClaimCost = element.value.prevYeartotalClaimCostAmount_sum / prevYearMemeberCount;

            element.currYearAvgClaimCost = element.value.currYeartotalClaimCostAmount_sum / element.value.currYearClaimCount_sum;
            element.prevYearAvgClaimCost = element.value.prevYeartotalClaimCostAmount_sum / element.value.prevYearClaimCount_sum;
        }


        // console.log(this.claimsAggregateData);

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


        this.claimsAggregateDataTotal.currYearClaimFrequency = this.claimsAggregateDataTotal.value.currYearClaimCount_sum / currYearMemeberCount;
        this.claimsAggregateDataTotal.prevYearClaimFrequency = this.claimsAggregateDataTotal.value.prevYearClaimCount_sum / prevYearMemeberCount;

        this.claimsAggregateDataTotal.currYearPerCapitalClaimCost = this.claimsAggregateDataTotal.value.currYeartotalClaimCostAmount_sum / currYearMemeberCount;
        this.claimsAggregateDataTotal.prevYearPerCapitalClaimCost = this.claimsAggregateDataTotal.value.prevYeartotalClaimCostAmount_sum / prevYearMemeberCount;

        this.claimsAggregateDataTotal.currYearAvgClaimCost = this.claimsAggregateDataTotal.value.currYeartotalClaimCostAmount_sum / this.claimsAggregateDataTotal.value.currYearClaimCount_sum;
        this.claimsAggregateDataTotal.prevYearAvgClaimCost = this.claimsAggregateDataTotal.value.prevYeartotalClaimCostAmount_sum / this.claimsAggregateDataTotal.value.prevYearClaimCount_sum;


        // console.log(this.claimsAggregateDataTotal);


        // begin populate claimsWaterfallChartData
        this.conditionGroupPrevYearData = {
            key: 'PREYEAR',
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

        // this.conditionGroupData = new Array();

        this.conditionGroupData = [];

        WaterfallData.UK_ConditionGrouping.forEach(element => {


            const item = this.claimsAggregateData.filter((val) => val.key === element);

            // console.log(item);

            if (item) {
                this.conditionGroupData.push({
                    key: item[0].key,
                    Base: 0,
                    Fall: 0,
                    Rise: 0,
                    Per_Capita: item[0].currYearPerCapitalClaimCost - item[0].prevYearPerCapitalClaimCost
                });
            } else {
                this.conditionGroupData.push({
                    key: element,
                    Base: 0,
                    Fall: 0,
                    Rise: 0,
                    Per_Capita: 0
                });
            }
        });

        this.conditionGroupData_NEW = [];

        for (const element of WaterfallData.UK_ConditionGrouping_NEW) {
            this.conditionGroupData_NEW.push({
                key: element,
                Base: 0,
                Fall: 0,
                Rise: 0,
                Per_Capita: 0
            });
        }


        // console.log(this.conditionGroupData_NEW);


        this.calculateWaterfallBaseFallRise();



        // testing fake data

        const prevYear = { key: '2015', Base: 0, Fall: 0, Rise: 8655.79, Per_Capita: 8655.79 };
        const currYear = { key: '2016', Base: 0, Fall: 0, Rise: 8963.31, Per_Capita: 8963.31 };
        const conditionGroup = [
            { key: 'Circulatory', Base: 0, Fall: 0, Rise: 0, Per_Capita: -16.11 },
            { key: 'Digestive', Base: 0, Fall: 0, Rise: 0, Per_Capita: 16.27 },
            { key: 'Injury & Accident', Base: 0, Fall: 0, Rise: 0, Per_Capita: -163.90 },
            { key: 'Mental Disorders', Base: 0, Fall: 0, Rise: 0, Per_Capita: -174.91 },
            { key: 'Musculoskeletal', Base: 0, Fall: 0, Rise: 0, Per_Capita: 103.97 },
            { key: 'Neoplasms', Base: 0, Fall: 0, Rise: 0, Per_Capita: 228.08 },
            { key: 'Pregnancy', Base: 0, Fall: 0, Rise: 0, Per_Capita: -16.23 },
            { key: 'Respiratory', Base: 0, Fall: 0, Rise: 0, Per_Capita: 109.99 },
            { key: 'SS & IDC', Base: 0, Fall: 0, Rise: 0, Per_Capita: -31.39 },
            { key: 'Other', Base: 0, Fall: 0, Rise: 0, Per_Capita: 251.76 },
        ];
        let prevItem = prevYear;
        conditionGroup.forEach(element => {
            element.Fall = element.Per_Capita <= 0 ? -element.Per_Capita : 0;
            element.Rise = element.Per_Capita > 0 ? element.Per_Capita : 0;
            element.Base = prevItem.Base + prevItem.Rise - element.Fall;
            prevItem = element;
        });

        // TO BE REMOVED
        this.conditionGroupData = conditionGroup;
        this.conditionGroupPrevYearData = prevYear;
        this.conditionGroupCurrYearData = currYear;



        // create stackdata
        this.conditionGroupDataCombined = (new Array(this.conditionGroupPrevYearData)).concat(this.conditionGroupData).concat(this.conditionGroupCurrYearData);

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
    getClaimsAggregateData(): any[] {
        return this.claimsAggregateData;
    }

    // getAggregate Total
    getClaimsAggregateDataTotal(): any {
        return this.claimsAggregateDataTotal;
    }

    getWaterfallConditionGroupData(): any[] {
        return this.conditionGroupData;
    }

    // getWaterfallPrevYearData(): any[] {
    //     return this.conditionGroupPrevYearData;
    // }

    // getWaterfallCurrYearData(): any[] {
    //     return this.conditionGroupCurrYearData;
    // }

    sortConditionGroupData(sortingMethod: string) {

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
                    WaterfallData.UK_ConditionGroupingTEST.indexOf(a.key) > WaterfallData.UK_ConditionGroupingTEST.indexOf(b.key) ? 1 : -1);
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

}


export interface WaterfallBar {
    Base: number,
    Fall: number,
    Rise: number,
    Per_Capita: number,
    key: string
}
