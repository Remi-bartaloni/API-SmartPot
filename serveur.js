const all = require('./routes/All')
const plante = require('./routes/Plante')
const langues = require('./routes/Langues')
const exposition = require('./routes/Exposition')
const humidite_ambiante = require('./routes/Humidite_ambiante')
const humidite_sol = require('./routes/Humidite_sol')
const image = require('./routes/Image')
const temperature = require('./routes/Temperature')
const texture = require('./routes/Texture')
const type = require('./routes/Type')
const mail = require('./routes/Mail')
const verif = require('./routes/verif')
const user = require('./routes/User')
const pot = require('./routes/Pot')
const application = require('./routes/App')
const authRoute = require('./routes/auth');
const authRouteMail = require('./routes/authMail');
const authenticated = require('./middleware/authenticated');
const authenticatedPassword = require('./middleware/authenticatedPassword');
const authRouteConte = require('./routes/authConte');
const authenticatedConte = require('./middleware/authenticatedConte');
const autConfimAcoute = require('./routes/autConfimAcoute');
const suggestion = require('./routes/Suggestion')

const authRouteAdmin = require('./routes/authAdmin');
const authVerifeAdmin = require('./middleware/authenticatedAdmin');
const admin = require('./routes/Admin')

const article = require('./routes/Article')


const erreurReturn = require('./erreur')


const Koa = require('koa')
const Router = require('koa-router')
const route = require('koa-route')
const koaBody = require('koa-body')
//const serve = require('koa-static');                /////////-------------------------------------------------
const path = require('path');
const cors = require('@koa/cors');
const compress = require('koa-compress');
const RateLimit = require('koa2-ratelimit').RateLimit;

const WebSocket = require('koa-websocket');
//const wss = new WebSocket.Server({ port: 8100 });


const staticDirPath = path.join(__dirname, 'Image');
//const app = new Koa()
const app = WebSocket(new Koa())
const router = new Router()


app.ws.use(function(ctx, next) {
  // return `next` to pass the context (ctx) on to the next ws middleware
  return next(ctx);
});

app.use(cors());
app.use(compress());
//app.use(bodyParser());
//app.use(koaBody({ multipart: true }));
app.use(koaBody());
//app.use(gzip());
//app.use(serve(staticDirPath));

//process.env.TZ = 'Pacific/Kiritimati'


const allLimiter = RateLimit.middleware({
  interval: 1*1000, // 1 second
  max: 9,
  delayAfter: 6, // begin slowing down responses after the first request
  timeWait: 1*1000,
  prefixKey: 'post/user/login/uuid::get/filter::get/plant/info::get/user/info::get/pot/images::put/pot/images/change::get/pot::get/pot/stats::get/pot/stats/date::get/pot/register::get/pot/info::post/pot/stats/add::post/pot/new::put/pot/change::delete/pot/delete::get/application/version::get/application/version/history::post/application/analyse/temp::post/application/analyse/info::post/suggestion::post/suggestion/plante::post/suggestion/lang',
  message: JSON.parse(erreurReturn.erreurReturn(429))
});

const utilisaturLimiter = RateLimit.middleware({
  interval: 5*1000, // 5 minute
  max: 6,
  delayAfter: 3, // begin slowing down responses after the first request
  timeWait: 2*1000,
  prefixKey: 'post/user/login::get/user/uuid::post/user/register::put/user/change/mail::put/user/change/password::put/user/new/password::delete/user/delete::put/user/valide/compte',
  message: JSON.parse(erreurReturn.erreurReturn(429))
});

const allLimiterMail = RateLimit.middleware({
  interval: 5*60*1000, // 5 minute
  max: 5,
  delayAfter: 1, // begin slowing down responses after the first request
  timeWait: 10*1000,
  prefixKey: 'post/user/send/mail',
  message: JSON.parse(erreurReturn.erreurReturn(429))
});




// -------------- pot -------------- //

router.get('/pot/info', allLimiter, authenticated, pot.info)
router.get('/pot', allLimiter, authenticated, pot.all)
router.get('/pot/stats', allLimiter, authenticated, pot.state)
router.get('/pot/stats/date', allLimiter, authenticated, pot.stateHeure)
router.get('/pot/register', allLimiter, authenticated, pot.PotVerif)
router.get('/pot/notification', authenticated, pot.notification)
router.get('/pot/images', allLimiter, authenticated, user.images)

router.put('/pot/images/change', allLimiter, authenticated, user.newImages)
router.put('/pot/change', allLimiter, authenticated, pot.valider)

