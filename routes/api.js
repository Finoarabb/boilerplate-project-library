"use strict";

const Book = require("../model/book");

module.exports = function (app) {
  app
    .route("/api/books")
    .get(async function (req, res) {
      let result;
      try {
        result = await Book.find();
        result = result.map(function (book) {
          let obj = book.toObject();
          obj.commentcount = obj.comments.length;
          delete obj.comments;
          return obj;
        });
        res.json(result);
        return;
      } catch (err) {
        res.send(err);
        return;
      }
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
    })

    .post(async function (req, res) {
      let title = req.body.title;
      if (!title) {
        return res.send("missing required field title");
      }
      try {
        const result = await Book.create({
          title: title,
          comments: [],
        });
        return res.json(result);
      } catch (error) {
        return res.send(error);
      }
      //response will contain new book object including atleast _id and title
    })

    .delete(function (req, res) {

      Book.deleteMany({})
        .then(() => {
          res.send("complete delete successful");
        })
        .catch((err) => {
          res.send(err);
        });
      //if successful response will be 'complete delete successful'
    });

  app
    .route("/api/books/:id")
    .get(async function (req, res) {
      let bookid = req.params.id;

      try {
        const result = await Book.findById(bookid);
        if (result) {
          return res.json(result);
        } else {
          return res.send('no book exists');
        }
      } catch (err) {
        return res.send('no book exists');
      }
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
    })

    .post(async function (req, res) {
      let bookid = req.params.id;
      let comment = req.body.comment;
      if (!comment) return res.send("missing required field comment");
      try {
        let result = await Book.findById(bookid);
        result.comments.push(comment);
        await result.save();
        return res.json(result);
      } catch (error) {
        return res.send('no book exists');
      }

      //json res format same as .get
    })

    .delete(async function (req, res) {
      let bookid = req.params.id;
      try {
        const result = await Book.findByIdAndDelete(bookid);
        if (result) {
         return  res.send("delete successful");
        } else {
          return res.send('no book exists');
        }
      } catch (error) {
        return res.send('no book exists');
      }
      //if successful response will be 'delete successful'
    });
};
