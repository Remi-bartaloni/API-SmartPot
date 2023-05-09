const db = require('../bd/Connexion');
const erreurReturn = require('../erreur')

module.exports.all = async function (id, nam, uuid) {
    return await db.select('pot.id_pot', 'pot.nom_pot', 'pot.image')
    .from('pot')
    .join('utilisateur', 'utilisateur.id_user', '=', 'pot.id_user')
    .where({ 'utilisateur.id_user' : id, 'utilisateur.login' : nam, 'utilisateur.uuid' : uuid })
    .orderBy('pot.nom_pot', 'ASC');
}

module.exports.pot = async function (id, nam, uuid, idPot) {
    var trame = "SELECT pot.id_pot, pot.image, pot.nom_pot, pot.notification_pot, pot.humidite_min, pot.humidite_max, pot.debut_soleil, pot.fin_soleil FROM pot INNER JOIN utilisateur on utilisateur.id_user = pot.id_user WHERE utilisateur.id_user = " + id + " and utilisateur.login = '" + nam + "' and utilisateur.uuid = '" + uuid + "' AND pot.id_pot = " + idPot

    var pot = await db.raw(trame);

    if (pot[0] == "") {
        return 1
    }

    return pot[0][0];
}

module.exports.state = async function (id, nam, uuid, idPot) {
    let trame = "SELECT pot.id_pot, pot.nom_pot, pot.humidite_min, pot.humidite_max, pot.temperature_min, pot.temperature_max FROM pot INNER JOIN utilisateur on utilisateur.id_user = pot.id_user WHERE utilisateur.id_user = " + id + " and utilisateur.login = '" + nam + "' and utilisateur.uuid = '" + uuid + "' AND pot.id_pot = " + idPot

    let pot = await db.raw(trame);

    if (pot[0] == "") {
        return 2
    }

    pot = pot[0][0];

    trame = "SELECT ROUND(COUNT(statistique.id_statistique) / 24) As nb FROM statistique WHERE statistique.id_pot = " + idPot + " ORDER BY statistique.heure ASC;"

    var state = await db.raw(trame);

    let nb = state[0][0]['nb']
    if (nb < 1)   nb = 1

    trame = "WITH resultats AS (SELECT *, ROW_NUMBER() OVER(ORDER BY statistique.id_pot) AS liste_resultats FROM statistique WHERE statistique.id_pot = " + idPot + " ORDER BY statistique.heure ASC) SELECT resultats.cuve, resultats.humidite_sol, resultats.humidite_ambiante, resultats.temperature, CONVERT(statistique.heure, CHAR) as date FROM resultats WHERE liste_resultats mod " + nb + " = 0;"

    state = await db.raw(trame);

    state = state[0];

    trame = "{\"list\":{\"pot\" : " +  JSON.stringify(pot) + ", \"stats\" : " + JSON.stringify(state) + "}}"

    return await JSON.parse(trame);

}

module.exports.stateHeure = async function (id, nam, uuid, idPot, gmt) {
    var pot = await db.first('pot.id_user')
    .from('pot')
    .where({'pot.id_pot' : idPot})

    if (typeof pot == "undefined" || typeof pot == undefined) {
        return 2
    }

    if (pot.id_user != id) {
        return 1
    }

    return await db.select(db.raw('DISTINCT CONVERT(DATE_FORMAT(CONVERT_TZ(statistique.heure, \'+00:00\', \''+gmt+'\'), "%Y-%m-%d"), CHAR)  AS date '))
    .from('statistique')
    .join('pot', 'pot.id_pot', '=', 'statistique.id_pot')
    .join('utilisateur', 'utilisateur.id_user', '=', 'pot.id_user')
    .where({ 'utilisateur.uuid': uuid, 'statistique.id_pot': idPot})
}

module.exports.stateDate = async function (uuid, idPot, debut, fin) {
    return await db.with('t', (qb) => {
        qb.select(db.raw('ROW_NUMBER() OVER(ORDER BY u.login) row_num'), 'u.login', 'u.mail', 'u.uuid', 'p.id_pot', 'p.nom_pot', 'p.temperature_min', 'p.temperature_max', 'p.humidite_min', 'p.humidite_max', 'p.humidite_ambiante_min', 'p.humidite_ambiante_max', 'p.debut_soleil', 'p.fin_soleil', 's.cuve', 's.humidite_sol', 's.humidite_ambiante', 's.temperature', 's.luminosite', db.raw('CONVERT(s.heure, CHAR) AS heure'))
        .from('utilisateur as u')
        .join('pot as p', 'p.id_user', '=', 'u.id_user')
        .leftJoin('statistique as s', 's.id_pot', '=', 'p.id_pot', 's.heure', '>=', debut, 's.heure', '<=', fin)
        .where({'p.id_pot' : idPot, 'u.uuid' : uuid})
        //.orderBy('s.heure', 'ASC');
    })
    .with('w', (qb) => {
        qb.select()
        .count('u.login as nb')
        .from('utilisateur as u')
        .join('pot as p', 'p.id_user', '=', 'u.id_user')
        .leftJoin('statistique as s', 's.id_pot', '=', 'p.id_pot', 's.heure', '>=', debut, 's.heure', '<=', fin)
        .where({'p.id_pot' : idPot, 'u.uuid' : uuid})
    })
    .select('t.login', 't.mail', 't.id_pot', 't.nom_pot', 't.temperature_min', 't.temperature_max', 't.humidite_min', 't.humidite_max', 't.humidite_ambiante_min', 't.humidite_ambiante_max', 't.debut_soleil', 't.fin_soleil', 't.cuve', 't.humidite_sol', 't.humidite_ambiante', 't.temperature', 't.luminosite', 't.heure')
    .from('t')
    .join('w')
    .where({'t.uuid' : uuid})
    .whereRaw('t.row_num MOD CEILING(w.nb/24) = 0')
}

