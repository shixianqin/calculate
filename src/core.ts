import {ArithmeticFunction, TransformModel, ToFixedTypes} from "../types/index";


/**
 * 获取一个数值的小数位长度，不合法的数值或者超大的数值都会返回 0
 * 注意：
 * 如果转换为字符串后出现 e 符号，则表示该数据已经大到需要使用科学表达式来显示，这么大的数据，小数位的值是直接忽略的
 * 22 位以上的数值会以科学计数法显示
 * 包含小数位超过 16 位的数值可能出现硬性误差。例如：123456789.987654321 = 123456789.98765433，123456789987654321 = 123456789987654320
 * @param value 一个数值
 */
function getDecimalLength(value: number): number {
  const valueString: string = value.toString();
  if (valueString.indexOf('e') < 0) {
    const decimal: string = valueString.split('.')[1];
    if (decimal) {
      return decimal.length;
    }
  }
  return 0;
}


/**
 * 把两个数值等比放大为整数，因为整数计算没有精确度误差的问题
 * @param x 一个数值
 * @param y 另一个数值
 */
function transform(x: number, y: number): TransformModel {
  const lengthX: number = getDecimalLength(x);
  const lengthY: number = getDecimalLength(y);
  const t: number = 10 ** (lengthX > lengthY ? lengthX : lengthY);

  // 有时浮点数乘以整10的数也会有计算误差。例如：8.13 * 100 = 813.0000000000001，9.37 * 100 = 936.9999999999999
  // 需要使用 Math.round 四舍五入为整数，杜绝这种情况
  return {
    t,
    x: Math.round(x * t),
    y: Math.round(y * t)
  }
}


/**
 * 加法运算
 * 等比放大为整数的两数之和，再除以放大的倍数得到精确结果
 * @param x 加数1
 * @param y 加数2
 */
export const add: ArithmeticFunction = function (x: number, y: number): number {
  const model: TransformModel = transform(x, y);
  return (model.x + model.y) / model.t;
};


/**
 * 减法运算
 * x - y = x + (-y)
 * @param x 被减数
 * @param y 减数
 */
export const subtract: ArithmeticFunction = function (x: number, y: number): number {
  return add(x, -y);
};


/**
 * 乘法运算
 * 等比放大为整数的两数的积，再除以放大倍数的平方得到精确结果
 * @param x 因数1
 * @param y 因数2
 */
export const multiply: ArithmeticFunction = function (x: number, y: number): number {
  const model: TransformModel = transform(x, y);
  return (model.x * model.y) / (model.t * model.t);
};


/**
 * 除法运算
 * 等比放大为整数的两数的商就是精确的结果
 * @param x 被除数
 * @param y 除数
 */
export const divide: ArithmeticFunction = function (x: number, y: number): number {
  const model: TransformModel = transform(x, y);
  return model.x / model.y;
};


/**
 * 取模运算
 * 等比放大为整数的数值取模的结果，再除以放大的倍数得到精确结果
 * @param x 被除数
 * @param y 除数
 */
export const modulo: ArithmeticFunction = function (x: number, y: number): number {
  const model: TransformModel = transform(x, y);
  return (model.x % model.y) / model.t;
};


/**
 * 定点表示法来格式化一个数值
 * 原生的 toFixed 方法格式化的四舍五入算法不精确，并且不同浏览器实现还不一致
 * 并且原生的 toFixed 方法只支持四舍五入算法
 * 并且原生的 toFixed 只支持小数位格式化，该方法同时支持整数位和小数位
 * @param value 需要格式化的数值
 * @param digits 保留的小数位长度，值为负数则格式化整数位
 * @param type 格式化舍入类型，支持 round,ceil,floor,round465(四舍六入五成双) 四种算法，默认 round
 */
export const toFixed = function (value: number, digits: number, type: ToFixedTypes = 'round'): string {
  // 获取缩放的倍数
  const times: number = 10 ** digits;

  // 缩放
  const zoomValue: number = multiply(value, times);

  // 取整
  const trimValue: number = type === 'round465' ? round465(zoomValue) : Math[type](zoomValue);

  // 还原
  const reductionValue: number = divide(trimValue, times);

  //
  if (digits > 0) {

    // 这里调用原生 toFixed 的原因只是为了末尾可能需要补 '0' 的需求
    // 如果想要手动补 '0' 的话
    // 1.需要先获取小数点的位置
    // 2.涉及小数点就不得不考虑科学表达式的数值
    // 3.科学表达式数值很大一般还不是太常见，而 fractionDigits 大于 0 的情况又是很常见，因此就不考虑手动补 '0' 了
    return reductionValue.toFixed(digits);
  }
  return reductionValue.toString();
};


/**
 * "四舍六入五成双" 修约规则
 * 对于位数很多的近似数，当有效位数确定后，其后面多余的数字应该舍去，只保留有效数字最末一位，
 * 这种修约（舍入）规则是“四舍六入五成双”，也即“4舍6入5凑偶”，
 * 这里“四”是指≤4 时舍去，"六"是指≥6时进上，"五"指的是根据5后面的数字来定，
 * 当5后有数时，舍5入1；当5后无有效数字时，需要分两种情况来讲：
 * （1）5前为奇数，舍5入1；
 * （2）5前为偶数，舍5不进（0是偶数）
 * @param value
 */
export function round465(value: number): number {
  const valueString: string = value.toString();

  // 以科学计数法展示的数值已经超大，小数位会被忽略，也就没有舍入的必要
  if (valueString.indexOf('e') >= 0) {
    return value;
  }

  // 拆分整数和小数
  const [integer, decimal]: string[] = valueString.split('.');

  // 进位值
  let forward: 0 | 1 = 0;

  //
  if (decimal) {
    const keyValue: any = decimal.charAt(0);
    // 大于等于 6 直接进 1
    if (keyValue >= 6) {
      forward = 1;
    } else if (keyValue === '5') {

      // 5 后面还有值，或者 5 前面的数为奇数则进 1
      if (decimal.length > 1 || (integer.charAt(integer.length - 1) as any) % 2 === 1) {
        forward = 1;
      }
    }
  }

  return Number(integer) + forward;
}
