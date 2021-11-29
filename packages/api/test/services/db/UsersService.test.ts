import InvariantError from "../../../src/exceptions/InvariantError";
import UsersService from "../../../src/services/db/UsersService";
import sequelize from "../../../src/sequelize";
import { UserCreationRequest } from "../../../src/models/requests/UserCreationRequest";
import NotFoundError from "../../../src/exceptions/NotFoundError";
import AuthenticationError from "../../../src/exceptions/AuthenticationError";

let usersService: UsersService;

describe("UsersService Test", () => {
  beforeAll(async () => {
    await sequelize.sync({ force: true });
    usersService = new UsersService(sequelize);
  })

  afterEach(async () => {
    await sequelize.truncate();
  })

  test("addUser test success", async () => {
    const userData: UserCreationRequest = {
      username: "bervianto",
      password: "test123",
      fullname: "Berv"
    }
    const createdUserId = await usersService.addUser(userData);
    expect(createdUserId).not.toBeNull();
  })

  test("addUser test failed", async () => {
    const userData: UserCreationRequest = {
      username: "bervianto",
      password: "test123",
      fullname: "Berv"
    }
    await usersService.addUser(userData);
    // try to re-create, should be throw error
    await expect(usersService.addUser(userData)).rejects.toThrow(InvariantError);
  })

  test("verifyNewUser test success", async () => {
    await expect(usersService.verifyNewUsername("bervianto")).resolves.not.toThrow();
  })

  test("verifyNewUser test throw exception", async () => {
    const userData: UserCreationRequest = {
      username: "bervianto",
      password: "test123",
      fullname: "Berv"
    }
    await usersService.addUser(userData);
    await expect(usersService.verifyNewUsername("bervianto")).rejects.toThrow(InvariantError);
  })

  test("getUserById test success", async () => {
    const userData: UserCreationRequest = {
      username: "bervianto",
      password: "test123",
      fullname: "Berv"
    }
    const userId = await usersService.addUser(userData);
    await expect(usersService.getUserById(userId)).resolves.not.toThrow();
  })

  test("getUserById test throw exception", async () => {
    await expect(usersService.getUserById("bervianto")).rejects.toThrow(NotFoundError);
  })

  test("verifyUserCredential test success", async () => {
    const userData: UserCreationRequest = {
      username: "bervianto",
      password: "test123",
      fullname: "Berv"
    }
    await usersService.addUser(userData);
    await expect(usersService.verifyUserCredential(userData.username, userData.password)).resolves.not.toThrow();
  })

  test("verifyUserCredential test throw exception not found the user", async () => {
    await expect(usersService.verifyUserCredential("bervianto", "yesyesyes")).rejects.toThrow(new AuthenticationError('Kredensial yang Anda berikan salah'));
  })

  test("verifyUserCredential test throw exception wrong password", async () => {
    const userData: UserCreationRequest = {
      username: "bervianto",
      password: "test123",
      fullname: "Berv"
    }
    await usersService.addUser(userData);
    await expect(usersService.verifyUserCredential(userData.username, "yesyesyes")).rejects.toThrow(new AuthenticationError('Kredensial yang Anda berikan salah'));
  })

})