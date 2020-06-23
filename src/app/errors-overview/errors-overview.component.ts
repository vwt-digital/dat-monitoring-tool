import { Component, OnInit } from '@angular/core';
import { DatePipe, TitleCasePipe } from '@angular/common';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';

import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

import { EnvService } from '../env/env.service';
import { UtilsService } from '../utils.service';
import { ErrorReport } from '../dashboard/error-report';

import 'ag-grid-enterprise';
import { GridOptions } from 'ag-grid-community';
import { DashboardService } from '../dashboard/dashboard.service';


@Component({
  selector: 'app-errors-overview',
  templateUrl: './errors-overview.component.html',
  styleUrls: ['./errors-overview.component.scss'],
  providers: [DatePipe, TitleCasePipe]
})
export class ErrorsOverviewComponent implements OnInit {
  gridOptions: GridOptions;
  overlayNoRowsTemplate: string;
  errorReporting$: Observable<ErrorReport[]>;

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
          valueFormatter: (params: any) => {
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
              valueFormatter: (params: any) => {
                return titleCasePipe.transform(
                  params.value.replace(/[^a-zA-Z0-9]/g, ' '));
              }
            },
            {
              headerName: 'Name',
              field: 'resource.labels',
              valueFormatter: (params: any) => {
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

  ngOnInit() {
    this.errorReporting$ = this.route.paramMap.pipe(
      switchMap(() => {
        return this.getErrorReports();
      })
    );
  }

  getErrorReports(): Observable<ErrorReport[]> {
    const queryParams: HttpParams = UtilsService.buildQueryParams({limit: 30});
    return this.httpClient.get<ErrorReport>(
      `${this.env.apiUrl}/error-reports`, { params: queryParams })
      .pipe(map((response: any) => response));
  }

  onGridReady(event: any) {
    event.api.showLoadingOverlay();

    this.errorReporting$.subscribe(
      async result => {
        event.api.setRowData(result);
        event.api.hideOverlay();
        event.columnApi.autoSizeAllColumns();

        if (result.length <= 0) {
          event.api.showNoRowsOverlay();
        }
      },
      error => {
        console.log(error);
      }
    );
  }
}
