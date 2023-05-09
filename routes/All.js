const DaoAll = require('../DAO/DaoAll')
const erreurReturn = require('../erreur')
const ClassAll = require('../Class/ClassAll');

module.exports.test = async function (ctx) {
    //const {id, min, max} = ctx.query
    //let all = await DaoAll.test(id, min, max);
    //ctx.body = all

    ctx.body = "Ok"
}

module.exports.racine = async function (ctx) {
    ctx.body = "API Ok v1.je sais pas"
}

module.exports.search2 = async function (ctx) {
    const {id_plante, langue, unite} = ctx.query
    var lang;
    var info;
    var modifications;

    if (!id_plante)     ctx.throw(202, erreurReturn.erreurReturn(14))

    switch (langue) {
        case "langFR":
        lang = "langues.francais as nom";
        info = "information.francais AS description";
        modifications = "Aucune modification n'a été apportée";
        break;
        case "langEN":
        lang = "langues.english as nom";
        info = "information.english AS description";
        modifications = "An adaptation of the French language to the English language has been made";
        break;
        case "langIT":
        lang = "langues.italiano as nom";
        info = "information.italiano AS description";
        modifications = "È stato effettuato un adattamento della lingua francese alla lingua italiana";
        break;
        case "langES":
        lang = "langues.espanol as nom";
        info = "information.espanol AS description";
        modifications = "Se ha realizado una adaptación del idioma francés al idioma español";
        break;
        default:
        lang = "langues.francais as nom";
        info = "information.francais AS description";
        modifications = "Aucune modification n'a été apportée";
    }

    const all = await DaoAll.info2(id_plante, lang, info);

    let json = {}
    Object.assign(json, {nom:all["nom"]});

    let jsoninformation = {}
    Object.assign(jsoninformation, {titre:all["titre"],credit:all["credit"],source:all["source"],description:all["description"],modifications:modifications});
    Object.assign(json, {information:jsoninformation});

    Object.assign(json, {image:{url_image:all["url_image"],image_auteur:all["image_auteur"],image_oeuvre:all["image_oeuvre"],image_copyright:all["image_copyright"]}});


    let jsonExposition = {exposition:[]}
    let labelExposition = all["label_exposition"].split(',')
    let urlExposition = all["url_exposition"].split(',')
    let minExposition = all["plante_exposition_min"]
    let maxExposition = all["plante_exposition_max"]

    for (let i = 0; i < labelExposition.length; ++i) {
        jsonExposition.exposition.push({label:labelExposition[i],url:urlExposition[i],plante_exposition_min:minExposition,plante_exposition_max:maxExposition})
    }


    let jsonAmbiante = {humidite_ambiante:[]}
    let labelAmbiante = all["label_humidite_ambiante"].split(',')
    let urlAmbiante = all["url_humidite_ambiante"].split(',')
    let minAmbiante = all["plante_humidite_ambiante_min"]
    let maxAmbiante = all["plante_humidite_ambiante_max"]

    for (let i = 0; i < labelAmbiante.length; ++i) {
        jsonAmbiante.humidite_ambiante.push({label:labelAmbiante[i],url:urlAmbiante[i],plante_humidite_ambiante_min:minAmbiante,plante_humidite_ambiante_max:maxAmbiante})
    }

    let jsonArrosage = {arrosage:[]}
    let labelArrosage = all["label_humidite_sol"].split(',')
    let urlArrosage = all["url_humidite_sol"].split(',')
    let minArrosage = all["plante_humidite_min"]
    let maxArrosage = all["plante_humidite_max"]


    for (let i = 0; i < labelArrosage.length; ++i) {
        jsonArrosage.arrosage.push({label:labelArrosage[i],url:urlArrosage[i],plante_humidite_min:minArrosage,plante_humidite_max:maxArrosage})
    }

    let jsonResistance = {resistance:[]}
    let labelResistance = all["label_temperature"].split(',')
    let urlResistance = all["url_temperature"].split(',')
    let minResistance = all["plante_temperature_min"]
    let maxResistance = all["plante_temperature_max"]


    for (let i = 0; i < labelResistance.length; ++i) {
        jsonResistance.resistance.push({label:labelResistance[i],url:urlResistance[i],plante_temperature_min:minResistance,plante_temperature_max:maxResistance})
    }

    let jsonTexture = {texture:[]}
    let labelTexture = all["label_texture"].split(',')
    let urlTexture = all["url_texture"].split(',')

    for (let i = 0; i < labelTexture.length; ++i) {
        jsonTexture.texture.push({label:labelTexture[i],url:urlTexture[i]})
    }

    let jsonType = {type:[]}
    let labelType = all["label_type"].split(',')
    let urlType = all["url_type"].split(',')

    for (let i = 0; i < labelType.length; ++i) {
        jsonType.type.push({label:labelType[i],url:urlType[i]})
    }



    Object.assign(json, jsonExposition);
    Object.assign(json, jsonAmbiante);
    Object.assign(json, jsonArrosage);
    Object.assign(json, jsonResistance);
    Object.assign(json, jsonTexture);
    Object.assign(json, jsonType);
    Object.assign(json, JSON.parse(erreurReturn.erreurReturn(0)));


    switch (unite) {
        case "kelvin":
        for (let i = 0; i < json['resistance'].length; i++) {
            json['resistance'][i]['plante_temperature_min'] = parseFloat((json['resistance'][i]['plante_temperature_min'] + 273.15).toFixed(2));
            json['resistance'][i]['plante_temperature_max'] = parseFloat((json['resistance'][i]['plante_temperature_max'] + 273.15).toFixed(2));
        }
        break;
        case "fahrenheit":
        for (let i = 0; i < json['resistance'].length; i++) {
            json['resistance'][i]['plante_temperature_min'] = parseFloat(((json['resistance'][i]['plante_temperature_min'] * 1.8) + 32).toFixed(2));
            json['resistance'][i]['plante_temperature_max'] = parseFloat(((json['resistance'][i]['plante_temperature_max'] * 1.8) + 32).toFixed(2));
        }
        break;
        case "ra":
        for (let i = 0; i < json['resistance'].length; i++) {
            json['resistance'][i]['plante_temperature_min'] = parseFloat((json['resistance'][i]['plante_temperature_min'] * 9 / 5 + 491.67).toFixed(2));
            json['resistance'][i]['plante_temperature_max'] = parseFloat((json['resistance'][i]['plante_temperature_max'] * 9 / 5 + 491.67).toFixed(2));
        }
        break;
        case "re":
        for (let i = 0; i < json['resistance'].length; i++) {
            json['resistance'][i]['plante_temperature_min'] = parseFloat((json['resistance'][i]['plante_temperature_min'] * 0.8).toFixed(2));
            json['resistance'][i]['plante_temperature_max'] = parseFloat((json['resistance'][i]['plante_temperature_max'] * 0.8).toFixed(2));
        }
        break;
    }

    ctx.body = json
}

module.exports.searchFiltre = async function (ctx) {
    let jsonFiltre = ctx.request.body
    let { langue } = ctx.query
    let lang;

    switch (langue) {
        case "langFR":
        lang = "francais";
        break;
        case "langEN":
        lang = "english";
        break;
        case "langIT":
        lang = "italiano";
        break;
        case "langES":
        lang = "espanol";
        break;
        default:
        lang = "francais";
    }

    let all = await DaoAll.find_filtre(jsonFiltre, lang)
    ctx.body = all

    let res = {}
    Object.assign(res, {list:all});
    Object.assign(res, JSON.parse(erreurReturn.erreurReturn(0)));
    ctx.body = res
}
