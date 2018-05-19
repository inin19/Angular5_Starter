import * as d3 from 'd3';
import * as crossfilter from 'crossfilter';
import { SelectorValue, Dimension } from '../utils/data-utils.model';
import { Selector } from '../utils/selector.model';


export class TornadoData {

  static FEMALE = 'F';
  static MALE = 'M';


  private ndx: crossfilter.Crossfilter<any>;

  private selectorValues: SelectorValue[];
  private dimensions: Dimension[];

  private graphDimension: crossfilter.Dimension<any, any>;
  private genderDimension: crossfilter.Dimension<any, any>;


  // Groups
  private graphDimensionGroup: crossfilter.Group<any, any, any>;
  private genderDimensionGroup: crossfilter.Group<any, any, any>;


  // Output
  private graphData: any[];
  private demographicAggregateData: any;
  private femaleMemberCount: number;
  private maleMemberCount: number;
  private maxPercentage: number;

  // Output for grid
  private gridSummary: GridSummary;
  private gridDetail: GridDetail[];



  constructor(data: any[], ageGroup: string[], selectorNames: string[]) {

    this.gridDetail = new Array<GridDetail>();
    // revisit null or 0
    for (const item of ageGroup.reverse()) {
      const detailItem: GridDetail = {
        ageGroup: item,
        percentage: { female: null, male: null }
      };
      this.gridDetail.push(detailItem);
    }

    this.gridSummary = {
      percentage: { female: 0, male: 0 },
      avgAge: { female: 0, male: 0 }
    };

    ////////////////////////////////////////////////////////////////////

    this.createDimensionGroup(data, selectorNames);
    this.updateData();

  }

  createDimensionGroup(demographicJsonData: any[], selectorNames: string[]) {
    this.ndx = crossfilter(demographicJsonData);
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

    this.graphDimension = this.ndx.dimension((d) => JSON.stringify({
      'ageGroup': d.ageGroup,
      'gender': d.gender
    }));
    this.genderDimension = this.ndx.dimension((d) => d.gender);


    this.graphDimensionGroup = this.graphDimension.group();
    this.genderDimensionGroup = this.genderDimension.group();

    this.graphDimensionGroup.all().forEach(function (d) {
      d.key = JSON.parse(d.key);
    });

  }





  updateData(selectors?: Selector[]) {
    // apply filters
    if (selectors) {
      for (const selector of selectors) {
        this.getDimensionByName(selector.getSelectorName()).filter(d => selector.getCurrentSelction().indexOf(d) !== -1);
      }
    } else {
      for (const item of this.dimensions) {
        item.dimension.filterAll();
      }
    }
    this.demographicAggregateData = this.graphDimensionGroup.reduceSum((d) => d.memberCount).all();

    // assign member count for female and male
    this.genderDimensionGroup.reduceSum((d) => d.memberCount).all().forEach(element => {
      if (element.key === TornadoData.FEMALE) {
        this.femaleMemberCount = element.value;
      }
      if (element.key === TornadoData.MALE) {
        this.maleMemberCount = element.value;
      }
    });

    this.gridSummary.percentage.female = this.femaleMemberCount / (this.femaleMemberCount + this.maleMemberCount);
    this.gridSummary.percentage.male = this.maleMemberCount / (this.femaleMemberCount + this.maleMemberCount);

    this.graphData = this.demographicAggregateData;

    // calculate Avg Age

    // console.log('total age');
    // console.log(this.gridSummary);

    this.genderDimensionGroup.reduceSum((d) => d.totalAge).all().forEach(element => {
      if (element.key === TornadoData.FEMALE) {
        this.gridSummary.avgAge.female = element.value / this.femaleMemberCount;
      }
      if (element.key === TornadoData.MALE) {
        this.gridSummary.avgAge.male = element.value / this.maleMemberCount;
      }
    });



    this.graphData.forEach(element => {

      const gridDetailItem = this.gridDetail.find(d => d.ageGroup === element.key.ageGroup);
      // if (gridDetailItem && element.key.gender === TornadoChartData.FEMALE) {
      //   gridDetailItem.percentage.female = element.percentage;
      // } else if (gridDetailItem && element.key.gender === TornadoChartData.MALE) {
      //   gridDetailItem.percentage.male = element.percentage;
      // }


      if (element.key.gender === TornadoData.FEMALE) {
        element.genderTotal = this.femaleMemberCount;
        // check divided 0
        element.percentage = element.genderTotal === 0 ? 0 : element.value / element.genderTotal;

        if (gridDetailItem) {
          gridDetailItem.percentage.female = element.percentage;
        }

        element.percentage = - element.percentage;
      } else {
        element.genderTotal = this.maleMemberCount;
        // check divided 0
        element.percentage = element.genderTotal === 0 ? 0 : element.value / element.genderTotal;

        if (gridDetailItem) {
          gridDetailItem.percentage.male = element.percentage;
        }
      }


    });


    this.maxPercentage = d3.max(this.graphData, (d) => Math.abs(d.percentage));

  }


  private getDimensionByName(selectorName: string): crossfilter.Dimension<any, any> {
    return this.dimensions.find(item => item.dimensionName === selectorName).dimension;
  }

  getGridDetail(ageGroup: string[]) {
    // const ageGroup = ['0-18', '19-23', '24-28', '29-33', '34-38', '39-43', '44-48', '49-53', '54-58', '59-63', '64+'];
    this.gridDetail.sort((a, b) =>
      ageGroup.indexOf(a.ageGroup) > ageGroup.indexOf(b.ageGroup) ? 1 : -1);

    return this.gridDetail;
  }


  getGridSummary() {
    return this.gridSummary;
  }

  getGraphData(): any {
    return this.graphData;
  }

  getMaxPercentage(): any {
    return this.maxPercentage;
  }



  getSelectorValuesByName(selectorName: string): string[] {
    return this.selectorValues.find(item => item.selectorName === selectorName).selectorValues;
  }


}



export interface GridSummary {
  // benchmark?: boolean;
  percentage: { female: number, male: number };
  avgAge: { female: number, male: number };
}

export interface GridDetail {
  ageGroup: string;
  percentage: { female: number, male: number };
  memberCount?: { female: number, male: number };
}
