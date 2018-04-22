import * as crossfilter from 'crossfilter';


export interface SelectorValue {
  selectorName: string;
  selectorValues: string[];
}

export interface Dimension {
  dimensionName: string;
  dimension: crossfilter.Dimension<any, any>;
}
