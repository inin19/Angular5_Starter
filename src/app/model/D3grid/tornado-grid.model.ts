import { ElementRef } from '@angular/core';
import * as d3 from 'd3';

export class TornadoGrid {

  private table: any;
  private thead: any;
  private tbody: any;
  private rows: any;
  private cells: any;


  constructor(gridData: any[], domId: string) {
    this.createGrid(gridData, domId);
  }

  createGrid(data: any[], domId: string) {
    this.table = d3.select(domId)
      .append('table')
      .classed('table', true)
      .classed('table-hover', true);

    this.thead = this.table.append('thead');
    this.tbody = this.table.append('tbody');

    // append the header row

    this.thead.append('tr')
      .selectAll('th')
      .data(['Age group', 'Female', 'Male']).enter()
      .append('th')
      .text(d => d);

    // create a row for each object in the data
    this.rows = this.tbody.selectAll('tr')
      .data(data)
      .enter()
      .append('tr');


    const formatFixedPercent = d3.format('.1%');


    // create a cell in each row for each column
    //               <th scope="row">64+</th>

    this.cells = this.rows.selectAll('td')
      .data(function (row) {
        return ['Age group', 'Female', 'Male'].map(function (column) {
          if (column === 'Age group') {
            return { column: column, value: row.ageGroup };
          } else if (column === 'Female') {
            return { column: column, value: formatFixedPercent(row.percentage.female) };
          } else {
            return { column: column, value: formatFixedPercent(row.percentage.male) };
          }
        });
      })
      .enter()
      .append('td')
      .text(function (d) { return d.value; });
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
      .data(function (row) {
        return ['Age group', 'Female', 'Male'].map(function (column) {
          if (column === 'Age group') {
            return { column: column, value: row.ageGroup };
          } else if (column === 'Female') {
            return { column: column, value: formatFixedPercent(row.percentage.female) };
          } else {
            return { column: column, value: formatFixedPercent(row.percentage.male) };
          }
        });
      });


    cells.exit().remove();


    // update exisitng cell table
    cells.transition().text(function (d) { return d.value; });


    cells
      .enter()
      .append('td')
      .text(function (d) { return d.value; });

    console.log('grid table updated!');

  }



}

export class TornadoCombinedGrid {
  private table: any;
  private thead: any;
  private tbody: any;
  private rows: any;
  private cells: any;
  constructor(proposalData: any[], benchmarkData: any[], domId: string) {
    this.createGrid(proposalData, benchmarkData, domId);
  }

  createGrid(proposalData: any[], benchmarkData: any[], domId: string) {
    this.table = d3.select(domId)
      .append('table')
      .classed('table', true)
      .classed('table-hover', true);


    this.thead = this.table.append('thead');
    this.tbody = this.table.append('tbody');


    this.thead.append('tr')
      .selectAll('th')
      .data(['Age group', 'Female', 'Male']).enter()
      .append('th')
      .text(d => d);

    // make spancol = 2
    this.thead.select('tr th:nth-child(2)').attr('colspan', '2');
    this.thead.select('tr th:nth-child(3)').attr('colspan', '2');

    this.thead.append('tr')
      .selectAll('td')
      .data(['', 'Client', 'Benchmark', 'Client', 'Benchmark']).enter()
      .append('td')
      .text(d => d);


    // begin tbody


    // create a row for each object in the data
    this.rows = this.tbody.selectAll('tr')
      .data(benchmarkData)
      .enter()
      .append('tr');

    const formatFixedPercent = d3.format('.1%');


    this.cells = this.rows.selectAll('td')
      .data(function (row) {
        return ['Age group', 'clientFemale', 'clientMale', 'benchmarkFemale', 'benchmarkMale'].map(function (column) {
          const item = proposalData.find(d => d.ageGroup === row.ageGroup);
          if (column === 'Age group') {
            return { column: column, value: row.ageGroup };
          } else if (column === 'clientFemale') {

            return { column: column, value: formatFixedPercent(item.percentage.female) };
          } else if (column === 'clientMale') {
            return { column: column, value: formatFixedPercent(item.percentage.male) };

          } else if (column === 'benchmarkFemale') {
            return { column: column, value: formatFixedPercent(row.percentage.female) };
          } else {
            return { column: column, value: formatFixedPercent(row.percentage.male) };
          }
        });
      })
      .enter()
      .append('td')
      .text(function (d) { return d.value; });

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
      .data(function (row) {
        return ['Age group', 'clientFemale', 'clientMale', 'benchmarkFemale', 'benchmarkMale'].map(function (column) {
          const item = proposalData.find(d => d.ageGroup === row.ageGroup);
          if (column === 'Age group') {
            return { column: column, value: row.ageGroup };
          } else if (column === 'clientFemale') {

            return { column: column, value: formatFixedPercent(item.percentage.female) };
          } else if (column === 'clientMale') {
            return { column: column, value: formatFixedPercent(item.percentage.male) };

          } else if (column === 'benchmarkFemale') {
            return { column: column, value: formatFixedPercent(row.percentage.female) };
          } else {
            return { column: column, value: formatFixedPercent(row.percentage.male) };
          }
        });
      });

    cells.exit().remove();


    // update exisitng cell table
    cells.transition().text(function (d) { return d.value; });


    cells
      .enter()
      .append('td')
      .text(function (d) { return d.value; });
  }

}
