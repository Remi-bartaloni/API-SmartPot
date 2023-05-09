const db = require('../bd/Connexion');
const aes256 = require('aes256');

module.exports.add = async function (login, password, mail, cgu_version) {
    var mailVerif = await db.count('mail as nb')
    .from('utilisateur')
    .where({'mail': mail})

    var loginVerif = await db.count('mail as nb')
    .from('utilisateur')
    .where({'login': login})


    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if(mailVerif[0].nb > 0 )  return await 1
    if(re.test(mail) == false )  return await 5
    if(loginVerif[0].nb != "")  return await 2

    const isoStr = new Date().toISOString();
    const date = isoStr.split('T')[0] + " " + isoStr.split('T')[1].split('.')[0]

    var idPlante = await db.insert({'login': login, 'password': password, 'mail': mail, 'date': date, 'cgu_version': cgu_version})
    .from('utilisateur')
    .where({'login': login})

    if (idPlante[0] != 0) {
        return await 200
    }

    return 24
}

module.exports.updateCGU = async function (id, cgu_version) {
    let trame = await db.update({'cgu_version' : cgu_version})
    .from('utilisateur')
    .where({'utilisateur.id_user': id})

    if (trame != 1) {
        return 25
    }

    return 200
}

module.exports.delete = async function (id, nam, uuid) {
    /*
    let trame = "SELECT pot.id_pot FROM pot INNER JOIN utilisateur ON utilisateur.id_user = pot.id_user WHERE utilisateur.id_user =" + id
    let pot = await db.raw(trame);*/

    let pot = await db.select('pot.id_pot')
    .from('pot')
    .join('utilisateur', 'utilisateur.id_user', '=', 'pot.id_user')
    .where({'utilisateur.id_user': id})

    let idPlante = await db.del()
    .from('utilisateur')
    .where({id_user: id, login: nam, uuid: uuid})

    if (idPlante != 1) {
        return 25
    }

/*
    trame = "DELETE FROM utilisateur WHERE id_user = " + id + " AND login = '" + nam + "' AND uuid = '" + uuid + "'"
    let idPlante = await db.raw(trame);

    if (idPlante[0]['affectedRows'] != 1) {
        return 25
    }*/

    return pot
}

module.exports.all = async function (id, nam, uuid) {
    return await db.first('id_user', 'login', 'mail', 'notification', 'date')
    .from('utilisateur')
    .where({'id_user': id, 'login': nam, 'uuid': uuid})
}

module.exports.updatMail = async function (uuid, mail) {
    var mailVerif = await db.count('mail as nb')
    .from('utilisateur')
    .where({'mail': mail})

    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if(mailVerif[0].nb > 0 )  return 1
    if(re.test(mail) == false )  return 5

    var idPlante = await db.update({'mail' : mail})
    .from('utilisateur')
    .where({'uuid': uuid})

    if (idPlante != 1) {
        return 25
    }

    return 200
}


module.exports.updatPass = async function (id, nam, uuid, ancienPassword, pass) {
    const keyEncriptePassword = 'WzIT6c6aGQNKfE8mOicl4bS"C5YefIx1AAkQ7eCW43BL6zT1=i02je.L15-s-A-5aSBO86N5IqZh-0CW4359s7wh--+Hz5bUbY-MEXF6JoafQfMpizXbN4-ss0mb19DepO4.dnAxiT500bn5GM54BTJQJIN7bab5brwW/4ExuQ5Au43h0ekLJ06XsJ-OcR7UegHO2R0RBTeafIdNe1NOBVtNzJLSJaD9n7i7MqJe5U3SL-xAcu946sOZ2eE5usscKd1NkoX8i6Jf9C9wI2b52EqaoIqQf8yIeg2WJ5ccA8e6Sdx9IeI7fHma3pi8eofteOqYyC9oa1VdLflUun-ja0IW-rbR6ITWO"SnfPb2c4b1b4cl42deCOybqk9p9XhKblw5pfwCD32itp58TONcTB0B4T0qCBIYs554a7yjgs1a/4WByRFMDPXkRlrCb-xj5cmuQGD3OisH4LQfS3IBuZ2afmtvOh8Jjn=bMLpM7i3RpKExEU+RJ+auwzBJObWDKhNPcyIYZIx-J/6FOI81aGRbV8q6rets00dwQw5Fa8iIDHL8fP3A1d2OPNbpj6/R2iTbBHvmB929m0d1bibHc/e';

    var dbUser = await db.first('*').from('utilisateur').where({ login : nam,  id_user : id, uuid : uuid}); //recupere l'users depuis la BD

    const buff = Buffer.from(ancienPassword, 'utf-8');
	const base64AncienPassword = buff.toString('base64');

	var passwordCrypt = aes256.decrypt(keyEncriptePassword, dbUser.password);

    if (base64AncienPassword === passwordCrypt) {
        await db.update({'password': pass, uuid: db.raw('UUID()')})
        .from('utilisateur')
        .where({'id_user' : id, 'login' : nam, 'uuid': uuid })


        return await db.first('uuid').from('utilisateur').where({ id_user: id });
    }
    else {
        return 401
    }
}

