// imports
const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');

// custom modules
const Article = require(__dirname + '/Schemas/Article');

// setup mongodb
mongoose.connect(
  'mongodb+srv://ndinecoder:echoroot@cluster0.sbzga5h.mongodb.net/db_wikipedia'
);

// setup express server
const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// using chainable route handlers setup api-endpoints
//======= requests targeting all articles =======//
app
  .route('/articles')
  .get((req, res) => {
    Article.find((err, foundArticles) => {
      if (!err) {
        res.send(foundArticles);
      } else {
        res.send(err);
      }
    });
  })
  .post((req, res) => {
    // create a new record
    const newArticle = Article({
      title: req.body.title,
      content: req.body.content,
    });

    newArticle.save((err) => {
      if (!err) {
        res.send('Successfully added new article!');
      } else {
        res.send(err);
      }
    });
  })
  .delete((req, res) => {
    Article.deleteMany((err) => {
      if (!err) {
        res.send('Successfully deledted all the articles!');
      } else {
        res.send(err);
      }
    });
  });
// end of chainable route handlers for all articles

//======= requests targeting a single article =======//
// start of route handlers for a single article
app
  .route('/articles/:articleTitle')
  .get((req, res) => {
    Article.findOne({ title: req.params.articleTitle }, (err, foundArticle) => {
      if (foundArticle) {
        res.send(foundArticle);
      } else {
        res.send(`No article matching '${req.params.articleTitle}' was found.`);
      }
    });
  })
  .put((req, res) => {
    Article.updateMany(
      { title: req.params.articleTitle }, // search every instance record having the requested title
      { title: req.body.title, content: req.body.content }, // update with this new info...
      (err) => {
        if (!err) {
          res.send(
            `Successfully updated every instance of '${req.params.articleTitle}'`
          );
        } else {
          res.send(
            `There was an error updating every instance of '${req.params.articleTitle}'`
          );
        }
      }
    );
  })
  .patch((req, res) => {
    Article.updateMany(
      { title: req.params.articleTitle }, // search every instance (document) of articleTitle
      { $set: req.body }, // change it to a new title provided from source e.g postman...
      (err) => {
        if (!err) {
          res.send(
            `Successfully patched every instance of '${req.params.articleTitle}'`
          );
        } else {
          res.send(
            `There was an error patching every instance of '${req.params.articleTitle}'`
          );
        }
      }
    );
  })
  .delete((req, res) => {
    Article.deleteMany({ title: req.params.articleTitle }, (err) => {
      if (!err) {
        res.send(
          `Successfully deleted every instance of '${req.params.articleTitle}'`
        );
      } else {
        res.send(
          `There was an error deleting every instance of '${req.params.articleTitle}'`
        );
      }
    });
  });
// end of route handlers for a single article

// setup server port
app.listen(process.env.PORT || '3000', () => {
  console.log('express server up and running!');
});
