export type FilterNode =
  | LogicalExpression
  | ComparisonExpression
  | UnaryExpression
  | PropertyLiteral
  | BooleanLiteral
  | NumberLiteral
  | StringLiteral
  | LikeExpression
  | RangeExpression;

export type Literal =
  | BooleanLiteral
  | NumberLiteral
  | PropertyLiteral
  | StringLiteral
  | StringRangeLiteral
  | NumberLiteral
  | NumberRangeLiteral
  | NullLiteral;

export type EquationExpression = ComparisonExpression | LikeExpression | RangeExpression;

export type EquationOperator = 'gt' | 'lt' | 'gte' | 'lte' | 'ne' | 'eq' | 'like' | 'range';

export type LogicalOperator = 'and' | 'or';

export interface LogicalExpression {
  kind: 'LogicalExpression';
  operator: 'and' | 'or';
  left: FilterNode;
  right: FilterNode;
  col: number;
}

export interface ComparisonExpression {
  kind: 'ComparisonExpression';
  operator: 'gt' | 'lt' | 'gte' | 'lte' | 'ne' | 'eq';
  left: Literal;
  right: Literal;
  col: number;
}

export interface LikeExpression {
  kind: 'ComparisonExpression';
  operator: 'like';
  left: PropertyLiteral;
  right: StringLiteral;
  col: number;
}

export interface RangeExpression {
  kind: 'ComparisonExpression';
  operator: 'range';
  left: PropertyLiteral;
  right: StringRangeLiteral | NumberRangeLiteral;
  col: number;
}

export interface UnaryExpression {
  kind: 'UnaryExpression';
  operator: 'not';
  argument: EquationExpression | LogicalExpression;
  col: number;
}

export interface PropertyLiteral {
  kind: 'Literal';
  annotation: 'Property';
  preference: 'none';
  value: 'string';
  col: number;
}

export interface BooleanLiteral {
  kind: 'Literal';
  annotation: 'Boolean';
  preference: 'none';
  value: boolean;
  col: number;
}

export interface NumberLiteral {
  kind: 'Literal';
  annotation: 'Number';
  preference: 'none';
  value: number;
  col: number;
}

export interface StringLiteral {
  kind: 'Literal';
  annotation: 'String';
  preference: 'startsWith' | 'endsWith' | 'contains' | 'none';
  value: string;
  col: number;
}

export interface StringRangeLiteral {
  kind: 'Literal';
  annotation: 'String';
  preference: 'range';
  value: [string, string];
  col: number;
}

export interface NumberRangeLiteral {
  kind: 'Literal';
  annotation: 'Number';
  preference: 'range';
  value: [number, number];
  col: number;
}

export interface NullLiteral {
  kind: 'Literal';
  annotation: 'Null';
  preference: 'none';
  value: undefined;
  col: number;
}
