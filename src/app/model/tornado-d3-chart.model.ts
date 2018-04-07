import { ElementRef } from '@angular/core';

import * as d3 from 'd3';

export class TornadoD3Chart {

    static barType = ['Benchmark', 'Client'];
    private width: number;
    private height: number;
    private svg: any;
    private chart: any;

    private graphTitle: any;
    private xScale: any;
    private yScale: any;
    private yInnerScale: any;
    private xAxis: any;
    private yAxis: any;

    private legend: any;

    // private grids: any;

    private margin: { top: number, right: number, bottom: number, left: number };


    constructor(dom: string, chartConfig: ChartConfig) {
        const htmlElement = chartConfig.chartContainer.nativeElement;
        this.margin = chartConfig.margin;
        this.width = htmlElement.offsetWidth - this.margin.left - this.margin.right;
        this.height = htmlElement.offsetHeight - this.margin.top - this.margin.bottom;




        // this.svg_1 = d3.select('#proposalDemographic').append('svg')
        // .attr('width', htmlElement.offsetWidth)
        // .attr('height', htmlElement.offsetHeight);
        this.svg = d3.select(dom).append('svg')
            .attr('width', htmlElement.offsetWidth)
            .attr('height', htmlElement.offsetHeight);



        // adding legend
        this.legend = this.svg.append('g')
            .classed('legend', true);


        let legendGroup = null;

        if (chartConfig.chartType !== 3) {
            legendGroup = this.legend.selectAll('g')
                .data(['Female', 'Male'])
                .enter()
                .append('g');

            legendGroup.append('rect')
                .attr('width', '10px')
                .attr('height', '10px')
                .attr('x', (d, i) => this.margin.left + (i * 80))
                .attr('y', this.margin.top / 2)
                .attr('class', (d) => ((d === 'Female' ? 'bar--negative' : 'bar--positive') + ' ' + (chartConfig.chartType === 1 ? 'client' : 'benchmark')));


            legendGroup.append('text')
                .attr('x', (d, i) => this.margin.left + 15 + (i * 80))
                .attr('y', this.margin.top / 2)
                .attr('text-anchor', 'left')
                .style('font-size', '12px')
                .attr('dy', '0.79em')
                .text(d => d);

        } else {
            legendGroup = this.legend.selectAll('g')
                .data(['Client', 'Benchmark', 'Female', 'Male'])
                .enter()
                .append('g');

            legendGroup.append('rect')
                .attr('width', '10px')
                .attr('height', '10px')
                .attr('x', (d, i) => this.margin.left + 100 + (i % 2 * 80))
                .attr('y', (d, i) => i < 2 ? this.margin.top / 1.5 : this.margin.top / 3)
                .attr('class', (d, i) => ((i % 2 === 0 ? 'bar--negative' : 'bar--positive') + ' ' + (i < 2 ? 'client' : 'benchmark')));


            legendGroup.append('text')
                .attr('x', (d, i) => (i < 2 ? this.margin.left + 90 : this.margin.left + 115 + ((i % 2) * 80)))
                .attr('y', (d, i) => i < 2 ? this.margin.top / (1.5 * (i + 1)) : this.margin.top / 2)
                .attr('text-anchor', (d, i) => (i < 2 ? 'end' : 'left'))
                .style('font-size', '12px')
                .attr('dy', '0.79em')
                .text(d => d);



        }





        this.chart = this.svg
            .append('g')
            .classed('bars', true)
            .attr('transform', `translate(${this.margin.left},${this.margin.top})`);


        // adding graph title
        this.graphTitle = this.chart.append('text')
            .classed('graphTitle', true)
            .attr('x', (this.width / 2))
            .attr('y', 0 - (this.margin.top / 1.5))
            .attr('text-anchor', 'middle')
            .style('font-size', '16px')
            .text(chartConfig.title);





        const maxPercentage = chartConfig.maxPercentage + 0.05;

        // create scales
        this.xScale = d3.scaleLinear()
            .domain([-maxPercentage, maxPercentage])
            .range([0, this.width]);

        this.yScale = d3.scaleBand()
            .domain(chartConfig.ageGroup)
            .range([this.height, 0])
            .padding(0.2);


        if (chartConfig.cluster) {
            this.yInnerScale = d3.scaleBand().
                domain(TornadoD3Chart.barType)
                .range([0, this.yScale.bandwidth()])
                .paddingInner(0.2);
        }


        // x axis  percentage formatting remove (-) sign
        const xaxis = d3.axisBottom(this.xScale)
            .tickFormat((d) => d3.format('.0%')(Math.abs(Number(d))));
        const yaxis = d3.axisLeft(this.yScale)
            .tickSize(0);


        this.xAxis = this.chart.append('g')
            .attr('class', 'x axis')
            .attr('transform', `translate(0, ${this.height})`);
        // .call(xaxis);

        this.yAxis = this.chart.append('g')
            .attr('class', 'y axis');
        // .call(yaxis);

        // this.line = this.chart.append('line')
        //     .attr('class', 'middleLine')
        //     .attr('stroke', '#000')
        //     .attr('x1', this.xScale(0))
        //     .attr('x2', this.xScale(0))
        //     .attr('y2', this.height)
        //     .attr('stroke-width', '1px');

    }


