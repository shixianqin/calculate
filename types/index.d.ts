// 运算符
export type Operators = '+' | '-' | '*' | '/' | '%';

// round（四舍五入）
// floor（舍）
// ceil（入）
// round465（四舍六入五成双）
export type ToFixedTypes = 'round' | 'floor' | 'ceil' | 'round465';

// 运算函数
export type ArithmeticFunction = (x: number, y: number) => number;

// 数值转换模型
export type TransformModel = { t: number, x: number, y: number };
