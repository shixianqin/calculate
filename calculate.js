/**
 * 获取一个数值的小数位长度
 * @param value
 * @returns {number|*}
 */
function getDigits (value) {
  if (isFinite(value)) {
    const valueStr = value.toString();
    const digits = (/e/i).test(valueStr) ? null : valueStr.split('.')[1];
    return digits ? digits.length : 0;
  }
  return value;
}

/**
 * 把两个数值转换为整数，因为整数计算没有精确度的问题
 * @param a
 * @param b
 * @returns {{a: number, times: number, b: number}}
 */
function transform (a, b) {
  const maxDigits = Math.max(getDigits(a), getDigits(b));
  const times = Math.pow(10, maxDigits);
  const valueA = a * times;
  const valueB = b * times;

  // 有时浮点数乘以整10的数也会有计算误差，比如：1.23456 * 100000 = 123456.00000000001
  // 需要使用 Math.round 杜绝这种情况
  return {
    times,
    a: Math.round(valueA),
    b: Math.round(valueB)
  }
}


export const Calculate = {
  // 加法计算
  add (a, b) {
    const model = transform(a, b);
    return (model.a + model.b) / model.times; // 整数相加后，再除以放大的倍数
  },

  // 减法计算
  sub (a, b) {
    return this.add(a, -b); // a - b = a + (-b)
  },

  // 乘法计算
  mul (a, b) {
    const model = transform(a, b);
    return model.a * model.b / (model.times * model.times); // 整数相乘后，再除以放大倍数相乘的值
  },

  // 除法计算
  div (a, b) {
    const model = transform(a, b);
    return model.a / model.b; // 除法直接计算，无论放大多少倍，都是一样
  }
};
