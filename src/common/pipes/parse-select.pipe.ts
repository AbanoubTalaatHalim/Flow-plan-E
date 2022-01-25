import { PipeTransform, Injectable } from '@nestjs/common';

@Injectable()
export class ParseSelectPipe implements PipeTransform {
  transform(value: any) {
    if (!value) return value;

    const tokens = value.split(',').map((token) => token.trim());
    const select = tokens;

    return select;
  }
}
