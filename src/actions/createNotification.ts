"use server";
import { need } from "@/utils/need";
import { copilotApi } from "copilot-node-sdk";

export async function createNotification(token: string) {
  const apiKey = need<string>(process.env.COPILOT_API_KEY);

  const copilot = copilotApi({
    apiKey,
    token,
  });

  const notification = await copilot.createNotification({
    requestBody: {
      senderId: '....',
      recipientId: '....',
      deliveryTargets: {
      inProduct: {
        title: 'Hi from custom app',
      }
    },
  }});
  console.log("notification", notification);
}

