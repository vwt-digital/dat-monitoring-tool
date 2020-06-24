import { Component } from '@angular/core';
import { DatePipe, TitleCasePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';

import { Observable } from 'rxjs';

import { EnvService } from '../env/env.service';
import { UtilsService } from '../utils.service';
import { ErrorReport } from '../dashboard/error-report';

import 'ag-grid-enterprise';
import { AgGridEvent, GridOptions, ValueFormatterParams } from 'ag-grid-community';
import { DashboardService } from '../dashboard/dashboard.service';


@Component({
  selector: 'app-errors-overview',
  templateUrl: './errors-overview.component.html',
  styleUrls: ['./errors-overview.component.scss'],
  providers: [DatePipe, TitleCasePipe]
})

export class ErrorsOverviewComponent {
  private gridApi;
  private gridColumnApi;

  public gridOptions: GridOptions;
  public overlayNoRowsTemplate: string;
  public errorReporting: ErrorReport[];

  private pageLimit = 30;
  public pageCurrent = 1;
  public pageHasNext = true;
  public pageHasPrev = false;

  constructor(
    private httpClient: HttpClient,
    private route: ActivatedRoute,
    private env: EnvService,
    private datePipe: DatePipe,
    private titleCasePipe: TitleCasePipe,
    public service: DashboardService
  ) {
    this.gridOptions = {
      defaultColDef: {
        sortable: true,
        filter: true,
        editable: false,
        width: 150,
        resizable: true
      },
      columnDefs: [
        {
          headerName: 'Timestamp',
          field: 'receive_timestamp',
          sort: 'desc',
          valueFormatter: (params: ValueFormatterParams): string => {
            if (!isNaN(Date.parse(params.value))) {
              return datePipe.transform(params.value, 'dd-MM-yyyy HH:mm:ss');
            } else {
              return 'N/B';
            }
          }
        },
        { headerName: 'Project ID', field: 'project_id' },
        {
          headerName: 'Resource',
          children: [
            {
              headerName: 'Type',
              field: 'resource.type',
              valueFormatter: (params: ValueFormatterParams): string => {
                return titleCasePipe.transform(
                  params.value.replace(/[^a-zA-Z0-9]/g, ' '));
              }
            },
            {
              headerName: 'Name',
              field: 'resource.labels',
              valueFormatter: (params: ValueFormatterParams): string => {
                for (const item in params.value) {
                  if (item in params.value && item.includes('name')) {
                    return params.value[item];
                  }
                }
                return 'N/A';
              }
            },
            { headerName: 'Region', field: 'resource.labels.region' }
          ]
        }
      ],
      rowData: [],
      enableRangeSelection: true,
      suppressScrollOnNewData: true,
      suppressPaginationPanel: true,
      domLayout: 'autoHeight',
      statusBar: {
        statusPanels: [
          { statusPanel: 'agTotalRowCountComponent', align: 'left' },
          { statusPanel: 'agFilteredRowCountComponent', align: 'left' }
        ]
      }
    };

    this.overlayNoRowsTemplate = '<span>Geen errors gevonden</span>';
  }

  onGridReady(event: AgGridEvent): void {
    this.gridApi = event.api;
    this.gridColumnApi = event.columnApi;

    this.changePage();
  }

  changePage(action = null): void {
    if (action === 'next') {
      this.pageCurrent++;
    } else if (action === 'prev') {
      if (this.pageCurrent > 1) {
        this.pageCurrent--;
      } else {
        this.pageHasPrev = false;
        this.pageHasNext = true;
        return;
      }
    } else if (action === 'first') {
      this.pageHasPrev = false;
      this.pageHasNext = true;
      this.pageCurrent = 1;
    }

    const limit = this.pageLimit;
    const offset = this.pageCurrent * this.pageLimit;

    this.gridApi.showLoadingOverlay();

    this.getErrorReports(limit, offset).subscribe(
      async result => {
        if (result.length >= 1) {
          this.gridApi.setRowData(result);
          this.pageHasNext = true;
          this.pageHasPrev = this.pageCurrent > 1 ? true : false;
          this.gridColumnApi.autoSizeAllColumns();
          this.gridApi.hideOverlay();
        } else {
          this.pageCurrent--;
          this.pageHasNext = false;
          this.gridApi.hideOverlay();
        }
      },
      error => {
        console.log(error);
      }
    );
  }

  getErrorReports(limit, offset): Observable<ErrorReport[]> {
    return this.httpClient.get<ErrorReport[]>(
      `${this.env.apiUrl}/error-reports`,
      { params: UtilsService.buildQueryParams({limit, offset}) }
    );
  }
}
