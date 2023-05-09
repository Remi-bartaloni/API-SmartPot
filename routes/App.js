const DaoApp = require('../DAO/DaoApp')
const erreurReturn = require('../erreur')
const exist = require('../DAO/DaoVerif')


module.exports.version = async function (ctx) {
    const {uuid} = ctx.request.header

    if(!uuid)                ctx.throw(202, erreurReturn.erreurReturn(11))

    const id = ctx.request.jwtPayloadTo.sub
    const nam = ctx.request.jwtPayloadTo.name

    let valid = await exist.exist(id, nam, uuid)
    if (valid == 11)         ctx.throw(202, erreurReturn.erreurReturn(11))

    const all = await DaoApp.version(id, nam);

    if (all){
        if (all == 11) {
            ctx.throw(202, erreurReturn.erreurReturn(11))
        }
        let response = erreurReturn.erreurReturn(0)
        response = response.substr(1, response.length - 2)

        let liste = JSON.stringify(all)
        liste = liste.substr(1, liste.length - 2)

        let jsonRes = "{" + liste + "," + response + "}"
        ctx.body = JSON.parse(jsonRes);
    }
    else {
        ctx.throw(202, erreurReturn.erreurReturn(25))
    }
}

module.exports.history = async function (ctx) {
    const {uuid} = ctx.request.header

    if(!uuid)                ctx.throw(202, erreurReturn.erreurReturn(11))

    const id = ctx.request.jwtPayloadTo.sub
    const nam = ctx.request.jwtPayloadTo.name

    const valid = await exist.exist(id, nam, uuid)
    if (valid == 11)         ctx.throw(202, erreurReturn.erreurReturn(11))

    const all = await DaoApp.history(id, nam);

    if (all){
        if (all == 11) {
            ctx.throw(202, erreurReturn.erreurReturn(11))
        }

        let response = erreurReturn.erreurReturn(0)
        response = response.substr(1, response.length - 2)

        let jsonRes = "{\"list\":" + JSON.stringify(all) + "," + response + "}"
        ctx.body = JSON.parse(jsonRes);
    }
    else {
        ctx.throw(202, erreurReturn.erreurReturn(25))
    }
}


module.exports.analyse = async function (ctx) {
    const {titr, temp} = ctx.query
    const {uuid} = ctx.request.header

    if(!uuid)                ctx.throw(202, erreurReturn.erreurReturn(11))
    if(!titr)                ctx.throw(202, erreurReturn.erreurReturn(25))
    if(!temp)               ctx.throw(202, erreurReturn.erreurReturn(25))


    const id = ctx.request.jwtPayloadTo.sub
    const nam = ctx.request.jwtPayloadTo.name

    const valid = await exist.exist(id, nam, uuid)
    if (valid == 11)         ctx.throw(202, erreurReturn.erreurReturn(11))

    const all = await DaoApp.analyse(id, titr, temp);

    if (all){
        if (all == 25) {
            ctx.throw(202, erreurReturn.erreurReturn(25))
        }
        ctx.body = JSON.parse(erreurReturn.erreurReturn(0));
    }
    else {
        ctx.throw(202, erreurReturn.erreurReturn(25))
    }
}


module.exports.analyseInfo = async function (ctx) {
    const {titr, info} = ctx.query
    const {uuid} = ctx.request.header

    if(!uuid)                ctx.throw(202, erreurReturn.erreurReturn(11))
    if(!titr)                ctx.throw(202, erreurReturn.erreurReturn(25))
    if(!info)               ctx.throw(202, erreurReturn.erreurReturn(25))


    const id = ctx.request.jwtPayloadTo.sub
    const nam = ctx.request.jwtPayloadTo.name

    const valid = await exist.exist(id, nam, uuid)
    if (valid == 11)         ctx.throw(202, erreurReturn.erreurReturn(11))

    const all = await DaoApp.analyseInfo(id, titr, info);

    if (all){
        if (all == 25) {
            ctx.throw(202, erreurReturn.erreurReturn(25))
        }
        ctx.body = JSON.parse(erreurReturn.erreurReturn(0));
    }
    else {
        ctx.throw(202, erreurReturn.erreurReturn(25))
    }
}
