import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { BehaviorSubject, forkJoin, Observable } from 'rxjs';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalComponent } from '../components/modal/modal.component';

import { EnvService } from '../env/env.service';
import { AuthService } from '../auth/auth.service';
import { BuildTriggerStatus } from './build-status';
import { ErrorReportCount, ErrorReport } from './error-report';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  public buildTriggerStatuses$: BehaviorSubject<BuildTriggerStatus[]> = new BehaviorSubject([]);
  public errorReporting$: BehaviorSubject<ErrorReportCount[]> = new BehaviorSubject([]);

  public refreshTime = 300000; // Time in milliseconds
  public lastUpdate: Date;
  public interval: number;

  public hasError = false;

  dotify(object) {
    const res = {};
    function recurse(obj, current = null) {
      for (const key in obj) {
        if (key in obj) {
          const value = obj[key];
          const newKey = (current ? current + '.' + key : key);  // joined key with dot
          if (value && typeof value === 'object') {
            recurse(value, newKey);  // it's a nested object, so do it again
          } else {
            res[newKey] = value;  // it's not an object, so set the property
          }
        }
      }
    }

    recurse(object);
    return res;
  }


  constructor(
    private httpClient: HttpClient,
    private env: EnvService,
    private authService: AuthService,
    private modalService: NgbModal
  ) { }

  updateData(): void {
    forkJoin([
      this.getBuildStatusesTrigger(),
      this.getErrorReporting()
    ]).subscribe(
        responseList => {
          this.buildTriggerStatuses$.next(responseList[0].filter(
            (value) => {
              return !(value.repo_name === 'backup' && value.status !== 'failing');
            }));
          this.errorReporting$.next(responseList[1]);

          this.lastUpdate = new Date();
        }, error => {
          if (error.status === 401) {
            clearInterval(this.interval);
            this.setModalMessage('Uh uh!', `You made an unauthorized request.`, false);

            setTimeout(() => {
              this.authService.removeApiKey();
            }, 4000 );
          }

          this.lastUpdate = new Date();
          console.log(error);
        });
  }

  get getBranch(): string {
    return this.env.environment;
  }

  setModalMessage(title: string, content: string, backdrop = true): void {
    const modalRef = this.modalService.open(ModalComponent, { backdrop: (backdrop ? backdrop : 'static') });
    modalRef.componentInstance.title = title;
    modalRef.componentInstance.content = content;
    modalRef.componentInstance.backdrop = backdrop;
  }


  getBuildStatusesTrigger(): Observable<BuildTriggerStatus[]> {
    return this.httpClient.get<BuildTriggerStatus[]>(`${this.env.apiUrl}/build-statuses-triggers`);
  }

  getErrorReporting(): Observable<ErrorReportCount[]> {
    return this.httpClient.get<ErrorReportCount[]>(
      `${this.env.apiUrl}/error-reports/counts`,
      { params: {
        days: '7',
        max_rows: '5' // eslint-disable-line camelcase
        } }
    );
  }

  getErrorLogsViewerUrl(error: ErrorReport): string {
    const flat = this.dotify({
      labels: error.labels,
      resource: error.resource
    });

    const advancedFilter = [];

    for (const item in flat) {
      if (item in flat && flat[item] !== '') {
        advancedFilter.push(`${item}%3D%22${flat[item]}%22`);
      }
    }

    return [
      `https://console.cloud.google.com/logs/viewer?project=${error.project_id}`,
      `advancedFilter=${advancedFilter.join('%0A')}`].join('&');
  }
}
