import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'timeToText' })
export class TimeToTextPipe implements PipeTransform {
  transform(value: number): string {
    try {
      return millisecondsToStr(value);
    } catch {
      return 'N/A';
    }
  }
}


function millisecondsToStr(milliseconds: number): string {
  let temp = Math.floor(milliseconds / 1000);
  const years = Math.floor(temp / 31536000);
  if (years) {
    return years + 'y';
  }

  const days = Math.floor((temp %= 31536000) / 86400);
  if (days) {
    return days + 'd';
  }
  const hours = Math.floor((temp %= 86400) / 3600);
  if (hours) {
    return hours + 'h';
  }
  const minutes = Math.floor((temp %= 3600) / 60);
  if (minutes) {
    return minutes + 'm';
  }
  const seconds = temp % 60;
  if (seconds) {
    return seconds + 's';
  }
  return '';
}
