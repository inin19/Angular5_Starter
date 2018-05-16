import * as d3 from 'd3';
import * as crossfilter from 'crossfilter';

export class ProjectionData {
  private ndx: crossfilter.Crossfilter<ProjectionJSONInput>;
  private planDimension: crossfilter.Dimension<any, any>;
  private otherDimension: crossfilter.Dimension<any, any>;



  // groups
  private otherDimensionGroup: crossfilter.Group<any, any, any>;

  // data aggreate
  private proposalAggregateData: any;


  // Output ??
  private graphData: ProjectionOutput[];
  private gridCurrent: ProjectionGridData[];
  private girdProposed: ProjectionGridData[];

  private allPeriod: number[];
  private allCurrentProposed: string[];
  private allPlans: number[];
  private allCategories: string[];

  private maxStackValue: number;

  private gridCategories: string[];
  private graphCategories: string[];

  // new for plans pie chart ------------------------------------------------------------------------------------------------------
  //
  private periodDimension: crossfilter.Dimension<any, any>;
  private currentProposedDimension: crossfilter.Dimension<any, any>;

  private planCategoryDimension: crossfilter.Dimension<any, any>;
  private planCategoryDimensionGroup: crossfilter.Group<any, any, any>;

  private planAggregateData: any[];



  constructor(data: ProjectionJSONInput[], graphCategories: string[], gridCategories: string[]) {

    // NEW -----------------------------------
    // data.forEach(element => {
    //   element.fundingGapCurrent = (element.category === 'FUNDING_GAP' && element.currentProposed === 'CURRENT') ? element.value : 0;
    //   element.fundingGapProposed = (element.category === 'FUNDING_GAP' && element.currentProposed === 'PROPOSED') ? element.value : 0;
    // });
    // NEW -----------------------------------



    this.graphCategories = graphCategories;
    this.gridCategories = gridCategories;

    this.createDimentionGroup(data);
    this.createGraphData(data);

  }