router.post('/pot/stats/add', allLimiter, authenticated, pot.statsAdd)
router.post('/pot/new', allLimiter, authenticated, pot.add)

router.post('/pot/ajust', authenticated, pot.ajust)

router.delete('/pot/delete', allLimiter, authenticated, pot.sup)

//router.get('/pot/parametre', authenticated, pot.searchParametre)

////////////////////////////////////////////////////////////////////////////////

// -------------- plante -------------- //

router.post('/filter', allLimiter, authenticated, all.searchFiltre)

router.get('/plant/info', allLimiter, authenticated, all.search2)

////////////////////////////////////////////////////////////////////////////////

router.get('/', all.racine)

router.post('/user/login', utilisaturLimiter, authRoute);
router.post('/user/login/uuid', allLimiter, authenticated, verif.all);
router.get('/user/uuid', utilisaturLimiter, verif.uuidExist);

////////////////////////////////////////////////////////////////////////////////

// -------------- user -------------- //

router.get('/user/info', allLimiter, authenticated, user.all)

router.post('/user/register', utilisaturLimiter, authRouteConte, user.add)
router.post('/user/topic', utilisaturLimiter, user.topic);


router.put('/user/updateCGU', utilisaturLimiter, user.updateCGU);
router.put('/user/change/mail', utilisaturLimiter, authenticatedPassword, user.updatMail)
router.put('/user/change/password', utilisaturLimiter, authenticated, user.updatPass)
router.put('/user/valide/compte', utilisaturLimiter, authenticatedConte, user.valideCompte)
router.put('/user/notification', utilisaturLimiter, authenticated, user.notification);
router.put('/user/new/password', utilisaturLimiter, authenticatedPassword, user.newPassword)


router.delete('/user/delete', utilisaturLimiter, authenticated, user.delete)

//router.get('/user', authenticated, user.all)

////////////////////////////////////////////////////////////////////////////////

// -------------- Mail -------------- //

router.post('/user/send/mail', allLimiterMail, authRouteMail, mail.send)
router.post('/user/send/new/mail', authRouteMail, mail.sendNewMail)
router.post('/user/send/mail/confirm/account', autConfimAcoute, mail.confirmAccount)
router.post('/sendMailBlage', mail.send2)

//router.post('/user/send/new/compte', authRouteConte, mail.newCompte)

////////////////////////////////////////////////////////////////////////////////

// -------------- app -------------- //

router.get('/application/version', allLimiter, authenticated, application.version)
router.get('/application/version/history', allLimiter, authenticated, application.history)

//router.post('/application/analyse/temp', allLimiter, authenticated, application.analyse)
//router.post('/application/analyse/info', allLimiter, authenticated, application.analyseInfo)

////////////////////////////////////////////////////////////////////////////////

// -------------- suggestion -------------- //

router.post('/suggestion', allLimiter, authenticated, suggestion.add)
router.post('/suggestion/plante', allLimiter, authenticated, suggestion.addPlante)
router.post('/suggestion/lang', allLimiter, authenticated, suggestion.addLang)

////////////////////////////////////////////////////////////////////////////////

// -------------- plante -------------- //

//router.get('/plante', authenticated, plante.search)

////////////////////////////////////////////////////////////////////////////////

// -------------- langues -------------- //

//router.get('/langues', authenticated, langues.search)

////////////////////////////////////////////////////////////////////////////////

// -------------- exposition -------------- //

//router.get('/exposition', authenticated, exposition.search)
//router.get('/exposition/filtre', authenticated, exposition.searchFiltre)

////////////////////////////////////////////////////////////////////////////////

// -------------- Humidite_ambiante -------------- //

//router.get('/HumAmbiante', authenticated, humidite_ambiante.search)

////////////////////////////////////////////////////////////////////////////////

// -------------- Humidite_sol -------------- //

//router.get('/HumSol', authenticated, humidite_sol.search)

////////////////////////////////////////////////////////////////////////////////

// -------------- Image -------------- //

//router.get('/Image', authenticated, image.search)

////////////////////////////////////////////////////////////////////////////////

// -------------- Temperature -------------- //

//router.get('/Temperature', authenticated, temperature.search)

////////////////////////////////////////////////////////////////////////////////

// -------------- Texture -------------- //

//router.get('/Texture', authenticated, texture.search)

////////////////////////////////////////////////////////////////////////////////

// -------------- type -------------- //

//router.get('/type', authenticated, type.search)

////////////////////////////////////////////////////////////////////////////////

// -------------- test -------------- //

router.get('/test', all.test)

