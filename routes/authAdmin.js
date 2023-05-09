const jwt = require('jsonwebtoken');
const erreurReturn = require('../erreur')

const aes256 = require('aes256');
const keyEncriptePassword = 'XXXXXXXXXXXXXXXXXXXX';

const secret = process.env.JWT_SECRET || 'XXXXXXXXXXXXXXXXXXXX'; //le secret, il ne dois pas etre publique, que le serveur doit le connaitre


module.exports = async (ctx) => {
    const { username, password } = ctx.request.header; //recupere les données du POST

    if (!username)      ctx.throw(202, erreurReturn.erreurReturn(6)) // si il n'y a pas d'username alors 422 error
    if (!password)      ctx.throw(202, erreurReturn.erreurReturn(7)) // si il n'y a pas de password alors 422 error

    const buff = Buffer.from(password, 'utf-8');
	const passwordGet = buff.toString('base64');

    buff = Buffer.from("Poney6Land", 'utf-8');
	const passwordIn = buff.toString('base64');

/*
    if (passwordGet === passwordIn && username == "Admin") { // si le mot de passe correspond
        const payload = { name: "admin" }; // paylord sub: l'id de l'user
        const token = jwt.sign(payload, secret, { expiresIn: '1d' }); // le serveur sign le token avec le paylord, le "secret", le temps de vie

        let response = erreurReturn.erreurReturn(0)
        response = response.substr(1, response.length - 2)

        const trame = "{\"token\":\"" + token + "\", " + response + "}"

        ctx.body = JSON.parse(trame);

    }
    else {
        ctx.throw(202, erreurReturn.erreurReturn(11)); //error mot de passe
    }

    */
};
