/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import {onRequest} from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

export const helloWorld = onRequest(
  {cors: true},
  (req, res) => {
    logger.info("Hello logs!", {structuredData: true});
    const msgs = [
      "Hello from cloud functions !",
      "Cloud functions is awesome !",
      "Cloud functions is easy to use !",
      "Cloud functions is scalable !",
      "Cloud functions is reliable !",
      "Cloud functions is fast !",
      "Cloud functions is serverless !",
      "Cloud functions is event-driven !",
      "Cloud functions is fully managed !",
      "Cloud functions is cost-effective !",
      "Cloud functions is easy to monitor !",
    ];
    res.send({text: msgs[Math.floor(Math.random() * msgs.length)]});
  }
);
