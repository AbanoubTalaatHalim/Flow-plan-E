import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class ParseSkipPipe implements PipeTransform {
  transform(value: any) {
    if (!value) return value;

    const isNumeric = ['string', 'number'].includes(typeof value) && /^-?\d+$/.test(value) && isFinite(value);

    if (!isNumeric) {
      throw new BadRequestException('Numeric string is expected.');
    }

    return parseInt(value, 10);
  }
}
