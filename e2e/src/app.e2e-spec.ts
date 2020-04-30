import { browser, protractor, by, element } from 'protractor';
const request = require('request'); // eslint-disable-line

describe('DAT Monitoring', () => {
    beforeEach(() => {
      browser.waitForAngularEnabled(false);
    });

    it('should authenticate', () => {
      browser.get(`/login?apiKey=${browser.params.login.apiKey}`);
      browser.sleep(4000);

      expect(browser.getCurrentUrl()).toContain('dashboard');
    });

    it('should connect to the API', () => {
      const requestOptions = {
        method: 'GET',
        url: browser.params.apiUrl,
        headers: {
          'X-API-KEY': browser.params.login.apiKey
        }
      };

      const get = (options: any): any => {
        const defer = protractor.promise.defer();

        request(options, (error, message) => {
          if (error || message.statusCode >= 400) {
            defer.reject({ error, message });
          } else {
            defer.fulfill(message);
          }
        });
        return defer.promise;
      };

      const setupCommon = (): any => {
        return get(requestOptions);
      };

      const flow = protractor.promise.controlFlow();
      flow.execute(setupCommon).then((response) => {
        expect(response.statusMessage).toBe('OK');
      });
    });

    it('should list more than 0 build statuses', () => {
      browser.get('/');
      browser.sleep(4000);

      const employeeRows = element.all(by.css('.build-status')).count();
      expect(employeeRows).toBeGreaterThan(0);
    });
});
