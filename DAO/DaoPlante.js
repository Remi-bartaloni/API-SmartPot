const db = require('../bd/Connexion');
/*
module.exports.all = async function (ctx) {
   return await db.select('*').from('plante').orderBy('nom_plante', 'asc');
}*/

module.exports.find = async function (id) {
    var trame = "SELECT plante.id_plante, plante.nom_plante, image.url_image FROM plante INNER JOIN image on image.id_plante = plante.id_plante Where plante.id_plante = " + id

    var idPlante = await db.raw(trame);

    var str = JSON.stringify(idPlante);
    var search = ']';
    var indexOfFirst = str.indexOf(search);

    var res = str.substr(1 , indexOfFirst )

    //return await res

    return await "{\"list\":" + res + "}"
}

module.exports.findNom = async function (nom) {
    var trame = "SELECT plante.id_plante, plante.nom_plante, image.url_image FROM plante INNER JOIN image on image.id_plante = plante.id_plante Where plante.nom_plante REGEXP '" + nom + "'"

    var idPlante = await db.raw(trame);

    var str = JSON.stringify(idPlante);
    var search = ']';
    var indexOfFirst = str.indexOf(search);

    var res = str.substr(1 , indexOfFirst )

    //return await res

    return await "{\"list\":" + res + "}"
}


module.exports.all = async function (ctx) {
    var trame = "SELECT plante.id_plante, plante.nom_plante, image.url_image FROM plante INNER JOIN image on image.id_plante = plante.id_plante ORDER BY plante.nom_plante ASC"

    var idPlante = await db.raw(trame);

    var str = JSON.stringify(idPlante);
    var search = ']';
    var indexOfFirst = str.indexOf(search);

    var res = str.substr(1 , indexOfFirst )

    //return await res

    return await "{\"list\":" + res + "}"
}
