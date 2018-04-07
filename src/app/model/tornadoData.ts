import * as d3 from 'd3';
import * as crossfilter from 'crossfilter2';

export class TornadoChartData {

    static FEMALE = 'F';
    static MALE = 'M';


    static REGION = 'region';
    static RELATION = 'relation';
    static AGEGROUP = 'ageGroup';
    static GENDER = 'gender';

    static UKAgeGroup = ['0-18', '19-25', '26-35', '36-45', '46-55', '56-60', '61-65', '66-70', '71-75', '76+'];

    private ndx: crossfilter.Crossfilter<any>;


    // Dimensions
    private relationDimension: crossfilter.Dimension<any, any>;
    private regionDimension: crossfilter.Dimension<any, any>;
    private genderDimension: crossfilter.Dimension<any, any>;

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


    private allRegion: string[];
    private allRelation: string[];


    constructor(data: Array<any>) {
        this.createDimentionGroup(data);
        this.processGraphData();

        // this.processGraphData(data, ['South'], ['EMPLOYEE']);

        // this.demographicAggregateData.forEach(element => {
        //     console.log(element.key, element.value, element.genderTotal, element.percentage);
        // });

        // console.log(this.maxPercentage);

    }



    createDimentionGroup(data: Array<any>) {
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

        // console.log(this.regionDimension.group().reduceCount().all());

        // this.regionDimension.group().reduceCount().all().forEach(element => {
        //     console.log(element);
        // });


        this.allRegion = this.regionDimension.group().reduceCount().all().map(item => item.key);
        this.allRelation = this.relationDimension.group().reduceCount().all().map(item => item.key);

    }

    processGraphData(regions?: Array<string>, relation?: Array<string>) {


        // reset filter
        // this.regionDimension.filter(null);
        // this.relationDimension.filter(null);


        if (regions) {
            this.regionDimension.filter((d) => regions.indexOf(d.toString()) !== -1);
        } else {
            this.regionDimension.filterAll();
        }

        if (relation) {
            this.relationDimension.filter((d) => relation.indexOf(d.toString()) !== -1);
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


        this.graphData = this.demographicAggregateData;



        this.graphData.forEach(element => {
            if (element.key.gender === TornadoChartData.FEMALE) {
                element.genderTotal = this.femaleMemberCount;
                // check divided 0
                element.percentage = element.genderTotal === 0 ? 0 : element.value / element.genderTotal;
                element.percentage = - element.percentage;
            } else {
                element.genderTotal = this.maleMemberCount;
                // check divided 0
                element.percentage = element.genderTotal === 0 ? 0 : element.value / element.genderTotal;

            }
        });


        this.maxPercentage = d3.max(this.graphData, (d) => Math.abs(d.percentage));

        // this.graphData.forEach(element => {
        //     console.log(element);
        // });

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
}