module.exports.info = async function (id, nam, uuid, idPot) {
    let infoPot = await db.first('pot.nom_pot', 'pot.image', 'pot.debut_soleil', 'pot.fin_soleil', 'pot.temperature_min', 'pot.temperature_max', 'pot.humidite_min', 'pot.humidite_max', 'pot.humidite_ambiante_min', 'pot.humidite_ambiante_max', 'statistique.cuve', 'statistique.humidite_sol', 'statistique.humidite_ambiante', 'pot.notification_pot', 'pot.humidite_min', 'pot.humidite_max', 'statistique.temperature', 'pot.luminosite_auto', 'statistique.heure')
    .sum('statistique.luminosite AS luminosite')
    .from('statistique')
    .join('pot', 'pot.id_pot', '=', 'statistique.id_pot')
    .join('utilisateur', 'utilisateur.id_user', '=', 'pot.id_user')
    .where({ 'utilisateur.uuid': uuid, 'statistique.id_pot': idPot})
    .groupByRaw("CAST(statistique.heure AS date)")
    .orderBy('heure', 'DESC');

    if (typeof infoPot != 'object') {
        infoPot = await db.first('pot.nom_pot', 'pot.image', 'pot.debut_soleil', 'pot.fin_soleil', 'pot.temperature_min', 'pot.temperature_max', 'pot.humidite_min', 'pot.humidite_max', 'pot.humidite_ambiante_min', 'pot.humidite_ambiante_max', 'pot.notification_pot', 'pot.humidite_min', 'pot.humidite_max', 'pot.luminosite_auto')
        .from('utilisateur')
        .join('pot', 'pot.id_user', '=', 'utilisateur.id_user')
        .where({ 'utilisateur.uuid': uuid, 'pot.id_pot': idPot})

        if (typeof infoPot == 'object') {
            Object.assign(infoPot, {cuve: -1, humidite_sol:"--", humidite_ambiante:"--", temperature:"--", luminosite:"--", date:"--"});
            return infoPot
        }
        return 2
    }

    return infoPot
}


function getRandomColor() {
    var letters = 'rvbrvbrvb';
    var res = '';
    for (var i = 0; i < 8; i++) {
        res += letters[Math.floor(Math.random() * 9)];
    }
    return res;
}

async function codecouleur() {
    var color = await getRandomColor()
    var idPlante = await db.select('code').from('pot').where({ id_user: 1 })

    if (JSON.stringify(idPlante).indexOf(color) == -1) {
        return color
    }

    return 1
}

module.exports.add = async function (id, uuid) {
    var color = 1

    var verifUseur = await db.first('id_user')
    .from('utilisateur')
    .where({ id_user: id, uuid : uuid})

    if (!verifUseur) {
        return 1
    }

    for (var i = 0; i < 500; i++) {
        color = await codecouleur()
        if (color != 1) {
            break
        }
    }
    if (color == 1) {
        return 404
    }

    var idres = await db.insert({ id_user: id, code: color })
    .into('pot')

    return await db.first('id_pot as id', 'uuid', 'code')
    .from('pot')
    .where({'id_pot': idres[0]})
}

module.exports.valider = async function (id, nam, uuid, nom_pot, notification, debut_soleil, fin_soleil, temperature_min, temperature_max, humidite_min, humidite_max, humidite_ambiante_min, humidite_ambiante_max, id_pot, url_image) {
    var verifUseur = await db.first('*')
    .from('utilisateur')
    .join('pot', 'pot.id_user', '=', 'utilisateur.id_user')
    .where({ 'utilisateur.uuid': uuid,  'utilisateur.id_user': id, 'pot.id_pot': id_pot})

    if (!verifUseur) {
        return 13
    }

    return await db.update({nom_pot: nom_pot, notification_pot: notification, debut_soleil: debut_soleil, fin_soleil: fin_soleil, temperature_min: temperature_min, temperature_max: temperature_max, humidite_min: humidite_min, humidite_max: humidite_max, humidite_ambiante_min: humidite_ambiante_min, humidite_ambiante_max: humidite_ambiante_max, image: url_image, code:''})
    .from('pot')
    .where({id_user: id, id_pot: id_pot})
}

