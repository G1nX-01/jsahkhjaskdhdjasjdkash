const express = require('express')
const app = express()
const port = 3000
const path = require('path');
const cors = require('cors');
const {accessLog, errorLog, setHeaders} = require('./other/scripts/usefulstuff.js')
const blowfishsecret = process.env['stop snooping goddamit']
const { JsonDB } = require('node-json-db');
const Config = require("node-json-db/dist/lib/JsonDBConfig").Config;
const altJSONdb = require('simple-json-db');
const Blowfish = require("javascript-blowfish").Blowfish
const { v4: uuidv4 } = require('uuid');
const hmm = process.env['what might this be?']
const { writeFileSync } = require('fs');
const Chance = require("chance");
var chance = new Chance();
var bf = new Blowfish(blowfishsecret);
//const authdb = new JSONdb('/path/to/your/storage.json');
//const authdb = new JsonDB(new Config("accounts", true, true, '/'));
var db = new JsonDB(new Config("db", true, true, '/'));
var ids = new JsonDB(new Config("ids", true, true, '/'));
const robots = require('express-robots-txt')
const bodyParser = require('body-parser')
var cookieParser = require('cookie-parser');
var session = require('express-session')
//const passport = require("passport")
//const LocalStrategy = require('passport-local').Strategy
const cookieSign = process.env["no, you can't see this either, sorry"]
app.use(cookieParser());
app.use(session({
    secret: cookieSign, // just a long random string
    resave: false,
    saveUninitialized: true
}));
/*passport.use(new LocalStrategy(
  function(username, password, done) {
    User.findOne({ username: username }, function (err, user) {
      if (err) { return done(err); }
      if (!user) { return done(null, false); }
      if (!user.verifyPassword(password)) { return done(null, false); }
      return done(null, user);
    });
  }
));*/
//const StormDB = require("stormdb");

// start db with "./db.stormdb" storage location
/*
const engine = new StormDB.localFileEngine("./accounts.stormdb", {
  serialize: data => {
    // encrypt and serialize data
    return encrypt(JSON.stringify(data));
  },
  deserialize: data => {
    // decrypt and deserialize data
    return JSON.parse(decrypt(data));
  }
});
const authdb = new StormDB(engine);
//const authdb = new StormDB(engine);
authdb.default({ users: [] });
*/

function pushNewUser(user, pass) {
  var now = new Date();
  var completedate = dateFormater(now, '/')
  authdb.push("/users/" + encrypt(user), {
    username:encrypt(user),
    password:encrypt(pass),
    joindate:encrypt(completedate)
}, false);
  return encrypt(user), encrypt(pass)
}

// Later in expressJS
//app.use(ipBlacklist.checkBlacklist);

// Later still in the 404 handler or any other controller
//app.use(ipBlacklist.increment);
function doesthatexistinthedb(str) {
  try {
    var data = db.getData("/codes/" + str);
} catch(error) {
    // The error will tell you where the DataPath stopped. In this case test1
    // Since /test1/test does't exist.
    //console.error(error);
    return false
};
  return true
}
function hasUser(str) {
  try {
    var data = authdb.getData("/users/" + str);
} catch(error) {
    // The error will tell you where the DataPath stopped. In this case test1
    // Since /test1/test does't exist.
    //console.error(error);
    return false
};
  return true
}

function hasUser(str) {
  try {
    var data = authdb.getData("/users/" + str);
} catch(error) {
    // The error will tell you where the DataPath stopped. In this case test1
    // Since /test1/test does't exist.
    //console.error(error);
    return false
};
  return true
}

function dateFormater(date, separator) {
  var day = date.getDate();
  // add +1 to month because getMonth() returns month from 0 to 11
  var month = date.getMonth() + 1;
  var year = date.getFullYear();
  var hour = date.getHours()
  var sec = date.getSeconds()

  if (sec < 10) {
    sec = "0" + sec
  }
  if (hour < 10) {
    hour = "0" + hour
  }

  // show date and month in two digits
  // if month is less than 10, add a 0 before it
  if (day < 10) {
    day = '0' + day;
  }
  if (month < 10) {
    month = '0' + month;
  }

  // now we have day, month and year
  // use the separator to join them
  return day + separator + month + separator + year + " - " + hour + ":" + sec;
}

//app.use(passport.initialize()) 
// init passport on every route call.
//app.use(passport.session())    
// allow passport to use "express-session".

var htmlPath = path.join(__dirname, 'altpublic');

app.use(express.static(htmlPath, { extensions: ['html'] }));
//app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css'));
app.use(require('express-title')());
app.set('title', 'MLB (Monomod Level Browser)');
app.use(express.json({extended: true, limit: '1mb'}))
app.use(robots(__dirname + '/robots.txt'));
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));

