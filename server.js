require("dotenv").config();
//URI="mongodb+srv://admin:TtFK1ahj1hbgwyp0@cluster0.d3oyk.mongodb.net/user?retryWrites=true&w=majority"
console.log(URI);
const express = require("express");
const app = express();
const UsersController = require("./controller/Users");
const bodyParser = require("body-parser");
const cors = require("cors");
const data = require("./dataService")(URI);
const port = 3000;
const jwt = require('jsonwebtoken');

var jwtOptions = {};

jwtOptions.secretOrKey = '&0y7$noP#5rt99&GB%Pz7j2b1vkzaB0RKs%^N^0zOP89NT04mPuaM!&G8cbNZOtH';

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

app.get("/v1/login", (req, res) => {
  data
    .getUserByName(req.body)
    .then((data) => {
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
