import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { LoaderService } from './loader.service';
import { DashboardService } from './dashboard/dashboard.service';

@Injectable()
export class LoaderInterceptor implements HttpInterceptor {
  private requests: HttpRequest<any>[] = [];

  constructor(
    private loaderService: LoaderService,
    private service: DashboardService
  ) { }

  removeRequest(req: HttpRequest<any>) {
    const i = this.requests.indexOf(req);
    this.requests.splice(i, 1);
    this.loaderService.isLoading.next(this.requests.length > 0);
    this.loaderService.isError.next(this.requests.length > 0);
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.requests.push(req);

    this.loaderService.isLoading.next(true);

    return new Observable(observer => {
      const subscription = next.handle(req)
        .subscribe(
          event => {
            if (event instanceof HttpResponse) {
              this.removeRequest(req);
              observer.next(event);
            }
          },
          err => {
            this.removeRequest(req);
            observer.error(err);
            this.loaderService.isError.next(true);
          },
          () => { this.removeRequest(req); observer.complete(); }
        );
      return () => {
        this.removeRequest(req);
        subscription.unsubscribe();
      };
    });
  }
}
