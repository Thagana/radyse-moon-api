import axios, { Axios } from "axios";
import IPlan from "../../interface/plan-interface";
import { Transaction } from "../../interface/Transaction-interface";
import {
  Subscription,
  Subscriptions,
} from "../../interface/Subscription-interface";

interface Transactions {
  authorization_url: string;
  access_code: string;
  reference: string;
}

class PayStack {
  token: string;
  PAY_STACK_URL = "https://api.paystack.co";
  constructor(token: string) {
    this.token = token;
  }
  createPlan(amount: number, name: string, interval: string) {
    return new Promise<IPlan>((resolve, reject) => {
      axios
        .post(
          `${this.PAY_STACK_URL}/plan`,
          {
            name,
            amount,
            interval,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${this.token}`,
            },
          }
        )
        .then((response) => {
          const { data } = response;
          resolve(data.data);
        })
        .catch((error) => reject(error));
    });
  }
  createTransaction(email: string, amount: number, callbackUrl: string) {
    return new Promise<Transactions>((resolve, reject) => {
      axios
        .post(
          `${this.PAY_STACK_URL}/transaction/initialize`,
          {
            email,
            amount,
            callback_url: callbackUrl,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${this.token}`,
            },
          }
        )
        .then((response) => {
          const { data } = response.data;
          resolve(data);
        })
        .catch((error) => reject(error));
    });
  }

  verifyTransaction(reference: string) {
    return new Promise<Transaction>((resolve, reject) => {
      axios
        .get(`${this.PAY_STACK_URL}/transaction/verify/${reference}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${this.token}`,
          },
        })
        .then((response) => {
          const res = response.data;
          resolve(res);
        })
        .catch((error) => reject(error));
    });
  }

  subscribeUser(customer: string, plan: string) {
    return new Promise<Subscription>((resolve, reject) => {
      if (!customer || !plan) {
        reject("Customer and Plan are required");
      }
      axios
        .post(
          `${this.PAY_STACK_URL}/subscription`,
          {
            customer,
            plan,
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${this.token}`,
            },
          }
        )
        .then((response) => {
          const res = response.data;
          resolve(res);
        })
        .catch((error) => reject(error));
    });
  }

  getSubscribers() {
    return new Promise<Subscriptions>((resolve, reject) => {
      axios
        .get(`${this.PAY_STACK_URL}/subscription`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${this.token}`,
          },
        })
        .then((response) => {
          const res = response.data;
          resolve(res);
        })
        .catch((error) => reject(error));
    });
  }

  getSubscriber() {}

  updateSubscription(code: string) {
    return new Promise<{ status: boolean; message: string }>(
      (resolve, reject) => {
        axios
          .post(
            `${this.PAY_STACK_URL}/subscription/${code}/manage/email`,
            {},
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${this.token}`,
              },
            }
          )
          .then((response) => {
            const data = response.data;
            resolve(data);
          })
          .catch((error) => reject(error));
      }
    );
  }
  /**
   *
   * @param code
   * @param token
   * @returns
   */
  disableSubscription(code: string, email_token: string) {
    return new Promise<{ status: boolean; message: string }>(
      (resolve, reject) => {
        axios
          .post(
            `${this.PAY_STACK_URL}/subscription/disable`,
            {
              code,
              token: email_token,
            },
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${this.token}`,
              },
            }
          )
          .then((response) => {
            const data = response.data;
            resolve(data);
          })
          .catch((error) => reject(error));
      }
    );
  }

  enableSubscription(code: string, email_token: string) {
    return new Promise<{ status: boolean; message: string }>(
      (resolve, reject) => {
        axios
          .post(
            `${this.PAY_STACK_URL}/subscription/enable`,
            {
              code,
              token: email_token,
            },
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${this.token}`,
              },
            }
          )
          .then((response) => {
            const data = response.data;
            resolve(data);
          })
          .catch((error) => reject(error));
      }
    );
  }

  getSubscriptions(code: string) {
    return new Promise<Subscriptions>((resolve, reject) => {
      axios.get(`${this.PAY_STACK_URL}/subscription/${code}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.token}`,
        },
      })
      .then((response) => {
        const data = response.data;
        resolve(data);
      })
      .catch((error) => reject(error));
    })
  }
}

export default PayStack;
