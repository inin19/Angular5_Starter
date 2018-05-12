export class Selector {

  public all: boolean;
  // private
  public selectionItems: SelectionItem[];

  public selectorName: string;

  constructor(items: any[], name?: string) {
    this.all = true;
    this.selectionItems = new Array<SelectionItem>();
    for (const item of items) {
      const curr: SelectionItem = { elementName: item, checked: true };
      this.selectionItems.push(curr);
    }
    this.selectorName = name;
  }

  getCurrentSelction(): string[] {
    return this.selectionItems.filter(item => item.checked === true).map(d => d.elementName);
  }


  getElementStatus(item: string): boolean {
    return this.selectionItems.filter(d => d.elementName === item)[0].checked;
  }

  // new
  toggleElementStatus(item: string) {
    const status = this.selectionItems.filter(d => d.elementName === item)[0].checked;
    this.selectionItems.filter(d => d.elementName === item)[0].checked = !status;
    this.setAll();
  }

  // new
  setAll() {
    if (this.checkIfAllChecked() === true) {
      this.all = true;
    } else {
      this.all = false;
    }
  }


  checkIfAllChecked() {
    const num = this.selectionItems.filter(d => d.checked === true).length;
    return num === this.selectionItems.length ? true : false;
  }

  resetSelector() {
    for (const item of this.selectionItems) {
      item.checked = true;
    }
    this.all = true;
  }

  getSelectorName(): string {
    return this.selectorName;
  }


  unSelectAll() {
    this.all = false;
    for (const item of this.selectionItems) {
      item.checked = false;
    }
  }



  setSelection(selection: string[]) {
    for (const item of selection) {
      if (this.selectionItems.filter(d => d.elementName === item)[0]) {
        this.selectionItems.filter(d => d.elementName === item)[0].checked = true;
      }
    }
  }


  syncAll() {
    if (this.selectionItems.length === this.getCurrentSelction().length) {
      this.all = true;
    }
  }

}

export interface SelectionItem {
  elementName: string;
  checked: boolean;
}
