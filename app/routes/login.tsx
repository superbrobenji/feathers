import { Authenticator, useAuthenticator } from "@aws-amplify/ui-react";
import { ActionFunction, ActionFunctionArgs } from "@remix-run/node";
import { useFetcher } from "@remix-run/react";
import { AuthUser } from "aws-amplify/auth";
import { useCallback, useEffect } from "react";
import { createUserSession } from "~/session.server";

interface User extends AuthUser {
  signInUserSession: {
    accessToken: {
      jwtToken: string;
    };
    idToken: {
      jwtToken: string;
    };
  };
}
export const action: ActionFunction = async ({
  request,
}: ActionFunctionArgs) => {
  // get data from the form
  const formData = await request.formData();
  const accessToken = formData.get("accessToken");
  const idToken = formData.get("idToken");

  // create the user session
  return await createUserSession({
    request,
    userInfo: {
      accessToken,
      idToken,
    },
    redirectTo: "/",
  });
};

// routes/login.jsx
export function Login() {
  // for calling action
  const fetcher = useFetcher();
  const { user } = useAuthenticator((context) => [context.user]);

  useEffect(() => {
    console.log(user);
    setUserSessionInfo(user as User);
  }, [user]);

  /**
   *
   */
  const setUserSessionInfo = useCallback(
    (user: User) => {
      // if i have a user then submit the tokens to the
      // action function to set up the cookies for server
      // authentication
      if (user && fetcher.state === "idle" && fetcher.data !== null) {
        fetcher.submit(
          {
            accessToken: user?.signInUserSession?.accessToken?.jwtToken,
            idToken: user?.signInUserSession?.idToken?.jwtToken,
          },
          { method: "post" }
        );
      }
    },
    [user]
  );

  return (
    <Authenticator signUpAttributes={["email"]}>
      {() => <h1>LOADING...</h1>}
    </Authenticator>
  );
}

export default Login;
