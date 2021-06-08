import * as functions from "firebase-functions";
import * as admin from 'firebase-admin';
import { rest } from "./rest";
import { WoocommerceSync } from "./listeners/wooocommerceSync";
import { UserStatusChange } from "./listeners/onUserStatusChanged";
import { OnRolNew } from "./listeners/onRolNew";

const axios = require('axios')


admin.initializeApp();

const db = admin.firestore();

// Initialize Rest API
const express = rest(db);
const woocoommerceSync = new WoocommerceSync(db,axios)
const userStatusChange = new UserStatusChange(db)
const onRolNew = new OnRolNew(db)


const api = functions.https.onRequest(express);



module.exports = {
    api,
    woocoommerceSync,
    userStatusChange,
    onRolNew
};