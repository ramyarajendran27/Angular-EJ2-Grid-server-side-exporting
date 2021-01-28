import { Component, OnInit, ViewChild } from '@angular/core';
import { ToolbarItems, GridComponent, Column } from '@syncfusion/ej2-angular-grids';
import { DataManager, UrlAdaptor } from '@syncfusion/ej2-data';
import { ClickEventArgs } from '@syncfusion/ej2-navigations';
import { Internationalization } from '@syncfusion/ej2-base';

@Component({
  selector: 'app-home',
  template: `<ejs-grid #grid id='Grid' [dataSource]='data' [toolbar]='toolbar' height='273px'(toolbarClick)='toolbarClick($event)'>
                <e-columns>
                    <e-column field='OrderID' headerText='Order ID' textAlign='Right' width=120></e-column>
                    <e-column field='CustomerID' headerText='Customer ID' width=150></e-column>
                    <e-column field='Freight' format='C2' textAlign='Right' width=120></e-column>
                    <e-column field='ShipCity' headerText='Ship City' width=150></e-column>
                    <e-column field='ShipName' headerText='Ship Name' width=150></e-column>
                </e-columns>
                </ejs-grid>`
})
export class HomeComponent implements OnInit {

  public data: DataManager;
  public toolbar: ToolbarItems[];

  public dataManager: DataManager = new DataManager({
    url: 'Home/UrlDatasource',
        adaptor: new UrlAdaptor()
  });
  @ViewChild('grid')
  public grid: GridComponent;
  ngOnInit(): void {
    this.data = this.dataManager;
    this.toolbar = ['ExcelExport', 'PdfExport'];
  }
  toolbarClick(args: ClickEventArgs): void {
    if (args.item.id === 'Grid_excelexport') { // 'Grid_excelexport' -> Grid component id + _ + toolbar item name
      this.exportGrid('Home/ExcelExport');
    }
    if (args.item.id === 'Grid_pdfexport') { // 'Grid_pdfexport' -> Grid component id + _ + toolbar item name
      this.exportGrid('Home/PdfExport');
    }
  }
  public exportGrid(url: string): void {
    let grid = this;

    let gridModel = JSON.parse((this.grid as any).addOnPersist(['allowGrouping', 'allowPaging', 'pageSettings', 'sortSettings', 'allowPdfExport', 'allowExcelExport', 'aggregates',
      'filterSettings', 'groupSettings', 'columns', 'locale', 'searchSettings']));
    gridModel.columns.forEach((e: Column) => {
      let column: Column = this.grid.getColumnByUid(e.uid);
      if (column) {
        e.headerText = column.headerText;
        if (e.format) {
          let format: string = typeof (e.format) === 'object' ? e.format.format : e.format;
          e.format = this.getNumberFormat(format, e.type);
        }
      }
      if (e.columns) {
        this.setHeaderText(e.columns as Column[]);
      }
    });
    let form: HTMLFormElement = this.grid.createElement('form', { id: 'ExportForm', styles: 'display:none;' });
    let gridInput: HTMLInputElement = this.grid.createElement('input', { id: 'gridInput', attrs: { name: "gridModel" } });
    gridInput.value = JSON.stringify(gridModel);
    form.method = "POST";
    form.action = url;
    form.appendChild(gridInput);
    document.body.appendChild(form);
    form.submit();
    form.remove();
  }

  /**
   * @hidden
   */
  public setHeaderText(columns: Column[]):void {
    for (var i = 0; i < columns.length; i++) {
      let column: Column = this.grid.getColumnByUid(columns[i].uid);
      columns[i].headerText = column.headerText;
      if (columns[i].format) {
        let e: Column = columns[i];
        let format: string = typeof (e.format) === 'object' ? e.format.format : e.format;
        columns[i].format = this.getNumberFormat(format, columns[i].type);
      }
      if (columns[i].columns) {
        this.setHeaderText(columns[i].columns as Column[]);
      }
    }
  }
  getNumberFormat(numberFormat: string, type: string): string {
    let format: string;
    let intl: Internationalization = new Internationalization();
    if (type === 'number') {
      try {
        format = intl.getNumberPattern({ format: numberFormat, useGrouping: true }, true);
      } catch (error) {
        format = numberFormat;
      }
    } else if (type === 'date' || type === 'time' || type === 'datetime') {
      try {
        format = intl.getDatePattern({ skeleton: numberFormat, type: type }, false);
      } catch (error) {
        try {
          format = intl.getDatePattern({ format: numberFormat, type: type }, false);
        } catch (error) {
          format = numberFormat;
        }
      }
    } else {
      format = numberFormat;
    }
    if (type !== 'number') {
      let patternRegex: RegExp = /G|H|c|'| a|yy|y|EEEE|E/g;
      let mtch: Object = { 'G': '', 'H': 'h', 'c': 'd', '\'': '"', ' a': ' AM/PM', 'yy': 'yy', 'y': 'yyyy', 'EEEE': 'dddd', 'E': 'ddd' };
      format = format.replace(patternRegex, (pattern: string): string => {
        return (<any>mtch)[pattern];
      });
    }
    return format;
  }

}
