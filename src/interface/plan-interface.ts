interface IPlan {
    "name": string,
    "interval": string,
    "amount": number,
    "integration": number,
    "domain": string,
    "currency": string,
    "plan_code": string,
    "invoice_limit": number,
    "send_invoices": boolean,
    "send_sms": boolean,
    "hosted_page": boolean,
    "migrate": boolean,
    "id": number,
    "createdAt": string,
    "updatedAt": string
}
export default IPlan