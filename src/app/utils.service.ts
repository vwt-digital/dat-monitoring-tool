import { HttpParams } from '@angular/common/http';
import { isNil, isPlainObject } from 'lodash';

export class UtilsService {
  static buildQueryParams(source: { property: string | number; }): HttpParams {
    let target: HttpParams = new HttpParams();

    Object.keys(source).forEach((key: string) => {
      let value: string | number = source[key];

      if (isNil(value)) {
        return;
      }

      if (isPlainObject(value)) {
        value = JSON.stringify(value);
      } else {
        value = value.toString();
      }

      target = target.append(key, value);
    });

    return target;
  }
}
