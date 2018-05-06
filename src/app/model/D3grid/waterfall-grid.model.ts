import { ElementRef } from '@angular/core';
import * as d3 from 'd3';

export class WaterfallD3Grid {
  private static tableHeaders = ['Condition Group', 'Previous Year', 'Current Year', 'Benchmark'];

  private tbody: any;


  constructor(gridData: any[], gridDataTotal: any, domId: string, translation: any) {
    this.createGrid(gridData, gridDataTotal, domId, translation);
  }

  createGrid(data: any[], gridDataTotal: any, domId: string, translation: any) {
    this.tbody = d3.select(domId).select('table tbody');
    // const tableHeaders = ['Condition Group', 'Previous Year', 'Current Year', 'Benchmark'];

    // create a row for each object in the data
    const rows = this.tbody.selectAll('.conditionGroupElement tr')
      .data(data)
      .enter()
      .append('tr')
      .classed('conditionGroupElement', true)
      .classed('d-flex', true);


    const formatFixed = d3.format('.1f');

    const cells = rows.selectAll('td')
      .data(function (row) {
        return WaterfallD3Grid.tableHeaders.map(function (column, index) {
          switch (index) {
            case 0: {
              return { column: column, value: translation[row.key] };
            }
            case 1: {
              return { column: column, value: formatFixed(row.prev) };
            }
            case 2: {
              return { column: column, value: formatFixed(row.curr) };
            }
            case 3: {
              return { column: column, value: formatFixed(row.benchmark) };
            }
          }
        });
      })
      .enter()
      .append('td')
      .text(function (d) { return d.value; })
      .classed('col-3', true);


    // append total
    const totalRow = this.tbody.append('tr')
      .classed('conditionGroupTotal', true)
      .classed('d-flex', true)
      .data([gridDataTotal]);

    const totalCells = totalRow.selectAll('td')
      .data(function (row) {
        return WaterfallD3Grid.tableHeaders.map(function (column, index) {
          if (index === 0) {
            return { column: column, value: 'Total' };
          } else if (index === 1) {
            return { column: column, value: formatFixed(row.prev) };
          } else if (index === 2) {
            return { column: column, value: formatFixed(row.curr) };
          } else {
            return { column: column, value: formatFixed(row.benchmark) };
          }
        });
      })
      .enter()
      .append('td')
      .text(function (d) { return d.value; })
      .classed('col-3', true);

  }


  updateGrid(data: any[], gridDataTotal: any, translation: any, sortingColumn: string, order: string, defaultOrder: string[]) {

    const formatFixed = d3.format('.1f');

    if (sortingColumn && order) {
      if (sortingColumn === 'conditionGroup') {
        data.sort((a, b) =>
          defaultOrder.indexOf(a.key) > defaultOrder.indexOf(b.key) ? 1 : -1);
      } else {
        data.sort((a, b) => order === 'asc' ? a[sortingColumn] - b[sortingColumn] : b[sortingColumn] - a[sortingColumn]);
      }
    }

    let rows = this.tbody.selectAll('.conditionGroupElement')
      .data(data);

    rows.exit().remove();
    rows.enter().append('tr').classed('conditionGroupElement', true);

    rows = this.tbody.selectAll('.conditionGroupElement')
      .data(data);

    const cells = rows.selectAll('td')
      .data(row => {
        return WaterfallD3Grid.tableHeaders.map(function (column, index) {
          switch (index) {
            case 0: {
              return { column: column, value: translation[row.key] };
            }
            case 1: {
              return { column: column, value: formatFixed(row.prev) };
            }
            case 2: {
              return { column: column, value: formatFixed(row.curr) };
            }
            case 3: {
              return { column: column, value: formatFixed(row.benchmark) };
            }
          }
        });
      });



    cells.exit().remove();

    // update exisitng cell table
    cells.transition().text(d => d.value);
    cells.enter().append('td').text(d => d.value);


    // udpate total
    const totalRow = this.tbody.selectAll('.conditionGroupTotal')
      .data([gridDataTotal]);


    const totalCells = totalRow.selectAll('td')
      .data(row => {
        return WaterfallD3Grid.tableHeaders.map((column, index) => {
          switch (index) {
            case 0: {
              return { column: column, value: 'Total' };
            }
            case 1: {
              return { column: column, value: formatFixed(row.prev) };
            }
            case 2: {
              return { column: column, value: formatFixed(row.curr) };
            }
            case 3: {
              return { column: column, value: formatFixed(row.benchmark) };
            }
          }
        });
      });


    totalCells.exit().remove();
    totalCells.transition().text(d => d.value);
    totalCells.enter().append('td').text(d => d.value);

  }
}