function encrypt(str) {
  authdb.reload();
  return bf.encrypt(str);
}

function decrypt(str) {
  authdb.reload();
  return bf.decrypt(str);
}

function set(path, value) {
  obj = {}  
  var schema = obj;  // a moving reference to internal objects within obj
    var pList = path.split('.');
    var len = pList.length;
    for(var i = 0; i < len-1; i++) {
        var elem = pList[i];
        if( !schema[elem] ) schema[elem] = {}
        schema = schema[elem];
    }

    schema[pList[len-1]] = value;
      console.log(schema[pList[len-1]])
}

function getKey(obj, val, r, t) {
  return obj.value[t] = r;
}

function findKeyInJson(jsonObj, targetKey) {
  if (typeof jsonObj === "object") {
    if (jsonObj.hasOwnProperty(targetKey)) {
      return targetKey;
    }
    for (var key in jsonObj) {
      var foundKey = findKeyInJson(jsonObj[key], targetKey);
      if (foundKey !== null) {
        return foundKey;
      }
    }
  }
  return null;
}

//authdb.get("users").push({ name: "tom" });
app.post('/ban/', (req, res) => {
if (!req.headers.authorization) {
    return res.status(403).json({ error: 'No credentials sent!' });
} else {
  if (req.headers.authorization == hmm) {
    var { title, banreason } = req.body
    db.reload();
    if (doesthatexistinthedb(title)) {
    var data = db.getData("/codes/");
    console.log(data)
    data = data[title]
    data.banned = banreason
    db.push("/codes/" + title, data);
   // fs.writeFile("./db.json", JSON.stringify(data))
    console.log(data)
    res.status(200).json({ result: title + ' is now banned!' });
      } else {
      return res.status(400).json({ error: title + " doesn't exist!" });
      }
  } else {
    return res.status(403).json({ error: 'Incorrect AUTH header!' });
  }
}
})

// Handling non matching request from the client
/*
app.use((req, res, next) => {
   res.sendFile(htmlPath + "/errorpages/404.html") 
})*/

app.post('/viewlevel/', (req, res) => {
    var { id } = req.body
    console.log(req.body)
  if (findKeyInJson(db.getData("/ids/"), id) != null)  {
  var data = db.getData("/ids/")
  data = data[findKeyInJson(db.getData("/ids/"), id)] // this would be le level title
  tmp = db.getData("/codes/" + data)
  tmp = tmp.banned
  if (tmp == undefined) {
    console.log(data)
    // resend json data
    res.status(200).json({data})
  } else {
    res.status(404).json({error: "ID " + id + " is banned! Reason: " + tmp})
  }
   } else {
    res.status(404).json({error: "ID " + id + " doesn't exist!"})
   }
})

app.post('/newcodething/', (req, res) => {
    var { code, title, isvanilla } = req.body
    var now = new Date();
    var completedate = dateFormater(now, '/')
    console.log(req.body)
    var id = chance.natural({ min: 99999999, max: 999999999 })
    console.log(id)
    // resend json data
    res.status(200).json({ code, title })
    db.push("/codes/" + title, {
    head:title,
    val:code,
    isvanilla:isvanilla,
    date:completedate
}, false);
    db.push("/ids/", {
    [id]:title
}, false);

})
/*
app.post('/regjson/', (req, res) => {
    var { user, pass } = req.body
    var now = new Date();
    var completedate = dateFormater(now, '/')
    console.log(req.body)

    // resend json data
    res.status(200).json({ user, pass })
    accsys.push("/users/" + user, {
    user:user,
    pass:pass,
    datemade:completedate
}, false);

})*/
app.get('/doesthatevenexist/:thing', (req, res) => {
  var result = doesthatexistinthedb(req.params.thing)
  res.status(200).json({result: result})
})


app.get('/newcodething/', (req, res) => {
 res.sendFile(htmlPath + "/waltuh.html") 
})
/*app.get('/regjson/', (req, res) => {
 res.sendFile(htmlPath + "/waltuh.html") 
})*/
app.get('/dbreload/', (req, res) => {
 db.reload();
 res.send("db reloaded!")
})

app.get('/listjson/', (req, res) => {
 //res.sendFile(htmlPath + "/waltuh.html") 
  db.reload();
  var data = db.getData("/codes/");
  var ids = db.getData("/ids/");
  res.status(200).json({data, ids})
})

app.get('/listspecific/:level', (req, res) => {
 //res.sendFile(htmlPath + "/waltuh.html") 
  db.reload();
  var arg = req.params.level
  var data = db.getData("/codes/" + arg);
  res.status(200).json({data})
})

app.listen(port, () => {
  console.log("We're on https://monomodbrowser.genarunchisacoa.repl.co!")
})