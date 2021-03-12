const mongoose = require("mongoose");
const Schema = mongoose.Schema;

mongoose
  .connect(process.env.URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to DB");
  })
  .catch((error) => {
    console.error("Connection to DB Failed");
    console.error(error.message);
    process.exit(-1);
  });


const UserSchema = new Schema({
  UserName: {
    type: String,
    required: true,
    unique:true
  },
  Email: {
    type: String,
    unique: true,
    required: true,
    unique:true
  },

  Password: {
    type: String,
    required: true,
  },
  Date: {
    type: Date,
    default: Date.now,
  },
  ProfilePic: {
    type: String,
    default: "default.png",
  },
  IsAdmin: {
    type: Boolean,
    default: false,
  },
  Balance: {
    type: Number,
    default: 5000,
  },
});

// exporting the module
module.exports = mongoose.connection.model("Users", UserSchema);
