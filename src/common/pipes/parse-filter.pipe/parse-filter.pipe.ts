import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { Between, IsNull, LessThan, LessThanOrEqual, Like, MoreThan, MoreThanOrEqual, Not } from 'typeorm';
import { Grammar, Parser } from 'nearley';

import {
  EquationExpression,
  FilterNode,
  Literal,
  LogicalExpression,
  NumberRangeLiteral,
  PropertyLiteral,
  StringLiteral,
  StringRangeLiteral,
  UnaryExpression,
} from './types';
import { grammar } from './grammar';

function parseFilter(query: string) {
  try {
    const parser = new Parser(Grammar.fromCompiled(grammar));

    parser.feed(query);

    const result = parser.finish();

    return result[0] as FilterNode;
  } catch (error) {
    throw new BadRequestException(`Syntax error at column: ${error.offset}.`);
  }
}

function getKeyValue<T extends EquationExpression>(node: T): [PropertyLiteral, Literal] {
  const { left, right } = node;

  if (left.annotation === 'Property' && right.annotation == 'Property') return [left, right];
  if (left.annotation === 'Property' && right.annotation !== 'Property') return [left, right];

  return [right as PropertyLiteral, left];
}

function logic(node: LogicalExpression) {
  const left = transform(node.left);
  const right = transform(node.right);

  switch (node.operator) {
    case 'and':
      return { ...left, ...right };

    case 'or':
      return [left, right];

    default:
      return;
  }
}

function comparison(node: EquationExpression): any {
  const [key, value] = getKeyValue(node);

  switch (node.operator) {
    case 'eq':
      if (value.annotation === 'Null') return { [key.value]: IsNull() };

      return { [key.value]: value.value };

    case 'gt':
      return { [key.value]: MoreThan(value.value) };

    case 'gte':
      return { [key.value]: MoreThanOrEqual(value.value) };

    case 'lt':
      return { [key.value]: LessThan(value.value) };

    case 'lte':
      return { [key.value]: LessThanOrEqual(value.value) };

    case 'ne':
      if (value.annotation === 'Null') return { [key.value]: Not(IsNull()) };

      return { [key.value]: Not(value.value) };

    case 'like':
      const str = value as StringLiteral;

      if (str.preference === 'startsWith') return { [key.value]: Like(`${value.value}%`) };
      if (str.preference === 'endsWith') return { [key.value]: Like(`%${value.value}`) };

      return { [key.value]: Like(`%${value.value}%`) };

    case 'range':
      const range = value as StringRangeLiteral | NumberRangeLiteral;

      return { [key.value]: Between(range.value[0], range.value[1]) };

    default:
      return;
  }
}

function unary(node: UnaryExpression) {
  const arg = transform(node.argument);

  return Not(arg);
}

function transform(node: FilterNode): any {
  switch (node.kind) {
    case 'ComparisonExpression':
      return comparison(node);

    case 'LogicalExpression':
      return logic(node);

    case 'UnaryExpression':
      return unary(node);

    default:
      return;
  }
}

@Injectable()
export class ParseFilterPipe implements PipeTransform {
  transform(value: any) {
    if (!value) return value;

    return transform(parseFilter(value));
  }
}
