import React, {useEffect, useRef, useState} from 'react';
import {makeStyles, Theme} from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import {CurrentUserContext} from "../../pages/_app";
import {Avatar, ClickAwayListener, Grow, MenuItem, MenuList, Paper, Popper} from "@material-ui/core";
import {logout} from "../providers/data.provider";
import {createStyles} from "@material-ui/styles";


const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        notLoggedIn: {
            flexGrow: 1,
        },
        menuButton: {
            marginRight: theme.spacing(2),
        },
        title: {
            flexGrow: 1,
            display: "flex"
        },
        logoutDialog: {
            backgroundColor: theme.palette.primary.light
        }

    })
);


export const MyAppBar = () => {
    const classes = useStyles();

    const [currentUrl, setCurrentUrl] = useState(null);
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const avatarRef = useRef(null);

    const user = React.useContext(CurrentUserContext);

    const handleToggle = () => {
        setIsOpen((prevState) => !prevState);
    }

    const handleClose = (event) => {
        if (avatarRef.current && avatarRef.current.contains(event.target))
            return;

        setIsOpen(false);
    }

    const handleLogout = () => {
        logout();
    }

    useEffect(() => {
        setCurrentUrl(window.location.protocol + "//" + window.location.hostname + (window.location.port ? ':' + window.location.port : ''));
    }, []);


    return (
        <div className={classes.notLoggedIn}>
            <AppBar position="static">
                <Toolbar>
                    {/*<IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">*/}
                    {/*    <MenuIcon/>*/}
                    {/*</IconButton>*/}
                    <div className={classes.title}>
                        <Typography variant="h6">
                            Compare Steam Games
                        </Typography>
                        <Typography style={{marginLeft: 5, height: "100%", marginTop: "auto", marginBottom: "auto"}} variant="caption">
                            v0.1.0
                        </Typography>
                    </div>
                    {
                        user ?
                            <>
                                <Popper open={isOpen} anchorEl={avatarRef.current} role={undefined} transition
                                        disablePortal>
                                    {({TransitionProps, placement}) => (
                                        <Grow
                                            {...TransitionProps}
                                            style={{transformOrigin: placement === 'bottom' ? "center top" : "center bottom"}}
                                        >
                                            <Paper className={classes.logoutDialog}>
                                                <ClickAwayListener onClickAway={handleClose}>
                                                    <MenuList autoFocusItem={isOpen}>
                                                        <MenuItem onClick={handleLogout}>Logout</MenuItem>
                                                    </MenuList>
                                                </ClickAwayListener>
                                            </Paper>
                                        </Grow>
                                    )}
                                </Popper>
                                <IconButton ref={avatarRef} onClick={handleToggle}>
                                    <Avatar src={user.avatarUrl}>
                                        {user.steamName ? user.steamName.charAt(0) : "?"}
                                    </Avatar>
                                </IconButton>
                            </>
                            :
                            <form action="https://steamcommunity.com/openid/login" method="post">
                                <input type="hidden" name="openid.identity"
                                       value="http://specs.openid.net/auth/2.0/identifier_select"/>
                                <input type="hidden" name="openid.claimed_id"
                                       value="http://specs.openid.net/auth/2.0/identifier_select"/>
                                <input type="hidden" name="openid.ns" value="http://specs.openid.net/auth/2.0"/>
                                <input type="hidden" name="openid.mode" value="checkid_setup"/>
                                <input type="hidden" name="openid.realm" value={currentUrl}/>
                                <input type="hidden" name="openid.return_to" value={currentUrl}/>
                                <Button disabled={!currentUrl} type="submit">
                                    <img alt="Login with steam" src={"/steam/steam_login.png"}/>
                                </Button>
                            </form>
                    }
                </Toolbar>
            </AppBar>
        </div>
    )
}
