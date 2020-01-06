# calculate
1. 解决 JavaScript 浮点数运算不精确的问题  
2. 支持 “[四舍六入五成双](https://baike.baidu.com/item/四舍六入五成双/9062547)” 修约规则
3. 增强 `Number.prototype.toFixed` 方法  
    + 原生方法四舍五入修约不精确，并且不同浏览器实现不一致
    + 原生方法不支持 ceil,floor 等修约规则
    + 原生方法不支持修约整数位


## 安装
```
npm i @shixianqin/calculate -S
```


## 导入
```typescript
// 全部导入
import * as calculate from '@shixianqin/calculate';

// 按需导入
import {
  add,
  subtract,
  multiply,
  divide,
  modulo,
  round465,
  toFixed
} from '@shixianqin/calculate';
```

如果项目没有支持 TypeScript，也可以导入 lib 目录下的 `core.js` 文件
```javascript
import * as calculate from '@shixianqin/calculate/lib/core';
```


## 运算方法

#### 加法
+ 类型
```typescript
add(x: number, y: number): number;
```

+ 参数  
`x` 加数1  
`y` 加数2

#### 减法
+ 类型
```typescript
subtract(x: number, y: number): number;
```

+ 参数  
`x` 被减数  
`y` 减数

#### 乘法
+ 类型
```typescript
multiply(x: number, y: number): number;
```

+ 参数  
`x` 因数1  
`y` 因数2

#### 除法
+ 类型
```typescript
divide(x: number, y: number): number;
```

+ 参数  
`x` 被除数  
`y` 除数

#### 取模
虽然通常情况下 x 和 y 都是整数，但许多计算系统允许对浮点数取模。
+ 类型
```typescript
modulo(x: number, y: number): number;
```

+ 参数  
`x` 被除数  
`y` 除数


## 四舍六入五成双
四舍六入五成双是一种比较精确比较科学的计数保留法，是一种数字修约规则。  
对于位数很多的近似数，当有效位数确定后，其后面多余的数字应该舍去，只保留有效数字最末一位，这种修约（舍入）规则是“四舍六入五成双”，也即“4 舍 6 入 5 凑偶”，这里“四”是指 ≤ 4 时舍去，"六"是指 ≥ 6 时进上，"五"指的是根据 5 后面的数字来定，当 5 后有数时，舍 5 入 1；当 5 后无有效数字时，需要分两种情况来讲：  
1. 5 前为奇数，舍 5 入 1；  
2. 5 前为偶数，舍 5 不进（0 是偶数）。
+ 类型  
```typescript
round465(value: number): number;
```

+ 参数  
`value` 一个数值

+ 示例
```typescript
round465(1.5); // 2
round465(2.5); // 2
round465(2.51); // 3
```


## toFixed
+ 类型
```typescript
toFixed(value: number, digits: number, type: 'round'|'ceil'|'floor'|'round465' = 'round'): string;
```

+ 参数  
`value` 一个数值  
`digits` 保留的小数位个数，如果该值为负数则修约到对应的整数位  
`type` 数值修约规则，支持 round(四舍五入), ceil(向上取整), floor(向下取整), round465(四舍六入五成双) 四种规则。默认 round

+ 示例
```typescript
toFixed(1.2345, 2, 'round'); // 1.23
toFixed(1.2345, 2, 'ceil'); // 1.24
toFixed(1.2345, 2, 'floor'); // 1.23
toFixed(1.2345, 2, 'round465'); // 1.23
toFixed(567.89, -2); // 600
```


## 精确度问题的原因和解决方案
[JavaScript 浮点数陷阱及解法](https://github.com/camsong/blog/issues/9)


## 参考
[number-precision](https://github.com/nefe/number-precision)  
[bignumber.js](https://github.com/MikeMcl/bignumber.js/)  
[big.js](https://github.com/MikeMcl/big.js/)  
[decimal.js](https://github.com/MikeMcl/decimal.js/)  
[BigInteger.js](https://github.com/peterolson/BigInteger.js)  
