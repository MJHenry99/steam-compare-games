import React from "react";
import PropTypes from "prop-types";
import {AutoSizer, List} from "react-virtualized";
import {ISteamGamesDetails} from "../models/steam.game.details";
import {Avatar, Divider, Typography} from "@material-ui/core";
import {makeStyles, Theme} from "@material-ui/core/styles";
import {createStyles} from "@material-ui/styles";

interface listProps {
    steamGames: ISteamGamesDetails[]
}

const rowStyles = makeStyles((theme: Theme) =>
    createStyles({
        icon: {
            marginTop: "auto",
            marginBottom: "auto",
            marginLeft: 15,
            marginRight: 15,
            // [theme.breakpoints.down("xs")]: {
            //     display: "none"
            // }
        },
        appId: {
            marginTop: "auto",
            marginBottom: "auto",
            marginLeft: 15,
            marginRight: 15,
            [theme.breakpoints.down("md")]: {
                display: "none"
            }
        },
        bannerImg: {
            marginTop: "auto",
            marginBottom: "auto",
            marginLeft: 15,
            marginRight: 15,
            display: "flex",
            justifyContent: "center",
            [theme.breakpoints.down("xs")]: {
                display: "none"
            }
        }
    })
);

const Row = ({steamGame}) => {

    const classes = rowStyles();

    const splitName = steamGame.name.split(" ");
    const avatarText = splitName[0].charAt(0).toUpperCase() + (splitName.length > 1 ? splitName[1].charAt(0).toUpperCase() : "");

    return (
        <div style={{width: "100%", height: "100%"}}>
            <div style={{
                width: "100%",
                height: "100%",
                display: "flex",
                justifyContent: "center"
            }}>
                <div className={classes.icon}>
                    <Avatar variant={"rounded"}
                            src={`http://media.steampowered.com/steamcommunity/public/images/apps/${steamGame.appid}/${steamGame.img_icon_url}.jpg`}
                    >
                        {avatarText}
                    </Avatar>
                </div>
                <div style={{
                    flexGrow: 1,
                    marginTop: "auto",
                    marginBottom: "auto",
                    marginLeft: 15,
                    marginRight: 15
                }}>
                    <Typography>{steamGame.name}</Typography>
                </div>
                <div className={classes.appId}>
                    {"App ID: " + steamGame.appid}
                </div>
                <div className={classes.bannerImg}>
                    {
                        steamGame.img_logo_url ?
                            <img alt={steamGame.name + " banner image"}
                                 src={`http://media.steampowered.com/steamcommunity/public/images/apps/${steamGame.appid}/${steamGame.img_logo_url}.jpg`}/>
                            : null
                    }
                </div>
            </div>
            <Divider/>
        </div>
    )
}

class Lists extends React.PureComponent<listProps> {
    render() {
        let {steamGames} = this.props;

        return (
            <div
                style={{
                    height: "100%",
                    width: "100%"
                }}
            >
                <AutoSizer>
                    {({height, width}) => {
                        const itemsPerRow = 1;
                        const rowCount = steamGames.length;

                        return (
                            <div>
                                <List
                                    width={width}
                                    height={height}
                                    rowCount={rowCount}
                                    rowHeight={80}
                                    rowRenderer={({index, key, style}) => {
                                        const items = [];
                                        const fromIndex = index * itemsPerRow;
                                        const toIndex = Math.min(fromIndex + itemsPerRow, steamGames.length);

                                        for (let i = fromIndex; i < toIndex; i++) {
                                            steamGames.map((steamGame, index) => {
                                                    return (index === i &&
                                                        items.push(
                                                            <Row steamGame={steamGame}/>
                                                        ))
                                                }
                                            );
                                        }

                                        return (
                                            <div key={key} style={style}>
                                                {items}
                                            </div>
                                        );
                                    }}
                                />
                            </div>
                        );
                    }}
                </AutoSizer>
            </div>
        );
    }
}

List.propTypes = {
    data: PropTypes.array,
};

export default Lists;
