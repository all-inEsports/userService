require("dotenv").config();
console.log(process.env.URI);
const express = require("express");
const app = express();
const UsersController = require("./controller/Users");
const bodyParser = require("body-parser");
const cors = require("cors");
const data = require("./dataService")(process.env.URI);
const port = process.env.PORT || 3000;

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

app.get("/v1/users/:id", (req, res) => {
  data
    .getUserById(req.params.id)
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      res.json({ message: `an error occurred: ${err}` });
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
