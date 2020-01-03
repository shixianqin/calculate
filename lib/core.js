function getDecimalLength(value) {
    const valueString = value.toString();
    if (valueString.indexOf('e') < 0) {
        const decimal = valueString.split('.')[1];
        if (decimal) {
            return decimal.length;
        }
    }
    return 0;
}
function transform(x, y) {
    const lengthX = getDecimalLength(x);
    const lengthY = getDecimalLength(y);
    const t = Math.pow(10, (lengthX > lengthY ? lengthX : lengthY));
    return {
        t,
        x: Math.round(x * t),
        y: Math.round(y * t)
    };
}
export const add = function (x, y) {
    const model = transform(x, y);
    return (model.x + model.y) / model.t;
};
export const subtract = function (x, y) {
    return add(x, -y);
};
export const multiply = function (x, y) {
    const model = transform(x, y);
    return (model.x * model.y) / (model.t * model.t);
};
export const divide = function (x, y) {
    const model = transform(x, y);
    return model.x / model.y;
};
export const modulo = function (x, y) {
    const model = transform(x, y);
    return (model.x % model.y) / model.t;
};
export const toFixed = function (value, digits, type = 'round') {
    const times = Math.pow(10, digits);
    const zoomValue = multiply(value, times);
    const trimValue = type === 'round465' ? round465(zoomValue) : Math[type](zoomValue);
    const reductionValue = divide(trimValue, times);
    if (digits > 0) {
        return reductionValue.toFixed(digits);
    }
    return reductionValue.toString();
};
export function round465(value) {
    const valueString = value.toString();
    if (valueString.indexOf('e') >= 0) {
        return value;
    }
    const [integer, decimal] = valueString.split('.');
    let forward = 0;
    if (decimal) {
        const keyValue = decimal.charAt(0);
        if (keyValue >= 6) {
            forward = 1;
        }
        else if (keyValue === '5') {
            if (decimal.length > 1 || integer.charAt(integer.length - 1) % 2 === 1) {
                forward = 1;
            }
        }
    }
    return Number(integer) + forward;
}
