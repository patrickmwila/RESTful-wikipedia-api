const mongoose = require('mongoose');

// create an article schema
const articleSchema = new mongoose.Schema({
  title: String,
  content: String,
});

// export an article collection model
module.exports = mongoose.model('Article', articleSchema);