    updateChart(dom: string, chartConfig: ChartConfig, barData: any[], chartParent: ElementRef, tooltipDom: string) {
        const htmlElement = chartConfig.chartContainer.nativeElement;
        this.width = htmlElement.offsetWidth - this.margin.left - this.margin.right;
        this.height = htmlElement.offsetHeight - this.margin.top - this.margin.bottom;

        this.svg
            .attr('width', htmlElement.offsetWidth)
            .attr('height', htmlElement.offsetHeight);

        this.graphTitle
            .attr('x', (this.width / 2))
            .attr('y', 0 - (this.margin.top / 1.5));

        this.xScale.range([0, this.width]);
        this.yScale.range([this.height, 0]);


        if (chartConfig.cluster) {
            this.yInnerScale
                .range([0, this.yScale.bandwidth()])
                .paddingInner(0.2);
        }



        const maxPercentage = chartConfig.maxPercentage + 0.05;


        // update scales
        this.xScale
            .domain([-maxPercentage, maxPercentage]);

        // probabaly not needed
        this.yScale
            .domain(chartConfig.ageGroup);

        // update axis
        const xaxis = d3.axisBottom(this.xScale)
            .tickFormat((d) => d3.format('.0%')(Math.abs(Number(d))));

        this.xAxis
            .transition()
            .attr('transform', `translate(0, ${this.height})`)
            .call(xaxis);



        // const middleChild = Math.floor(d3.selectAll(dom + ' .x.axis .tick').size() / 2) + 1;

        // console.log('middle: ' + middleChild);

        // const abc = d3.selectAll(dom + ' .x.axis .tick line');
        // abc
        //     .attr('y2', -this.height);




        const yaxis = d3.axisLeft(this.yScale)
            .tickSize(-this.width);

        this.yAxis
            .transition()
            .call(yaxis);

        d3.selectAll(dom + ' .y.axis .tick line')
            .attr('y1', - this.yScale.step() / 2)
            .attr('y2', - this.yScale.step() / 2);




        // move y axis path to the middle
        // '#proposalDemographic .y.axis path'

        // const abc = dom + ' .y.axis path';
        // console.log(abc)

        // d3.select(dom + ' .y.axis path')
        //     .attr('transform', 'translate(' + this.xScale(0) + ',0)');


        // create grid

        // if (chartConfig.createGrid) {
        //     this.grids = this.chart.selectAll(dom + ' .grid')
        //         .data([0]);
        //     this.grids.exit().remove();



        // start groups
        let groups = this.chart.selectAll(dom + ' .group')
            .data(chartConfig.ageGroup);

        groups.exit().remove();


        groups
            .attr('transform', d => 'translate(0,' + this.yScale(d) + ')');

        // adding new groups
        groups
            .enter().append('g')
            .classed('group', true)
            .attr('transform', d => 'translate(0,' + this.yScale(d) + ')');

        // rejoin data VERY IMPORTANT
        groups = this.chart.selectAll(dom + ' .group')
            .data(chartConfig.ageGroup);

        const bars = groups.selectAll('.bar')
            .data((d) => barData.filter(d1 => (d1.key.ageGroup === d)));

        bars.exit().remove();

        // update existing bars
        bars
            .transition()
            .attr('x', (d) => d.percentage < 0 ? this.xScale(Math.min(0, d.percentage)) : this.xScale(Math.min(0, d.percentage)) + 1)
            .attr('y', (d) => (chartConfig.cluster) ? this.yInnerScale(d.source) : 0)
            .attr('width', (d) => Math.abs(this.xScale(d.percentage) - this.xScale(0)))
            .attr('height', (chartConfig.cluster) ? this.yInnerScale.bandwidth() : this.yScale.bandwidth());

        // this.yInnerScale.bandwidth()
        // this.yScale.bandwidth()

        // if (chartConfig.cluster) {
        //     bars
        //         .attr('y', (d) => this.yInnerScale(d.source));
        // }

        // adding new bars
        bars
            .enter()
            .append('rect')
            .attr('class', function (d) { return 'bar bar--' + (d.percentage < 0 ? 'negative' : 'positive') + ' ' + (d.source === 'Client' ? 'client' : 'benchmark'); })
            .attr('x', (d) => d.percentage < 0 ? this.xScale(Math.min(0, d.percentage)) : this.xScale(Math.min(0, d.percentage)) + 1)
            .attr('y', (d) => (chartConfig.cluster) ? this.yInnerScale(d.source) : 0)
            .attr('width', (d) => Math.abs(this.xScale(d.percentage) - this.xScale(0)))
            .attr('height', (chartConfig.cluster) ? this.yInnerScale.bandwidth() : this.yScale.bandwidth())
            .on('mouseover', this.handleMouseOver(chartConfig, tooltipDom))
            .on('mousemove', this.handleMouseMove(chartParent, tooltipDom))
            .on('mouseout', this.handleMouseOut(tooltipDom));




    }

