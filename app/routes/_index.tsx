import { useAuthenticator } from "@aws-amplify/ui-react";
import type {
  ActionFunctionArgs,
  LoaderFunction,
  LoaderFunctionArgs,
  MetaFunction,
} from "@remix-run/node";
import { useFetcher } from "@remix-run/react";
import { logout, requireUserId } from "~/session.server";

export const meta: MetaFunction = () => {
  return [
    { title: "Budgy" },
    { name: "description", content: "Welcome to Budgy!" },
  ];
};

export const loader: LoaderFunction = async ({
  request,
}: LoaderFunctionArgs) => {
  await requireUserId(request, "/login");
  return null;
};
/**
 * this action function is called when the user logs
 * out of the application. We call logout on server to
 * clear out the session cookies
 */
export const action = async ({ request }: ActionFunctionArgs) => {
  console.log("in logout action");
  return await logout(request);
};

export default function Index() {
  const fetcher = useFetcher();
  const { signOut } = useAuthenticator();
  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8" }}>
      <h1>Welcome to Remix</h1>
      <ul>
        <li>
          <a
            target="_blank"
            href="https://remix.run/tutorials/blog"
            rel="noreferrer"
          >
            15m Quickstart Blog Tutorial
          </a>
        </li>
        <li>
          <a
            target="_blank"
            href="https://remix.run/tutorials/jokes"
            rel="noreferrer"
          >
            Deep Dive Jokes App Tutorial
          </a>
        </li>
        <li>
          <a target="_blank" href="https://remix.run/docs" rel="noreferrer">
            Remix Docs
          </a>
        </li>
      </ul>
      <button
        className="ui button"
        type="button"
        onClick={() => {
          // amplify sign out
          signOut({ global: true });

          // clear out our session cookie...
          fetcher.submit({}, { method: "post" });
        }}
      >
        Log Out
      </button>
    </div>
  );
}
