import React, {useEffect, useState} from "react";
import {CurrentUserContext} from "./_app";
import {makeStyles, Theme} from "@material-ui/core/styles";
import {createStyles} from "@material-ui/styles";
import Typography from "@material-ui/core/Typography";
import {Button} from "@material-ui/core";
import {loginWithSteamQueryKeyword} from "../src/utils/steam.utils";
import {getSteamId, removeSteamId, setSteamId} from "../src/services/auth.service";
import {login} from "../src/providers/data.provider";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            minHeight: "100%",
            width: "100%",
            display: "flex",
            flexDirection: 'column',
            justifyContent: 'center'
        }
    })
);

export default function Index() {

    const classes = useStyles();

    const user = React.useContext(CurrentUserContext);

    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        if (window.location.search) {
            const urlParams = new URLSearchParams(window.location.search);
            if (urlParams.has(loginWithSteamQueryKeyword)) {
                const steamIdUrl = urlParams.get(loginWithSteamQueryKeyword);
                const steamIdUrlSplit = steamIdUrl.split("/");
                setSteamId(steamIdUrlSplit[steamIdUrlSplit.length - 1]);
            }
        }

        login(getSteamId()).then(() => {

        }).finally(() => {
            setIsLoading(false);
        });
    }, [])

    return (
        <div className={classes.root}>
            {
                user ? null
                    :
                    <div style={{width: "40%", marginLeft: "auto", marginRight: "auto"}}>
                        {/*<img style={{width: "80%", display: "block", marginLeft: "auto", marginRight: "auto"}} src={"/undraw/ninja.svg"}/>*/}
                        {/*<Typography style={{textAlign: "center"}} variant={"h4"}>Sign in to see what games you and your friends have in*/}
                        {/*    common.</Typography>*/}
                        <form action="https://steamcommunity.com/openid/login" method="post">
                            <input type="hidden" name="openid.identity"
                                   value="http://specs.openid.net/auth/2.0/identifier_select" />
                            <input type="hidden" name="openid.claimed_id"
                                   value="http://specs.openid.net/auth/2.0/identifier_select" />
                            <input type="hidden" name="openid.ns" value="http://specs.openid.net/auth/2.0" />
                            <input type="hidden" name="openid.mode" value="checkid_setup" />
                            <input type="hidden" name="openid.realm" value="http:\\localhost:3000" />
                            <input type="hidden" name="openid.return_to" value="http:\\localhost:3000" />
                            <Button type="submit">Log in through Steam</Button>
                        </form>
                        <form action="http://localhost:3000/api/hello" method="post">
                            <input type="hidden" name="openid.identity"
                                   value="http://specs.openid.net/auth/2.0/identifier_select" />
                            <input type="hidden" name="openid.claimed_id"
                                   value="http://specs.openid.net/auth/2.0/identifier_select" />
                            <input type="hidden" name="openid.ns" value="http://specs.openid.net/auth/2.0" />
                            <input type="hidden" name="openid.mode" value="checkid_setup" />
                            <input type="hidden" name="openid.realm" value="http:\\localhost:3000" />
                            <input type="hidden" name="openid.return_to" value="http:\\localhost:3000" />
                            <Button disabled={isLoading} type="submit">Log in through FUCK ME</Button>
                        </form>
                    </div>
            }
        </div>
    )
}
