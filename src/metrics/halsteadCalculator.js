function safeSum(obj) {

    return Object.values(obj)
        .filter(v => typeof v === "number" && !isNaN(v))
        .reduce((sum, v) => sum + v, 0);
}

function calculateHalstead(operators, operands) {

    const uniqueOperators = Object.keys(operators).length;
    const uniqueOperands = Object.keys(operands).length;

    const totalOperators = safeSum(operators);
    const totalOperands = safeSum(operands);

    const vocabulary = uniqueOperators + uniqueOperands;

    const length = totalOperators + totalOperands;

    const estimatedLength =
        (uniqueOperators * Math.log2(uniqueOperators || 1)) +
        (uniqueOperands * Math.log2(uniqueOperands || 1));

    const diffRatio = Math.abs(estimatedLength - length) / (length || 1);

    let hlc;
    if (diffRatio > 1) {
        hlc = 0;
    } else {
        hlc = 1 - diffRatio;
    }

    return {

        n1: uniqueOperators,
        n2: uniqueOperands,

        N1: totalOperators,
        N2: totalOperands,

        vocabulary,
        length,
        estimatedLength,

        hlc

    };
}

module.exports = {
    calculateHalstead
};