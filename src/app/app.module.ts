import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';

import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AgGridModule } from 'ag-grid-angular';

import { AuthGuard } from './auth/auth.guard';
import { TokenInterceptor } from './auth/token.interceptor';
import { LoaderInterceptor } from './loader.interceptor';

import { AppRoutingModule } from './app-routing.module';
import { EnvServiceProvider } from './env/env.service.provider';

import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { LoginComponent } from './components/login/login.component';
import { PageNotAuthorizedComponent } from './components/page-not-authorized/page-not-authorized.component';
import { ModalComponent } from './components/modal/modal.component';
import { ErrorsOverviewComponent } from './errors-overview/errors-overview.component';
import { SecurityOverviewComponent } from './security-overview/security-overview.component';

import { FormPasswordDirective } from './components/login/form-password.directive';
import { DashboardModule } from './dashboard/dashboard.module';

import { registerLocaleData } from '@angular/common';
import localeNl from '@angular/common/locales/nl';

registerLocaleData(localeNl, 'nl');

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    LoginComponent,
    FormPasswordDirective,
    PageNotAuthorizedComponent,
    ModalComponent,
    ErrorsOverviewComponent,
    SecurityOverviewComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    AgGridModule.withComponents([]),
    NgbModule,
    DashboardModule,
    AppRoutingModule
  ],
  exports: [
    AppComponent,
    HeaderComponent,
    LoginComponent,
    FormPasswordDirective,
    PageNotAuthorizedComponent,
    ModalComponent
  ],
  providers: [
    EnvServiceProvider,
    AuthGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoaderInterceptor,
      multi: true
    }
  ],
  entryComponents: [
    ModalComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
