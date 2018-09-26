/*!
 *   2018-5-23
 *   https://github.com/shixianqin/calculate
 */

var Calculate = {

    /**
     * 获取小数点的长度，如果存在科学计数法 E 关键字，长度为 0
     * @param  {Number} num 截取的数字
     * @return {Number}     小数点的长度
     */
    _getDecimalLength: function(num) {

        var value = num.toString(),

            decimal = value.search("e") < 0 ? value.split(".")[1] : 0;

        return decimal ? decimal.length : 0;
    },


    /**
     * 转换需要计算的两个值为整数
     * @param  {Number} a 数值 a
     * @param  {Number} b 数值 b
     * @return {Object}   a: 数值 a 的转换结果，b: 数值 b 的转换结果，times: 放大的倍数
     */
    _transform: function(a, b) {

        var lengthA = this._getDecimalLength(a),

            lengthB = this._getDecimalLength(b),

            // 计算需要放大的倍数
            times = Math.pow(10, lengthA > lengthB ? lengthA : lengthB),

            valueA = a * times,

            valueB = b * times;

        return {

            // 有时数值乘以整数也会有计算误差，使用 parseInt 杜绝这种情况
            // 科学计数法的数值忽略处理
            a: lengthA ? parseInt(valueA) : valueA,

            b: lengthB ? parseInt(valueB) : valueB,

            times: times
        }
    },


    /**
     * 加法计算
     * @param {Number} a 数值 a
     * @param {Number} b 数值 b
     */
    add: function(a, b) {

        var obj = this._transform(a, b);

        // 整数相加后，再除以放大的倍数
        return (obj.a + obj.b) / obj.times;
    },


    /**
     * 减法计算
     * @param {Number} a 数值 a
     * @param {Number} b 数值 b
     */
    sub: function(a, b) {

        // a - b = a + (-b)
        return this.add(a, -b);
    },


    /**
     * 乘法计算
     * @param {Number} a 数值 a
     * @param {Number} b 数值 b
     */
    mul: function(a, b) {

        var obj = this._transform(a, b);

        // 整数相乘后，再除以放大倍数相乘的值
        return obj.a * obj.b / (obj.times * obj.times);
    },


    /**
     * 除法计算
     * @param {Number} a 数值 a
     * @param {Number} b 数值 b
     */
    div: function(a, b) {

        var obj = this._transform(a, b);

        // 除法直接计算，无论放大多少倍，都是一样
        return obj.a / obj.b;
    }
};
