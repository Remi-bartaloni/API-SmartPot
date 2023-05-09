const DaoPot = require('../DAO/DaoSuggestion')
const exist = require('../DAO/DaoVerif')
const erreurReturn = require('../erreur')

module.exports.add = async function (ctx) {
    let {titre, texte, recommandation, interface, ergonomie} = ctx.query
    const {uuid} = ctx.request.header

    if(!titre)       ctx.throw(202, erreurReturn.erreurReturn(31))
    if(!texte)       ctx.throw(202, erreurReturn.erreurReturn(31))
    if(!uuid)       ctx.throw(202, erreurReturn.erreurReturn(6))

    if(!recommandation)     recommandation = "-1"
    if(!interface)          interface = "-1"
    if(!ergonomie)          ergonomie = "-1"

    const id = ctx.request.jwtPayloadTo.sub
    const nam = ctx.request.jwtPayloadTo.name

    const valid = await exist.exist(id, nam, uuid)
    if (valid == 11)         ctx.throw(202, erreurReturn.erreurReturn(11))

    titre = titre.replaceAll("'", "\\'");
    texte = texte.replaceAll("'", "\\'");

    var res = await DaoPot.add(id, titre, texte, recommandation, interface, ergonomie)

    if (res == 0) {
        ctx.throw(202, erreurReturn.erreurReturn(25))
    }

    ctx.body = JSON.parse(erreurReturn.erreurReturn(0))
}

module.exports.addPlante = async function (ctx) {
    const {nom, lang, information, type, exposition, arrosage, humidite_ambiante, resistance, texture} = ctx.query
    const {uuid} = ctx.request.header

    if(!nom)       ctx.throw(202, erreurReturn.erreurReturn(31))
    if(!lang)       ctx.throw(202, erreurReturn.erreurReturn(31))
    if(!information)       ctx.throw(202, erreurReturn.erreurReturn(31))
    if(!type)       ctx.throw(202, erreurReturn.erreurReturn(31))
    if(!exposition)       ctx.throw(202, erreurReturn.erreurReturn(31))
    if(!arrosage)       ctx.throw(202, erreurReturn.erreurReturn(31))
    if(!humidite_ambiante)       ctx.throw(202, erreurReturn.erreurReturn(31))
    if(!resistance)       ctx.throw(202, erreurReturn.erreurReturn(31))
    if(!texture)       ctx.throw(202, erreurReturn.erreurReturn(31))
    if(!uuid)       ctx.throw(202, erreurReturn.erreurReturn(6))

    const id = ctx.request.jwtPayloadTo.sub
    const nam = ctx.request.jwtPayloadTo.name

    const valid = await exist.exist(id, nam, uuid)
    if (valid == 11)         ctx.throw(202, erreurReturn.erreurReturn(11))

    let type2 = ""
    let exposition2 = ""
    let arrosage2 = ""
    let humidite_ambiante2 = ""
    let resistance2 = ""
    let texture2 = ""

    if (Array.isArray(type)) {
        for (let i = 0; i < type.length; ++i) {
            type2 += '"' + type[i] + '",'
        }
        type2 = type2.slice(0, -1);
    }
    else {
        type2 += '"' + type + '"'
    }

    if (Array.isArray(exposition)) {
        for (let i = 0; i < exposition.length; ++i) {
            exposition2 += '"' + exposition[i] + '",'
        }
        exposition2 = exposition2.slice(0, -1);
    }
    else {
        exposition2 += '"' + exposition + '"'
    }

    if (Array.isArray(arrosage)) {
        for (let i = 0; i < arrosage.length; ++i) {
            arrosage2 += '"' + arrosage[i] + '",'
        }
        arrosage2 = arrosage2.slice(0, -1);
    }
    else {
        arrosage2 += '"' + arrosage + '"'
    }

    if (Array.isArray(humidite_ambiante)) {
        for (let i = 0; i < humidite_ambiante.length; ++i) {
            humidite_ambiante2 += '"' + humidite_ambiante[i] + '",'
        }
        humidite_ambiante2 = humidite_ambiante2.slice(0, -1);
    }
    else {
        humidite_ambiante2 += '"' + humidite_ambiante + '"'
    }

    if (Array.isArray(resistance)) {
        for (let i = 0; i < resistance.length; ++i) {
            resistance2 += '"' + resistance[i] + '",'
        }
        resistance2 = resistance2.slice(0, -1);
    }
    else {
        resistance2 += '"' + resistance + '"'
    }

    if (Array.isArray(texture)) {
        for (let i = 0; i < texture.length; ++i) {
            texture2 += '"' + texture[i] + '",'
        }
        texture2 = texture2.slice(0, -1);
    }
    else {
        texture2 += '"' + texture + '"'
    }

    type2 = '{"Type":['+type2+']}'
    exposition2 = '{"Exposition":['+exposition2+']}'
    arrosage2 = '{"Arrosage":['+arrosage2+']}'
    humidite_ambiante2 = '{"Humidite_ambiante":['+humidite_ambiante2+']}'
    resistance2 = '{"Resistance":['+resistance2+']}'
    texture2 = '{"Texture":['+texture2+']}'

    var res = await DaoPot.addPlante(id, nom, lang, information, type2, exposition2, arrosage2, humidite_ambiante2, resistance2, texture2)

    if (res[0]["affectedRows"] == 0) {
        ctx.throw(202, erreurReturn.erreurReturn(25))
    }

    ctx.body = JSON.parse(erreurReturn.erreurReturn(0))
}

module.exports.addLang = async function (ctx) {
    let {lang, origine, correction} = ctx.query
    const {uuid} = ctx.request.header

    if(!lang)       ctx.throw(202, erreurReturn.erreurReturn(31))
    if(!origine)       ctx.throw(202, erreurReturn.erreurReturn(31))
    if(!correction)       ctx.throw(202, erreurReturn.erreurReturn(31))
    if(!uuid)       ctx.throw(202, erreurReturn.erreurReturn(6))

    const id = ctx.request.jwtPayloadTo.sub
    const nam = ctx.request.jwtPayloadTo.name

    var valid = await exist.exist(id, nam, uuid)
    if (valid == 11)         ctx.throw(202, erreurReturn.erreurReturn(11))

    origine = decodeURI(origine)
    origine = origine.replaceAll("'", "\\'")

    correction = decodeURI(correction)
    correction = correction.replaceAll("'", "\\'")

    var res = await DaoPot.addLang(id, lang, origine, correction)

    if (res[0]["affectedRows"] == 0) {
        ctx.throw(202, erreurReturn.erreurReturn(25))
    }

    ctx.body = JSON.parse(erreurReturn.erreurReturn(0))
}
