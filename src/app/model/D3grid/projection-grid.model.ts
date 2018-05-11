import * as d3 from 'd3';


export class ProjectionGrid {

  private tbody: any;
  private translation: any;

  constructor(data: any[], domId: string, translation: any) {
    this.translation = translation;

    console.log(this.translation);
    this.createGrid(data, domId);


  }

  // by default 7 column
  createGrid(data: any[], domId: string) {
    const formatFixedPercent = d3.format('.2s');

    this.tbody = d3.select(domId).select('tbody');
    // console.log('GRID created!');

    // create a row for each object in the data
    const rows = this.tbody.selectAll('tr')
      .data(data)
      .enter()
      .append('tr');


    const cells = rows.selectAll('td')
      .data((row) => {
        const foo = Array.apply(null, { length: 6 }).map(Number.call, Number);
        // const column = [-1].concat([0, 1, 2, 3, 4, 5]);
        const column = [-1].concat(foo);

        if (row.value) {
          return column.map((item, index) => {
            if (index === 0) {
              return { colspan: 1, value: this.translation[row.attribute] };
            } else {
              return { colspan: 1, value: formatFixedPercent(row.value[index - 1]) };
            }
          });
        } else {
          return [{ colspan: 7, value: row.attribute }];
        }
      })
      .enter()
      .append('td')
      .text((d) => d.value)
      .attr('colspan', (d) => d.colspan)
      .classed('bg-secondary', (d) => d.colspan !== 1 ? true : false)
      .style('font-style', (d) => d.colspan !== 1 ? 'italic' : null)
      .style('font-weight', (d) => d.colspan !== 1 ? 'bolder' : null);

  }

  updateGrid(data: any[], period: number[]) {
    const formatFixedPercent = d3.format('.2s');
    let rows = this.tbody.selectAll('tr')
      .data(data);

    rows.exit().remove();
    rows.enter().append('tr');

    rows = this.tbody.selectAll('tr')
      .data(data);


    const cells = rows.selectAll('td')
      .data((row) => {

        const column = [-1].concat(period);

        if (row.value) {
          return column.map((item, index) => {
            if (index === 0) {
              return { colspan: 1, value: this.translation[row.attribute] };
            } else {
              return { colspan: 1, value: formatFixedPercent(row.value[index - 1]) };
            }
          });
        } else {
          return [{ colspan: period.length + 1, value: row.attribute }];
        }
      });


    cells.exit().remove();

    // update exisitng cell table
    // cells.transition()
    //   .text((d) => d.value)
    //   .attr('colspan', (d) => d.colspan)
    //   .classed('bg-secondary', (d) => d.colspan !== 1 ? true : false)
    //   .style('font-style', (d) => d.colspan !== 1 ? 'italic' : null)
    //   .style('font-weight', (d) => d.colspan !== 1 ? 'bolder' : null);

    cells
      .text((d) => d.value)
      .attr('colspan', (d) => d.colspan)
      .classed('bg-secondary', (d) => d.colspan !== 1 ? true : false)
      .style('font-style', (d) => d.colspan !== 1 ? 'italic' : null)
      .style('font-weight', (d) => d.colspan !== 1 ? 'bolder' : null);


    cells
      .enter()
      .append('td')
      .text((d) => d.value)
      .attr('colspan', (d) => d.colspan)
      .classed('bg-secondary', (d) => d.colspan !== 1 ? true : false)
      .style('font-style', (d) => d.colspan !== 1 ? 'italic' : null)
      .style('font-weight', (d) => d.colspan !== 1 ? 'bolder' : null);

  }




}

