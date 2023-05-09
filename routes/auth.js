const jwt = require('jsonwebtoken'); //require
const db = require('../bd/Connexion');
const erreurReturn = require('../erreur')

const aes256 = require('aes256');
const keyEncriptePassword = 'XXXXXXXXXXXXXXXXXXXX';

const secret = process.env.JWT_SECRET || 'XXXXXXXXXXXXXXXXXXXX'; //le secret, il ne dois pas etre publique, que le serveur doit le connaitre


module.exports = async (ctx) => {
    const { username, password, cgu = 0, cgu_version, topic } = ctx.request.header; //recupere les données du POST

    if (!username)      ctx.throw(202, erreurReturn.erreurReturn(6)) // si il n'y a pas d'username alors 422 error
    if (!password)      ctx.throw(202, erreurReturn.erreurReturn(7)) // si il n'y a pas de password alors 422 error

    var dbUser = await db.first('*').from('utilisateur').where({ login : username }).orWhere({ mail : username }); //recupere l'users depuis la BD

    if (!dbUser) ctx.throw(401, "{\"result\":401}"); // si il ne trouve pas alors 401 error


    const buff = Buffer.from(password, 'utf-8');
	const base64 = buff.toString('base64');

	var passwordCrypt = aes256.decrypt(keyEncriptePassword, dbUser.password);


    if (base64 === passwordCrypt) { // si le mot de passe correspond
        if (username=="PotTokenLogin") {
            const payload = { sub: dbUser.id_user, pot: true }; // paylord sub: l'id de l'user
            const token = jwt.sign(payload, secret, { expiresIn: '1d' }); // le serveur sign le token avec le paylord, le "secret", le temps de vie

            let response = erreurReturn.erreurReturn(0)
            response = response.substr(1, response.length - 2)

            const trame = "{\"uuid\":\"" + dbUser.uuid + "\",\"token\":\"" + token + "\", " + response + "}"


            ctx.body = JSON.parse(trame);
        }
        else {
            if (!cgu_version)      ctx.throw(202, erreurReturn.erreurReturn(35))

            if (cgu == 0) {
                ctx.throw(202, erreurReturn.erreurReturn(36))
            }

            if (dbUser.cgu_version != cgu_version) {
                if (dbUser.cgu_version == "" || dbUser.cgu_version == "0") {
                    ctx.throw(202, erreurReturn.erreurReturn(36))
                }
                else {
                    ctx.throw(202, erreurReturn.erreurReturn(35))
                }
            }

            if (cgu_version == 'null') {
                ctx.throw(202, erreurReturn.erreurReturn(25))
            }

            const payload = { sub: dbUser.id_user, name: dbUser.login, pot: false}; // paylord sub: l'id de l'user
            const token = jwt.sign(payload, secret, { expiresIn: '365d' }); // le serveur sign le token avec le paylord, le "secret", le temps de vie

            let response = erreurReturn.erreurReturn(0)
            response = response.substr(1, response.length - 2)

            if (dbUser.disabled == -1 ) {
                ctx.throw(202, erreurReturn.erreurReturn(33))
            }
            else if (dbUser.disabled >= 1) {
                ctx.throw(202, erreurReturn.erreurReturn(34))
            }

            const trame = "{\"uuid\":\"" + dbUser.uuid + "\",\"token\":\"" + token + "\", " + response + "}"


            ctx.body = JSON.parse(trame);
        }
    }
    else {
        ctx.throw(202, erreurReturn.erreurReturn(11)); //error mot de passe
    }
};
