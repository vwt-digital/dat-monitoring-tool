import { Component } from '@angular/core';
import { DatePipe, TitleCasePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';

import { Observable } from 'rxjs';

import { EnvService } from '../env/env.service';
import { UtilsService } from '../utils.service';
import { SecurityNotification } from '../dashboard/security-notification';

import 'ag-grid-enterprise';
import { AgGridEvent, GridOptions, ValueFormatterParams, ICellRendererParams } from 'ag-grid-community';
import { DashboardService } from '../dashboard/dashboard.service';


@Component({
  selector: 'app-security-command-centre',
  templateUrl: './security-command-centre.component.html',
  styleUrls: ['./security-command-centre.component.scss'],
  providers: [DatePipe, TitleCasePipe]
})

export class SecurityCommandCentreComponent {
  private gridApi;
  private gridColumnApi;

  public gridOptions: GridOptions;
  public overlayLoadingTemplate: string;
  public overlayNoRowsTemplate: string;
  public SecurityNotificationing: SecurityNotification[];

  private pageSize = 10;
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
        autoHeight: true,
        width: 150,
        maxWidth: 500,
        resizable: true,
        flex: 1,
        cellClass: 'cell-wrap-text'
      },
      columnDefs: [
        {
          headerName: 'Updated',
          field: 'updated_at',
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
        { headerName: 'Severity', field: 'severity', pinned: 'left', },
        { headerName: 'Category', field: 'category' },
        { headerName: 'Project ID', field: 'project_id' },
        {
          headerName: 'Explanation',
          field: 'explanation',
          width: 100,
          cellRenderer: this.parseUrlsInString
        },
        {
          headerName: 'Recommendation',
          field: 'recommendation',
          cellRenderer: this.parseUrlsInString
        },
        {
          headerName: 'Created',
          field: 'created_at',
          valueFormatter: (params: ValueFormatterParams): string => {
            if (!isNaN(Date.parse(params.value))) {
              return datePipe.transform(params.value, 'dd-MM-yyyy HH:mm:ss.SSS');
            } else {
              return 'N/B';
            }
          }
        },
        {
          headerName: '',
          pinned: 'right',
          filter: false,
          sortable: false,
          suppressMenu: true,
          width: 100,
          field: 'external_uri',
          cellRenderer: (params: ICellRendererParams): string => {
            return `<a class="view-more" href="${params.value}" target="_blank">View resource <i class="fas fa-external-link-alt"></i></a>`;
          }
        }
      ],
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

    this.overlayLoadingTemplate = '<span class="ag-overlay-loading-center"><i class="fas fa-spinner fa-spin mr-2"></i> Loading data</span>';
    this.overlayNoRowsTemplate = '<span class="ag-overlay-loading-center">No notifications found</span>';
  }

  rowDataChangedHandler(event: AgGridEvent) {
    if (!event.api.getRowNode('0')) {
      event.api.showNoRowsOverlay();
    }
  }

  parseUrlsInString(params: ICellRendererParams): string {
    let value = params.value;
    const urls = /(\b(https?|ftp):\/\/[A-Z0-9+&@#/%?=~_|!:,.;-]*[-A-Z0-9+&@#/%=~_|])/gim;
    const emails = /(\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,6})/gim;

    if (value.match(urls)) {
      value = value.replace(urls, '<a href="$1" target="_blank" title="$1">link</a>');
    }
    if (value.match(emails)) {
      value = value.replace(emails, '<a href="mailto:$1">$1</a>');
    }
    return value;
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

    this.getSecurityNotifications(pageSize, action, cursor).subscribe(
      async result => {
        console.log(result);

        if (result['results'] && result['results'].length >= 1) {
          if (result['next_cursor']) {
            this.pageCursors[this.pageCurrent + 1] = result['next_cursor'];
            this.pageHasNext = true;
          } else {
            this.pageHasNext = false;
          }

          this.gridColumnApi.autoSizeAllColumns();
          this.gridApi.setRowData(result['results']);
          this.gridApi.resetRowHeights();
          this.gridApi.hideOverlay();
        } else {
          this.gridApi.hideOverlay();
          this.gridApi.showNoRowsOverlay();

          this.pageCurrent--;
          this.pageHasNext = false;
        }
      },
      error => {
        this.gridApi.setRowData([]);
        this.gridApi.hideOverlay();
        console.log(error);
      }
    );
  }

  getSecurityNotifications(pageSize: number, page: string, cursor: string): Observable<SecurityNotification> {
    const requestParams = {
      page_size: pageSize,
      page
    };

    if (cursor) {
      requestParams['cursor'] = cursor;
    }

    return this.httpClient.get<SecurityNotification>(
      `${this.env.apiUrl}/security-notifications`,
      { params: UtilsService.buildQueryParams(requestParams) }
    );
  }
}