  createDimentionGroup(data: ProjectionJSONInput[]) {
    this.ndx = crossfilter(data);
    this.planDimension = this.ndx.dimension((d) => d.planId);

    this.otherDimension = this.ndx.dimension((d) => JSON.stringify({
      period: d.period,
      currentProposed: d.currentProposed,
      category: d.category
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

    // NEW 5/15
    this.planCategoryDimension = this.ndx.dimension((d) => JSON.stringify({
      planId: d.planId,
      // currentProposed: d.currentProposed,
      category: d.category
    }));

    this.planCategoryDimensionGroup = this.planCategoryDimension.group();
    this.planCategoryDimensionGroup.all().forEach(function (d) {
      d.key = JSON.parse(d.key);
    });

    this.periodDimension = this.ndx.dimension(d => d.period);
    this.currentProposedDimension = this.ndx.dimension(d => d.currentProposed);
  }





  private groupbyPlan = (data: any[], item: number) => {
    return data.filter(d => d.key === item).reduce((accumulator, currVal) => {
      return {
        key: item,
        fundingGapCurrent: accumulator.fundingGapCurrent + currVal.fundingGapCurrent,
        fundingGapProposed: accumulator.fundingGapProposed + currVal.fundingGapProposed,
      };
    }, {
        key: item,
        fundingGapCurrent: 0,
        fundingGapProposed: 0,
      });
  }


  // categories is country specific
  createGraphData(data: ProjectionJSONInput[]) {
    // NEW ----------------------------------------------------------------------------------------
    let aggregateData = this.planCategoryDimensionGroup.reduceSum((d) => (d.value)).all();
    aggregateData = aggregateData.filter(d => d.key.category === 'FUNDING_GAP');
    this.planAggregateData = aggregateData;
    // NEW ----------------------------------------------------------------------------------------

    // projection main chart
    this.proposalAggregateData = this.otherDimensionGroup.reduceSum((d) => (d.value)).all();
    this.graphData = [];

    this.gridCurrent = [];
    this.girdProposed = [];

    for (const period of this.allPeriod) {
      let yCurrentBegin = 0;
      let yProposedBegin = 0;

      // populate graph
      for (const category of this.graphCategories) {
        // populate current
        const currentValue = this.proposalAggregateData.filter((d) =>
          (d.key.period === period) && (d.key.category === category) && d.key.currentProposed === 'CURRENT')[0].value;

        const currentItem: ProjectionOutput = {
          period: period,
          categoery: category,
          column: 'CURRENT',
          value: currentValue,
          yBegin: yCurrentBegin,
          yEnd: currentValue + yCurrentBegin
        };

        yCurrentBegin = currentValue + yCurrentBegin;
        this.graphData.push(currentItem);

        // populate proposed
        const proposedValue = this.proposalAggregateData.filter((d) =>
          (d.key.period === period) && (d.key.category === category) && d.key.currentProposed === 'PROPOSED')[0].value;

        const proposedItem: ProjectionOutput = {
          period: period,
          categoery: category,
          column: 'PROPOSED',
          value: proposedValue,
          yBegin: yProposedBegin,
          yEnd: proposedValue + yProposedBegin
        };

        yProposedBegin = proposedValue + yProposedBegin;
        this.graphData.push(proposedItem);
      }



      // populate grid
      for (const category of this.gridCategories) {

        const temp = this.proposalAggregateData.find(item => {
          return (item.key.period === period) && (item.key.category === category) && (item.key.currentProposed === 'CURRENT');
        });

        if (temp) {
        } else {
          console.log('period: ', period, ' category: ', category);
        }


        const current = this.gridCurrent.find(item => item.attribute === category);
        if (current) {
          current.value.push(this.proposalAggregateData.filter((d) =>
            (d.key.period === period) && (d.key.category === category) && d.key.currentProposed === 'CURRENT')[0].value);

        } else {
          // adding new record
          const temp1: ProjectionGridData = {
            attribute: category,
            value: []
          };
          temp1.value.push(this.proposalAggregateData.filter((d) =>
            (d.key.period === period) && (d.key.category === category) && d.key.currentProposed === 'CURRENT')[0].value);
          this.gridCurrent.push(temp1);
        }

        const modified = this.girdProposed.find(item => item.attribute === category);

        if (modified) {
          modified.value.push(this.proposalAggregateData.filter((d) =>
            (d.key.period === period) && (d.key.category === category) && d.key.currentProposed === 'PROPOSED')[0].value);
        } else {
          const temp2: ProjectionGridData = {
            attribute: category,
            value: []
          };
          temp2.value.push(this.proposalAggregateData.filter((d) =>
            (d.key.period === period) && (d.key.category === category) && d.key.currentProposed === 'PROPOSED')[0].value);
          this.girdProposed.push(temp2);
        }
      }

    }




    this.maxStackValue = d3.max(this.graphData, (d) => d.yEnd);

  }




  updateGraphData(plans: number[], periods: number[], selectedGraphCategories: string[], currentProposed: string[]) {


    this.gridCurrent = [];
    this.girdProposed = [];

    const removed = this.graphCategories.filter((item) => selectedGraphCategories.indexOf(item) < 0);
    const adjustedGridCategories = this.gridCategories.filter((item) => removed.indexOf(item) < 0);

    // console.log(adjustedGridCategories);

    // reset filter
    this.planDimension.filterAll();
    this.planDimension.filter((d) => plans.indexOf(Number(d)) !== -1);


    let aggregateData = this.planCategoryDimensionGroup.reduceSum((d) => (d.value)).all();
    aggregateData = aggregateData.filter(d => d.key.category === 'FUNDING_GAP');
    this.planAggregateData = aggregateData;

    this.proposalAggregateData = this.otherDimensionGroup.reduceSum((d) => (d.value)).all();
    this.graphData = [];

    for (const period of periods) {
      let yCurrentBegin = 0;
      let yProposedBegin = 0;


      // graph
      for (const category of selectedGraphCategories) {
        for (const projection of currentProposed) {
          if (projection === 'CURRENT') {
            const currentValue = this.proposalAggregateData.filter((d) =>
              (d.key.period === period) && (d.key.category === category) && d.key.currentProposed === projection)[0].value;

            const currentItem: ProjectionOutput = {
              period: period,
              categoery: category,
              column: 'CURRENT',
              value: currentValue,
              yBegin: yCurrentBegin,
              yEnd: currentValue + yCurrentBegin
            };

            yCurrentBegin = currentValue + yCurrentBegin;
            this.graphData.push(currentItem);
          } else {
            const proposedValue = this.proposalAggregateData.filter((d) =>
              (d.key.period === period) && (d.key.category === category) && d.key.currentProposed === 'PROPOSED')[0].value;

            const proposedItem: ProjectionOutput = {
              period: period,
              categoery: category,
              column: 'PROPOSED',
              value: proposedValue,
              yBegin: yProposedBegin,
              yEnd: proposedValue + yProposedBegin
            };
            yProposedBegin = proposedValue + yProposedBegin;
            this.graphData.push(proposedItem);
          }
        }
      }


      // grid
      for (const category of adjustedGridCategories) {

        const temp = this.proposalAggregateData.find(item => {
          return (item.key.period === period) && (item.key.category === category) && (item.key.currentProposed === 'CURRENT');
        });

        if (temp) {
        } else {
          console.log('period: ', period, ' category: ', category);
        }


        const current = this.gridCurrent.find(item => item.attribute === category);
        if (current) {
          current.value.push(this.proposalAggregateData.filter((d) =>
            (d.key.period === period) && (d.key.category === category) && d.key.currentProposed === 'CURRENT')[0].value);

        } else {
          // adding new record
          const temp1: ProjectionGridData = {
            attribute: category,
            value: []
          };
          temp1.value.push(this.proposalAggregateData.filter((d) =>
            (d.key.period === period) && (d.key.category === category) && d.key.currentProposed === 'CURRENT')[0].value);
          this.gridCurrent.push(temp1);
        }

        const modified = this.girdProposed.find(item => item.attribute === category);

        if (modified) {
          modified.value.push(this.proposalAggregateData.filter((d) =>
            (d.key.period === period) && (d.key.category === category) && d.key.currentProposed === 'PROPOSED')[0].value);
        } else {
          const temp2: ProjectionGridData = {
            attribute: category,
            value: []
          };
          temp2.value.push(this.proposalAggregateData.filter((d) =>
            (d.key.period === period) && (d.key.category === category) && d.key.currentProposed === 'PROPOSED')[0].value);
          this.girdProposed.push(temp2);
        }
      }

    }



    this.maxStackValue = d3.max(this.graphData, (d) => d.yEnd);
  }


  getGraphData(): ProjectionOutput[] {
    return this.graphData;
  }

  getMaxStackValue(): number {
    return this.maxStackValue;
  }

  getAllPeriod(): number[] {
    return this.allPeriod;
  }

  getAllPlan(): number[] {
    return this.allPlans;
  }

  getAllProjection(): string[] {
    return this.allCurrentProposed;
  }

  getGridCurrent(): ProjectionGridData[] {
    return this.gridCurrent;
  }

  getGridProposed(): ProjectionGridData[] {
    return this.girdProposed;
  }


  getFinalGrid(projection?: string[]): ProjectionGridData[] {

    const temp = [];
    const temp1: ProjectionGridData = {
      attribute: 'CURRENT'
    };
    const temp2: ProjectionGridData = {
      attribute: 'PROPOSED'
    };

    if (projection) {

      if (projection.indexOf('CURRENT') > -1) {
        temp.push(temp1);

        this.gridCurrent.forEach(element => {
          temp.push(element);
        });
      }
      if (projection.indexOf('PROPOSED') > -1) {
        temp.push(temp2);

        this.girdProposed.forEach(element => {
          temp.push(element);
        });
      }
    } else {
      temp.push(temp1);

      this.gridCurrent.forEach(element => {
        temp.push(element);
      });

      temp.push(temp2);

      this.girdProposed.forEach(element => {
        temp.push(element);
      });

    }

    return temp;
  }


  getFundingGapByPlan(): any[] {
    return this.planAggregateData;
  }

}


export interface ProjectionJSONInput {
  period: number;
  planId: number;
  currentProposed: string;
  category: string;
  value: number;
  fundingGapCurrent?: number;
  fundingGapProposed?: number;
}

export interface ProjectionOutput {
  period: number;
  categoery: string;
  column: string;
  value: number;
  yBegin: number;
  yEnd: number;
}

export interface ProjectionGridData {
  attribute: string;
  value?: number[];
}
