const DaoType = require('../DAO/DaoType')
const erreurReturn = require('../erreur')



module.exports.all = async function (ctx) {
	const all = await DaoType.all();
	ctx.body = all
}

module.exports.search = async function (ctx) {
   const {id, num} = ctx.query

   if (!id) {
       if (!num) {
           const all = await DaoType.all();
           ctx.body = all
       }
       else {
           const user = await DaoType.findNom(num);
              if (user){
               ctx.body = user;
           }
           else {
               ctx.throw(202, erreurReturn.erreurReturn(4))
           }
       }
   }
   else {
       const user = await DaoType.find(id);
          if (user){
           ctx.body = user;
       }
       else {
           ctx.throw(202, erreurReturn.erreurReturn(4))
       }
   }
}
