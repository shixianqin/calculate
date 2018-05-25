/*!
 *   2018-5-23
 *   https://github.com/shixianqin/calculate
 */

var Calculate = {

    _convert: function(a, b) {
        var dot = ".",
            empty = "",
            dotA = a.toString().split(dot)[1] || empty,
            dotB = b.toString().split(dot)[1] || empty,
            times = Math.pow(10, Math.max(dotA.length, dotB.length));

        return {
            a: a * times,
            b: b * times,
            times: times
        }
    },

    add: function(a, b) {
        var obj = this._convert(a, b),
            value = obj.a + obj.b;
        return obj.times > 1 ? value / obj.times : value;
    },

    sub: function(a, b) {
        return this.add(a, -b);
    },

    mul: function(a, b) {
        var obj = this._convert(a, b),
            value = obj.a * obj.b,
            times = obj.times;
        return times > 1 ? value / (times * times) : value;
    },

    div: function(a, b) {
        var obj = this._convert(a, b);
        return obj.a / obj.b;
    }
};
