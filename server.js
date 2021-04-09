require("dotenv").config();
const express = require("express");
const app = express();
const UsersController = require("./controller/Users");
const bodyParser = require("body-parser");
const cors = require("cors");
const data = require("./dataService")(process.env.URI);
const port = process.env.PORT || 3000;
const jwt = require('jsonwebtoken');
const passport = require("passport");
const passportJWT = require("passport-jwt");
var ExtractJwt = passportJWT.ExtractJwt;
var JwtStrategy = passportJWT.Strategy;

var jwtOptions = {};
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme("jwt");

jwtOptions.secretOrKey = '&0y7$noP#5rt99&GB%Pz7j2b1vkzaB0RKs%^N^0zOP89NT04mPuaM!&G8cbNZOtH';

var strategy = new JwtStrategy(jwtOptions, function (jwt_payload, next) {
  console.log('payload received', jwt_payload);

  if (jwt_payload) {
      next(null, { 
          _id: jwt_payload._id, 
          UserName: jwt_payload.UserName,
          ProfilePic: jwt_payload.ProfilePic,
          Balance: jwt_payload.Balance 
        }); 
  } else {
      next(null, false);
  }
});

passport.use(strategy);

app.use(passport.initialize());



app.use(bodyParser.json());
app.use(cors());

app.post("/v1/user", async (req, res) => {
  data
    .addNewUser(req.body)
    .then((msg) => {
      res.json({ message: msg });
    })
    .catch((err) => {
      res.json({ message: `an error occurred: ${err}` });
    });
});

app.get("/v1/users", async (req, res) => {
  let page = req.query.page || 1;
  let perPage = req.query.perPage || 10;
  data
    .getAllUsers(page, perPage)
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      res.json({ message: `an error occurred: ${err}` });
    });
});

app.get("/v1/users/:id", async (req, res) => {
  data
    .getUserById(req.params.id)
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      res.json({ message: `an error occurred: ${err}` });
    });
});
app.post("/v1/balance/:username", (req,res) => {
    data.updateUserBalanceByUserName(req.body.Balance,req.params.username)
    .then((msg) => {
       res.status(200).json({message:msg});
    }).catch((err) => {
      res.status(422).json({ message: `an error occurred: ${err}` });
    });
})
app.post("/v1/login", (req, res) => {
  data
    .getUserByName(req.body)
    .then((data) => {
      let payload = {
        _id: data._id,
        UserName: data.UserName,
        ProfilePic: data.ProfilePic,
        Balance: data.Balance
      }
      let token = jwt.sign(payload, jwtOptions.secretOrKey);

      res.json({ "message": "login successful", "token": token });
    })
    .catch((err) => {
      res.status(422).json({ message: `an error occurred: ${err}` });
    });

    
});

app.put("/v1/users/:id", (req, res) => {
  if(req.query.Balance){
    data.updateUserBalance(req.query.Balance, req.params.id).then((data) => {
      let payload = {
        _id: data._id,
        UserName: data.UserName,
        Balance: data.Balance
      }
      let token = jwt.sign(payload, jwtOptions.secretOrKey);

      res.json({ "message": "Balance Updated", "token": token });
    }).catch((err) => res.json(err));
  }
  else {
  data
    .updateUserById(req.body, req.params.id)
    .then((msg) => {
      res.json({ message: msg });
    })
    .catch((err) => {
      res.json({ message: `an error occurred: ${err}` });
    });
  }


});

app.delete("/v1/users/:id", (req, res) => {
  data
    .deleteUserById(req.params.id)
    .then((msg) => {
      res.json({ message: msg });
    })
    .catch((err) => {
      res.json({ message: `an error occurred: ${err}` });
    });
});

data
  .connect()
  .then(() => {
    app.listen(port, () => {
      console.log("API listening on: " + port);
    });
  })
  .catch((err) => {
    console.log("unable to start the server: " + err);
    process.exit();
  });
