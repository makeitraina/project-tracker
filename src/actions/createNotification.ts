"use server";
import { need } from "@/utils/need";
import { copilotApi } from "copilot-node-sdk";

type CreateNotificationArgs = {
  token: string;
  clientId: string;
  companyId: string;
};

export async function createNotification({
  token,
  clientId,
  companyId,
}: CreateNotificationArgs) {
  const apiKey = need<string>(process.env.COPILOT_API_KEY);

  const copilot = copilotApi({
    apiKey,
    token,
  });

  // list all IUs and filter by the ones that are assigned to the client
  const internalUsers = await copilot.listInternalUsers({});
  console.log("internalUsers", internalUsers);
  const usersToNotify =
    internalUsers.data?.filter((iu) => {
      if (iu.isClientAccessLimited) {
        return iu.companyAccessList?.includes(companyId);
      }

      return true;
    }) || [];

  console.log("usersToNotify", usersToNotify);
  usersToNotify.forEach(async (iu) => {
    const notification = await copilot.createNotification({
      requestBody: {
        senderId: clientId,
        recipientId: iu.id || "",
        deliveryTargets: {
          inProduct: {
            title: "Project requested",
          },
        },
      },
    });
    console.log("notification", notification);
  });
}
