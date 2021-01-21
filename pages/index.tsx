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
import {Box, Divider, useTheme} from "@material-ui/core";
import {BallsLoading} from "../src/components/balls.loading";
import {CompareGames} from "../src/components/compare.games";
import {ISelectableFriendModel} from "../src/models/selectable.friend.model";
import HiddenCss from "@material-ui/core/Hidden/HiddenCss";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        notLoggedIn: {
            minHeight: "100%",
            width: "100%",
            display: "flex",
            flexDirection: 'column',
            justifyContent: 'center'
        },
        loggedIn: {
            height: "100%",
            width: "100%",
            display: "flex",
            [theme.breakpoints.down("sm")]: {
                flexDirection: 'column'
            },
            [theme.breakpoints.up("md")]: {
                flexDirection: 'row'
            }
        },
        compareGamesContainer: {
            [theme.breakpoints.down("sm")]: {
                flex: "2 2 0",
                order: 2,
            },
            [theme.breakpoints.up("md")]: {
                flex: "4 3 0",
                order: 0,
            },
            display: "flex",
            flexDirection: "column",
            justifyContent: "center"
        },
        friendsContainer: {
            flex: "1 1 0",
            order: 2,
            [theme.breakpoints.down("sm")]: {
                order: 0,
                maxHeight: "30%"
            }
        }
    })
);

export default function Index() {

    const classes = useStyles();
    const router = useRouter();

    const user = React.useContext(CurrentUserContext);

    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [friendsLoading, setFriendsLoading] = useState<boolean>(true);

    const [friends, setFriends] = useState<ISelectableFriendModel[]>([]);

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
        user ? <div
                className={classes.loggedIn}
            >
                <div className={classes.compareGamesContainer}>
                    <Typography variant={"subtitle1"} style={{height: 30}}><u>Shared Games</u></Typography>
                    <div style={{width: "100%", height: "calc(100% - 30px)"}}>
                        <CompareGames steamFriends={friends} friendsLoading={friendsLoading}/>
                    </div>
                </div>
                <div style={{order: 1}}>
                    <HiddenCss smDown>
                        <Divider style={{width: 1, height: "calc(100% - 30px)", marginTop: 30}}/>
                    </HiddenCss>
                    <HiddenCss mdUp>
                        <Divider style={{marginTop: 5, marginBottom: 5}}/>
                    </HiddenCss>
                </div>
                <Box borderColor="rgba(0, 0, 0, 0.12)" className={classes.friendsContainer}>
                    <Friends steamFriends={friends} setSteamFriends={setFriends} setIsLoading={setFriendsLoading}
                             isLoading={friendsLoading}/>
                </Box>
            </div>
            :
            (<div className={classes.notLoggedIn}>
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
