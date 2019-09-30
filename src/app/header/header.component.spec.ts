import { Component } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { TestBed, async, ComponentFixture } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { BrowserModule } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AuthGuard } from '../auth/auth.guard';
import { OAuthService, OAuthModule } from 'angular-oauth2-oidc';

import { EnvServiceProvider } from '../env/env.service.provider';
import { HeaderComponent } from './header.component';

@Component({
  selector: 'app-header',
  template: ''
})
class MockHeaderComponent {}

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

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
        HeaderComponent,
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
    fixture = TestBed.createComponent(HeaderComponent);
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
