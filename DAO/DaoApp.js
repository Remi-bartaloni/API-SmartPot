const db = require('../bd/Connexion');

module.exports.version = async function (id, nam) {
    /*
    var trame = "SELECT app.version, app.date, app.description, app.nouveautes FROM app INNER JOIN utilisateur WHERE utilisateur.id_user = " + id + " AND utilisateur.login = '" + nam + "' ORDER BY app.date DESC LIMIT 1"
    var app = await db.raw(trame);

    if (app[0][0] == "") {
        return await 11
    }

    return await app[0][0]
    */

    return await db.first('app.version', 'app.date', 'app.description', 'app.nouveautes')
    .from('app')
    .join('utilisateur')
    .where({'utilisateur.id_user': id, 'utilisateur.login': nam})
    .orderBy('app.date', 'DESC')
}

module.exports.history = async function (id, nam) {
    /*
    var trame = "SELECT app.version, app.date, app.description, app.nouveautes FROM app INNER JOIN utilisateur WHERE utilisateur.id_user = " + id + " AND utilisateur.login = '" + nam + "' ORDER BY app.date ASC"
    var app = await db.raw(trame);

    if (app[0] == "") {
        return await 11
    }

    return await app[0]*/

    return await db.select('app.version', 'app.date', 'app.description', 'app.nouveautes')
    .from('app')
    .join('utilisateur')
    .where({'utilisateur.id_user': id, 'utilisateur.login': nam})
    .orderBy('app.date', 'DESC')
}


module.exports.analyse = async function (id, titr, temp) {
    var trame = "INSERT INTO analyse_utilisation(id_user, nom, temp, date) VALUES ('" + id + "','" + titr + "','" + temp + "', UTC_TIMESTAMP())"
    var app = await db.raw(trame);

    if (app[0]["affectedRows"] == 1) {
        return 200
    }

    return 25
}

module.exports.analyseInfo = async function (id, titr, info) {
    var trame = "INSERT INTO analyse_utilisation_info(id_user, nom, info, date) VALUES ('" + id + "','" + titr + "','" + info + "', UTC_TIMESTAMP())"
    var app = await db.raw(trame);

    if (app[0]["affectedRows"] == 1) {
        return 200
    }

    return 25
}
