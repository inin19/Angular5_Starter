import * as d3 from 'd3';
import * as crossfilter from 'crossfilter2';

export class ProjectionData {
  private ndx: crossfilter.Crossfilter<ProjectionJSONInput>
  private planDimension: crossfilter.Dimension<any, any>;
  private otherDimension: crossfilter.Dimension<any, any>;

  // groups
  private otherDimensionGroup: crossfilter.Group<any, any, any>;


  // data aggreate
  private proposalAggregateData: any;


  // Output ??
  private graphData: ProjectionOutput[];


  private graphPeriod: number[];
  private graphCurrentProposed: string[];
  private graphPlan: number[];
  private graphCategory: string[];


  private allPeriod: number[];
  private allCurrentProposed: string[];
  private allPlans: number[];
  private allCategories: string[];

  private maxStack: number;

  constructor(data: ProjectionJSONInput[], categories: string[]) {
    this.createDimentionGroup(data, categories);
    this.createGraphData(data, categories);
  }


  createDimentionGroup(data: ProjectionJSONInput[], categories: string[]) {
    this.ndx = crossfilter(data);
    this.planDimension = this.ndx.dimension((d) => d.planId);

    this.otherDimension = this.ndx.dimension((d) => JSON.stringify({
      'period': d.period,
      'currentProposed': d.currentProposed,
      'category': d.category
    }));

    // create groups
    this.otherDimensionGroup = this.otherDimension.group();

    this.otherDimensionGroup.all().forEach(function (d) {
      d.key = JSON.parse(d.key);
    });

    // get all distinct value
    this.allPlans = data.map(item => item.planId).filter((value, index, self) => self.indexOf(value) === index);
    this.allCategories = data.map(item => item.category).filter((value, index, self) => self.indexOf(value) === index);
    this.allPeriod = data.map(item => item.period).filter((value, index, self) => self.indexOf(value) === index);
    this.allCurrentProposed = data.map(item => item.currentProposed).filter((value, index, self) => self.indexOf(value) === index);

  }

  createGraphData(data: ProjectionJSONInput[], categories: string[]) {

    this.proposalAggregateData = this.otherDimensionGroup.reduceSum((d) => (d.value)).all();
    this.graphData = [];


    // this.proposalAggregateData.forEach(element => {
    //   console.log(element.key.period, element.key.category);
    // });

    for (const period of this.allPeriod) {
      const yColumn = new Array();
      const Current = new Array();
      const Proposed = new Array();

      let yCurrentBegin = 0;
      let yProposedBegin = 0;

      // order matters
      for (const category of categories) {
        // populate current
        const currentValue = this.proposalAggregateData.filter((d) => {
          return (d.key.period === period) && (d.key.category === category) && d.key.currentProposed === 'CURRENT'
        })[0].value;

        const currentItem: ProjectionOutput = {
          period: period,
          categoery: category,
          column: 'CURRENT',
          value: currentValue,
          yBegin: yCurrentBegin,
          yEnd: currentValue + yCurrentBegin
        }

        yCurrentBegin = currentValue + yCurrentBegin;

        this.graphData.push(currentItem);

        // console.log('Period: ', period, ' Category: ', category, ' Current ', curr);
        // populate proposed

        // populate current
        const proposedValue = this.proposalAggregateData.filter((d) => {
          return (d.key.period === period) && (d.key.category === category) && d.key.currentProposed === 'PROPOSED'
        })[0].value;

        const proposedItem: ProjectionOutput = {
          period: period,
          categoery: category,
          column: 'PROPOSED',
          value: proposedValue,
          yBegin: yProposedBegin,
          yEnd: proposedValue + yProposedBegin
        }
        yProposedBegin = proposedValue + yProposedBegin;
        this.graphData.push(proposedItem);
      }
    }

    this.maxStack = d3.max(this.graphData, (d) => d.yEnd);

    console.log(this.maxStack);

    // this.graphData.forEach(element => {
    //   console.log(element);
    // });
  }


}


export interface ProjectionJSONInput {
  period: number,
  planId: number,
  currentProposed: string,
  category: string,
  value: number
}

export interface ProjectionOutput {
  period: number,
  categoery: string,
  column: string,
  value: number,
  yBegin: number,
  yEnd: number
}
