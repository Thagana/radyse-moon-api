/* eslint-disable @typescript-eslint/no-unused-vars */
import { describe, test, expect } from "vitest";

import { authServiceFactory } from "./auth.service";
import { IRepositories } from "../../interface/IRepository";
import { IAuthenticationRepository } from "./auth.repository";
import { User } from "../users/model";
import { IUsersRepository } from "../users/user.repository";
import { IncomingHttpHeaders } from "http";
import { INewsRepository } from "../news/news.repository";
import Article from "../../interface/articles-interface";
import { INotificationRepository } from "../notification/notification.repository";

describe("AuthService - [login]", () => {
  const authRepo: IAuthenticationRepository = {
    getValidateCode() {
      return new Promise<User | boolean>((resolve, reject) => {});
    },
    sendMail(username: string, password: string, email: string) {
      return new Promise<boolean>((resolve, reject) => {});
    },
    verifyAccount() {
      return new Promise<boolean>((resolve, reject) => {});
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
    generateLink(email: string) {
      return "";
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
        const userMockDb = [
          new User(
            1,
            "john",
            "doe",
            "john@email.com",
            1,
            "token",
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
            "token"
          ),
        ]
        const user = userMockDb.find((user) => user.email === email);
        if (user) {
          resolve(user);
        } else {
          resolve(false);
        }
      });
    },
    updateToken(token: string, user: User) {
      return new Promise<boolean>((resolve, reject) => {});
    },
    updatePushToken(token: string, user: User, title: string) {
      return new Promise<boolean>((resolve, reject) => {});
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
    getPushTokens(users: { userId: number }[]) {
      return new Promise<string[]>((resolve, reject) => {
        resolve([]);
      });
    },
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
  };
  const repository: IRepositories = {
    authenticationRepository: authRepo,
    userRepository: userRepo,
    newsRepository: newsRepo,
    notificationRepository: notificationRepo,
  };

  const service = authServiceFactory.init(repository);

  test("Login Successfully", async () => {
    const login = await service.login("john@email.com", "password1");
    
    expect(login).toStrictEqual({
      success: true,
      message: "Successfully loggedIn",
      data: {
        token: 'token',
        profile: {
          firstName: 'john',
          lastName: 'doe',
          fullName: `john doe`,
          email: 'john@email.com',
          avatar: 'https://images.com',
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
  })
  test("Login - [password must be a string]", async () => {
    const email = 'samuel@gmail.com';
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
  })
  test("Login - [email must be a string]", async () => {
    const email = 123 as unknown as string;
    const password = 'password'
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
  })
});
