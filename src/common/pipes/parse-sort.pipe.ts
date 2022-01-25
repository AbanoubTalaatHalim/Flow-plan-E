import { PipeTransform, Injectable } from '@nestjs/common';

const queryRegex = /^(\+|\-)*\s*[a-zA-Z_]+[a-zA-Z0-9_]*/;
const operatorRegex = /^(\+|\-)\s*/;

@Injectable()
export class ParseSortPipe implements PipeTransform {
  transform(value: any) {
    if (!value) return value;

    const tokens = value.split(',').map((token) => token.trim());
    const sort = {};

    for (const token of tokens) {
      if (queryRegex.test(token)) {
        const name = token.replace(operatorRegex, '');
        const order = token.startsWith('-') ? 'DESC' : 'ASC';

        sort[name] = order;
      }
    }

    return sort;
  }
}
