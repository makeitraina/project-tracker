"use client";
import { createNotification } from "@/actions/createNotification";
import { ClientSessionContext } from "@/common/context";
import { useSearchParams } from "next/navigation";
import { useContext } from "react";

/**
 * Feature for current user to create a project.
 *
 * This will create a project item in the system in a
 * "requested" state. Also, notify the IUs that are assigned
 * to this client that a new project has been requested.
 */
export function CreateProject({
  clientId,
  companyId,
}: {
  clientId: string;
  companyId: string;
}) {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? undefined;

  const handleCreateNotification = async () => {
    if (token) {
      await createNotification({
        token,
        clientId,
        companyId,
      });
    }
  };

  return (
    <div>
      <button onClick={handleCreateNotification}>Create Notification</button>
    </div>
  );
}