    // i is the index of the data, d is the actual data
    // console.log(d3.event.currentTarget);  is the current selcted DOM element
    handleMouseOver(chartConfig: ChartConfig, tooltipDom: string): (d, i) => void {
        return (d, i) => {
            // console.log('in mouseOver');
            d3.select(d3.event.currentTarget)
                .attr('opacity', 0.5);

            const formatFixedPercent = d3.format('.1%');

            d3.select(tooltipDom)
                .style('opacity', 1)
                .html(
                    (chartConfig.cluster) ?
                        d.source + '<br/>' + (d.key.gender === 'F' ? 'Female' : 'Male') + ': ' + formatFixedPercent(Math.abs(d.percentage))
                        : (d.key.gender === 'F' ? 'Female' : 'Male') + ': ' + formatFixedPercent(Math.abs(d.percentage))
                );
        };
    }

    handleMouseOut(tooltipDom: string): (d, i) => void {
        return (d, i) => {
            // console.log('in MouseOut');
            d3.select(d3.event.currentTarget)
                .attr('opacity', 1);

            d3.select(tooltipDom)
                .style('opacity', 0);
        };
    }


    handleMouseMove(chartParent: ElementRef, tooltipDom: string): (d, i) => void {
        return (d, i) => {
            // const bounds = document.getElementById('demographicChartsArea').getBoundingClientRect();
            const bounds = chartParent.nativeElement.getBoundingClientRect();

            d3.select(tooltipDom)
                .style('left', d3.event.clientX - bounds.left + 10 + 'px')
                .style('top', d3.event.clientY - bounds.top + 10 + 'px');
        };
    }







}


export interface ChartConfig {
    title?: string,
    chartContainer: ElementRef,
    margin?: { top: number, right: number, bottom: number, left: number },
    ageGroup: string[],
    maxPercentage: number,
    cluster?: boolean,
    createGrid?: boolean,
    chartType?: number // 1: client, 2: benchmark, 3 both
}
