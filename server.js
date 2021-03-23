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
      // The following will ensure that all routes using 
      // passport.authenticate have a req.user._id, req.user.userName, req.user.fullName & req.user.role values 
      // that matches the request payload data
      next(null, { 
          _id: jwt_payload._id, 
          UserName: jwt_payload.UserName,
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

app.post("/v1/login", (req, res) => {
  data
    .getUserByName(req.body)
    .then((data) => {
      console.log(data)
      var payload = {
        _id: data._id,
        UserName: data.UserName,
        Balance: data.Balance
      }
      var token = jwt.sign(payload, jwtOptions.secretOrKey);

      res.json({"message":"login successful", "token": token});
    })
    .catch((err) => {
      res.status(422).json({ message: `an error occurred: ${err}` });
    });

    
});

app.put("/v1/users/:id", (req, res) => {
  data
    .updateUserById(req.body, req.params.id)
    .then((msg) => {
      res.json({ message: msg });
    })
    .catch((err) => {
      res.json({ message: `an error occurred: ${err}` });
    });
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
