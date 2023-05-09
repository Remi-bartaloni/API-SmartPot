const DaoTemperature = require('../DAO/DaoTemperature')
const erreurReturn = require('../erreur')


module.exports.all = async function (ctx) {
	const all = await DaoTemperature.all();
	ctx.body = all
}

module.exports.search = async function (ctx) {
   const {id, num} = ctx.query

   if (!id) {
       if (!num) {
           const all = await DaoTemperature.all();
           ctx.body = all
       }
       else {
           const user = await DaoTemperature.findNom(num);
              if (user){
               ctx.body = user;
           }
           else {
               ctx.throw(202, erreurReturn.erreurReturn(4))
           }
       }
   }
   else {
       const user = await DaoTemperature.find(id);
          if (user){
           ctx.body = user;
       }
       else {
           ctx.throw(202, erreurReturn.erreurReturn(4))
       }
   }
}
