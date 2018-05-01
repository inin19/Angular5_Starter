import { ElementRef } from '@angular/core';
import * as d3 from 'd3';

export class TornadoGrid {
  // private table: any;
  // private thead: any;
  private tbody: any;
  // private rows: any;
  // private cells: any;

  constructor(gridData: any[], domId: string) {
    this.createGrid(gridData, domId);
  }

  createGrid(data: any[], domId: string) {
    const table = d3.select(domId)
      .append('table')
      .classed('table', true)
      .classed('table-hover', true);

    const thead = table.append('thead');
    this.tbody = table.append('tbody');

    // append the header row

    thead.append('tr')
      .selectAll('th')
      .data(['Age group', 'Female', 'Male']).enter()
      .append('th')
      .text(d => d);

    // create a row for each object in the data
    const rows = this.tbody.selectAll('tr')
      .data(data)
      .enter()
      .append('tr');


    const formatFixedPercent = d3.format('.1%');


    // create a cell in each row for each column
    //               <th scope="row">64+</th>

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

  private tbody: any;

  constructor(proposalData: any[], benchmarkData: any[], domId: string) {
    this.createGrid(proposalData, benchmarkData, domId);
  }

  createGrid(proposalData: any[], benchmarkData: any[], domId: string) {
    const table = d3.select(domId)
      .append('table')
      .classed('table', true)
      .classed('table-hover', true);


    const thead = table.append('thead');
    this.tbody = table.append('tbody');


    thead.append('tr')
      .selectAll('th')
      .data(['Age group', 'Female', 'Male']).enter()
      .append('th')
      .text(d => d);

    // make spancol = 2
    thead.select('tr th:nth-child(2)').attr('colspan', '2');
    thead.select('tr th:nth-child(3)').attr('colspan', '2');

    thead.append('tr')
      .selectAll('td')
      .data(['', 'Client', 'Benchmark', 'Client', 'Benchmark']).enter()
      .append('td')
      .text(d => d);


    // begin tbody


    // create a row for each object in the data
    const rows = this.tbody.selectAll('tr')
      .data(benchmarkData)
      .enter()
      .append('tr');

    const formatFixedPercent = d3.format('.1%');


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

export class TornadoSummaryGrid {
  private tbody: any;

  constructor(data: any, domId: string) {
    this.createGrid(data, domId);
  }
  createGrid(data: any, domId: string) {
    const table = d3.select(domId)
      .append('table')
      .classed('table', true)
      .classed('table-hover', true)
      .classed('table-sm', true)
      ;

    const thead = table.append('thead');
    this.tbody = table.append('tbody');

    // header
    thead.append('tr')
      .selectAll('th')
      .data([' ', 'Female', 'Male']).enter()
      .append('th')
      .text(d => d);


    const formatFixedPercent = d3.format('.1%');
    const formatFixed = d3.format('.1f');


    // .data need to be an array

    const row1 = this.tbody.append('tr')
      .classed('percentage', true)
      .data([data.percentage]);

    const cell1 = row1.selectAll('td')
      .data(function (row) {
        return [' ', 'Female', 'Male'].map(function (column) {
          if (column === ' ') {
            return { column: column, value: 'Percentage' };
          } else if (column === 'Female') {
            return { column: column, value: formatFixedPercent(row.female) };
          } else {
            return { column: column, value: formatFixedPercent(row.male) };
          }
        });
      })
      .enter()
      .append('td')
      .text(function (d) { return d.value; });


    const row2 = this.tbody.append('tr')
      .classed('avgAge', true)
      .data([data.avgAge]);

    const cell2 = row2.selectAll('td')
      .data(function (row) {
        return [' ', 'Female', 'Male'].map(function (column) {
          if (column === ' ') {
            return { column: column, value: 'Avg Age' };
          } else if (column === 'Female') {
            return { column: column, value: formatFixed(row.female) };
          } else {
            return { column: column, value: formatFixed(row.male) };
          }
        });
      })
      .enter()
      .append('td')
      .text(function (d) { return d.value; });

  }

  updateGrid(data: any) {
    console.log('update Summary Grid');

    const formatFixedPercent = d3.format('.1%');
    const formatFixed = d3.format('.1f');


    const row1 = this.tbody.selectAll('.percentage')
      .data([data.percentage]);

    // update
    const cell1 = row1.selectAll('.percentage td')
      .data(function (row) {
        return [' ', 'Female', 'Male'].map(function (column) {
          if (column === ' ') {
            return { column: column, value: 'Percentage' };
          } else if (column === 'Female') {
            return { column: column, value: formatFixedPercent(row.female) };
          } else {
            return { column: column, value: formatFixedPercent(row.male) };
          }
        });
      });


    cell1.exit().remove();
    // update exisitng cell table
    cell1.transition().text(function (d) { return d.value; });

    cell1
      .enter()
      .append('td')
      .text(function (d) { return d.value; });

    const row2 = this.tbody.selectAll('.avgAge')
      .data([data.avgAge]);


    const cell2 = row2.selectAll('.avgAge td')
      .data(function (row) {
        return [' ', 'Female', 'Male'].map(function (column) {
          if (column === ' ') {
            return { column: column, value: 'Avg Age' };
          } else if (column === 'Female') {
            return { column: column, value: formatFixed(row.female) };
          } else {
            return { column: column, value: formatFixed(row.male) };
          }
        });
      });


    cell2.exit().remove();
    // update exisitng cell table
    cell2.transition().text(function (d) { return d.value; });

    cell2
      .enter()
      .append('td')
      .text(function (d) { return d.value; });

  }

}
