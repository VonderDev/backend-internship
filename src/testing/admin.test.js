const chai = require("chai");
const chaiHttp = require("chai-http");
const chaiJsonPattern = require("chai-json-pattern").default;
const questionModel = require("../models/questions.model");
const server = require("../../app");
const expect = chai.expect;
const { authPattern, questionPattern, summarizePattern } = require("./pattern");

chai.use(chaiHttp);
chai.use(chaiJsonPattern);
let token;
before((done) => {
  chai
    .request(server)
    .post("/login")
    .send({
      email: "admin@gmail.com",
      password: "1234",
    })
    .end((err, res) => {
      token = res.body.token;
      done();
    });
});
describe("Admin API", () => {
  describe("GET /results", () => {
    it("should return all results", (done) => {
      chai
        .request(server)
        .get("/results")
        .set("Accept", "application/json")
        .set("Authorization", "Bearer " + token)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          done();
        });
    });
  });
  describe("GET /user", () => {
    it("should return all users", (done) => {
      chai
        .request(server)
        .get("/user")
        .set("Accept", "application/json")
        .set("Authorization", "Bearer " + token)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          for (let i = 0; i < res.body.length; i++) {
            expect(res.body[i]).to.matchPattern(authPattern);
          }
          done();
        });
    });
  });
  describe("GET /admin/find", () => {
    it("should return results", (done) => {
      chai
        .request(server)
        .get("/admin/find")
        .set("Accept", "application/json")
        .set("Authorization", "Bearer " + token)
        .send({ _id: "60d9a47d394de836f86bccce" })
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.matchPattern(authPattern);
          done();
        });
    });
  });
  describe("GET /admin", () => {
    it("should return all results", (done) => {
      chai
        .request(server)
        .get("/admin/find")
        .set("Accept", "application/json")
        .set("Authorization", "Bearer " + token)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          for (let i = 0; i < res.body.length; i++) {
            expect(res.body[i]).to.matchPattern(authPattern);
          }
          done();
        });
    });
  });
  // test get /questions
  describe("GET /questions", () => {
    it("should return all questions", (done) => {
      chai
        .request(server)
        .get("/questions")
        .set("Accept", "application/json")
        .set("Authorization", "Bearer " + token)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          for (let i = 0; i < res.body.length; i++) {
            expect(res.body[i]).to.matchPattern(questionPattern);
          }
          done();
        });
    });
  });
  describe("GET /questions/cat", () => {
    it("should return all questions", (done) => {
      chai
        .request(server)
        .get("/questions/cat")
        .set("Accept", "application/json")
        .set("Authorization", "Bearer " + token)
        .send({ category: "1" })
        .end((err, res) => {
          expect(res.status).to.equal(200);
          for (let i = 0; i < res.body.length; i++) {
            expect(res.body[i]).to.matchPattern(questionPattern);
          }
          done();
        });
    });
  });
  describe("GET /summarize", () => {
    it("should return all questions", (done) => {
      chai
        .request(server)
        .get("/summarize")
        .set("Accept", "application/json")
        .set("Authorization", "Bearer " + token)
        .send({ category: "1" })
        .end((err, res) => {
          expect(res.status).to.equal(200);
          for (let i = 0; i < res.body.length; i++) {
            expect(res.body[i]).to.matchPattern(summarizePattern);
          }
          done();
        });
    });
  });
  // describe("POST /questions", () => {
  //   it("post questions", (done) => {
  //     chai
  //       .request(server)
  //       .post("/questions")
  //       .set("Accept", "application/json")
  //       .set("Authorization", "Bearer " + token)
  //       .send({
  //         questionIndex: "25",
  //         category_id: "3",
  //         questionBody: "ฉันชอบเรียนรู้",
  //       })
  //       .end((err, res) => {
  //         expect(res.status).to.equal(200);
  //         expect(res.body).to.matchPattern(questionPattern);
  //         done();
  //       });
  //   });
  // });
});
