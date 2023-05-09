const DaoPlante = require('../DAO/DaoPlante')
const erreurReturn = require('../erreur')


module.exports.search = async function (ctx) {
   const {id, Nom} = ctx.query

   if (!id) {
       if (!Nom) {
           const all = await DaoPlante.all();
           ctx.body = all
       }
       else {
           const user = await DaoPlante.findNom(Nom);
              if (user){
               ctx.body = user;
           }
           else {
               ctx.throw(202, erreurReturn.erreurReturn(4))
           }
       }
   }
   else {
       const user = await DaoPlante.find(id);
          if (user){
           ctx.body = user;
       }
       else {
           ctx.throw(202, erreurReturn.erreurReturn(4))
       }
   }
}
