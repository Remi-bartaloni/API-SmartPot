const jwt = require('jsonwebtoken'); // user token
const erreurReturn = require('../erreur')

const secret = process.env.JWT_SECRET || 'XXXXXXXXXXXXXXXXXXXX'; // définit le Secret

module.exports = async (ctx, next) => {
  if (!ctx.headers.authorization)   ctx.throw(202, erreurReturn.erreurReturn(11)) // verifie si on a mis un token

  const token = ctx.headers.authorization.split(' ')[1]; // split le token pour enlever le "Bearer " qui est devant le token
  try {
    ctx.request.jwtPayloadTo = jwt.verify(token, secret); // on verifie la validité tu token
    if (ctx.request.jwtPayloadTo.pot == true) {
        if (ctx.request.jwtPayloadTo.sub != 1) {
            ctx.throw(202, erreurReturn.erreurReturn(11))
        }
    }
    else {
        if (ctx.request.jwtPayloadTo.sub == 1) {
            ctx.throw(202, erreurReturn.erreurReturn(11))
        }
    }
  } catch (err) {
    ctx.throw(202, erreurReturn.erreurReturn(11)) // token non valide
  }

  await next(); // suivant
};
