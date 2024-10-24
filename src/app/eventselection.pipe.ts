import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'eventselection'
})
export class EventselectionPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }

}
