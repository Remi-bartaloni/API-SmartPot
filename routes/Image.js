const DaoImage = require('../DAO/DaoImage')
const erreurReturn = require('../erreur')


module.exports.all = async function (ctx) {
	const all = await DaoImage.all();
	ctx.body = all
}

module.exports.search = async function (ctx) {
   const {id} = ctx.query

   if (!id){
       const all = await DaoImage.all();
   	   //ctx.body = all

	   let response = erreurReturn.erreurReturn(0)
	   response = response.substr(1, response.length - 2)

	   let jsonRes = "{\"list\":" + JSON.stringify(all) + "," + response + "}"
	   ctx.body = JSON.parse(jsonRes);
   }
   else {
       const user = await DaoImage.find(id);
          if (user){
           //ctx.body = user;

		   let response = erreurReturn.erreurReturn(0)
	       response = response.substr(1, response.length - 2)

	       let liste = JSON.stringify(user)
	       liste = liste.substr(1, liste.length - 2)

	       let jsonRes = "{" + liste + "," + response + "}"
	       ctx.body = JSON.parse(jsonRes);
       }
       else {
           ctx.throw(202, erreurReturn.erreurReturn(5))
       }
   }
}
