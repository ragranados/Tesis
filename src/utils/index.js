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

export const getLastYearInfo = (features) => {
    features.features.sort(function (feature1, feature2) {

        return feature1.attributes.dga - feature2.attributes.dga;
    })

    var aux = features.features[0];
    const filteredFeatures = [];

    features.features.forEach((e, index) => {

        if (e.attributes.anio > aux.attributes.anio) {
            aux = e;
        }

        if (!features.features[index + 1] || e.attributes.dga != features.features[index + 1].attributes.dga) {

            filteredFeatures.push(aux);
            aux = features.features[index + 1];
        }

    }, this);

    features.features = filteredFeatures;

    return features;

}

export const tableFormatting = (results) => {
    console.log('xd');

    return results.map((feature) => {
        return {
            ...feature.attributes,
            consumo_anual_m3: Math.round(feature.attributes.consumo_anual_m3),
        }
    });
}
