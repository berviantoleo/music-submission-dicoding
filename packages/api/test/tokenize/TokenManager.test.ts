import InvariantError from "../../src/exceptions/InvariantError";
import tokenManager from "../../src/tokenize/TokenManager";

describe("TokenManager Test", () => {
  test("generateAccessToken test", () => {
    const token = tokenManager.generateAccessToken({id: "random"});
    expect(token).toBeTruthy();
  })

  test("generateRefreshToken test", () => {
    const token = tokenManager.generateRefreshToken({ id: "random" });
    expect(token).toBeTruthy();
  })

  test("verifyRefreshToken success", () => {
    const token = tokenManager.generateRefreshToken({ id: "random" });
    const verified = tokenManager.verifyRefreshToken(token);
    expect(verified).toBeTruthy();
  })

  test("verifyRefreshToken failed", () => {
    expect(() => tokenManager.verifyRefreshToken("randomly")).toThrow(new InvariantError('Refresh token tidak valid'));
  })
})