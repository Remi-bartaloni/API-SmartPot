const db = require('../bd/Connexion');

function tempResten(dt2, dt1)
{
    var diff =(dt2.getTime() - dt1.getTime()) / 1000;
    diff /= 60;
    var rest = 60 - Math.abs(Math.round(diff));
    if (rest < 0) {
        rest = 0
    }
    return rest
}

module.exports.verif = async function (mail, newMail) {
    /*var verif = "SELECT COUNT(mail) as nb FROM utilisateur WHERE mail = '" + mail + "'"
    var mailVerif = await db.raw(verif);*/

    var mailVerif = await db.count('mail as nb')
    .from('utilisateur')
    .where({'mail': mail})

    if(mailVerif[0].nb < 0 )  return 1

    verif = "SELECT COUNT(mail) as nb FROM utilisateur WHERE mail = '" + newMail + "'"
    mailVerif = await db.raw(verif);

    mailVerif = await db.count('mail as nb')
    .from('utilisateur')
    .where({'mail': newMail})

    if(mailVerif[0].nb > 0 )  return 1
}

module.exports.sed = async function (mail) {
    var idPlante = await db.first('*')
    .from('utilisateur')
    .where({mail: mail})

    if (!idPlante) {
        return 401
    }

    var idPlante = await db.first('*')
    .from('sendMail')
    .where({mail: mail})
    .orderBy('date', 'DESC');

    if (!idPlante) {
        return "ok"
    }
    else {
        var date_node = new Date();
        var date_bd = new Date(idPlante.date);

        if (tempResten(date_node, date_bd) == 0) {
            return "ok"
        }
        else if (tempResten(date_node, date_bd) >= 55) {
            return "ok2"
        }
        return await tempResten(date_node, date_bd)
    }
}

module.exports.add = async function (mail) {
    var date_node = new Date();

    let year = date_node.getFullYear();
    let month = ("0" + (date_node.getMonth() + 1)).slice(-2);
    let date = ("0" + date_node.getDate()).slice(-2);
    let hours = date_node.getHours();
    let minutes = date_node.getMinutes();
    let seconds = date_node.getSeconds();
    let date_heur = year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds;

    await db.insert({ mail: mail, date: date_heur })
    .into('sendMail')

   return JSON.parse("{\"temps\" : 0}");
}

module.exports.uuidNewPasse = async function (mail) {
    var idPlante = await db.first('uuid')
    .from('utilisateur')
    .where({'mail': mail, 'disabled': 0})

    return idPlante.uuid
}

module.exports.uuid = async function (mail) {
    var trame = "SELECT utilisateur.uuid FROM utilisateur WHERE utilisateur.mail = '" + mail + "' AND utilisateur.disabled = -1"
    var idPlante = await db.raw(trame);

    return idPlante[0][0]
}

module.exports.uuidToUserOrMail = async function (data) {
    /*
    var trame = "SELECT utilisateur.uuid, utilisateur.mail FROM utilisateur WHERE (utilisateur.mail = '" + data + "' OR utilisateur.login = '" + data + "') AND utilisateur.disabled = -1"
    var idPlante = await db.raw(trame);

    return idPlante[0][0]*/

    return await db.first('uuid', 'mail')
    .from('utilisateur')
    .orWhere( function (dbb) {
        dbb.orWhere({'mail': data})
        .orWhere({'login': data})
    })
    .andWhere({'disabled': -1})
}
