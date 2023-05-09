const DaoHumAmbiante = require('../DAO/DaoHumAmbiante')
const erreurReturn = require('../erreur')


module.exports.all = async function (ctx) {
	const all = await DaoHumAmbiante.all();
	ctx.body = all
}

module.exports.search = async function (ctx) {
   const {id, num} = ctx.query

   if (!id) {
       if (!num) {
           const all = await DaoHumAmbiante.all();
           ctx.body = all
       }
       else {
           const user = await DaoHumAmbiante.findNom(num);
              if (user){
               ctx.body = user;
           }
           else {
               ctx.throw(202, erreurReturn.erreurReturn(5))
           }
       }
   }
   else {
       const user = await DaoHumAmbiante.find(id);
          if (user){
           ctx.body = user;
       }
       else {
           ctx.throw(202, erreurReturn.erreurReturn(5))
       }
   }
}
