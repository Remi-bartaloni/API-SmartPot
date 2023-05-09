const db = require('../bd/Connexion');

module.exports.all = async function (id, nam, uuid) {
    /*
    var trame = "SELECT * FROM utilisateur INNER JOIN app WHERE id_user = " + id + " AND login = '" + nam + "' AND uuid = '" + uuid + "' ORDER BY app.date DESC LIMIT 0,1"

    var idPlante = await db.raw(trame);

    if (idPlante[0][0]["version"] == "" || idPlante[0][0]["version"] == undefined) {
        return 1
    }

    return await idPlante[0][0]["version"]*/

    var info = await db.first('*')
    .from('utilisateur')
    .join('app')
    .where({'id_user': id, 'login': nam, 'uuid': uuid})
    .orderBy('app.date', 'DESC')

    if (info.version == "" || info.version == undefined) {
        return 1
    }

    return info.version
}

module.exports.uuidExist = async function (uuid) {
    var res = await db.first('uuid').from('utilisateur').where({ uuid: uuid });

    if (res != null) {
        if (res.uuid = uuid) {
            return 200;
        }
        return 401;
    }

    return 401;
}

module.exports.exist = async function (id, nam, uuid) {
    var res = await db.first('uuid').from('utilisateur').where({ uuid: uuid, id_user: id, login: nam, disabled: 0 });
    if (res != null) {
        return 200;
    }
    return 11;
}

module.exports.cgu_version = async function (id, nam, uuid, cgu_version) {
    var res = await db.first('cgu_version').from('utilisateur').where({ uuid: uuid, id_user: id, login: nam, disabled: 0 });
    if (res != null) {
        if (res.cgu_version == cgu_version) {
            return 200;
        }
        return 35;
    }
    return 11;
}
