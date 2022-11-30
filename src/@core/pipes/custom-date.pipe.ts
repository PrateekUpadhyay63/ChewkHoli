import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'customDate'
})
export class CustomDatePipe implements PipeTransform {

  transform(value: any): any {

    if (value) {
        const temp = value.toString().replace(' ', 'T');
        return new Date(temp);
    } else {
        return null;
    }
}

}
