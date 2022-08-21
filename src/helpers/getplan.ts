import Plan from "../data/infrastructure/db/entities/Plan";

const getPlan = async (
  name: string,
  amount?: number
): Promise<{ success: boolean; id: string; data: any }> => {
  try {
    if (amount) {
      const plan = await Plan.findOne({
        amount,
      });
      if (!plan) {
        return { success: false, id: "", data: "" };
      }
      return { success: true, id: plan.plan_code, data: plan };
    }
    const plan = await Plan.findOne({
      name,
    });
    if (!plan) {
      return { success: false, id: "", data: "" };
    }
    return { success: true, id: plan.plan_code, data: plan };
  } catch (error) {
    return { success: false, id: "", data: "" };
  }
};

export default getPlan;
