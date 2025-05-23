/*
 *
 *
 *       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
 *       -----[Keep the tests in the same order!]-----
 *
 */

const chaiHttp = require("chai-http");
const chai = require("chai");
const assert = chai.assert;
const server = require("../server");
const Book = require("../model/book");
chai.use(chaiHttp);

suite("Functional Tests", function () {
  this.beforeAll(async function () {
    const db = await server.db;
    await Book.deleteMany({});
    await Book.insertMany([
      { _id: "67f52d862334b70013df6810", title: "1" },
      { title: "2" },
      { title: "3" },
      { title: "4" },
      { title: "5" },
    ]);
  });
  /*
   * ----[EXAMPLE TEST]----
   * Each test should completely test the response of the API end-point including response status code!
   */
  test("#example Test GET /api/books", function (done) {
    chai
      .request(server.app)
      .get("/api/books")
      .end(function (err, res) {
        assert.equal(res.status, 200);
        assert.isArray(res.body, "response should be an array");
        assert.property(
          res.body[0],
          "commentcount",
          "Books in array should contain commentcount"
        );
        assert.property(
          res.body[0],
          "title",
          "Books in array should contain title"
        );
        assert.property(
          res.body[0],
          "_id",
          "Books in array should contain _id"
        );
        done();
      });
  });
  /*
   * ----[END of EXAMPLE TEST]----
   */

  suite("Routing tests", function () {
    suite(
      "POST /api/books with title => create book object/expect book object",
      function () {
        test("Test POST /api/books with title", function (done) {
          chai
            .request(server.app)
            .post("/api/books")
            .send({ title: "test" })
            .end(function (err, res) {
              assert.equal(res.status, 200);
              assert.isObject(res.body, "response should be an object");
              assert.property(
                res.body,
                "title",
                "response should contain title"
              );
              assert.property(res.body, "_id", "response should contain _id");
              done();
            });
        });

        test("Test POST /api/books with no title given", function (done) {
          chai
            .request(server.app)
            .post("/api/books")
            .send({})
            .end(function (err, res) {
              assert.equal(res.status, 400);
              assert.isString(res.text);
              assert.strictEqual(res.text, "missing required field title");
              done();
            });
        });
      }
    );

    suite("GET /api/books => array of books", function () {
      test("Test GET /api/books", function (done) {
        chai
          .request(server.app)
          .get("/api/books")
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.isArray(res.body, "response should be an Array");
            assert.property(
              res.body[0],
              "title",
              "response should contain title"
            );
            assert.property(res.body[0], "_id", "response should contain _id");
            assert.property(
              res.body[0],
              "commentcount",
              "response should contain commentcount"
            );
            done();
          });
      });
    });

    suite("GET /api/books/[id] => book object with [id]", function () {
      const id = "67f52d862334b70013df6810";
      test("Test GET /api/books/[id] with id not in db", function (done) {
        chai
          .request(server.app)
          .get("/api/books/67f52d862334b70013df6812")
          .send({})
          .end(function (err, res) {
            assert.equal(res.status, 404);
            assert.isString(res.text);
            assert.strictEqual(res.text, "no book exists");
            done();
          });
      });

      test("Test GET /api/books/[id] with valid id in db", function (done) {
        chai
          .request(server.app)
          .get("/api/books/" + id)
          .send({})
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.isObject(res.body, "response should be an object");
            assert.deepInclude(res.body, { _id: id, title: "1" });
            assert.isArray(
              res.body.comments,
              "response should contain comments"
            );
            done();
          });
      });
    });

    suite(
      "POST /api/books/[id] => add comment/expect book object with id",
      function () {
        const id = "67f52d862334b70013df6810";
        test("Test POST /api/books/[id] with comment", function (done) {
          chai
            .request(server.app)
            .post("/api/books/" + id)
            .send({ comment: "test" })
            .end(function (err, res) {
              assert.equal(res.status, 200);
              assert.isObject(res.body);
              assert.deepInclude(res.body, { _id: id, title: "1" });
              assert.isArray(res.body.comments);
              done();
            });
        });

        test("Test POST /api/books/[id] without comment field", function (done) {
          chai
            .request(server.app)
            .post("/api/books/" + id)
            .send({})
            .end(function (err, res) {
              assert.isString(res.text);
              assert.strictEqual(res.text, "missing required field comment");
              done();
            });
        });

        test("Test POST /api/books/[id] with comment, id not in db", function (done) {
          chai
            .request(server.app)
            .post("/api/books/67f52d862334b70013df6812")
            .send({ comment: "test" })
            .end(function (err, res) {
              assert.equal(res.status, 404);
              assert.isString(res.text);
              assert.strictEqual(res.text, "no book exists");
              done();
            });
        });
      }
    );

    suite("DELETE /api/books/[id] => delete book object id", function () {
      const id = "67f52d862334b70013df6810";
      test("Test DELETE /api/books/[id] with valid id in db", function (done) {
        chai
          .request(server.app)
          .delete("/api/books/" + id)
          .send({})
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.strictEqual(res.text, "delete successful");
            done();
          });
      });

      test("Test DELETE /api/books/[id] with  id not in db", function (done) {
        chai
          .request(server.app)
          .delete("/api/books/67f52d862334b70013df6812")
          .send({})
          .end(function (err, res) {
            assert.equal(res.status, 404);
            assert.isString(res.text);
            assert.strictEqual(res.text, "no book exists");
            done();
          });
      });
    });
  });
});
