# Calculate
解决 JavaScript 浮点数计算不精确的问题
### 安装
```
npm install @shixianqin/calculate -S
```

### 用法
```javascript
import Calculate from "@shixianqin/calculate";


// 加法
Calculate.add(1.2, 2.2);
// value：3.4
// native js value：3.4000000000000004


// 减法
Calculate.subtract(1.2, 2.2);
// value：-1
// native js value：-1.0000000000000002


// 乘法
Calculate.multiply(0.2, 3.2);
// value：0.64
// native js value：0.6400000000000001


// 除法
Calculate.divide(1.68, 3.2);
// value：0.525
// native js value：0.5249999999999999
```
