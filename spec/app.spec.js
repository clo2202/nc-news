process.env.NODE_ENV = "test";
const { app } = require("../app");
const request = require("supertest")(app);
const chai = require("chai");
const chaiSorted = require("chai-sorted");
const { expect } = chai;
const { connection } = require("../connection");

chai.use(chaiSorted);

describe("/api", () => {
  beforeEach(() => connection.seed.run());
  after(() => connection.destroy());
  describe('/', () => {
    it('GET responds with status: 200 and a json object of all available endpoints', () => {
      return request
      .get('/api')
      .expect(200)
      .then(({body}) => {
        expect(body).to.be.an('object')
      })
    })
    it("INVALID METHOD responds with status: 405", () => {
      const invalidMethods = ["put", "patch", 'post', "delete"];
      const methodPromises = invalidMethods.map(method => {
        return request[method]("/api")
          .expect(405)
          .then(({ body: { msg } }) => {
            expect(msg).to.equal("Method not allowed");
          });
      });
      return Promise.all(methodPromises);
    });
  });
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
    it("POST responds with status: 201 and the new topic obj", () => {
      const input = {
        slug: 'test',
        description: 'test topic',
      };
      return request
        .post("/api/topics")
        .send(input)
        .expect(201)
        .then(({ body: { topic} }) => {
          expect(topic.slug).to.equal('test');
          expect(topic).to.contain.keys(
            "slug",
            "description"
          );
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
  describe('/users', () => {
    it("GET responds with status: 200 and an array of user objects", () => {
      return request
        .get("/api/users")
        .expect(200)
        .then(({ body: { users } }) => {
          expect(users).to.be.an("array");
          expect(users.length).to.equal(4)
        });
    });
  })
  describe("/users/:username", () => {
    it("GET responds with status:200 and a single user obj with given username", () => {
      return request
        .get("/api/users/rogersop")
        .expect(200)
        .then(({ body: { user } }) => {
          expect(user).to.contain.keys("username", "avatar_url", "name");
          expect(user.name).to.equal("paul");
        });
    });
    it("GET ERROR responds with status: 404 when username is non-existent", () => {
      return request
        .get("/api/users/notAUsername")
        .expect(404)
        .then(({ body}) => {
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
  describe("/articles/:article_id", () => {
    it("GET responds with status:200 and a single article obj with given article_id", () => {
      return request
        .get("/api/articles/1")
        .expect(200)
        .then(({ body: { article} }) => {
          expect(article).to.contain.keys(
            "author",
            "title",
            "article_id",
            "body",
            "topic",
            "created_at",
            "votes"
          );
          expect(article.author).to.equal("butter_bridge");
        });
    });
    it("GET responds with an article obj which includes a count of no. of comments", () => {
      return request
        .get("/api/articles/1")
        .expect(200)
        .then(({ body: { article} }) => {
          expect(article.comment_count).to.equal("13");
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
    it("GET ERROR responds with status: 400 when article_id is invalid", () => {
      return request
        .get("/api/articles/cats")
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).to.equal("Bad Request");
        });
    });
    it('DELETE responds with status: 204 and no content', () => {
      return request
        .delete('/api/articles/1')
        .expect(204)
    });
    it("DELETE ERROR responds with status: 404 when article id does not exist", () => {
      return request
        .delete("/api/articles/5000")
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).to.equal("Article does not exist");
        });
    });
    it('DELETE ERROR responds with status: 400 when article id is invalid', () => {
      return request
      .delete("/api/articles/cats")
      .expect(400)
      .then(({body: { msg }}) => {
        expect(msg).to.equal("Bad Request")
      })
    });
    it("PATCH responds with status: 200 and an updated object with given article_id", () => {
      const input = { inc_votes: 1 };
      return request
        .patch("/api/articles/1")
        .send(input)
        .expect(200)
        .then(({ body: { article } }) => {
          expect(article.votes).to.equal(101);
        });
    });
    it("PATCH responds with status: 200 and an updated object with decreased votes", () => {
      const input = { inc_votes: -1 };
      return request
        .patch("/api/articles/1")
        .send(input)
        .expect(200)
        .then(({ body: { article } }) => {
          expect(article.votes).to.equal(99);
        });
    });
    it("PATCH responds with status: 200 and an unchanged object if request body is empty", () => {
      const input = {};
      return request
        .patch("/api/articles/1")
        .send(input)
        .expect(200)
        .then(({ body: { article } }) => {
          expect(article.votes).to.equal(100);
        });
    });
    it("PATCH ERROR responds with status: 404 when article id does not exist", () => {
      const input = { inc_votes: 1 };
      return request
        .patch("/api/articles/5000")
        .send(input)
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).to.equal("Article does not exist");
        });
    });
    it("PATCH ERROR responds with status: 400 when article_id is invalid", () => {
      const input = { inc_votes: 1 };
      return request
        .patch("/api/articles/cats")
        .send(input)
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).to.equal("Bad Request");
        });
    });
    it("PATCH ERROR responds with status: 400 when input is incorrect type", () => {
      const input = { inc_votes: "hello" };
      return request
        .patch("/api/articles/1")
        .send(input)
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).to.equal("Bad Request");
        });
    });
    it("INVALID METHOD responds with status: 405", () => {
      const invalidMethods = ["put", "post"];
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
  describe("/articles/:article_id/comments", () => {
    it("POST responds with status: 201 and the new comment obj", () => {
      const input = {
        username: "butter_bridge",
        body: "I am a comment"
      };
      return request
        .post("/api/articles/1/comments")
        .send(input)
        .expect(201)
        .then(({ body: { comment} }) => {
          expect(comment.votes).to.equal(0);
          expect(comment).to.contain.keys(
            "comment_id",
            "author",
            "article_id",
            "created_at",
            "body"
          );
        });
    });
    it("POST ERROR responds with status: 404 when article id does not exist", () => {
      const input = {
        username: "butter_bridge",
        body: "I am a comment"
      };
      return request
        .post("/api/articles/5000/comments")
        .send(input)
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).to.equal("The page does not exist");
        });
    });
    it("POST ERROR responds with status: 400 when adding invalid columns", () => {
      const input = {
        username: "test user",
        copy: "I am a comment"
      };
      return request
        .post("/api/articles/1/comments")
        .send(input)
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).to.equal("Bad Request");
        });
    });
    it("POST ERROR responds with status: 400 when required info is not provided", () => {
      const input = {
        username: "test user",
      };
      return request
        .post("/api/articles/1/comments")
        .send(input)
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).to.equal("Bad Request");
        });
    });
    it("GET responds with status: 200 and an array of all comments for given article", () => {
      return request
        .get("/api/articles/1/comments")
        .expect(200)
        .then(({ body: { comments } }) => {
          expect(comments.length).equal(13);
          expect(comments[0]).to.contain.keys(
            "comment_id",
            "author",
            "article_id",
            "votes",
            "body"
          );
        });
    });
    it("GET responds with status: 200 & an array of comments with a default sort of created_at", () => {
      return request
        .get("/api/articles/1/comments")
        .expect(200)
        .then(({ body: { comments } }) => {
          expect(comments).to.be.sortedBy("created_at", { descending: true });
        });
    });
    it("GET responds with status: 200 & and an empty array if there are no comments for given article", () => {
      return request
        .get("/api/articles/4/comments")
        .expect(200)
        .then(({ body: { comments } }) => {
          expect(comments).to.eql([]);
        });
    });
    it("GET responds with status: 200 & an array of comments that can be sorted by a given column", () => {
      return request
        .get("/api/articles/1/comments?sort_by=votes")
        .expect(200)
        .then(({ body: { comments } }) => {
          expect(comments).to.be.sortedBy("votes", { descending: true });
        });
    });
    it("GET responds with status: 200 & an array of comments with a default order of descending", () => {
      return request
        .get("/api/articles/5/comments")
        .expect(200)
        .then(({ body: { comments } }) => {
          expect(comments).to.be.sortedBy("created_at", { descending: true });
        });
    });
    it("GET responds with status: 200 & an array of comments with an order that can be set to asc or desc", () => {
      return request
        .get("/api/articles/1/comments?order=asc")
        .expect(200)
        .then(({ body: { comments } }) => {
          expect(comments).to.be.sortedBy("created_at");
        });
    });
    it("GET ERROR status: 400 for invalid sort_by value", () => {
      return request
        .get("/api/articles/1/comments?sort_by=cats")
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).to.equal('Bad Request')
        });
    });
    it("GET ERROR responds with status: 404 when article id does not exist", () => {
      return request
        .get("/api/articles/5000/comments")
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).to.equal("Article does not exist");
        });
    });
    it("INVALID METHOD responds with status: 405", () => {
      const invalidMethods = ["put", "patch", "delete"];
      const methodPromises = invalidMethods.map(method => {
        return request[method]("/api/articles/1/comments")
          .expect(405)
          .then(({ body: { msg } }) => {
            expect(msg).to.equal("Method not allowed");
          });
      });
      return Promise.all(methodPromises);
    });
  });
  describe('/api/articles', () => {
    it('GET responds with status: 200 & an array of all articles', () => {
      return request
      .get('/api/articles')
      .expect(200)
      .then(({body: {articles}}) => {
        expect(articles.length).to.equal(12)
      })
    });
    it('GET responds with status: 200 & an array of all articles default order of created_at', () => {
      return request
      .get('/api/articles')
      .expect(200)
      .then(({body: {articles}}) => {
        expect(articles).to.be.sortedBy('created_at', { descending: true })
      })
    });
    it('GET responds with status: 200 & an array of all articles that can be sorted by a given column', () => {
      return request
      .get('/api/articles?sort_by=votes')
      .expect(200)
      .then(({body: {articles}}) => {
        expect(articles).to.be.sortedBy('votes', { descending: true })
      })
    });
    it('GET responds with status: 200 & an array of all articles that can be ordered asc or desc', () => {
      return request
      .get('/api/articles?order=asc')
      .expect(200)
      .then(({body: {articles}}) => {
        expect(articles).to.be.sortedBy('created_at')
      })
    });
    it('GET responds with status: 200 & an array of all articles that can be filtered by author', () => {
      return request
      .get('/api/articles?author=rogersop')
      .expect(200)
      .then(({body: {articles}}) => {
        expect(articles.length).to.equal(3)
      })
    });
    it('GET responds with status: 200 & an array of all articles that can be filtered by topic', () => {
      return request
      .get('/api/articles?topic=cats')
      .expect(200)
      .then(({body: {articles}}) => {
        expect(articles.length).to.equal(1)
      })
    });
    it('GET ERROR responds with status: 400 for invalid sort_by value', () => {
      return request
      .get('/api/articles?sort_by=bananas')
      .expect(400)
      .then(({body: {msg}}) => {
        expect(msg).to.equal("Bad Request")
      })
    });
    it('GET ERROR responds with status: 404 for author that does not exist', () => {
      return request
      .get('/api/articles?author=sally')
      .expect(404)
      .then(({body: {msg}}) => {
        expect(msg).to.equal("Page cannot be found")
      })
    });
    it('GET ERROR responds with status: 404 for topic that does not exist', () => {
      return request
      .get('/api/articles?topic=test')
      .expect(404)
      .then(({body: {msg}}) => {
        expect(msg).to.equal("Page cannot be found")
      })
    });
    it("POST responds with status: 201 and the new article obj", () => {
      const input = {
        title: 'Test article',
        topic: 'mitch',
        author: 'butter_bridge',
        body: 'I am a test article',
      };
      return request
        .post("/api/articles")
        .send(input)
        .expect(201)
        .then(({ body: { article} }) => {
          expect(article.votes).to.equal(0);
          expect(article).to.contain.keys(
            "article_id",
            "author",
            "topic",
            "created_at",
            "body"
          );
        });
    });
    it("POST ERROR responds with status: 400 when input value is missing", () => {
      const input = {
        title: 'Test article',
        topic: 'mitch',
        body: 'I am a test article',
      };
      return request
        .post("/api/articles")
        .send(input)
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).to.equal("Bad Request");
        });
    });
    it("INVALID METHOD responds with status: 405", () => {
      const invalidMethods = ["delete", "put", "patch"];
      const methodPromises = invalidMethods.map(method => {
        return request[method]("/api/articles")
          .expect(405)
          .then(({ body: { msg } }) => {
            expect(msg).to.equal("Method not allowed");
          });
      });
      return Promise.all(methodPromises);
    });
  });
  describe('/api/comments/:comment_id', () => {
    it('PATCH responds with status: 200 an updated comment object', () => {
      const input = { inc_votes: 1 }
      return request
        .patch('/api/comments/1')
        .send(input)
        .expect(200)
        .then(({body: { comment }}) => {
          expect(comment.votes).to.equal(17)
        })
    })
    it('PATCH responds with status: 200 an updated comment object with decreased votes', () => {
      const input = { inc_votes: -1 }
      return request
        .patch('/api/comments/1')
        .send(input)
        .expect(200)
        .then(({body: { comment }}) => {
          expect(comment.votes).to.equal(15)
        })
    })
    it("PATCH responds with status: 200 and an unchanged object if request body is empty", () => {
      const input = {};
      return request
        .patch("/api/comments/1")
        .send(input)
        .expect(200)
        .then(({ body: { comment } }) => {
          expect(comment.votes).to.equal(16);
        });
    });
    it("PATCH ERROR responds with status: 404 when comment id does not exist", () => {
      const input = { inc_votes: 1 }
      return request
        .patch("/api/comments/5000")
        .send(input)
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).to.equal("Comment does not exist");
        });
    });
    it("PATCH ERROR responds with status: 400 when comment id is invalid", () => {
      const input = { inc_votes: 1 }
      return request
        .patch("/api/comments/cats")
        .send(input)
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).to.equal("Bad Request");
        });
    });
    it("PATCH ERROR responds with status: 400 when input value is invalid", () => {
      const input = { inc_votes: 'hello' }
      return request
        .patch("/api/comments/cats")
        .send(input)
        .expect(400)
        .then(({ body: { msg } }) => {
          expect(msg).to.equal("Bad Request");
        });
    });
    it('DELETE responds with status: 204 and no content', () => {
      return request
        .delete('/api/comments/1')
        .expect(204)
    });
    it("DELETE ERROR responds with status: 404 when comment id does not exist", () => {
      return request
        .delete("/api/comments/5000")
        .expect(404)
        .then(({ body: { msg } }) => {
          expect(msg).to.equal("Comment does not exist");
        });
    });
    it('DELETE ERROR responds with status: 400 when comment id is invalid', () => {
      return request
      .delete("/api/comments/cats")
      .expect(400)
      .then(({body: { msg }}) => {
        expect(msg).to.equal("Bad Request")
      })
    });
    it("INVALID METHOD responds with status: 405", () => {
      const invalidMethods = ["put", "post", 'get'];
      const methodPromises = invalidMethods.map(method => {
        return request[method]("/api/comments/1")
          .expect(405)
          .then(({ body: { msg } }) => {
            expect(msg).to.equal("Method not allowed");
          });
      });
      return Promise.all(methodPromises);
    });
  });
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

// POST /api/users
// GET /api/users