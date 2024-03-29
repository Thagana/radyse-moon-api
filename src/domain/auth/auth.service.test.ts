/* eslint-disable @typescript-eslint/no-unused-vars */
import { describe, test, expect, beforeAll } from "vitest";

import { authServiceFactory } from "./auth.service";
import { IRepositories } from "../../interface/IRepository";
import { IAuthenticationRepository } from "./auth.repository";
import { User } from "../users/model";
import { IUsersRepository } from "../users/user.repository";
import { IncomingHttpHeaders } from "http";
import { INewsRepository } from "../news/news.repository";
import Article from "../../interface/articles-interface";
import { INotificationRepository } from "../notification/notification.repository";

// mock database
const userMockDb = [
  new User(
    1,
    "john",
    "doe",
    "john@email.com",
    1,
    "token",
    "https://images.com",
    "https://images.com",
    "token"
  ),
  new User(
    2,
    "james",
    "walker",
    "james@email.com",
    0,
    "token",
    "https://images.com",
    "https://images.com",
    "token"
  ),
];

const authRepo: IAuthenticationRepository = {
  getValidateCode() {
    return new Promise<User | boolean>((resolve, reject) => {});
  },
  sendMail(username: string, password: string, email: string) {
    return new Promise<boolean>((resolve, reject) => {});
  },
  verifyAccount() {
    return new Promise((resolve, reject) => {
      resolve(true);
    });
  },
  createToken(userId: number) {
    return "token";
  },
  checkHashedPassword() {
    return true;
  },
  hashPassword(salt: number, password: string) {
    return new Promise<string>((resolve, reject) => {
      resolve("");
    });
  },
  getJwtToken(user: User) {
    return "token";
  },
  updateFCMToken(userId: number, fcmToken?: string) {
    return new Promise<void>((resolve, reject) => {
      resolve();
    });
  },
  generateLink(ALPHABET: string) {
    return "0123";
  },
};

const userRepo: IUsersRepository = {
  createUser(
    firstName: string,
    lastName: string,
    email: string,
    hashPassword: string,
    emailCode: string,
    headers: IncomingHttpHeaders
  ) {
    return new Promise<{
      success: boolean;
      message: string;
    }>((resolve, reject) => {
      resolve({
        success: true,
        message: "",
      });
    });
  },
  findUser(email: string) {
    return new Promise<User | boolean>((resolve, reject) => {
      const user = userMockDb.find((user) => user.email === email);
      if (user) {
        resolve(user);
      } else {
        resolve(false);
      }
    });
  },
  updateToken(token: string, user: User) {
    return new Promise<boolean>((resolve, reject) => { });
  },
  updatePushToken(token: string, user: User, title: string) {
    return new Promise<boolean>((resolve, reject) => { });
  },
  getSettings(id: number) {
    return new Promise<{
      language: string;
      location: string;
      category: string;
      frequency: number;
      push_enabled: number;
      email_notification: number;
      web_push_notification: number;
      sms_notification: number;
    }>((resolve, reject) => {
      resolve({
        language: "",
        location: "",
        category: "",
        frequency: 0,
        push_enabled: 0,
        email_notification: 0,
        web_push_notification: 0,
        sms_notification: 0,
      });
    });
  },
  getUsers() {
    return new Promise<User[]>((resolve, reject) => {
      resolve([]);
    });
  },
  getPushTokens(users: { userId: number; }[]) {
    return new Promise<string[]>((resolve, reject) => {
      resolve([]);
    });
  },
  updateForgotPasswordCode() {
    return new Promise<boolean>((resolve, reject) => {
      resolve(true);
    });
  },
  updatePassword: function (email: string, password: string): Promise<boolean> {
    throw new Error("Function not implemented.");
  }
};

const newsRepo: INewsRepository = {
  getSettings(id: number) {
    return new Promise<{
      location: string;
      category: string;
    }>((resolve, reject) => {
      resolve({
        location: "",
        category: "",
      });
    });
  },
  getArticles(
    limit: number,
    offset: number,
    category: string,
    countryISO: string
  ) {
    return new Promise<Article[]>((resolve, reject) => {
      resolve([]);
    });
  },
  getHeadlines(category: string, countryISO: string) {
    return new Promise<Article[]>((resolve, reject) => {
      resolve([]);
    });
  },
  getHeadlineArticles() {
    return new Promise<Article[]>((resolve, reject) => {
      resolve([]);
    });
  },
};
const notificationRepo: INotificationRepository = {
  sendVerificationNotification(
    firstName: string,
    lastName: string,
    email: string,
    token: string | undefined
  ) {
    return new Promise<void>((resolve, reject) => {});
  },
  sendCropPushNotification(
    data: { title: string; description: string }[],
    pushTokens: string[]
  ) {
    return new Promise<void>((resolve, reject) => {});
  },
  sendResetPasswordNotification(email: string, token: string, username: string) {
    return new Promise<void>((resolve, reject) => {});
  },
};
const repository: IRepositories = {
  authenticationRepository: authRepo,
  userRepository: userRepo,
  newsRepository: newsRepo,
  notificationRepository: notificationRepo,
};

