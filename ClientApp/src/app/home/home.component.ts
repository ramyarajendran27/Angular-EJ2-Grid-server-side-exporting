import { Component, OnInit, ViewChild } from '@angular/core';
import { ToolbarItems, GridComponent } from '@syncfusion/ej2-angular-grids';
import { DataManager, UrlAdaptor } from '@syncfusion/ej2-data';
import { ClickEventArgs } from '@syncfusion/ej2-navigations';

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
      this.grid.serverExcelExport('Home/ExcelExport');
    }
    if (args.item.id === 'Grid_pdfexport') { // 'Grid_pdfexport' -> Grid component id + _ + toolbar item name
      this.grid.serverPdfExport('Home/PdfExport');
    }
  }
}
