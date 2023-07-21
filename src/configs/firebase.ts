import * as firebaseAdmin from "firebase-admin";
import { serviceAccounts } from './serviceAccounts'

firebaseAdmin.initializeApp({
    credential: firebaseAdmin.credential.cert(JSON.parse(JSON.stringify(serviceAccounts))),
})

export { firebaseAdmin }