import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { OAuthModule, OAuthService } from 'angular-oauth2-oidc';
import { AuthGuard } from './auth/auth.guard';
import { TokenInterceptor } from './auth/token.interceptor';

import { AppRoutingModule } from './app-routing.module';
import { EnvServiceProvider } from './env/env.service.provider';

import { AppComponent } from './app.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { DashboardModule } from './dashboard/dashboard.module';

import { registerLocaleData } from '@angular/common';
import localeNl from '@angular/common/locales/nl';
import { HeaderComponent } from './header/header.component';

registerLocaleData(localeNl, 'nl');

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    PageNotFoundComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    OAuthModule.forRoot(),
    NgbModule,
    DashboardModule,
    AppRoutingModule
  ],
  exports: [
    AppComponent,
    HeaderComponent,
    PageNotFoundComponent
  ],
  providers: [
    EnvServiceProvider,
    OAuthService,
    AuthGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
