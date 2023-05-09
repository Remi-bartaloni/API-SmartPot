const jwt = require('jsonwebtoken'); // user token
const erreurReturn = require('../erreur')

/*
const secret = process.env.JWT_SECRET || 'seE0so-ZfA47g-LIeO-7WAb8c7i4s8bJ-t-WeT-wRCsTjX95em4I4DzE67Y6C6IfpeE.XsTO4DOp75FIEiOpI+BB4L1m6eaWIQIChf0JYMSzmi-C-9tYjQ-PBssdc85HHBIWRIQAFdjy-821L6Ob89SXTTwcPf6YOXbfcRdp6ff750e2WLo0WAEzubnG5asJyxqHqT/1aLb8ppaJyqK2NalLiB7HRodifde9kCn3"lQco9Nx0eqS5lh0Hb6N2EckbT20mw6Qd5iabojc21-TesmBxcx9JJ0qwIgn=leAfR3b8TQ5bHtI+aO8B4D2tu4sL5aR/TIdSP8mWueDGx9vwqGy12e4b2XcOcX1Jib6H3ab911lbaqOtfaNCz-4Bx9MhriVfI=1Zji5.35i3emb5eN8Vrf-NPRbLiNDcF4UZsb3pZ2RQkua42OfKuUOQ1k/zKpOjMp5529SJJ"R0cu5n3u01N6rCzNey34aAk3DU5bN9B5AMO6D45u0/wNILhP1hFIC0UA7xS20VUJdBOJJ5in9wJgd54qbcahOb8IQrfB8ef46bIKiIO-WvMJ7SEMMW+BC35/bynbwaBesxGaRKY0'; // définit le Secret
*/

const secret = process.env.JWT_SECRET || 'XXXXXXXXXXXXXXXXXXXX'; // définit le Secret


module.exports = async (ctx, next) => {
  if (!ctx.headers.authorization)   ctx.throw(202, erreurReturn.erreurReturn(11)) // verifie si on a mis un token

  const token = ctx.headers.authorization.split(' ')[1]; // split le token pour enlever le "Bearer " qui est devant le token
  try {
    ctx.request.jwtPayloadTo = jwt.verify(token, secret); // on verifie la validité tu token
  } catch (err) {
    ctx.throw(202, erreurReturn.erreurReturn(11)) // token non valide
  }

  await next(); // suivant
};
