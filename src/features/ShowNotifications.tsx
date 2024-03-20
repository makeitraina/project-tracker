import { createNotification } from "@/actions/createNotification";
import { CopilotAPI } from "copilot-node-sdk";
import { useSearchParams } from "next/navigation";

async function getData(copilotApi: CopilotAPI, recipientId: string) {
  const result = await copilotApi.listNotifications({
    recipientId,
    includeRead: true,
  });

  return result.data || [];
}

/**
 * show open notifications for the current user
 */
export async function ShowNotifications({
  copilotApi,
  userId,
}: {
  copilotApi: CopilotAPI;
  userId: string;
}) {
  const notifications = await getData(copilotApi, userId);

  return (
    <div>
      <h1>Notifications</h1>
      <br />
      {notifications.map((notification) => (
        <div key={notification.id}>
          {notification.deliveryTargets?.inProduct && (
            <>
              <h2>{notification.deliveryTargets.inProduct.title}</h2>
              <p>{`Is Read: ${notification.deliveryTargets.inProduct.isRead}`}</p>
            </>
          )}
        </div>
      ))}
    </div>
  );
}
