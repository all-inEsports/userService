const mongoose = require("mongoose");

module.exports = (mongoDBConnectionString) => {
  const User = require("./model/Users");
  return {
    // Connection to db and defines User model
    connect: () => {
      return new Promise(function (resolve, reject) {
        let db = mongoose.createConnection(mongoDBConnectionString, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        });

        db.on("error", (err) => {
          reject(err);
        });

        db.once("open", () => {
          resolve();
        });
      });
    },

    addNewUser: function (data) {
      return new Promise((resolve, reject) => {
        let newUser = new User(data);

        newUser.save((err) => {
          if (err) {
            reject(err);
          } else {
            resolve(`new User: ${newUser._id} successfully added`);
          }
        });
      });
    },
    getAllUsers: (page, perPage) => {
      return new Promise((resolve, reject) => {
        if (+page && +perPage) {
          let filter = {};

          page = +page - 1;
          User.find(filter)
            .sort({ Balance: -1 })
            .skip(page * +perPage)
            .limit(+perPage)
            .exec()
            .then((users) => {
              resolve(users);
            })
            .catch((err) => {
              reject(err);
            });
        } else {
          reject("page and perPage query parameters must be present");
        }
      });
    },
    getUserByName: (userData) => {
      return new Promise((resolve,reject)=>{
        User.find({Array: userData.UserName})
        .limit(1)
        .exec()
        .then((users)=>{
          
              if(users[0].Password === userData.Password){
                resolve(user);
              }else{ 
                reject("Incorrect Password."); 
              }
            
        })
        .catch((err)=>reject(`${err}`))
      });
    },
    getUserById: function (id) {
      return new Promise((resolve, reject) => {
        User.findOne({ _id: id })
          .exec()
          .then((user) => {
            resolve(user);
          })
          .catch((err) => {
            reject(err);
          });
      });
    },
    updateUserById: function (data, id) {
      return new Promise((resolve, reject) => {
        User.updateOne(
          { _id: id },
          {
            $set: data,
          }
        )
          .exec()
          .then(() => {
            resolve(`user ${id} successfully updated`);
          })
          .catch((err) => {
            reject(err);
          });
      });
    },
    deleteUserById: function (id) {
      return new Promise((resolve, reject) => {
        User.deleteOne({ _id: id })
          .exec()
          .then(() => {
            resolve(`user ${id} successfully deleted`);
          })
          .catch((err) => {
            reject(err);
          });
      });
    },
  };
};
