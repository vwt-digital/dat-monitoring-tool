import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'replaceValue' })

export class ReplaceValuePipe implements PipeTransform {
  transform(value: string, arg1: string, arg2: string): any {
    try {
      return value.replace(
        new RegExp(arg1, 'g'),
        arg2
      );
    } catch {
      return 'N/A';
    }
  }
}
