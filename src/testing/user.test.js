const chai = require("chai");
const chaiJsonPattern = require("chai-json-pattern").default;
const chaiHttp = require("chai-http");
const server = require("../../app");
const expect = chai.expect;
const {
  authPattern,
  contentPattern,
  commentPattern,
  arraySearchPatten,
  resultPattern,
  userProfilePattern,
  createContentPattern,
} = require("./pattern");

const commentModel = require("../models/comment.model");
const contentModel = require("../models/content.model");
const resultModel = require("../models/resultNew.model");
const userModel = require("../models/auth.model");

chai.use(chaiHttp);
chai.use(chaiJsonPattern);

let token, comment_id, content_id, dataSet, result_id;
const email = "jay@gmail.com";

const search_keyword = "moon";
const tag = ["word smart"];
const content_type = ["board"];
const create_content_type = "board";

before(function (done) {
  chai
    .request(server)
    .post("/login")
    .send({
      email: email,
      password: "1234",
    })
    .end((err, res) => {
      token = res.body.token;
      done();
    });
});

describe("User api", () => {
  it("POST /comment", (done) => {
    chai
      .request(server)
      .post("/comment")
      .set("Accept", "application/json")
      .set("Authorization", "Bearer " + token)
      .send({
        contentId: content_id,
        comment_body: "TDD",
      })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.matchPattern(commentPattern);
        comment_id = res.body._id;
        done();
      });
  });

  it("POST /user/content", (done) => {
    chai
      .request(server)
      .post("/user/content")
      .set("Accept", "application/json")
      .set("Authorization", "Bearer " + token)
      .send({
        content_body: "TDD Testing",
        content_type: create_content_type,
        title: "TDD testing",
        tag: tag,
      })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.matchPattern(createContentPattern);
        content_id = res.body._id;
        done();
      });
  });

  it("POST /user/newResult", (done) => {
    chai
      .request(server)
      .post("/user/newResult")
      .set("Accept", "application/json")
      .set("Authorization", "Bearer " + token)
      .send([
        { categoryId: 1, score: 2 },
        { categoryId: 2, score: 1 },
        { categoryId: 3, score: 1 },
        { categoryId: 4, score: 1 },
        { categoryId: 5, score: 1 },
        { categoryId: 6, score: 1 },
        { categoryId: 7, score: 1 },
        { categoryId: 8, score: 1 },
        { categoryId: 1, score: 1 },
        { categoryId: 2, score: 1 },
        { categoryId: 3, score: 1 },
        { categoryId: 4, score: 1 },
        { categoryId: 5, score: 1 },
        { categoryId: 6, score: 1 },
        { categoryId: 7, score: 1 },
        { categoryId: 8, score: 1 },
        { categoryId: 1, score: 1 },
        { categoryId: 2, score: 2 },
        { categoryId: 3, score: 3 },
        { categoryId: 4, score: 3 },
        { categoryId: 5, score: 3 },
        { categoryId: 6, score: 3 },
        { categoryId: 7, score: 3 },
        { categoryId: 8, score: 3 },
      ])
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.a("Object");
        result_id = res.body._id;
        done();
      });
  });

  // it("POST /images", (done) => {
  //   chai
  //     .request(server)
  //     .post("/images")
  //     .set("Accept", "application/json")
  //     .set("Authorization", "Bearer " + token)
  //     .attach("photo", "uploads/test.jpg")
  //     .end((err, res) => {
  //       expect(res).to.have.status(500);
  //       expect(res.body).to.be.a("String");
  //       done();
  //     });
  // });
  //testing
  it("GET /user/profile", (done) => {
    chai
      .request(server)
      .get("/user/profile")
      .set("Accept", "application/json")
      .set("Authorization", "Bearer " + token)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.matchPattern(userProfilePattern);
        done();
      });
  });
  it("GET /user/find", (done) => {
    chai
      .request(server)
      .get("/user/find")
      .set("Accept", "application/json")
      .set("Authorization", "Bearer " + token)
      .send({
        _id: "60d96eb6add0dd4f80dd523e",
      })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.matchPattern(authPattern);
        done();
      });
  });

  it("GET /user/content/get", (done) => {
    chai
      .request(server)
      .get("/user/content/get")
      .set("Accept", "application/json")
      .set("Authorization", "Bearer " + token)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.matchPattern([contentPattern]);
        done();
      });
  });

  it("GET /user/comment/get/:page-:limit/:contentId", (done) => {
    chai
      .request(server)
      .get("/user/comment/get/1-2/60ed5544b735fb713a22d5bb")
      .set("Accept", "application/json")
      .set("Authorization", "Bearer " + token)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.matchPattern([commentPattern]);
        done();
      });
  });

  describe("GET /user/search/:keyword", () => {
    it("just search", (done) => {
      chai
        .request(server)
        .post("/user/search/" + "search_keyword")
        .set("Accept", "application/json")
        .set("Authorization", "Bearer " + token)
        .send({
          tag: [],
          content_type: [],
        })
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.matchPattern(arraySearchPatten);

          dataSet = res.body;
          done();
        });
    });
    it("filter tag && content_type -> search", (done) => {
      chai
        .request(server)
        .post("/user/search/" + search_keyword)
        .set("Accept", "application/json")
        .set("Authorization", "Bearer " + token)
        .send({ tag: tag, content_type: content_type })
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.matchPattern(arraySearchPatten);
          done();
        });
    });
    it("filter tag -> search", (done) => {
      chai
        .request(server)
        .post("/user/search/" + search_keyword)
        .set("Accept", "application/json")
        .set("Authorization", "Bearer " + token)
        .send({ tag: tag, content_type: [] })
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.matchPattern(arraySearchPatten);
          done();
        });
    });
    it("filter content_type -> search", (done) => {
      chai
        .request(server)
        .post("/user/search/" + search_keyword)
        .set("Accept", "application/json")
        .set("Authorization", "Bearer " + token)
        .send({ tag: [], content_type: content_type })
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.matchPattern(arraySearchPatten);
          done();
        });
    });
  });

  describe("POST /user/content/tag", () => {
    it("filter by tag && content", (done) => {
      chai
        .request(server)
        .post("/user/content/tag")
        .set("Accept", "application/json")
        .set("Authorization", "Bearer " + token)
        .send({
          tag: tag,
          content_type: content_type,
        })
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.matchPattern([contentPattern]);
          done();
        });
    });

    it("filter by tag", (done) => {
      chai
        .request(server)
        .post("/user/content/tag")
        .set("Accept", "application/json")
        .set("Authorization", "Bearer " + token)
        .send({
          tag: tag,
          content_type: [],
        })
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.matchPattern([contentPattern]);
          done();
        });
    });

    it("filter by content", (done) => {
      chai
        .request(server)
        .post("/user/content/tag")
        .set("Accept", "application/json")
        .set("Authorization", "Bearer " + token)
        .send({
          tag: [],
          content_type: content_type,
        })
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.matchPattern([contentPattern]);
          done();
        });
    });

    it("filter by nothing", (done) => {
      chai
        .request(server)
        .post("/user/content/tag")
        .set("Accept", "application/json")
        .set("Authorization", "Bearer " + token)
        .send({
          tag: [],
          content_type: [],
        })
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.matchPattern([contentPattern]);
          done();
        });
    });

    it("search -> filter by tag && content_type", (done) => {
      chai
        .request(server)
        .post("/user/content/tag")
        .set("Accept", "application/json")
        .set("Authorization", "Bearer " + token)
        .send({
          tag: tag,
          content_type: content_type,
          dataSet: dataSet,
        })
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.matchPattern([contentPattern]);
          done();
        });
    });

    it("search -> filter by tag", (done) => {
      chai
        .request(server)
        .post("/user/content/tag")
        .set("Accept", "application/json")
        .set("Authorization", "Bearer " + token)
        .send({
          tag: tag,
          content_type: [],
          dataSet: dataSet,
        })
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.matchPattern([contentPattern]);
          done();
        });
    });

    it("search -> filter by content_type", (done) => {
      chai
        .request(server)
        .post("/user/content/tag")
        .set("Accept", "application/json")
        .set("Authorization", "Bearer " + token)
        .send({
          tag: [],
          content_type: content_type,
          dataSet: dataSet,
        })
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.matchPattern([contentPattern]);
          done();
        });
    });
  });

  it("GET /user/newResult", (done) => {
    chai
      .request(server)
      .get("/user/newResult")
      .set("Accept", "application/json")
      .set("Authorization", "Bearer " + token)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.matchPattern([resultPattern]);
        done();
      });
  });

  it("GET /user/content", (done) => {
    chai
      .request(server)
      .get("/user/content")
      .set("Accept", "application/json")
      .set("Authorization", "Bearer " + token)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.matchPattern([contentPattern]);
        done();
      });
  });

  it("GET /user/contentID/:_id", (done) => {
    chai
      .request(server)
      .get("/user/contentID/" + content_id)
      .set("Accept", "application/json")
      .set("Authorization", "Bearer " + token)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.matchPattern(contentPattern);
        done();
      });
  });

  it("PUT /user/content", (done) => {
    chai
      .request(server)
      .put("/user/content")
      .set("Accept", "application/json")
      .set("Authorization", "Bearer " + token)
      .send({
        content_id: content_id,
      })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.matchPattern(createContentPattern);
        done();
      });
  });

  it("PUT /user", (done) => {
    chai
      .request(server)
      .put("/user")
      .set("Accept", "application/json")
      .set("Authorization", "Bearer " + token)
      .send({
        username: "TDD Testing",
      })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.matchPattern(authPattern);
        done();
      });
  });

  it("DELETE /user", (done) => {
    chai
      .request(server)
      .delete("/user")
      .set("Accept", "application/json")
      .set("Authorization", "Bearer " + token)
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property("isDeleted").to.equal(true);
        done();
      });
  });

  it("DELETE /user/comment", (done) => {
    chai
      .request(server)
      .delete("/user/comment")
      .set("Accept", "application/json")
      .set("Authorization", "Bearer " + token)
      .send({
        comment_id: comment_id,
      })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property("isDeleted").to.equal(true);
        done();
      });
  });

  it("DELETE /user/content", (done) => {
    chai
      .request(server)
      .delete("/user/content")
      .set("Accept", "application/json")
      .set("Authorization", "Bearer " + token)
      .send({
        content_id: content_id,
      })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.property("isDeleted").to.equal(true);
        done();
      });
  });

  describe("clear dummy database", () => {
    it("clear dummy comment", async () => {
      return await commentModel.deleteOne(
        { _id: comment_id },
        async (unit, err, data) => {
          console.log("pass");
        }
      );
    });

    it("clear dummy content", async () => {
      return await contentModel.deleteOne(
        { _id: content_id },
        async (unit, err, data) => {
          console.log("pass");
        }
      );
    });

    it("clear dummy result", async () => {
      const results_array = await resultModel.findOne({ _id: result_id });
      results_array.results.pop();
      return await resultModel.updateOne(
        { _id: result_id },
        { results: results_array.results },
        async (unit, err, data) => {
          console.log("pass");
        }
      );
    });

    it("change username back", async () => {
      return await userModel.updateOne(
        { email: email },
        { username: "superJay" },
        async (unit, err, data) => {
          console.log("pass");
        }
      );
    });

    it("change deleted user back", async () => {
      return await userModel.updateOne(
        { email: email },
        { $unset: { delete_at: 1 }, isDeleted: false },
        { new: true },
        async (unit, err, data) => {
          console.log("pass");
        }
      );
    });
  });
});
