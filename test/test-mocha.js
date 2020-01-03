const assert = require('assert');
const calculate = require('../test/core');

const tests = [
  {
    title: '加法',
    operator: '+',
    handler: calculate.add,
    originHandler (x, y) {
      return Number(x) + Number(y);
    }
  },
  {
    title: '减法',
    operator: '-',
    handler: calculate.subtract,
    originHandler (x, y) {
      return x - y;
    }
  },
  {
    title: '乘法',
    operator: '*',
    handler: calculate.multiply,
    originHandler (x, y) {
      return x * y;
    }
  },
  {
    title: '除法',
    operator: '/',
    handler: calculate.divide,
    originHandler (x, y) {
      return x / y;
    }
  },
  {
    title: '取模',
    operator: '%',
    handler: calculate.modulo,
    originHandler (x, y) {
      return x % y;
    }
  }
];

const range = 1000;
const tempArr = new Array(10).fill('');

function randomNumber (min, max) {
  const diff = max - min;
  const randomValue = Math.random();
  return Math.floor(randomValue * (diff + 1)) + min;
}

tests.forEach((item) => {
  describe(item.title + '运算测试：', function () {
    tempArr.forEach(() => {
      const x = randomNumber(-range, range) / 100;
      const y = randomNumber(-range, range) / 100;
      const z = item.handler(x, y);
      const o = item.originHandler(x, y);
      it(`${x} ${item.operator} ${y} = ${z} (${o})${z === o ? '✅' : '🛠'} `, function () {
        assert.equal(item.handler(x, y), z);
      })
    })
  })
});
