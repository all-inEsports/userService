const mongoose = require("mongoose");
const autoIncrement = require("mongoose-auto-increment");
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
autoIncrement.initialize(mongoose.connection);

const UserSchema = new Schema({
  _id: {
    type: Number,
    required: true,
  },
  UserName: {
    type: String,
    required: true,
  },
  Email: {
    type: String,
    unique: true,
    required: true,
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

UserSchema.plugin(autoIncrement.plugin, "Users");
// exporting the module
module.exports = mongoose.connection.model("Users", UserSchema);
