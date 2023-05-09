const Dao = require('../DAO/DaoAdmin')
const erreurReturn = require('../erreur')

module.exports.addPlante = async function (ctx) {
    const { TempMin, TempMax, HumTerreMin, HumTerreMax, HumAmbianteMin, HumAmbianteMax, ExpositionMin, ExpositionMax, Texture, Type } = ctx.query
    const {  } = ctx.request.header

    if(!TempMin)                        ctx.throw(202, erreurReturn.erreurReturn(30))
    if(!TempMax)                        ctx.throw(202, erreurReturn.erreurReturn(30))
    if(!HumTerreMin)                    ctx.throw(202, erreurReturn.erreurReturn(28))
    if(!HumTerreMax)                    ctx.throw(202, erreurReturn.erreurReturn(28))
    if(!HumAmbianteMin)                 ctx.throw(202, erreurReturn.erreurReturn(29))
    if(!HumAmbianteMax)                 ctx.throw(202, erreurReturn.erreurReturn(29))
    if(!ExpositionMin)                  ctx.throw(202, erreurReturn.erreurReturn(6))
    if(!ExpositionMax)                  ctx.throw(202, erreurReturn.erreurReturn(6))
    if(!Texture)                        ctx.throw(202, erreurReturn.erreurReturn(31))
    if(!Type)                           ctx.throw(202, erreurReturn.erreurReturn(6))

    const add = await Dao.addPlante(TempMin, TempMax, HumTerreMin, HumTerreMax, HumAmbianteMin, HumAmbianteMax, ExpositionMin, ExpositionMax, Texture, Type);

    if (add == 3) {
        ctx.body = JSON.parse(erreurReturn.erreurReturn(0))
    }
    else {
        ctx.throw(202, erreurReturn.erreurReturn(25))
    }
}
