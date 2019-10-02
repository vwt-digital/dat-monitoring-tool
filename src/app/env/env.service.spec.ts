import { TestBed } from '@angular/core/testing';

import { EnvService } from './env.service';
import { EnvServiceProvider } from './env.service.provider';

describe('EnvService', () => {
  let service: EnvService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        EnvServiceProvider
      ]
    });
  });

  beforeEach(() => {
    service = TestBed.get(EnvService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should define all variables', () => {
    expect(service.loginUrl).toBeDefined();
    expect(service.logoutUrl).toBeDefined();
    expect(service.clientId).toBeDefined();
    expect(service.scope).toBeDefined();
    expect(service.issuer).toBeDefined();

    expect(service.apiUrl).toBeDefined();
    expect(service.environment).toBeDefined();
  });
});
