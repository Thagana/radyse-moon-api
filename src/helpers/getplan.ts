import Plan from "../models/Mongodb/Plan"

const getPlan = async (amount: number) => {
    try {
        const plan = await Plan.findOne({
            amount,
        });
        if (!plan) {
            return { success: false, id: '' };
        }
        return { success: true, id: plan.plan_code }
    } catch (error) {
        return {  success: false, id: '' }
    }
}

export default getPlan;