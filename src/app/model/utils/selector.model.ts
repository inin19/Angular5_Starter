export class Selector {

  public all: boolean;
  // private
  public currentSelection: SelectionItem[];

  constructor(items: any[]) {
    this.all = true;
    this.currentSelection = new Array<SelectionItem>();
    for (const item of items) {
      const curr: SelectionItem = { elementName: item, checked: true };
      this.currentSelection.push(curr);
    }

    // this.toggleElementStatus('TAX');
    // console.log(this.getElementStatus('TAX'));
    // this.toggleElementStatus('TAX');
    // console.log(this.getElementStatus('TAX'));

  }

  getCurrentSelction(): string[] {
    return this.currentSelection.filter(item => item.checked === true).map(d => d.elementName);
  }


  getElementStatus(item: string): boolean {
    return this.currentSelection.filter(d => d.elementName === item)[0].checked;
  }

  toggleElementStatus(item: string) {
    const status = this.currentSelection.filter(d => d.elementName === item)[0].checked;
    this.currentSelection.filter(d => d.elementName === item)[0].checked = !status;
  }

  checkIfAllChecked() {
    const num = this.currentSelection.filter(d => d.checked === true).length;
    return num === this.currentSelection.length ? true : false;
  }

}

export interface SelectionItem {
  elementName: string,
  checked: boolean
}