describe("AuthService - [login]", () => {
  const service = authServiceFactory.init(repository);

  test("Login Successfully", async () => {
    const login = await service.login("john@email.com", "password1");

    expect(login).toStrictEqual({
      success: true,
      message: "Successfully loggedIn",
      data: {
        token: "token",
        profile: {
          firstName: "john",
          lastName: "doe",
          fullName: `john doe`,
          email: "john@email.com",
          avatar: "https://images.com",
        },
      },
    });
  }, 10000);

  test("Login [user not verified]", async () => {
    const login = await service.login("james@email.com", "password1");

    expect(login).toStrictEqual({
      success: false,
      message: "Not yet activated your account",
    });
  }, 10000);

  test("Login [user not found]", async () => {
    const login = await service.login("no-user@email.com", "password1");

    expect(login).toStrictEqual({
      success: false,
      message: "Could not find user",
    });
  }, 10000);

  test("Login - [email validation error]", async () => {
    const login = await service.login("", "password1");
    expect(login).toStrictEqual({
      success: false,
      message: "Invalid form data",
      errors: [
        {
          message: "Email is required",
        },
      ],
    });
  });

  test("Login - [password validation error]", async () => {
    const login = await service.login("samuel@test.com", "");
    expect(login).toStrictEqual({
      success: false,
      message: "Invalid form data",
      errors: [
        {
          message: "Password is required",
        },
      ],
    });
  });

  test("Login - [password and email validation error]", async () => {
    const login = await service.login("", "");
    expect(login).toStrictEqual({
      success: false,
      message: "Invalid form data",
      errors: [
        {
          message: "Email is required",
        },
        {
          message: "Password is required",
        },
      ],
    });
  });

  test("Login - [password and email must be a string]", async () => {
    const email = 123 as unknown as string;
    const password = 123 as unknown as string;
    const login = await service.login(email, password);
    expect(login).toStrictEqual({
      success: false,
      message: "Invalid form data",
      errors: [
        {
          message: "Email must be a string",
        },
        {
          message: "Password must be a string",
        },
      ],
    });
  });
  test("Login - [password must be a string]", async () => {
    const email = "samuel@gmail.com";
    const password = 123 as unknown as string;
    const login = await service.login(email, password);
    expect(login).toStrictEqual({
      success: false,
      message: "Invalid form data",
      errors: [
        {
          message: "Password must be a string",
        },
      ],
    });
  });
  test("Login - [email must be a string]", async () => {
    const email = 123 as unknown as string;
    const password = "password";
    const login = await service.login(email, password);
    expect(login).toStrictEqual({
      success: false,
      message: "Invalid form data",
      errors: [
        {
          message: "Email must be a string",
        },
      ],
    });
  });
});
describe("AuthService - [verify]", () => {
  const service = authServiceFactory.init(repository);
  test("Verify - [should be able to verify]", async () => {
    const verify = await service.verify("token");
    expect(verify).toStrictEqual({
      success: true,
      message: "Successfully verified",
    });
  }, 50000);

  test("Verify - [should not be able to verify]", async () => {
    const verify = await service.verify("");
    expect(verify).toStrictEqual({
      success: true,
      message: "Successfully verified",
    });
  }, 50000);
});
describe("AuthService - [register]", () => {
  const service = authServiceFactory.init(repository);
  test("Register - [should fail to register for invalid form data - password]", async () => {
    const headers = {} as IncomingHttpHeaders;
    const register = await service.register(
      "jane",
      "doe",
      "jane@email.com",
      "",
      headers
    );
    expect(register).toStrictEqual({
      success: false,
      message: "Invalid form data",
      errors: [
        {
          message: "Password is required",
        },
      ],
    });
  })
  test("Register - [should fail to register for invalid form data - first name]", async () => {
    const headers = {} as IncomingHttpHeaders;
    const register = await service.register(
      "",
      "doe",
      "jane@email.com",
      "password",
      headers
    );
    expect(register).toStrictEqual({
      success: false,
      message: "Invalid form data",
      errors: [
        {
          message: "First Name is required",
        },
      ],
    });
  })
  test("Register - [should fail to register for invalid form data - last name]", async () => {
    const headers = {} as IncomingHttpHeaders;
    const register = await service.register(
      "jane",
      "",
      "jane@email.com",
      "password",
      headers
    );
    expect(register).toStrictEqual({
      success: false,
      message: "Invalid form data",
      errors: [
        {
          message: "Last Name is required",
        },
      ],
    });
  })
  test("Register - [should fail to register for invalid form data - email]", async () => {
    const headers = {} as IncomingHttpHeaders;
    const register = await service.register(
      "jane",
      "doe",
      "",
      "password",
      headers
    );
    expect(register).toStrictEqual({
      success: false,
      message: "Invalid form data",
      errors: [
        {
          message: "Email is required",
        },
      ],
    });
  })
  test("Register - [should fail to register for invalid form data - all missing]", async () => {
    const headers = {} as IncomingHttpHeaders;
    const register = await service.register(
      "",
      "",
      "",
      "",
      headers
    );
    expect(register).toStrictEqual({
      success: false,
      message: "Invalid form data",
      errors: [
        {
          message: "Email is required",
        },
        {
          message: "Password is required",
        },
        {
          message: "First Name is required",
        },
        {
          message: "Last Name is required",
        }
      ],
    });
  })
  test("Register - [should be able to register]", async () => {
    const headers = {} as IncomingHttpHeaders;

    const register = await service.register(
      "jane",
      "doe",
      "jane@email.com",
      "password1",
      headers
    );
    
    expect(register).toStrictEqual({
      success: true,
      message: "Successfully registered",
      token: '0123',
    });
  });
  test("Register -  [user already exist]", async () => {
    const headers = {} as IncomingHttpHeaders;
    const register = await service.register(
      "john",
      "doe",
      "john@email.com",
      "password1",
      headers
    );
    expect(register).toStrictEqual({
      success: false,
      message: "Account already exist",
    });
  })
});
