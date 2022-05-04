import { Request, Response } from "express";
import PayStack from "../../helpers/PayStack/PayStack";
import Subscription from "../../models/Mongodb/Subscription";
import logger from "../../utils/logger";
import { configs } from "../../configs/app.configs";
import Plan from "../../models/Mongodb/Plan";
import getPlan from "../../helpers/getplan";

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

    const subscriptions = await Subscription.findOne({
      user_id: id,
    });

    if (!subscriptions) {
      return response.status(200).json({
        success: false,
        message: "You don't have any subscriptions, create one",
      });
    }

    return response.status(200).json({
      success: true,
      data: [],
    });
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
    const { email, amount } = request.body;

    const PayStackInst = new PayStack(configs.PAY_STACK_SECRET);
    
    const plan = await getPlan(amount);

    if (!plan.success) {
      return response.status(400).json({
        success: false,
        message: 'Could not find plan'
      })
    }

    const trans = await PayStackInst.createTransaction(email, amount, configs.returnUrl, plan.id);

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
    if (!reference) {
      return response.status(400).json({
        success: false,
        message: "Reference not found",
      });
    }
    const PayStackInst = new PayStack(configs.PAY_STACK_SECRET);
    const verify = await PayStackInst.verifyTransaction(reference);

    const customer = verify.data.customer.customer_code;
    const plan = verify.data.plan;
    
    console.log(customer, plan, verify);

    const subscription = await PayStackInst.subscribeUser(customer, plan);
    await Subscription.create(subscription.data);
    return response.status(200).json({
      success: true,
      message: "Successfully created a subscription",
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
export default { getSubscriptions, createPlan, getPlans, createTransactions, verifyTransactions };
