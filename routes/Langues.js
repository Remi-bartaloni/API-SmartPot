const DaoPlante = require('../DAO/DaoLangues')
const erreurReturn = require('../erreur')


module.exports.search = async function (ctx) {
   const {id} = ctx.query

   if (!id){
       const all = await DaoPlante.all();
   	   ctx.body = all
   }
   else {
       const user = await DaoPlante.find(id);
          if (user){
           ctx.body = user;
       }
       else {
           ctx.throw(202, erreurReturn.erreurReturn(5))
       }
   }
}
