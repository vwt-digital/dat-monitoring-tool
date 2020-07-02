import { Component } from '@angular/core';
import { DatePipe, TitleCasePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';

import { Observable } from 'rxjs';
import 'rxjs/add/operator/filter';

import { EnvService } from '../env/env.service';
import { UtilsService } from '../utils.service';
import { ErrorReport, ErrorReportResponse } from '../dashboard/error-report';

import 'ag-grid-enterprise';
import { AgGridEvent, GridOptions, ValueFormatterParams, ICellRendererParams } from 'ag-grid-community';
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

  private pageSize = 30;
  private pageCursors = {};
  public pageCurrent = 1;
  public pageHasNext = true;
  public pageHasPrev = false;

  private uuidRegex = /[0-9]{6}-[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}/g;

  constructor(
    private httpClient: HttpClient,
    private route: ActivatedRoute,
    private env: EnvService,
    private titleCasePipe: TitleCasePipe,
    private datePipe: DatePipe,
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
          field: 'received_at',
          pinned: 'left',
          sort: 'desc',
          valueFormatter: (params: ValueFormatterParams): string => {
            if (!isNaN(Date.parse(params.value))) {
              return datePipe.transform(params.value, 'dd-MM-yyyy HH:mm:ss.SSS');
            } else {
              return 'N/B';
            }
          }
        },
        { headerName: 'Severity', field: 'severity' },
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
                const nameKeys = ['function_name', 'service_name', 'revision_name', 'detector_name', 'job_id', 'configuration_name'];
                for (const item in params.value) {
                  if (item in params.value && nameKeys.indexOf(item) > -1) {
                    return params.value[item];
                  }
                }
                return 'N/A';
              }
            },
            { headerName: 'Region', field: 'resource.labels.region' }
          ]
        },
        { headerName: 'Text Payload', field: 'text_payload' },
        {
          pinned: 'right',
          filter: false,
          sortable: false,
          suppressMenu: true,
          width: 100,
          rowGroup: true,
          valueGetter: (params) => this.service.getErrorLogsViewerUrl(params.data),
          valueFormatter: (params: ValueFormatterParams): string => {
            if (params.node.group) {
              return `Error group: ${params.node.allLeafChildren[0].data.project_id}`;
            }
            return params.node.hasChildren() ? 'Error group' : params.value;
          },
          cellRenderer: (params: ICellRendererParams): string => {
            return `<a class="view-more" href="${params.value}" target="_blank">More <i class="fas fa-external-link-alt"></i></a>`;
          }
        }
      ],
      enableRangeSelection: true,
      suppressScrollOnNewData: true,
      suppressPaginationPanel: true,
      groupUseEntireRow: true,
      groupRemoveSingleChildren: true,
      getRowClass: (params) => {
        if (params.node.parent.allChildrenCount > 1) {
          return 'ag-group-row';
        }
      },
      domLayout: 'autoHeight',
      statusBar: {
        statusPanels: [
          { statusPanel: 'agTotalRowCountComponent', align: 'left' },
          { statusPanel: 'agFilteredRowCountComponent', align: 'left' }
        ]
      }
    };

    this.overlayNoRowsTemplate = '<span class="ag-overlay-loading-center">No errors found</span>';
  }

  rowDataChangedHandler(event: AgGridEvent) {
    if (!event.api.getRowNode('0')) {
      event.api.showNoRowsOverlay();
    }
  }

  onGridReady(event: AgGridEvent): void {
    this.gridApi = event.api;
    this.gridColumnApi = event.columnApi;

    this.gridApi.addEventListener('rowDataChanged', this.rowDataChangedHandler);

    this.changePage();
  }

  changePage(action = null): void {
    this.gridApi.showLoadingOverlay();

    const pageSize = this.pageSize;
    let cursor = null;

    if (action === 'next') {
      cursor = this.pageCursors[this.pageCurrent + 1];
      this.pageHasPrev = true;
      this.pageCurrent++;
    } else if (action === 'prev' && this.pageCurrent > 2) {
      cursor = this.pageCursors[this.pageCurrent];
      this.pageHasPrev = true;
      this.pageCurrent--;
    } else {
      action = 'next';
      this.pageHasPrev = false;
      this.pageHasNext = true;
      this.pageCurrent = 1;
      this.pageCursors = {};
    }

    this.getErrorReports(pageSize, action, cursor).subscribe(
      async result => {
        if (result['results'] && result['results'].length >= 1) {
          if (result['next_cursor']) {
            this.pageCursors[this.pageCurrent + 1] = result['next_cursor'];
          }
          this.gridApi.setRowData(result['results']);
          this.pageHasNext = true;
          this.gridColumnApi.autoSizeAllColumns();
        } else {
          this.pageCurrent--;
          this.pageHasNext = false;
        }
        this.gridApi.hideOverlay();
      },
      error => {
        this.gridApi.setRowData([]);
        this.gridApi.hideOverlay();
        console.log(error);
      }
    );
  }

  getErrorReports(pageSize: number, page: string, cursor: string): Observable<ErrorReportResponse> {
    const requestParams = {
      page_size: pageSize,
      page
    };

    if (cursor) {
      requestParams['cursor'] = cursor;
    }

    return this.httpClient.get<ErrorReportResponse>(
      `${this.env.apiUrl}/error-reports`,
      { params: UtilsService.buildQueryParams(requestParams) }
    );
  }

  getErrorReportName(error: ErrorReport): string {
    const nameKeys = ['function_name', 'service_name', 'revision_name', 'detector_name', 'job_id', 'configuration_name'];
    for (const item in error) {
      if (item in error && nameKeys.indexOf(item) > -1) {
        return error[item];
      }
    }
    return 'N/A';
  }
}
