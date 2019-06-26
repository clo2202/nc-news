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
    it('INVALID METHOD responds with status: 405', () => {
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
  describe('/users/:username', () => {
    it('GET responds with status:200 and a single user obj with given username', () => {
      return request.get('/api/users/rogersop').expect(200).then(({body}) => {
        expect(body).to.contain.keys('username', 'avatar_url', 'name')
        expect(body.name).to.equal('paul')
      })
    })
    it('GET ERROR responds with status: 404 when username is non-existent', () => {
      return request.get('/api/users/notAUsername').expect(404).then(({body}) => {
        expect(body.msg).to.equal('Username does not exist')
      })
    });
    it('INVALID METHOD responds with status: 405', () => {
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
  // describe('/users/:username')
      // status: 400 non existent username
      // set up so fetchAllUsers model can be used with and without param, don't need two models
});

describe("generic error tests", () => {
  it("GET on an invalid path return status:404", () => {
    return request.get("/api/cats").expect(404).then(body => {
      expect(body.text).to.equal('Route not found')
    });
  });
});
