function isEven(n) {
    return Math.abs(n % 2) != 1;
}

function getRootCode(pfastetter) {

    let array = pfastetter.split("");

    while (!isEven(array[array.length - 1])) {
        array.pop();
    }

    return array.join("");
}

export const createSqlQuery = (array) => {

    let rootCode = getRootCode(array);

    if (isEven(array[array.length - 1])) {
        return `Pfastetter = '${array}'`
    }

    let query = `(Pfastetter >= '${array}' AND Pfastetter LIKE '${rootCode}%') OR Pfastetter LIKE '${rootCode}0%'`;

    return query;
}
