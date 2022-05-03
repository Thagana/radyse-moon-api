import axios from "axios";
import IPlan from "../../interface/plan-interface";
import { Transaction } from '../../interface/Transaction-interface';
import { Subscription } from '../../interface/Subscription-interface';

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
  createTransaction(email: string, amount: number) {
    return new Promise<Transactions>((resolve, reject) => {
      axios.post(
        `${this.PAY_STACK_URL}/transaction/initialize`,
        {
          email,
          amount,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${this.token}`,
          },
        }
      ).then((response) => {
        const { data } = response.data
        resolve(data);
      }).catch(error => reject(error));
    });
  }

  verifyTransaction(reference: string) {
    return new Promise<Transaction>((resolve, reject) => {
      axios.post(`${this.PAY_STACK_URL}/transaction/verify/${reference}`,{}, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.token}`,
        }
      }).then((response) => {
        const res = response.data;
        resolve(res);
      }).catch(error => reject(error))
    })
  }

  subscribeUser(customer: string, plan: string) {
    return new Promise<Subscription>((resolve, reject) => {
      if (!customer || !plan) {
        reject('Customer and Plan are need')
      }
      axios.post(`${this.PAY_STACK_URL}/subscription`, {
        customer,
        plan
      }).then((response) => {
        const res = response.data;
        resolve(res);
      }).catch(error => reject(error))
    })
  }

}

export default PayStack;