////////////////////////////////////////////////////////////////////////////////

const rooms = {};

var roomsInfo = { "rooms": [] };

app.ws.use(route.all('/', function (ctx) {
    const uuid = uuidv4(); // create here a uuid for this connection

    const leave = room => {

        for (let i = 0; i < Object.keys(roomsInfo["rooms"]).length; ++i) {
            if (room == roomsInfo["rooms"][i]["id"]) {
                // not present: do nothing
                if (!rooms[room][uuid]) return;

                // if the one exiting is the last one, destroy the room
                if (Object.keys(rooms[room]).length === 1) delete rooms[room];
                // otherwise simply leave the room
                else delete rooms[room][uuid];
                console.log(rooms)
            }
        }
    };
  // `ctx` is the regular koa context created from the `ws` onConnection `socket.upgradeReq` object.
  // the websocket is added to the context on `ctx.websocket`.
  ctx.websocket.send('Hello World');
  ctx.websocket.on('message', function(data) {
    // do something with the message from client
        //console.log(JSON.parse(data))
        //try {
            var { message, meta, room, idPot, ipApp } = JSON.parse(data);
            //console.log(message + " " + meta + " " + room)

            if (meta === "join") {
                if (!rooms[room]) rooms[room] = {}; // create the room
                if (!rooms[room][uuid]) rooms[room][uuid] = ctx.websocket; // join the room
                //console.log(rooms[room][uuid])

                let flage = false
                let flageExiste = false
                let index = -1
                for (var i = 0; i < roomsInfo["rooms"].length; ++i) {
                    if (roomsInfo["rooms"][i]["id"] == room) {
                        flage = true
                        index = i
                    }
                }

                if (flage === false) {
                    roomsInfo["rooms"].push({ id: room })
                    index = roomsInfo["rooms"].length - 1
                }

                if (roomsInfo["rooms"][index].hasOwnProperty('user') === true) {
                    for (var i = 0; i < Object.keys(roomsInfo["rooms"][index]["user"]).length; ++i) {
                        if (roomsInfo["rooms"][index]["user"][i]["idPot"] == idPot && roomsInfo["rooms"][index]["user"][i]["ipApp"] == ipApp) {
                            flageExiste = true
                        }
                    }
                }

                if (flageExiste == false) {
                    let buf = { user: [] }
                    if (roomsInfo["rooms"][index].hasOwnProperty('user') === true) {
                        for (var i = 0; i < Object.keys(roomsInfo["rooms"][index]["user"]).length; ++i) {
                            buf.user.push({ idPot: roomsInfo["rooms"][index]["user"][i]["idPot"], ipApp: roomsInfo["rooms"][index]["user"][i]["ipApp"] })
                        }
                    }

                    buf.user.push({ idPot: idPot, ipApp: ipApp })

                    let bufRoom = roomsInfo["rooms"][index]["id"]

                    Object.assign(roomsInfo["rooms"][index], { id: bufRoom, user: buf.user });
                }

                console.log(JSON.stringify(roomsInfo))
            }
            else if (meta === "leave") {
                leave(room);
            }
            else if (!meta) {
                // send the message to all in the room

                for (let i = 0; i < Object.keys(roomsInfo["rooms"]).length; ++i) {
                    if (room == roomsInfo["rooms"][i]["id"]) {
                        for (var ii = 0; ii < Object.keys(roomsInfo["rooms"][i]["user"]).length; ++ii) {
                            if (roomsInfo["rooms"][i]["user"][ii]["idPot"] == idPot && roomsInfo["rooms"][i]["user"][ii]["ipApp"] == ipApp) {
                                Object.entries(rooms[room]).forEach(([, sock]) => {
                                    console.log(message)
                                    sock.send(message);
                                });
                            }
                        }
                    }
                }
            }
        //} catch (error) { }

  });
}));




function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}
////////////////////////////////////////////////////////////////////////////////

// -------------- admin -------------- //

router.post('/admin/login', authRouteAdmin)

//router.post('/admin/add/plante', authVerifeAdmin, admin.addPlante)

////////////////////////////////////////////////////////////////////////////////






// -------------- article -------------- //

router.get('/article/get', article.get);
router.get('/article/get/sum', article.getSum);

router.post('/article/add', article.add);

router.delete('/article/date', article.deleteDate);

//router.post('/admin/add/plante', authVerifeAdmin, admin.addPlante)

////////////////////////////////////////////////////////////////////////////////

app.use(router.routes())
app.use(router.allowedMethods())
app.listen(8100)
