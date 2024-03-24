import {
    Links,
    Meta,
    Outlet,
    Scripts,
    ScrollRestoration,
} from "@remix-run/react";
import { Amplify } from 'aws-amplify';

import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';

Amplify.configure({
    Auth: {
        Cognito: {
            //  Amazon Cognito User Pool ID
            userPoolId: process.env.AWS_USER_POOL_ID!,
            // OPTIONAL - Amazon Cognito Web Client ID (26-char alphanumeric string)
            userPoolClientId: process.env.AWS_USER_POOL_CLIENT_ID!,
            // REQUIRED only for Federated Authentication - Amazon Cognito Identity Pool ID
            identityPoolId: process.env.AWS_IDENTITY_POOL_ID!,
            // OPTIONAL - This is used when autoSignIn is enabled for Auth.signUp
            // 'code' is used for Auth.confirmSignUp, 'link' is used for email link verification
            signUpVerificationMethod: 'code', // 'code' | 'link'
            loginWith: {
                // OPTIONAL - Hosted UI configuration
                oauth: {
                    domain: process.env.AWS_COGNITO_DOMAIN!,
                    scopes: [
                        'phone',
                        'email',
                        'profile',
                        'openid',
                        'aws.cognito.signin.user.admin'
                    ],
                    redirectSignIn: ['http://localhost:5173/'],
                    redirectSignOut: ['http://localhost:5173/'],
                    responseType: 'code' // or 'token', note that REFRESH token will only be generated when the responseType is code
                }
            }
        }
    }
});

export function Layout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <head>
                <meta charSet="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <Meta />
                <Links />
            </head>
            <main>
                <body>
                    {children}
                    <ScrollRestoration />
                    <Scripts />
                </body>
            </main>
        </html>
    );
}

export default function App() {
    return (
        <Authenticator.Provider>
            <Authenticator loginMechanisms={['email']}>
                {({ signOut }) => (
                    <Layout>
                        <button onClick={signOut}>Sign out</button>
                        <Outlet />
                    </Layout>
                )}
            </Authenticator>
        </Authenticator.Provider>
    );
}
