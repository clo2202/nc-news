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
          expect(topics.length).to.equal(3);
        });
    });
  });
});

describe("generic error tests", () => {
  it("GET on an invalid path return status:404", () => {
    return request.get("/api/cats").expect(404).then(body => {
      expect(body.text).to.equal('Route not found')
    });
  });
});
