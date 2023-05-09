const DaoHumSol = require('../DAO/DaoHumSol')
const erreurReturn = require('../erreur')


module.exports.all = async function (ctx) {
	const all = await DaoHumSol.all();
	ctx.body = all
}

module.exports.search = async function (ctx) {
   const {id, num} = ctx.query

   if (!id) {
       if (!num) {
           const all = await DaoHumSol.all();
           ctx.body = all
       }
       else {
           const user = await DaoHumSol.findNom(num);
              if (user){
               ctx.body = user;
           }
           else {
               ctx.throw(202, erreurReturn.erreurReturn(5))
           }
       }
   }
   else {
       const user = await DaoHumSol.find(id);
          if (user){
           ctx.body = user;
       }
       else {
           ctx.throw(202, erreurReturn.erreurReturn(5))
       }
   }
}
