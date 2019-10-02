import { Component } from '@angular/core';

import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';

import { BrowserModule } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AuthGuard } from '../auth/auth.guard';
import { OAuthService, OAuthModule } from 'angular-oauth2-oidc';

import { PageNotFoundComponent } from './page-not-found.component';
import { EnvServiceProvider } from '../env/env.service.provider';

@Component({
  selector: 'app-header',
  template: ''
})
class MockHeaderComponent {}


describe('PageNotFoundComponent', () => {
  let component: PageNotFoundComponent;
  let fixture: ComponentFixture<PageNotFoundComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        BrowserModule,
        HttpClientModule,
        OAuthModule.forRoot(),
        NgbModule
      ],
      declarations: [
        PageNotFoundComponent,
        MockHeaderComponent
      ],
      providers: [
        EnvServiceProvider,
        OAuthService,
        AuthGuard
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PageNotFoundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it(`should have a defined component`, () => {
    expect(component).toBeDefined();
  });
});
