import * as d3 from 'd3';
import * as crossfilter from 'crossfilter2';

export class TornadoChartData {

  static FEMALE = 'F';
  static MALE = 'M';


  static REGION = 'region';
  static RELATION = 'relation';
  static AGEGROUP = 'ageGroup';
  static GENDER = 'gender';


  private ndx: crossfilter.Crossfilter<DemographicJSONInput>;


  // Dimensions
  private relationDimension: crossfilter.Dimension<any, any>;
  private regionDimension: crossfilter.Dimension<any, any>;
  private genderDimension: crossfilter.Dimension<any, any>;

  // private planclassDimension: crossfilter.Dimension<any, any>;
  // private IndustryDimension: crossfilter.Dimension<any, any>;
  // private operatorDimension: crossfilter.Dimension<any, any>;


  private graphDimension: crossfilter.Dimension<any, any>;


  // Groups
  private graphDimensionGroup: crossfilter.Group<any, any, any>;
  private genderDimensionGroup: crossfilter.Group<any, any, any>;


  // Output
  private graphData: Array<any>;
  private demographicAggregateData: any;
  private femaleMemberCount: number;
  private maleMemberCount: number;
  private maxPercentage: number;


  // country common list (key)
  private allRegion: string[];
  private allRelation: string[];

  private allPlanClass: string[];
  private allIndustry: string[];
  private allOperatorType: string[];


  // Output for grid
  private gridSummary: GridSummary;
  private gridDetail: GridDetail[];


  constructor(data: DemographicJSONInput[], ageGroup: string[]) {
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


    this.createDimentionGroup(data);
    this.processGraphData();


    // this.processGraphData(data, ['South'], ['EMPLOYEE']);

    // this.demographicAggregateData.forEach(element => {
    //     console.log(element.key, element.value, element.genderTotal, element.percentage);
    // });

    // console.log(this.maxPercentage);
  }



  createDimentionGroup(data: DemographicJSONInput[]) {
    this.ndx = crossfilter(data);

    this.regionDimension = this.ndx.dimension((d) => d.region);
    this.relationDimension = this.ndx.dimension((d) => d.relation);
    this.genderDimension = this.ndx.dimension((d) => d.gender);


    this.graphDimension = this.ndx.dimension((d) => JSON.stringify({
      // 'region': d.region,
      // 'relation': d.relation,
      'ageGroup': d.ageGroup,
      'gender': d.gender
    }));


    this.graphDimensionGroup = this.graphDimension.group();
    this.genderDimensionGroup = this.genderDimension.group();

    this.graphDimensionGroup.all().forEach(function (d) {
      d.key = JSON.parse(d.key);
    });



    // this.allRegion = this.regionDimension.group().reduceCount().all().map(item => item.key);
    // this.allRelation = this.relationDimension.group().reduceCount().all().map(item => item.key);

    // across all countries
    this.allRegion = data.map(item => item.region).filter((value, index, self) => self.indexOf(value) === index);
    this.allRelation = data.map(item => item.relation).filter((value, index, self) => self.indexOf(value) === index);
    this.allPlanClass = data.map(item => item.planClassKey).filter((value, index, self) => self.indexOf(value) === index);
    this.allIndustry = data.map(item => item.industryKey).filter((value, index, self) => self.indexOf(value) === index);
    this.allOperatorType = data.map(item => item.operatorTypeKey).filter((value, index, self) => self.indexOf(value) === index);

  }

  processGraphData(update?: ChartUpdateParameters) {

    // regions?: string[], relation?: string[]

    // reset filter
    // this.regionDimension.filter(null);
    // this.relationDimension.filter(null);


    if (update) {
      this.regionDimension.filter((d) => update.region.indexOf(d.toString()) !== -1);
    } else {
      this.regionDimension.filterAll();
    }

    if (update) {
      this.relationDimension.filter((d) => update.relation.indexOf(d.toString()) !== -1);
    } else {
      this.relationDimension.filterAll();
    }

    this.demographicAggregateData = this.graphDimensionGroup.reduceSum((d) => d.memberCount).all();


    // begin to calculate F/M percentage

    // assign member count for female and male
    this.genderDimensionGroup.reduceSum((d) => d.memberCount).all().forEach(element => {
      if (element.key === TornadoChartData.FEMALE) {
        this.femaleMemberCount = element.value;
      }
      if (element.key === TornadoChartData.MALE) {
        this.maleMemberCount = element.value;
      }
    });


    this.gridSummary.percentage.female = this.femaleMemberCount / (this.femaleMemberCount + this.maleMemberCount);
    this.gridSummary.percentage.male = this.maleMemberCount / (this.femaleMemberCount + this.maleMemberCount);


    this.graphData = this.demographicAggregateData;



    this.graphData.forEach(element => {

      const gridDetailItem = this.gridDetail.find(d => d.ageGroup === element.key.ageGroup);
      // if (gridDetailItem && element.key.gender === TornadoChartData.FEMALE) {
      //   gridDetailItem.percentage.female = element.percentage;
      // } else if (gridDetailItem && element.key.gender === TornadoChartData.MALE) {
      //   gridDetailItem.percentage.male = element.percentage;
      // }


      if (element.key.gender === TornadoChartData.FEMALE) {
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


    // console.log(this.gridSummary);

    // populating grid

    // grid detail

  }



  getGraphData(): any {
    return this.graphData;
  }

  getMaxPercentage(): any {
    return this.maxPercentage;
  }

  getAllRegion(): string[] {
    return this.allRegion;
  }

  getAllRelation(): string[] {
    return this.allRelation;
  }

  getAllPlanClass(): string[] {
    return this.allPlanClass;
  }

  getAllIndustry(): string[] {
    return this.allIndustry;
  }
  getAllOperatorType(): string[] {
    return this.allOperatorType;
  }
}


export interface DemographicJSONInput {
  region: string;
  relation: string;
  ageGroup: string;
  gender: string;
  planClassKey: string;
  industryKey: string;
  operatorTypeKey: string;
  memberCount: number;
  countryKey: string;
}



// d3.format('.0%')

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



// all countries
export interface ChartUpdateParameters {
  region: string[];
  relation: string[];
}
