const jwt = require('jsonwebtoken'); //require
const erreurReturn = require('../erreur')
const db = require('../bd/Connexion');


const secret = process.env.JWT_SECRET || 'XXXXXXXXXXXXXXXXXXXX'; //le secret, il ne dois pas etre publique, que le serveur doit le connaitre

module.exports = async (ctx, next) => {
    let { data } = ctx.request.header

/*
    var trame = "SELECT utilisateur.uuid, utilisateur.mail FROM utilisateur WHERE (utilisateur.mail = '" + data + "' OR utilisateur.login = '" + data + "') AND utilisateur.disabled = -1"
    var idPlante = await db.raw(trame);*/

    var idPlante = await db.first('uuid', 'mail')
    .from('utilisateur')
    .orWhere( function (dbb) {
        dbb.orWhere({'mail': data})
        .orWhere({'login': data})
    })
    .andWhere({'disabled': -1})

    const payload = { mail : idPlante.mail }; // paylord sub: l'id de l'user
    const token = jwt.sign(payload, secret, { expiresIn: '24h' }); // le serveur sign le token avec le paylord, le "secret", le temps de vie

    ctx.request.jwtPayloadTo = token;
    await next(); // suivant
};
