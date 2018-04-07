import { ElementRef } from '@angular/core';

export interface ChartConfig {
    title?: string,
    margin?: { top: number, right: number, bottom: number, left: number },
    chartContainer: ElementRef,
    domID: string,  // start with #
    tooltipDomID?: string;
    xScaleDomain: any[],
    yScaleDomain: any[], // let component handle min
    createGrid?: boolean,
    toolTipParent?: ElementRef
}

export interface WaterfallChartConfig extends ChartConfig {
    zoom?: boolean,
    stackColor?: { Base: string, Fall: string, Rise: string }
    barData?: any[],
    previousYearKey?: string,
    currentYearKey?: string
}
