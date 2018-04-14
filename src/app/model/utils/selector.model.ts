export class Selector {

  public all: boolean;
  // private
  public selectionItems: SelectionItem[];

  constructor(items: any[]) {
    this.all = true;
    this.selectionItems = new Array<SelectionItem>();
    for (const item of items) {
      const curr: SelectionItem = { elementName: item, checked: true };
      this.selectionItems.push(curr);
    }

    // this.toggleElementStatus('TAX');
    // console.log(this.getElementStatus('TAX'));
    // this.toggleElementStatus('TAX');
    // console.log(this.getElementStatus('TAX'));

  }

  getCurrentSelction(): string[] {
    return this.selectionItems.filter(item => item.checked === true).map(d => d.elementName);
  }


  getElementStatus(item: string): boolean {
    return this.selectionItems.filter(d => d.elementName === item)[0].checked;
  }

  toggleElementStatus(item: string) {
    const status = this.selectionItems.filter(d => d.elementName === item)[0].checked;
    this.selectionItems.filter(d => d.elementName === item)[0].checked = !status;
  }

  checkIfAllChecked() {
    const num = this.selectionItems.filter(d => d.checked === true).length;
    return num === this.selectionItems.length ? true : false;
  }

  resetSelector() {
    for (const item of this.selectionItems) {
      item.checked = true;
    }
  }

}

export interface SelectionItem {
  elementName: string,
  checked: boolean
}
