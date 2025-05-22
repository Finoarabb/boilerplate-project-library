const mongoose = require("mongoose");


const BookSchema = mongoose.Schema({
  title: String,
  comments: Array,
});

module.exports = mongoose.model("Book", BookSchema);