module.exports.newPassword = async function (uuid, mail, passwordCrypt) {
    var user = await db.update({password: passwordCrypt, uuid: db.raw('UUID()')})
    .from('utilisateur')
    .where({mail: mail, uuid: uuid})

    if (user == 0) {
        return 401
    }
    return await 200
}

module.exports.imagePot = async function (id, nam, uuid, id_pot) {
    /*
    let trame = "SELECT pot.image FROM pot INNER JOIN utilisateur ON utilisateur.id_user = pot.id_user WHERE utilisateur.id_user = " + id + " AND utilisateur.login = '" + nam + "' AND utilisateur.uuid = '" + uuid + "' AND pot.id_pot = " + id_pot
    let user = await db.raw(trame);

    if (user[0] == "") {
        return 2
    }

    return user[0]*/

    let user = await db.first('pot.image')
    .from('pot')
    .join('utilisateur', 'utilisateur.id_user', '=', 'pot.id_user')
    .where({'utilisateur.id_user': id, 'utilisateur.login': nam, 'utilisateur.uuid': uuid, 'pot.id_pot': id_pot})

    if (!user) {
        return 2
    }

    return user
}

module.exports.images = async function (id, nam, uuid) {
    var trame = "SELECT pot.image FROM pot INNER JOIN utilisateur ON utilisateur.id_user = pot.id_user WHERE utilisateur.id_user = " + id + " AND utilisateur.login = '" + nam + "' AND utilisateur.uuid = '" + uuid + "'"
    var user = await db.raw(trame);

    return user[0]
}

module.exports.newImages = async function (id, nam, uuid, id_pot, lien) {
    return await db.update({'pot.image': lien})
    .from('pot')
    .join('utilisateur', 'utilisateur.id_user', '=', 'pot.id_user')
    .where({'utilisateur.uuid' : uuid, 'pot.id_pot' : id_pot})
}


module.exports.valideCompte = async function (uuid, mail) {
    return await db.update({'disabled': 0})
    .from('utilisateur')
    .where({'uuid': uuid, 'mail': mail, 'disabled': -1})
}


module.exports.notification = async function (id, notification) {
    /*var trame = "UPDATE utilisateur SET notification="+notification+" WHERE utilisateur.id_user =  " + id + ";"
    var user = await db.raw(trame);*/

    var user = await db.update({notification: notification})
    .from('utilisateur')
    .where({id_user: id})

    if (user == 0) {
        return 401
    }
    return await 200
}

module.exports.topic = async function (username, keyEncriptePassword, base64, topic) {
    var user = await db.select('*').from('utilisateur').where({ login : username }).orWhere({ mail : username });

    if (user) {
        var passwordCrypt = aes256.decrypt(keyEncriptePassword, user[0].password);
        if (base64 === passwordCrypt) {
            var topicRes = await db.select('*').from('topic').where({ topics_subcribed : topic, id_user: user[0].id_user});
            var flage = false
            for (var i = 0; i < topicRes.length; i++) {
                if (topicRes[0].topics_subcribed == topic) {
                    flage = true
                }
            }

            if (flage == false) {
                await db.insert({'id_user': user[0].id_user, 'topics_subcribed': topic})
                .from('topic')
            }

            return "true"
        }
    }

    return "false"
}
