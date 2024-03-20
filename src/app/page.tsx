import { copilotApi } from "copilot-node-sdk";
import Image from "next/image";
import { need } from "../utils/need";
import { CreateProject } from "@/features/CreateProject";
import { ShowNotifications } from "@/features/ShowNotifications";

type SearchParams = { [key: string]: string | string[] | undefined };

const apiKey = process.env.COPILOT_API_KEY;

const API_KEY = need<string>(apiKey);

export default async function Page({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  // const hasValidToken =
  //   "token" in searchParams && typeof searchParams.token === "string";
  // if (!hasValidToken) {
  //   return <div>Invalid token</div>;
  // }

  const copilot = copilotApi({
    apiKey: API_KEY,
    token:
      typeof searchParams.token === "string" ? searchParams.token : undefined,
  });

  const data: {
    workspace: Awaited<ReturnType<typeof copilot.retrieveWorkspace>>;
    client?: Awaited<ReturnType<typeof copilot.retrieveClient>>;
    company?: Awaited<ReturnType<typeof copilot.retrieveCompany>>;
    internalUser?: Awaited<ReturnType<typeof copilot.retrieveInternalUser>>;
  } = {
    workspace: await copilot.retrieveWorkspace(),
  };
  const tokenPayload = await copilot.getTokenPayload?.();

  if (tokenPayload?.clientId) {
    data.client = await copilot.retrieveClient({ id: tokenPayload.clientId });
    console.log("client", data.client);
  }
  if (tokenPayload?.companyId) {
    data.company = await copilot.retrieveCompany({
      id: tokenPayload.companyId,
    });
  }
  if (tokenPayload?.internalUserId) {
    data.internalUser = await copilot.retrieveInternalUser({
      id: tokenPayload.internalUserId,
    });
  }

  const currentUserId = tokenPayload?.internalUserId || tokenPayload?.clientId;

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
          Welcome to the custom app&nbsp;
          <code className="font-mono font-bold">
            {data.client ? data.client.givenName : data.company?.name}
            {data.internalUser ? data.internalUser.givenName : ""}
          </code>
          ,
        </p>
        <div className="fixed bottom-0 left-0 flex h-48 w-full items-end justify-center bg-gradient-to-t from-white via-white dark:from-black dark:via-black lg:static lg:h-auto lg:w-auto lg:bg-none">
          <a
            className="pointer-events-none flex place-items-center gap-2 p-8 lg:pointer-events-auto lg:p-0"
            href="https://copilot.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            By{" "}
            <Image
              src="/copilot_icon.png"
              alt="Copilot Icon"
              className="dark:invert"
              width={24}
              height={24}
              priority
            />
          </a>
        </div>
      </div>

      {tokenPayload?.clientId && tokenPayload.companyId && (
        <CreateProject
          clientId={tokenPayload.clientId}
          companyId={tokenPayload.companyId}
        />
      )}

      {currentUserId && (
        <ShowNotifications copilotApi={copilot} userId={currentUserId} />
      )}
    </main>
  );
}
