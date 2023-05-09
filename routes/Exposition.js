const DaoExposition = require('../DAO/DaoExposition')
const erreurReturn = require('../erreur')


module.exports.all = async function (ctx) {
	const all = await DaoExposition.all();
	ctx.body = all
}

module.exports.search = async function (ctx) {
   const {id, num} = ctx.query

   if (!id) {
       if (!num) {
           const all = await DaoExposition.all();
           ctx.body = all
       }
       else {
           const user = await DaoExposition.findNom(num);
              if (user){
               ctx.body = user;
           }
           else {
               ctx.throw(202, erreurReturn.erreurReturn(5))
           }
       }
   }
   else {
       const user = await DaoExposition.find(id);
          if (user){
           ctx.body = user;
       }
       else {
           ctx.throw(202, erreurReturn.erreurReturn(5))
       }
   }
}


module.exports.searchFiltre = async function (ctx) {
    const {arg1, arg2, arg3, arg4, arg5, arg6, arg7, arg8, arg9} = ctx.query

    var id_1 = "-1"
    var id_2 = "-1"
    var id_3 = "-1"
    var id_4 = "-1"
    var id_5 = "-1"
    var id_6 = "-1"
    var id_7 = "-1"
    var id_8 = "-1"
    var id_9 = "-1"

    if (!arg1) ctx.throw(422, 'arg1 required.');
    else if (!arg2) ctx.throw(422, 'arg2 required.');
    else if (!arg3) ctx.throw(422, 'arg3 required.');
    else if (!arg4) ctx.throw(422, 'arg4 required.');
    else if (!arg5) ctx.throw(422, 'arg5 required.');
    else if (!arg6) ctx.throw(422, 'arg6 required.');
    else if (!arg7) ctx.throw(422, 'arg7 required.');
    else if (!arg8) ctx.throw(422, 'arg8 required.');
    else if (!arg9) ctx.throw(422, 'arg9 required.');

    else {
        if (arg1 == "true") {
            id_1 = "1"
        }

        if (arg2 == "true") {
            id_2 = "2"
        }

        if (arg3 == "true") {
            id_3 = "3"
        }

        if (arg4 == "true") {
            id_4 = "4"
        }
        if (arg5 == "true") {
            id_5 = "5"
        }

        if (arg6 == "true") {
            id_6 = "6"
        }

        if (arg7 == "true") {
            id_7 = "7"
        }

        if (arg8 == "true") {
            id_8 = "8"
        }

        if (arg9 == "true") {
            id_9 = "9"
        }

        ctx.body = await DaoExposition.find_filtre(id_1, id_2, id_3, id_4, id_5, id_6, id_7, id_8, id_9);
        //ctx.body = await DaoAll.all();
    }
}
