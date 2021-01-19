import React, {useEffect, useState} from "react";
import {CurrentUserContext} from "./_app";
import {makeStyles, Theme} from "@material-ui/core/styles";
import {createStyles} from "@material-ui/styles";
import Typography from "@material-ui/core/Typography";
import {loginWithSteamQueryKeyword} from "../src/utils/steam.utils";
import {getSteamId, setSteamId} from "../src/services/auth.service";
import {login} from "../src/providers/data.provider";
import {useRouter} from "next/router";
import {Friends} from "../src/components/friends";
import {Box, Paper, useTheme} from "@material-ui/core";
import {BallsLoading} from "../src/components/balls.loading";
import {CompareGames} from "../src/components/compare.games";
import {ISelectableFriendModel} from "../src/models/selectable.friend.model";

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
    const router = useRouter();

    const user = React.useContext(CurrentUserContext);

    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [friendsLoading, setFriendsLoading] = useState<boolean>(true);

    const [friends, setFriends] = useState<ISelectableFriendModel[]>([])

    useEffect(() => {
        if (window.location.search) {
            const urlParams = new URLSearchParams(window.location.search);
            if (urlParams.has(loginWithSteamQueryKeyword)) {
                const steamIdUrl = urlParams.get(loginWithSteamQueryKeyword);
                const steamIdUrlSplit = steamIdUrl.split("/");
                setSteamId(steamIdUrlSplit[steamIdUrlSplit.length - 1]);
            }
        }

        if (!user) {
            login(getSteamId()).then(() => {

            }).finally(() => {
                router.push("");
                setIsLoading(false);
            });
        } else {
            setIsLoading(false);
        }
    }, [])

    return isLoading ?
        <BallsLoading/>
        :
        user ? <div style={{
                height: "100%",
                width: "100%",
                display: "flex",
                flexDirection: 'row'
            }}
            >
                <div style={{flexGrow: 1, display: "flex", flexDirection: "column", justifyContent: "center"}}>
                    {/*<img src={"/undraw/welcome_cats.svg"} style={{marginLeft: "auto", marginRight: "auto", width: "50%"}}/>*/}
                    <CompareGames steamFriends={friends} friendsLoading={friendsLoading}/>
                </div>
                <Box borderLeft={1} borderColor="rgba(0, 0, 0, 0.12)" style={{minHeight: "100%"}}>
                    <Friends steamFriends={friends} setSteamFriends={setFriends} setIsLoading={setFriendsLoading} isLoading={friendsLoading}/>
                </Box>
            </div>
            :
            (<div className={classes.root}>
                    <div style={{width: "40%", marginLeft: "auto", marginRight: "auto"}}>
                        <img style={{width: "80%", display: "block", marginLeft: "auto", marginRight: "auto"}}
                             src={"/undraw/ninja.svg"}/>
                        <Typography style={{textAlign: "center"}} variant={"h4"}>
                            Sign in to see what games you and your friends have in common.
                        </Typography>
                    </div>
                </div>
            )
}
