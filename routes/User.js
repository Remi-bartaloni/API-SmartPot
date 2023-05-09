const DaoUser = require('../DAO/DaoUser')
const erreurReturn = require('../erreur')
const aes256 = require('aes256');
const exist = require('../DAO/DaoVerif')
const db = require('../bd/Connexion');
const mailSand = require('./Mail')

const keyEncriptePassword = 'XXXXXXXXXXXXXXXXXXXX';


module.exports.add = async function (ctx) {
	const {username, password, mail, cgu_version} = ctx.request.header
	const { langue } = ctx.query

	if(!username)    		ctx.throw(202, erreurReturn.erreurReturn(6))
	if(!password)    	ctx.throw(202, erreurReturn.erreurReturn(7))
	if(!mail)    		ctx.throw(202, erreurReturn.erreurReturn(5))
	if(!cgu_version)    		ctx.throw(202, erreurReturn.erreurReturn(35))

	const buff = Buffer.from(password, 'utf-8');
	const base64 = buff.toString('base64');
	var passwordCrypt = aes256.encrypt(keyEncriptePassword, base64);

	if (username.search( /[ ":]/g) != -1 || username.search(/[a-zA-Z0-9]/g) == -1) {
		ctx.throw(202, erreurReturn.erreurReturn(6))
	}
	if (username.length >= 4 && username.length <= 32) {	}
	else {
		ctx.throw(202, erreurReturn.erreurReturn(6))
	}

	const add = await DaoUser.add(username, passwordCrypt, mail, cgu_version);

	let token = ctx.request.jwtPayloadTo

	if (add){
		if (add == 200) {
			let getMail = await mailSand.newCompte(mail, langue, token);
			if (getMail == 200) {
				ctx.body = JSON.parse(erreurReturn.erreurReturn(0))
			}
			else {
				ctx.throw(202, erreurReturn.erreurReturn(1))
			}
		}
		if (add == 1) {
			let getMail = await mailSand.newCompte(mail, langue, token);
			if (getMail == 200) {
				ctx.body = JSON.parse(erreurReturn.erreurReturn(33))
			}
			else {
				ctx.throw(202, erreurReturn.erreurReturn(1))
			}
		}
		else if (add == 5) {
			ctx.throw(202, erreurReturn.erreurReturn(5))
		}
		else if (add == 2) {
			ctx.throw(202, erreurReturn.erreurReturn(2))
		}
		else if (add == 7) {
			ctx.throw(202, erreurReturn.erreurReturn(7))
		}
		else if (add == 24) {
			ctx.throw(202, erreurReturn.erreurReturn(25))
		}
	}
	else {
		ctx.throw(202, erreurReturn.erreurReturn(25))
	}
}

module.exports.updateCGU = async function (ctx) {
	const {cgu_version, username, password} = ctx.request.header

	if(!cgu_version)    		ctx.throw(202, erreurReturn.erreurReturn(35))
	if (!username)      ctx.throw(202, erreurReturn.erreurReturn(6))
	if (!password)      ctx.throw(202, erreurReturn.erreurReturn(7))

	var cguVertion = await db.select('cgu_version').from('app');
	var flagCgu = false;
	for (var i = 0; i < cguVertion.length; i++) {
		if (cguVertion[i]["cgu_version"] == cgu_version) {
			flagCgu = true;
		}
	}

	if (flagCgu != true) {
		ctx.throw(202, erreurReturn.erreurReturn(36))
	}

	const buff = Buffer.from(password, 'utf-8');
	const base64 = buff.toString('base64');

	const keyEncriptePassword = 'WzIT6c6aGQNKfE8mOicl4bS"C5YefIx1AAkQ7eCW43BL6zT1=i02je.L15-s-A-5aSBO86N5IqZh-0CW4359s7wh--+Hz5bUbY-MEXF6JoafQfMpizXbN4-ss0mb19DepO4.dnAxiT500bn5GM54BTJQJIN7bab5brwW/4ExuQ5Au43h0ekLJ06XsJ-OcR7UegHO2R0RBTeafIdNe1NOBVtNzJLSJaD9n7i7MqJe5U3SL-xAcu946sOZ2eE5usscKd1NkoX8i6Jf9C9wI2b52EqaoIqQf8yIeg2WJ5ccA8e6Sdx9IeI7fHma3pi8eofteOqYyC9oa1VdLflUun-ja0IW-rbR6ITWO"SnfPb2c4b1b4cl42deCOybqk9p9XhKblw5pfwCD32itp58TONcTB0B4T0qCBIYs554a7yjgs1a/4WByRFMDPXkRlrCb-xj5cmuQGD3OisH4LQfS3IBuZ2afmtvOh8Jjn=bMLpM7i3RpKExEU+RJ+auwzBJObWDKhNPcyIYZIx-J/6FOI81aGRbV8q6rets00dwQw5Fa8iIDHL8fP3A1d2OPNbpj6/R2iTbBHvmB929m0d1bibHc/e';

	var dbUser = await db.first('*').from('utilisateur').where({ login : username }).orWhere({ mail : username });
	if (!dbUser) ctx.throw(401, "{\"result\":401}");

	var passwordCrypt = aes256.decrypt(keyEncriptePassword, dbUser.password);

	if (base64 === passwordCrypt) {

		const user = await DaoUser.updateCGU(dbUser.id_user, cgu_version);

		if (user){
			if (user == 25) {
				ctx.throw(202, erreurReturn.erreurReturn(25))
			}
			else if (user == 200) {
				ctx.body = JSON.parse(erreurReturn.erreurReturn(0))
			}
			else {
				ctx.body = user
			}
		}
		else {
			ctx.throw(202, erreurReturn.erreurReturn(25))
		}
	}
	else {
		ctx.throw(202, erreurReturn.erreurReturn(25))
	}
}

module.exports.delete = async function (ctx) {
	//const {uuid} = ctx.query
	const {uuid} = ctx.request.header

	const id = ctx.request.jwtPayloadTo.sub
	const nam = ctx.request.jwtPayloadTo.name

	if(!uuid) 	ctx.throw(202, erreurReturn.erreurReturn(6))

	const valid = await exist.exist(id, nam, uuid)
	if (valid == 11)         ctx.throw(202, erreurReturn.erreurReturn(11))

	const user = await DaoUser.delete(id, nam, uuid);

	if (user){
		if (user == 25) {
			ctx.throw(202, erreurReturn.erreurReturn(6))
		}
		let response = erreurReturn.erreurReturn(0)
		response = response.substr(1, response.length - 2)
		ctx.body = await JSON.parse("{" + response + ", \"list\":" + JSON.stringify(user) + "}")
	}
	else {
		ctx.throw(202, erreurReturn.erreurReturn(25))
	}
}

module.exports.all = async function (ctx) {
	//const {uuid} = ctx.query
	const {uuid} = ctx.request.header

	if(!uuid) 	ctx.throw(202, erreurReturn.erreurReturn(6))

	const id = ctx.request.jwtPayloadTo.sub
	const nam = ctx.request.jwtPayloadTo.name

	const valid = await exist.exist(id, nam, uuid)
	if (valid == 11)         ctx.throw(202, erreurReturn.erreurReturn(11))

	let user = await DaoUser.all(id, nam, uuid);

	let response = erreurReturn.erreurReturn(0)
	response = response.substr(1, response.length - 2)

	user = JSON.stringify(user)
	user = user.substr(0, user.length - 1) + "," + response + "}"

	ctx.body = JSON.parse(user)

}

module.exports.updatMail = async function (ctx) {
	const {uuid, mail} = ctx.request.header

	if(!uuid) 			ctx.throw(202, erreurReturn.erreurReturn(6))
	if(!mail)    		ctx.throw(202, erreurReturn.erreurReturn(5))

	if (mail != ctx.request.jwtPayloadTo.new_mail) {
		ctx.throw(202, erreurReturn.erreurReturn(5))
	}

	const user = await DaoUser.updatMail(uuid, mail);

	if (user){
		if (user == 1) {
			ctx.throw(202, erreurReturn.erreurReturn(1))
		}
		else if (user == 5) {
			ctx.throw(202, erreurReturn.erreurReturn(5))
		}
		else if (user == 200) {
			ctx.body = JSON.parse(erreurReturn.erreurReturn(0))
		}
	}
	else {
		ctx.throw(202, erreurReturn.erreurReturn(6))
	}
}

module.exports.updatPass = async function (ctx) {
	const {uuid, ancienpassword, password} = ctx.request.header

	if(!uuid) 				ctx.throw(202, erreurReturn.erreurReturn(6))
	if(!password)			ctx.throw(202, erreurReturn.erreurReturn(7))
	if(!ancienpassword)		ctx.throw(202, erreurReturn.erreurReturn(7))

	const id = ctx.request.jwtPayloadTo.sub
	const nam = ctx.request.jwtPayloadTo.name

	const valid = await exist.exist(id, nam, uuid)
	if (valid == 11)         ctx.throw(202, erreurReturn.erreurReturn(11))

	const buff = Buffer.from(password, 'utf-8');
	const base64 = buff.toString('base64');
	var passwordCrypt = aes256.encrypt(keyEncriptePassword, base64);

	const user = await DaoUser.updatPass(id, nam, uuid, ancienpassword, passwordCrypt);

	if (user == 401) {
		ctx.throw(202, erreurReturn.erreurReturn(7))
	}

	let response = erreurReturn.erreurReturn(0)
	response = response.substr(1, response.length - 2)

	let liste = JSON.stringify(user)
	liste = liste.substr(1, liste.length - 2)

	let jsonRes = "{" + liste + "," + response + "}"
	ctx.body = JSON.parse(jsonRes);
}

module.exports.newPassword = async function (ctx) {
	const { uuid, password } = ctx.request.header

	if(!uuid) 				ctx.throw(202, erreurReturn.erreurReturn(6))
	if(!password)			ctx.throw(202, erreurReturn.erreurReturn(7))

	const mail = ctx.request.jwtPayloadTo.mail

	const buff = Buffer.from(password, 'utf-8');
	const base64 = buff.toString('base64');
	var passwordCrypt = aes256.encrypt(keyEncriptePassword, base64);

	const user = await DaoUser.newPassword(uuid, mail, passwordCrypt);
	if (user == 401) {
		ctx.throw(202, erreurReturn.erreurReturn(6))
	}


	ctx.body = JSON.parse(erreurReturn.erreurReturn(0))
}

module.exports.images = async function (ctx) {
	const { id_pot } = ctx.query
	const { uuid } = ctx.request.header

	if(!uuid) 		ctx.throw(202, erreurReturn.erreurReturn(6))
	if(!id_pot) 	ctx.throw(202, erreurReturn.erreurReturn(13))

	const id = ctx.request.jwtPayloadTo.sub
	const nam = ctx.request.jwtPayloadTo.name

	const valid = await exist.exist(id, nam, uuid)
	if (valid == 11)         ctx.throw(202, erreurReturn.erreurReturn(11))

	let user
	if(id_pot)	{
		user = await DaoUser.imagePot(id, nam, uuid, id_pot);
		if (user){
			if (user == 2) {
				ctx.throw(202, erreurReturn.erreurReturn(13))
			}
		}
		else {
			ctx.throw(202, erreurReturn.erreurReturn(6))
		}

		let response = erreurReturn.erreurReturn(0)
		response = response.substr(1, response.length - 2)

		user = JSON.stringify(user)
		user = user.substr(0, user.length - 1) + "," + response + "}"
	}

	ctx.body = JSON.parse(user)
}


module.exports.newImages = async function (ctx) {
	const { id_pot, lien } = ctx.query
	const { uuid } = ctx.request.header

	if(!uuid) 				ctx.throw(202, erreurReturn.erreurReturn(6))
	if(!id_pot) 			ctx.throw(202, erreurReturn.erreurReturn(13))
	if(!lien) 			 	ctx.throw(202, erreurReturn.erreurReturn(22))

	const id = ctx.request.jwtPayloadTo.sub
	const nam = ctx.request.jwtPayloadTo.name

	const valid = await exist.exist(id, nam, uuid)
	if (valid == 11)         ctx.throw(202, erreurReturn.erreurReturn(11))

	const user = await DaoUser.newImages(id, nam, uuid, id_pot, lien);

	if (user != 1) {
		ctx.throw(202, erreurReturn.erreurReturn(23))
	}

	ctx.body = JSON.parse(erreurReturn.erreurReturn(0))
}


module.exports.valideCompte = async function (ctx) {
	const { uuid } = ctx.request.header

	if(!uuid) 	ctx.throw(202, erreurReturn.erreurReturn(6))

	const mail = ctx.request.jwtPayloadTo.mail

	const user = await DaoUser.valideCompte(uuid, mail);

	if (user != 1) {
		ctx.throw(202, erreurReturn.erreurReturn(23))
	}

	ctx.body = JSON.parse(erreurReturn.erreurReturn(0))
}

module.exports.notification = async function (ctx) {
	let { uuid, notification } = ctx.request.header

	if(!uuid) 				ctx.throw(202, erreurReturn.erreurReturn(6))

	const id = ctx.request.jwtPayloadTo.sub
	const nam = ctx.request.jwtPayloadTo.name

	const valid = await exist.exist(id, nam, uuid)
	if (valid == 11)         ctx.throw(202, erreurReturn.erreurReturn(11))

	if (notification == 1) {
		notification = 1
	}
	else {
		notification = 0
	}

	const user = await DaoUser.notification(id, notification);
	if (user == 401) {
		ctx.throw(202, erreurReturn.erreurReturn(11))
	}

	ctx.body = JSON.parse(erreurReturn.erreurReturn(0))
}


module.exports.topic = async function (ctx) {
	let { topic, username, password } = ctx.request.header

	if(!username)    		ctx.throw(202, erreurReturn.erreurReturn(6))
	if(!password)    	ctx.throw(202, erreurReturn.erreurReturn(7))

	const buff = Buffer.from(password, 'utf-8');
	const base64 = buff.toString('base64');

	const res = await DaoUser.topic(username, keyEncriptePassword, base64, topic);

	if (res == false) {
		ctx.throw(202, erreurReturn.erreurReturn(24))
	}

	ctx.body = JSON.parse(erreurReturn.erreurReturn(0))
/*
	if (topic) {
        var topicex = await db.first('*').from('topic').where({ topics_subcribed : topic });
        if (!topicex) {
            let tramTopic = "INSERT INTO topic(id_user, topics_subcribed) VALUES ('" + id + "', '" + topic + "')"
            await db.raw(tramTopic);
        }
    }*/
}
