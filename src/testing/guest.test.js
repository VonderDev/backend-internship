const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../../app");
const expect = chai.expect;

chai.use(chaiHttp);
describe("guest API", () => {
  it("POST /guest/result", (done) => {
    chai
      .request(server)
      .post("/guest/result")
      .send({
        question_data: [
          { categoryId: 1, score: 3 },
          { categoryId: 2, score: 3 },
          { categoryId: 3, score: 3 },
          { categoryId: 4, score: 3 },
          { categoryId: 5, score: 3 },
          { categoryId: 6, score: 3 },
          { categoryId: 7, score: 3 },
          { categoryId: 8, score: 3 },
          { categoryId: 1, score: 3 },
          { categoryId: 2, score: 3 },
          { categoryId: 3, score: 3 },
          { categoryId: 4, score: 3 },
          { categoryId: 5, score: 3 },
          { categoryId: 6, score: 3 },
          { categoryId: 7, score: 3 },
          { categoryId: 8, score: 3 },
          { categoryId: 1, score: 3 },
          { categoryId: 2, score: 3 },
          { categoryId: 3, score: 3 },
          { categoryId: 6, score: 3 },
          { categoryId: 7, score: 3 },
          { categoryId: 8, score: 3 },
          { categoryId: 1, score: 3 },
          { categoryId: 2, score: 3 },
        ],
      })
      .end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.body).to.be.a("Array");
        done();
      });
  });
});
