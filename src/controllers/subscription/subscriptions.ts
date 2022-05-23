import { Request, Response } from "express";
import PayStack from "../../helpers/PayStack/PayStack";
import Subscription from "../../models/Mongodb/Subscription";
import logger from "../../utils/logger";
import { configs } from "../../configs/app.configs";
import Plan from "../../models/Mongodb/Plan";
import getPlan from "../../helpers/getplan";
import UserModel from "../../models/Mongodb/Users";

const getSubscriptions = async (request: Request, response: Response) => {
  try {
    // @ts-ignore
    const id = request.user.id;

    if (!id) {
      return response.status(401).json({
        success: false,
        message: "Access denied",
      });
    }

    const findUser = await UserModel.findOne({
      _id: id,
    });

    if (!findUser) {
      return response.status(400).json({
        success: false,
        message: "Could not find user",
      });
    }

    const PayStackInst = new PayStack(configs.PAY_STACK_SECRET);

    const subs = await PayStackInst.getSubscribers();

    return response.status(200).json({
      success: true,
      data: subs,
    });
  } catch (error) {
    logger.error(error);
    return response.status(400).json({
      success: false,
      message: "Something went wrong, please try again",
    });
  }
};

const getSubscription = async (request: Request, response: Response) => {
  try {
    // @ts-ignore
    const id = request.user.id;

    if (!id) {
      return response.status(401).json({
        success: false,
        message: "Access denied",
      });
    }
    const subs = await Subscription.findOne({
      user_id: id,
    });

    if (!subs) {
      return response.status(200).json({
        message: 'Could not find subscription',
        success: false
      })
    }

    const plan = await Plan.findOne({
      id: subs.plan
    })

    const planFilter = {
      name: plan?.name
    }
    return response.status(200).json({
      success: true,
      message: 'Successful',
      data: {
        next_payment_date: subs.next_payment_date,
        amount: subs.amount,
        start: subs.start,
        name: plan?.name,
        status: subs.status,
        domain: subs.domain,
        createdAt: subs.createdAt,
      }
    })
    
  } catch (error) {
    logger.error(error);
    return response.status(400).json({
      success: false,
      message: "Something went wrong, please try again",
    });
  }
};

const createPlan = async (request: Request, response: Response) => {
  try {
    const { name, amount, interval } = request.body;

    if (!name || !amount || !interval) {
      return response.status(400).json({
        success: false,
        message: "Name, Amount and Interval are required",
      });
    }

    const PayStackInst = new PayStack(configs.PAY_STACK_SECRET);

    const createPlan = await PayStackInst.createPlan(amount, name, interval);

    await Plan.create(createPlan);

    return response.status(200).json({
      success: true,
      message: `Successfully create a Plan ${name}`,
    });
  } catch (error) {
    logger.error(error);
    return response.status(400).json({
      success: false,
      message: "Something went wrong, please try again",
    });
  }
};

const getPlans = async (request: Request, response: Response) => {
  try {
    const plans = await Plan.find({});
    return response.status(200).json({
      success: true,
      data: plans,
    });
  } catch (error) {
    logger.error(error);
    return response.status(400).json({
      success: false,
      message: "Something went wrong, please try again",
    });
  }
};

const createTransactions = async (request: Request, response: Response) => {
  try {
    const { name } = request.body;
    // @ts-ignore
    const id = request.user.id;

    if (!id) {
      return response.status(401).json({
        success: false,
        message: "Access denied",
      });
    }
    const user = await UserModel.findOne({
      _id: id
    });

    if (!user) {
      return response.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    const PayStackInst = new PayStack(configs.PAY_STACK_SECRET);

    const plan = await getPlan(name);

    if (!plan.success) {
      return response.status(400).json({
        success: false,
        message: "Could not find plan",
      });
    }

    const trans = await PayStackInst.createTransaction(
      user.email,
      plan.data.amount,
      configs.returnUrl
    );

    return response.status(200).json({
      success: true,
      data: trans,
    });
  } catch (error) {
    logger.error(error);
    return response.status(400).json({
      success: false,
      message: "Something went wrong, please try again",
    });
  }
};

const verifyTransactions = async (request: Request, response: Response) => {
  try {
    const { reference } = request.body;

    // @ts-ignore
    const id = request.user.id;

    if (!id) {
      return response.status(401).json({
        success: false,
        message: "Access denied",
      });
    }

    if (!reference) {
      return response.status(400).json({
        success: false,
        message: "Reference not found",
      });
    }
    const PayStackInst = new PayStack(configs.PAY_STACK_SECRET);

    const verify = await PayStackInst.verifyTransaction(reference);

    const customer = verify.data.customer.customer_code;
    const plan = await getPlan('', verify.data.amount);

    if (!plan.success) {
      return response.status(400).json({
        success: false,
        message: "Could not find plan",
      });
    }

    const subs = await PayStackInst.subscribeUser(customer, plan.id);

    await Subscription.create({ ...subs.data, user_id: id });

    return response.status(200).json({
      success: true,
      message: "Successfully created a subscription",
      data: subs.data,
    });
  } catch (error) {
    console.log(error);
    logger.error(error);
    return response.status(400).json({
      success: false,
      message: "Something went wrong, please try again",
    });
  }
};
export default {
  getSubscriptions,
  createPlan,
  getPlans,
  createTransactions,
  verifyTransactions,
  getSubscription,
};
