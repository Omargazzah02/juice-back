const request = require("supertest");
const jwt = require("jsonwebtoken");
const app = require("../app");

describe("Route protégée avec token dans cookie", () => {
  let token;

  beforeAll(() => {
    token = jwt.sign({ userId: 123 }, process.env.JWT_SECRET, { expiresIn: "1h" });
  });

  test("sans cookie token => 401", async () => {
    const res = await request(app).get("/products");
    expect(res.status).toBe(401);
    expect(res.body.message).toBe("Token manquant");
  });

  test("avec cookie token invalide => 401", async () => {
    const res = await request(app)
      .get("/products")
      .set("Cookie", ["token=fauxToken"]);
    expect(res.status).toBe(403);
    expect(res.body.message).toBe("Token invalide.");
  });

  test("avec cookie token valide => 200", async () => {
    const res = await request(app)
      .get("/products")
      .set("Cookie", [`token=${token}`]);
    expect(res.status).toBe(200);
  });
});
