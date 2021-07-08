const { response } = require("express");
const request = require("supertest");
const app = require("./app");

const token =
  "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MGRjMjMxZjZjN2U2ZTE4MDY2ODVmZGYiLCJlbWFpbCI6IkpvSm9BZG1pbkBob3RtYWkuY29tIiwicm9sZSI6ImFkbWluIiwiaWF0IjoxNjI1MDM5NjQ3LCJleHAiOjE2MjUxMjYwNDd9.elE4gDD15-wgMIjVTNiGK5etRViSTCKuZWv_-A5-l_w";

describe("user API", () => {
  it("GET /user --> get all users", async () => {
    return await request(app)
      .get("/user")
      .set("Authorization", token)
      .expect("Content-Type", /json/)
      .then((response) => {
        expect(response.body).toEqual(
          expect.arrayContaining([
            expect.objectContaining({
              _id: expect.any(String),
              email: expect.any(String),
              firstName: expect.any(String),
              lastName: expect.any(String),
              password: expect.any(String),
              isDeleted: expect.any(Boolean),
              role: expect.any(String),
            }),
          ])
        );
      });
  });

  it("GET /user/find --> get user by id", async () => {
    return await request(app)
      .get("/user/find")
      .set("Authorization", token)
      .expect("Content-Type", /json/)
      .then((response) => {
        expect(response.body).toEqual(
          expect.objectContaining({
            _id: expect.any(String),
            email: expect.any(String),
            firstName: expect.any(String),
            lastName: expect.any(String),
            password: expect.any(String),
            isDeleted: expect.any(Boolean),
            role: expect.any(String),
          })
        );
      });
  });

  it("GET /user/find --> 404 if not found", async () => {
    return await request(app)
      .get("/user/find")
      .set("Authorization", token)
      .send({ _id: "99999" })
      .expect(404);
  });

  it("POST /user -->  signup", async () => {
    return await request(app)
      .post("/signup")
      .send({
        role: "user",
        username: "Jo",
        firstName: "JoFirstName",
        lastName: "JoLastName",
        email: "Jo@hotmail.com",
        password: "1234",
      })
      .expect("Content-Type", /json/)
      .then((response) => {
        expect(response.body).toEqual(
          expect.objectContaining({
            resuit: expect.objectContaining({
              _id: expect.any(String),
              email: expect.any(String),
              firstName: expect.any(String),
              lastName: expect.any(String),
              password: expect.any(String),
              isDeleted: expect.any(Boolean),
              role: expect.any(String),
            }),
          })
        );
      });
  });
});
