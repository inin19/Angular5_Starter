import { ElementRef } from '@angular/core';
import * as d3 from 'd3';

export class TornadoGrid {

  private gridDetailColumnHeader = ['Age Group', 'Female', 'Male'];
  private tbody: any;

  constructor(gridData: any[], domId: string) {
    this.createGrid(gridData, domId);
  }

  createGrid(data: any[], domId: string) {
    this.tbody = d3.select(domId).select('table tbody');

    // create a row for each object in the data
    const rows = this.tbody.selectAll('tr')
      .data(data)
      .enter()
      .append('tr')
      .classed('d-flex', true);

    const formatFixedPercent = d3.format('.1%');

    const cells = rows.selectAll('td')
      .data((row) =>
        // todo
        this.gridDetailColumnHeader.map((column, index) => {
          if (index === 0) {
            return { column: column, value: row.ageGroup };
          } else if (index === 1) {
            return { column: column, value: formatFixedPercent(row.percentage.female) };
          } else {
            return { column: column, value: formatFixedPercent(row.percentage.male) };
          }
        })
      )
      .enter()
      .append('td')
      .classed('col-4', true)
      .text((d) => d.value);

  }

  updateGrid(data: any[]) {
    const formatFixedPercent = d3.format('.1%');

    let rows = this.tbody.selectAll('tr')
      .data(data);

    rows.exit().remove();
    rows.enter().append('tr');
    rows = this.tbody.selectAll('tr')
      .data(data);


    const cells = rows.selectAll('td')
      .data((row) =>
        this.gridDetailColumnHeader.map((column, index) => {
          if (index === 0) {
            return { column: column, value: row.ageGroup };
          } else if (index === 1) {
            return { column: column, value: formatFixedPercent(row.percentage.female) };
          } else {
            return { column: column, value: formatFixedPercent(row.percentage.male) };
          }
        }));

    cells.exit().remove();
    // update exisitng cell table
    cells.transition().text((d) => d.value);

    cells
      .enter()
      .append('td')
      .text((d) => d.value);

    console.log('grid table updated!');
  }



}

export class TornadoCombinedGrid {

  private tbody: any;
  private gridCombinedColumnHeader = ['', 'Client', 'Benchmark', 'Client', 'Benchmark'];

  constructor(proposalData: any[], benchmarkData: any[], domId: string) {
    this.createGrid(proposalData, benchmarkData, domId);
  }

  createGrid(proposalData: any[], benchmarkData: any[], domId: string) {
    this.tbody = d3.select(domId).select('table tbody');
    const rows = this.tbody.selectAll('tr')
      .data(benchmarkData)
      .enter()
      .append('tr');

    const formatFixedPercent = d3.format('.1%');

    const cells = rows.selectAll('td')
      .data((row) =>
        this.gridCombinedColumnHeader.map((column, index) => {
          const item = proposalData.find(d => d.ageGroup === row.ageGroup);
          switch (index) {
            case 0: {
              return { column: column, value: row.ageGroup };
            }
            case 1: {
              return { column: column, value: formatFixedPercent(item.percentage.female) };
            }
            case 2: {
              return { column: column, value: formatFixedPercent(item.percentage.male) };
            }
            case 3: {
              return { column: column, value: formatFixedPercent(row.percentage.female) };
            }
            case 4: {
              return { column: column, value: formatFixedPercent(row.percentage.male) };
            }
          }
        })
      )
      .enter()
      .append('td')
      .text((d) => d.value);

  }

  updateGrid(proposalData: any[], benchmarkData: any[]) {
    const formatFixedPercent = d3.format('.1%');

    let rows = this.tbody.selectAll('tr')
      .data(benchmarkData);

    rows.exit().remove();
    rows.enter().append('tr');
    rows = this.tbody.selectAll('tr')
      .data(benchmarkData);


    const cells = rows.selectAll('td')
      .data((row) =>
        this.gridCombinedColumnHeader.map((column, index) => {
          const item = proposalData.find(d => d.ageGroup === row.ageGroup);
          switch (index) {
            case 0: {
              return { column: column, value: row.ageGroup };
            }
            case 1: {
              return { column: column, value: formatFixedPercent(item.percentage.female) };
            }
            case 2: {
              return { column: column, value: formatFixedPercent(item.percentage.male) };
            }
            case 3: {
              return { column: column, value: formatFixedPercent(row.percentage.female) };
            }
            case 4: {
              return { column: column, value: formatFixedPercent(row.percentage.male) };
            }
          }
        })
      );

    cells.exit().remove();

    // update exisitng cell table
    cells.transition().text((d) => d.value);

    cells
      .enter()
      .append('td')
      .text((d) => d.value);
  }

}
