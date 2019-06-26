process.env.NODE_ENV = "test";
const { app } = require("../app");
const request = require("supertest")(app);
const chai = require("chai");
const { expect } = chai;
const { connection } = require("../connection");

describe("/api", () => {
  beforeEach(() => connection.seed.run());
  after(() => connection.destroy());
  describe("/topics", () => {
    it("GET responds with status: 200 and an array of topic objects", () => {
      return request
        .get("/api/topics")
        .expect(200)
        .then(({ body: { topics } }) => {
          expect(topics).to.be.an("array");
          expect(topics[0]).to.contain.keys("slug", "description");
        });
    });
    it("INVALID METHOD responds with status: 405", () => {
      const invalidMethods = ["put", "patch", "delete"];
      const methodPromises = invalidMethods.map(method => {
        return request[method]("/api/topics")
          .expect(405)
          .then(({ body: { msg } }) => {
            expect(msg).to.equal("Method not allowed");
          });
      });
      return Promise.all(methodPromises);
    });
  });
  describe("/users/:username", () => {
    it("GET responds with status:200 and a single user obj with given username", () => {
      return request
        .get("/api/users/rogersop")
        .expect(200)
        .then(({ body }) => {
          expect(body).to.contain.keys("username", "avatar_url", "name");
          expect(body.name).to.equal("paul");
        });
    });
    it("GET ERROR responds with status: 404 when username is non-existent", () => {
      return request
        .get("/api/users/notAUsername")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).to.equal("Username does not exist");
        });
    });
    it("INVALID METHOD responds with status: 405", () => {
      const invalidMethods = ["put", "patch", "delete"];
      const methodPromises = invalidMethods.map(method => {
        return request[method]("/api/users/rogersop")
          .expect(405)
          .then(({ body: { msg } }) => {
            expect(msg).to.equal("Method not allowed");
          });
      });
      return Promise.all(methodPromises);
    });
  });
  describe("/api/articles/:article", () => {
    it("GET responds with status:200 and a single article obj with given article_id", () => {
      return request
        .get("/api/articles/1")
        .expect(200)
        .then(({ body }) => {
          expect(body).to.contain.keys(
            "author",
            "title",
            "article_id",
            "body",
            "topic",
            "created_at",
            "votes"
          );
          expect(body.author).to.equal("butter_bridge");
        });
    });
    it("GET responds with an article obj which includes a count of no. of comments", () => {
      return request
        .get("/api/articles/1")
        .expect(200)
        .then(({ body }) => {
          expect(body.comment_count).to.equal("13");
        });
    });
    it("GET ERROR responds with status: 404 when article is non-existent", () => {
      return request
        .get("/api/articles/5000")
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).to.equal("Article does not exist");
        });
    });
    it('GET ERROR responds with status: 400 when article_id is invalid', () => {
      return request
        .get("/api/articles/cats")
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).to.equal("Bad Request");
        });
    });
    it("PATCH responds with status: 201 and an updated object with given article_id", () => {
      const input = { inc_votes: 1 };
      return request
        .patch("/api/articles/1")
        .send(input)
        .expect(201)
        .then(({body}) => {
          expect(body.votes).to.equal(101)
        });
    });
    it('PATCH ERROR responds with status: 404 when article id does not exist', () => {
      const input = { inc_votes: 1 };
      return request
        .patch("/api/articles/5000")
        .send(input)
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).to.equal("Article does not exist");
        });
    });
    it('PATCH ERROR responds with status: 400 when article_id is invalid', () => {
      const input = { inc_votes: 1 };
      return request
        .patch("/api/articles/cats")
        .send(input)
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).to.equal("Bad Request");
        });
    });
    it('PATCH ERROR responds with status: 400 when input is incorrect type', () => {
      const input = { inc_votes: 'hello' };
      return request
        .patch("/api/articles/1")
        .send(input)
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).to.equal("Bad Request");
        });
    });
    it("INVALID METHOD responds with status: 405", () => {
      const invalidMethods = ["put", "post", "delete"];
      const methodPromises = invalidMethods.map(method => {
        return request[method]("/api/articles/1")
          .expect(405)
          .then(({ body: { msg } }) => {
            expect(msg).to.equal("Method not allowed");
          });
      });
      return Promise.all(methodPromises);
    });
  });
  // describe('/articles/:article')
  // status: 400 invalid article_id e.g bananas
  // set up so fetchAllUsers model can be used with and without param, don't need two models
});

describe("generic error tests", () => {
  it("GET on an invalid path return status:404", () => {
    return request
      .get("/api/cats")
      .expect(404)
      .then(body => {
        expect(body.text).to.equal("Route not found");
      });
  });
});
