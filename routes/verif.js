const DaoVerif = require('../DAO/DaoVerif')
const erreurReturn = require('../erreur')
const exist = require('../DAO/DaoVerif')

module.exports.all = async function (ctx) {
    //const { uuid } = ctx.query
    const {uuid, cgu_version} = ctx.request.header

    if(!uuid)    ctx.throw(202, erreurReturn.erreurReturn(6))

    const id = ctx.request.jwtPayloadTo.sub
    const nam = ctx.request.jwtPayloadTo.name

    const valid = await exist.exist(id, nam, uuid)
    if (valid == 11)         ctx.throw(202, erreurReturn.erreurReturn(11))

    const validCgu_version = await exist.cgu_version(id, nam, uuid, cgu_version)
    if (validCgu_version == 35)         ctx.throw(202, erreurReturn.erreurReturn(35))
    if (validCgu_version == 11)         ctx.throw(202, erreurReturn.erreurReturn(11))

    const all = await DaoVerif.all(id, nam, uuid);

    if (all != 1) {
        let response = erreurReturn.erreurReturn(0)
        response = response.substr(1, response.length - 2)

        let jsonRes = "{\"version\": \"" + all + "\"," + response + "}"
        ctx.body = JSON.parse(jsonRes);
    }
    else {
        ctx.throw(202, erreurReturn.erreurReturn(6))
    }
}

module.exports.uuidExist = async function (ctx) {
    const {uuid} = ctx.request.header

    if(!uuid)    ctx.throw(202, erreurReturn.erreurReturn(6))

    const all = await DaoVerif.uuidExist(uuid);


    if (all == 200){
        ctx.body = JSON.parse(erreurReturn.erreurReturn(0))
    }
    else {
        ctx.throw(202, erreurReturn.erreurReturn(6))
    }
}
