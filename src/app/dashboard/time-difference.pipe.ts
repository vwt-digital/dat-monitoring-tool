import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'timeDifference' })
export class TimeDifferencePipe implements PipeTransform {
  transform(value: string): string {
    if (value) {
      try {
        const currentDate = new Date();
        const updatedDate = new Date(value);
        const timeDifference = (currentDate.getTime() - updatedDate.getTime());
        return millisecondsToStr(timeDifference);
      } catch {
        return 'N/A';
      }
    } else {
      return 'N/A';
    }
  }
}


function millisecondsToStr(milliseconds): string {
    function numberEnding(endingNumber: number): string {
      return (endingNumber > 1) ? 's ago' : ' ago';
    }

    let temp = Math.floor(milliseconds / 1000);
    const years = Math.floor(temp / 31536000);
    if (years) {
      return years + ' year' + numberEnding(years);
    }

    const days = Math.floor((temp %= 31536000) / 86400);
    if (days) {
      return days + ' day' + numberEnding(days);
    }
    const hours = Math.floor((temp %= 86400) / 3600);
    if (hours) {
      return hours + ' hour' + numberEnding(hours);
    }
    const minutes = Math.floor((temp %= 3600) / 60);
    if (minutes) {
      return minutes + ' minute' + numberEnding(minutes);
    }
    const seconds = temp % 60;
    if (seconds) {
      return seconds + ' second' + numberEnding(seconds);
    }
    return 'Just now';
}