module.exports.PotVerif = async function (code, id) {
    var idPlante = await db.first('*').from('pot').where({ code: code })
    if (!idPlante) {
        return 10
    }

    await db.update({id_user: id, code: ''}).from('pot').where('code', '=', code)

    return idPlante.id_pot
}

module.exports.sup = async function (id, nam, uuid, id_pot) {
    var info = await db.first('*')
    .from('utilisateur')
    .join('pot', 'pot.id_user', '=', 'utilisateur.id_user')
    .where({ 'utilisateur.uuid': uuid,  'utilisateur.id_user': id, 'pot.id_pot': id_pot})

    if (!info) {
        return 404
    }

    return await db.del()
    .from('pot')
    .where({id_pot: id_pot})
}

module.exports.statsAdd = async function (uuid, id_pot, cuve, humidite_sol, humidite_ambiante, temperature, luminosite) {
    var verifpot = await db.first('id_pot')
    .from('pot')
    .where({'uuid': uuid})

    if (verifpot.id_pot != id_pot) {
        return 1
    }

    const isoStr = new Date().toISOString();
    const heure = isoStr.split('T')[0] + " " + isoStr.split('T')[1].split('.')[0]
    return await db.insert([{id_pot: id_pot, cuve: cuve, humidite_sol: humidite_sol, humidite_ambiante: humidite_ambiante, temperature: temperature, luminosite: luminosite, heure: heure}])
    .into('statistique')
}

module.exports.notification = async function (id, uuid, nam) {
    return await db.select('pot.id_pot', 'pot.nom_pot', db.raw("If(s.cuve <= 15, 0, 1) AS cuve, IF((s.humidite_sol < pot.humidite_min OR s.humidite_sol > pot.humidite_max) = true, IF(s.humidite_sol < pot.humidite_min = true, 'basse', 'élevée'), 'bonne') AS humidite, IF((s.humidite_ambiante < pot.humidite_ambiante_min OR s.humidite_ambiante > pot.humidite_ambiante_max) = true, IF(s.humidite_ambiante < pot.humidite_ambiante_min = true, 'basse', 'élevée'), 'bonne') AS humidite_ambiante, IF((s.temperature < pot.temperature_max AND s.temperature > pot.temperature_min) = false, IF(s.temperature < pot.temperature_min = true, 'basse', 'élevée'), 'bonne') AS temperature"), 's.heure', 'pot.debut_soleil', 'pot.fin_soleil')
    .sum('s.luminosite AS luminosite')
    .from('utilisateur')
    .join('pot', 'pot.id_user', '=', 'utilisateur.id_user')
    .join('statistique as s', 's.id_pot', '=', 'pot.id_pot', db.raw("CAST(s.heure AS DATE) = (SELECT MAX(CAST(s1.heure AS DATE)) FROM statistique s1 WHERE s1.id_pot = s.id_pot)"))
    .where({ 'pot.notification_pot': 1, 'utilisateur.notification': 1, 'utilisateur.id_user': id})
    .groupBy('pot.id_pot')
    .orderBy('heure', 'DESC')
}

module.exports.luminosite = async function (id_pot, lum) {
    let date = new Date()
    let d = date.getDate();
    let m = date.getMonth() + 1;
    let y = date.getFullYear();

    var trame = "SELECT luminosite.luminosite FROM luminosite WHERE luminosite.id_pot = " + id_pot + " AND luminosite.date = '" + y + '-' + (m <= 9 ? '0' + m : m) + '-' + (d <= 9 ? '0' + d : d) + "' LIMIT 0,1"
    var idPlante = await db.raw(trame);

    if (idPlante[0].length == 0) {
        trame = "INSERT INTO luminosite (id_pot, luminosite) VALUES ('" + id_pot + "', '" + lum + "')"
    }
    else {
        trame = "UPDATE luminosite SET luminosite = '[value-3]' WHERE id_luminosite = AND id_pot = "
    }

    return idPlante[0].length
}

module.exports.ajustPotInfo = async function (id, nam, uuid, id_pot, notEnoughtLight, tooMuchLight, notEnoughtWater, tooMuchWatering, tooMuchHeat) {
    return await db.first('pot.debut_soleil', 'pot.fin_soleil', 'pot.humidite_min', 'pot.humidite_max', 'pot.temperature_min', 'pot.temperature_max')
    .from('utilisateur')
    .join('pot', 'pot.id_user', '=', 'utilisateur.id_user')
    .where({'utilisateur.id_user': id, 'utilisateur.login': nam, 'utilisateur.uuid': uuid, 'pot.id_pot': id_pot})
}

module.exports.ajustPotUpdate = async function (id_pot, lum, eauMin, eauMax, tempMin, tempMax) {
    return await db.update({fin_soleil: lum, humidite_min: eauMin, humidite_max: eauMax, temperature_min: tempMin, temperature_max: tempMax })
    .from('pot')
    .where({id_pot: id_pot})
}
