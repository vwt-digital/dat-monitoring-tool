import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'timeDifference' })
export class TimeDifferencePipe implements PipeTransform {
  transform(value: string, args?: any): any {
    try {
      const currentDate = new Date();
      const updatedDate = new Date(value);
      const timeDifference = (currentDate.getTime() - updatedDate.getTime());
      return millisecondsToStr(timeDifference);
    } catch {
      return 'N/A';
    }
  }
}


function millisecondsToStr (milliseconds) {
    function numberEnding (number) {
      return (number > 1) ? 's ago' : ' ago';
    }

    var temp = Math.floor(milliseconds / 1000);
    var years = Math.floor(temp / 31536000);
    if (years) {
      return years + ' year' + numberEnding(years);
    }

    var days = Math.floor((temp %= 31536000) / 86400);
    if (days) {
      return days + ' day' + numberEnding(days);
    }
    var hours = Math.floor((temp %= 86400) / 3600);
    if (hours) {
      return hours + ' hour' + numberEnding(hours);
    }
    var minutes = Math.floor((temp %= 3600) / 60);
    if (minutes) {
      return minutes + ' minute' + numberEnding(minutes);
    }
    var seconds = temp % 60;
    if (seconds) {
      return seconds + ' second' + numberEnding(seconds);
    }
    return 'Just now';
}