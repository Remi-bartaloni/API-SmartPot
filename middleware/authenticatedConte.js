const jwt = require('jsonwebtoken'); // user token
const erreurReturn = require('../erreur')
/*
const secret = process.env.JWT_SECRET || 'bbWsndp++pLn1wyBq0m2lmA2sIApSJr5b8PuqBOX5aJuW4oDvG-Dx7cQcBMAxZ3wCIildv-0GCtDIIHXm3aaSH2PfSEbk8z-ilhGble5LJS85J1YDU6e0JKNWXLRKCsX0maA1O2Afte394OJzEba46hsRCKfb1VAB51jC9eI0QOcb64NC47bxUrBaLNF5mBf8--NzfTHTim980HQdYJ7bweV5-/Ndo/6byQV"HBix4Ig597xfsRucssca1e0G0BNAf5bP4RWyBNs-2iICTi5gHx9f4OpOZs7T4JKueYNdQWBaEjJzU5O"54jeWIhej2p3TL5-4NepOFhnb8beCMOgyIP7S4Ekeq36UJdLtI6OQ4O5po9MTcbcwJlDaRpIMm306SRI-0iabOBY8iswNb58Xnwthu21Yjt2k0quiJ6TRSAZoIT21L8D5Zi6.sM-1x9JQ69fI7zX-qy+6cfE502s=b2-aE9fOfO8od9wW9c4dRfaFQ.Wbabk3eiIe6806e-7ij1E14hnL1FCJci5xpIU/T=7cMPIyb-n8BHbOk3933TqBMKub52cq0rw2abRLR5WdqaaeOfQ/rc4D5zNeeI/uf'; // définit le Secret
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
