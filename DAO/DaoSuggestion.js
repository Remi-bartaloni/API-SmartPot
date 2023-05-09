const db = require('../bd/ConnexionSuggestion');

module.exports.add = async function (id, titre, texte, recommandation, interface, ergonomie) {
    return await db.insert({'id_user': id, 'titre': titre, 'proposition': texte, 'recommandation': recommandation, 'interface': interface, 'ergonomie': ergonomie})
    .into('soumission')
}

module.exports.addPlante = async function (id, nom, lang, information, type, exposition, arrosage, humidite_ambiante, resistance, texture) {
    /*var trame = "INSERT INTO plante(id_user, nom, lang, information, type, exposition, arrosage, humidite_ambiante, resistance, texture) VALUES ('"+id+"','"+nom+"','"+lang+"','"+information+"','"+type+"','"+exposition+"','"+arrosage+"','"+humidite_ambiante+"','"+resistance+"','"+texture+"')"
    var idPlante = await db.raw(trame);

    return idPlante*/

    return await db.insert({'id_user': id, 'nom': nom, 'lang': lang, 'information': information, 'type': type, 'exposition': exposition, 'arrosage': arrosage, 'humidite_ambiante': humidite_ambiante, 'resistance': resistance, 'texture': texture})
    .into('plante')
}

module.exports.addLang = async function (id, lang, origine, correction) {
    /*var trame = "INSERT INTO lang(id_user, lang, origine, correction) VALUES ('"+id+"','"+lang+"','"+origine+"','"+correction+"')"
    var idPlante = await db.raw(trame);

    return idPlante*/

    return await db.insert({'id_user': id, 'lang': lang, 'origine': origine, 'correction': correction})
    .into('lang')
}
