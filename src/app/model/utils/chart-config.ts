import { ElementRef } from '@angular/core';
import { ProjectionOutput } from '../../model/D3chartData/projection-data.model';
export interface ChartConfig {
    title?: string;
    margin?: { top: number; right: number; bottom: number; left: number; };
    chartContainer: ElementRef;
    domID: string;  // start with #
    tooltipDomID?: string;
    xScaleDomain: any[];
    yScaleDomain: any[]; // let component handle min
    createGrid?: boolean;
    toolTipParent?: ElementRef;
}

export interface WaterfallChartConfig extends ChartConfig {
    zoom?: boolean;
    // stackColor?: { Base: string; Fall: string; Rise: string; };
    barData?: any[];
    previousYearKey?: string;
    currentYearKey?: string;
    conditionGroupTranslation: any;
    chartType: string; // 'percapita' 'frequency'
}


// AvgClaimCostChartConfig

export interface AvgClaimCostChartConfig extends ChartConfig {
    conditionGroupTranslation: any;
    x1ScaleDomain: any[];
    barData?: any[];
}


export interface ProjectionChartConfig extends ChartConfig {
    x1ScaleDomain: any[];
    barData?: ProjectionOutput[];
    categories?: string[];
    translation?: any;
}
