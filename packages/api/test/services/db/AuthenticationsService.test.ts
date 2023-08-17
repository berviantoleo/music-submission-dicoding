import InvariantError from "../../../src/exceptions/InvariantError";
import AuthenticationsService from "../../../src/services/db/AuthenticationsService";
import sequelize from "../../../src/sequelize";

jest.mock('../../../src/services/redis/CacheService');

let authenticationService: AuthenticationsService;

describe("AuthenticationsService Test", () => {
  beforeAll(async () => {
    await sequelize.sync();
    authenticationService = new AuthenticationsService(sequelize);
  });

  afterEach(async () => {
    await sequelize.truncate();
  })

  test("addRefreshToken test success", async () => {
    const refreshToken = "yes-yes-100";
    await expect(authenticationService.addRefreshToken(refreshToken)).resolves.not.toThrow();
  })

  test("verifyRefreshToken test success", async () => {
    const refreshToken = "yes-yes-111";
    await authenticationService.addRefreshToken(refreshToken);
    await expect(authenticationService.verifyRefreshToken(refreshToken)).resolves.not.toThrow();
  })

  test("verifyRefreshToken test failed", async () => {
    const refreshToken = "yes-yes-111";
    await expect(authenticationService.verifyRefreshToken(refreshToken)).rejects.toThrow(InvariantError);
  })

  test("deleteRefreshToken test success", async () => {
    const refreshToken = "yes-yes-123";
    await authenticationService.addRefreshToken(refreshToken);
    await expect(authenticationService.deleteRefreshToken(refreshToken)).resolves.not.toThrow();
  })

  test("deleteRefreshToken test failed", async () => {
    const refreshToken = "yes-yes-123";
    await expect(authenticationService.deleteRefreshToken(refreshToken)).rejects.toThrow(InvariantError);
  })

})