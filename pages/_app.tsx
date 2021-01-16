import React, {createContext, useState} from 'react';
import Head from 'next/head';
import {ThemeProvider} from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import theme from '../src/theme';
import {AppProps} from "next/app";
import {IUser} from "../src/models/user";
import {$currentUser} from "../src/providers/data.provider";
import {filter} from "rxjs/operators";
import {AppBase} from "../src/components/app.base";

export const CurrentUserContext = createContext(null as IUser | null);

export default function MyApp(props: AppProps) {
    const {Component, pageProps} = props;

    const [user, setUser] = useState<IUser | null>(null as IUser | null);

    React.useEffect(() => {
        // Remove the server-side injected CSS.
        const jssStyles = document.querySelector('#jss-server-side');
        if (jssStyles) {
            jssStyles.parentElement!.removeChild(jssStyles);
        }

        const handleRouteChange = (url) => {
            console.log(url);

            if (url !== window.location.pathname) {

            }
        }


        const observable = $currentUser
            .pipe(filter((user) => user !== undefined))
            .subscribe((newUser) => {
                if (newUser === null) {
                    setUser(null);
                } else {
                    setUser(newUser);
                }
            });

        return () => {
            observable.unsubscribe();
        }
    }, []);

    return (
        <React.Fragment>
            <Head>
                <title>My page</title>
                <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width"/>
            </Head>
            <ThemeProvider theme={theme}>
                {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
                <CssBaseline/>
                <CurrentUserContext.Provider value={user}>
                    <AppBase>
                        <Component {...pageProps} />
                    </AppBase>
                </CurrentUserContext.Provider>
            </ThemeProvider>
        </React.Fragment>
    );
}
