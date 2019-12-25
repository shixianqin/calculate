/**
 * 获取一个数值的小数位长度
 * @param value
 */
function getDecimalLength(value: number): number {
  if (isFinite(value)) {
    const valueStr: string = value.toString();
    // 如果转换为字符串后出现 `e` 符号，则表示该数据已经大到需要使用科学表达式来显示，这么大的数据，小数位的值是直接忽略的
    if (!(/e/.test(valueStr))) {
      const decimal: string | undefined = valueStr.split('.')[1];
      if (decimal) {
        return decimal.length;
      }
    }
  }
  return 0;
}

/**
 * 把两个数值转换为整数，因为整数计算没有精确度的问题
 * @param a
 * @param b
 */
function transform(a: number, b: number): { times: number; a: number; b: number } {
  const decimalALength: number = getDecimalLength(a);
  const decimalBLength: number = getDecimalLength(b);
  const maxDecimalLength: number = decimalALength > decimalBLength ? decimalALength : decimalBLength; // Math.max(decimalALength, decimalBLength);
  const times: number = 10 ** maxDecimalLength; // Math.pow(10, maxDecimalLength);
  const valueA: number = a * times;
  const valueB: number = b * times;

  // 有时浮点数乘以整10的数也会有计算误差，比如：1.23456 * 100000 = 123456.00000000001
  // 需要使用 Math.round 转换为整数，杜绝这种情况
  return {
    times,
    a: Math.round(valueA),
    b: Math.round(valueB)
  }
}

const Calculate: { [key: string]: (x: number, y: number) => number } = {
  // 加法计算
  add(x, y) {
    const {a, b, times} = transform(x, y);
    return (a + b) / times; // 整数相加后，再除以放大的倍数
  },

  // 减法计算
  subtract(x, y) {
    return this.add(x, -y); // a - b = a + (-b)
  },

  // 乘法计算
  multiply(x, y) {
    const {a, b, times} = transform(x, y);
    return a * b / (times * times); // 整数相乘后，再除以放大倍数相乘的值
  },

  // 除法计算
  divide(x, y) {
    const {a, b} = transform(x, y);
    return a / b; // 除法直接计算，无论放大多少倍，都是一样
  },

  // 求余运算
  remainder(x, y) {
    const {a, b, times} = transform(x, y);
    return (a % b) / times;
  }
};

export default Calculate;
