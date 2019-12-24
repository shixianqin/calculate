/**
 * 获取一个数值的小数位长度
 * @param value
 */
function getDecimalLength (value) {
  if (isFinite(value)) {
    var valueStr = value.toString();
    // 如果转换为字符串后存在 `e` 字符串，则表示该数据已经大到需要使用科学表达式来显示，这么大的数据，小数位的值是直接忽略的
    var decimal = (/e/i).test(valueStr) ? '' : valueStr.split('.')[1];
    return decimal ? decimal.length : 0;
  }
  return value;
}

/**
 * 把两个数值转换为整数，因为整数计算没有精确度的问题
 * @param a
 * @param b
 */
function transform (a, b) {
  var decimalALength = getDecimalLength(a);
  var decimalBLength = getDecimalLength(b);
  var maxDecimalLength = decimalALength > decimalBLength ? decimalALength : decimalBLength; // Math.max(decimalALength, decimalBLength);
  var times = Math.pow(10, maxDecimalLength); // Math.pow(10, maxDecimalLength);
  var valueA = a * times;
  var valueB = b * times;
  // 有时浮点数乘以整10的数也会有计算误差，比如：1.23456 * 100000 = 123456.00000000001
  // 需要使用 Math.round 转换为整数，杜绝这种情况
  return {
    times: times,
    a: Math.round(valueA),
    b: Math.round(valueB)
  };
}

var Calculate = {
  // 加法计算
  add: function (x, y) {
    var _a = transform(x, y), a = _a.a, b = _a.b, times = _a.times;
    return (a + b) / times; // 整数相加后，再除以放大的倍数
  },
  // 减法计算
  subtract: function (x, y) {
    return this.add(x, -y); // a - b = a + (-b)
  },
  // 乘法计算
  multiply: function (x, y) {
    var _a = transform(x, y), a = _a.a, b = _a.b, times = _a.times;
    return a * b / (times * times); // 整数相乘后，再除以放大倍数相乘的值
  },
  // 除法计算
  divide: function (x, y) {
    var _a = transform(x, y), a = _a.a, b = _a.b;
    return a / b; // 除法直接计算，无论放大多少倍，都是一样
  }
};
