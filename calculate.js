/*!
 *   2018-5-23
 *   https://github.com/shixianqin/calculate
 */

var Calculate = (function() {

    function translate(a, b) {
        var dot = /\./,
            empty = "",
            dotA = a.toString().split(dot)[1] || empty,
            dotB = b.toString().split(dot)[1] || empty,
            max = Math.max(dotA.length, dotB.length);

        return {
            a: Number(a.toFixed(max).replace(dot, empty)),
            b: Number(b.toFixed(max).replace(dot, empty)),
            max: max
        }
    }

    return {

        add: function(a, b) {
            var obj = translate(a, b),
                value = obj.a + obj.b;

            return obj.max ? value / Math.pow(10, obj.max) : value;
        },

        sub: function(a, b) {
            return this.add(a, -b);
        },

        mul: function(a, b) {
            var obj = translate(a, b),
                value = obj.a * obj.b;

            return obj.max ? value / Math.pow(10, obj.max * 2) : value;
        },

        div: function(a, b) {
            var obj = translate(a, b);
            return obj.a / obj.b;
        }
    }

})();
