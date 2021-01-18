import React, {useEffect, useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableRow from '@material-ui/core/TableRow';
import {ISteamGamesDetails} from "../models/steam.game.details";
import {Avatar, Box, Collapse, createStyles, Typography} from "@material-ui/core";
import {getSharedGames} from "../providers/data.provider";
import {ISelectableFriendModel} from "../models/selectable.friend.model";
import NoSteamIdsError from "../errors/no.steam.ids.error";

const useStyles = makeStyles({
    root: {
        width: '100%',
    },
    container: {
        height: "100%"
    },
});

interface ICompareGamesProps {
    steamFriends: ISelectableFriendModel[];
}

const useRowStyles = makeStyles((theme) =>
    createStyles({
        root: {
            '& > *': {
                borderBottom: 'unset',
            },
        },
        avatar: {
            marginLeft: "auto",
            width: theme.spacing(5),
            height: theme.spacing(5)
        }
    })
);

function Row(props: { steamGame: ISteamGamesDetails }) {
    const {steamGame} = props;
    const classes = useRowStyles();
    const splitName = steamGame.name.split(" ");
    const avatarText = splitName[0].charAt(0).toUpperCase() + (splitName.length > 1 ? splitName[1].charAt(0).toUpperCase() : "");

    return (
        <React.Fragment>
            <TableRow className={classes.root}>
                <TableCell align={"center"}>
                    <Avatar variant={"rounded"}
                            src={`http://media.steampowered.com/steamcommunity/public/images/apps/${steamGame.appid}/${steamGame.img_icon_url}.jpg`}
                            className={classes.avatar}>{avatarText}</Avatar>
                </TableCell>
                <TableCell component="th" scope="row">
                    <Typography>{steamGame.name}</Typography>
                </TableCell>
                <TableCell
                    align={"center"}
                >
                    {steamGame.appid}
                </TableCell>
                <TableCell align="center">
                    {
                        steamGame.img_logo_url ?
                            <img alt={steamGame.name + " banner image"}
                                 src={`http://media.steampowered.com/steamcommunity/public/images/apps/${steamGame.appid}/${steamGame.img_logo_url}.jpg`}/>
                            : null
                    }
                </TableCell>
            </TableRow>
        </React.Fragment>
    );
}

export const CompareGames = (props: ICompareGamesProps) => {

    const {steamFriends} = props;

    const classes = useStyles();

    const [sharedGames, setSharedGames] = useState<ISteamGamesDetails[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true)

    useEffect(() => {

        setIsLoading(true);

        (async function () {

            const steamIds: string[] = [];
            for (let i = 0; i < steamFriends.length; i++) {
                const steamFriend = steamFriends[i];
                if (steamFriend.isChecked) {
                    steamIds.push(steamFriend.friend.steamId);
                }
            }

            await getSharedGames(steamIds)
                .then((games) => {
                    setSharedGames(games)
                })
                .catch((error) => {
                    if (!(error instanceof NoSteamIdsError))
                        console.log(error)
                    setSharedGames([])
                })
                .finally(() => {
                    setIsLoading(false);
                })

        })();
    }, [steamFriends])

    return (
        <TableContainer className={classes.container}>
            <Table stickyHeader aria-label="sticky table">
                {/*<TableHead>*/}
                {/*    <TableRow>*/}
                {/*        <TableCell*/}
                {/*            key={"appDropDown"}*/}
                {/*            align={"center"}*/}
                {/*        />*/}
                {/*        <TableCell*/}
                {/*            key={"appName"}*/}
                {/*            align={"left"}*/}
                {/*        >*/}
                {/*            Game*/}
                {/*        </TableCell>*/}
                {/*        <TableCell*/}
                {/*            key={"appId"}*/}
                {/*            align={"center"}*/}
                {/*        >*/}
                {/*            AppId*/}
                {/*        </TableCell>*/}
                {/*        <TableCell/>*/}
                {/*    </TableRow>*/}
                {/*</TableHead>*/}
                <TableBody>
                    {sharedGames.filter((value) => value).map((steamGame) => {
                        return (
                            <Row steamGame={steamGame}/>
                        );
                    })}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
