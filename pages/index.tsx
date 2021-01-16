import React from "react";
import {CurrentUserContext} from "./_app";
import {makeStyles, Theme} from "@material-ui/core/styles";
import {createStyles} from "@material-ui/styles";
import Typography from "@material-ui/core/Typography";

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

    return (
        <div className={classes.root}>
            {
                user ? null
                    :
                    <div style={{width: "40%", marginLeft: "auto", marginRight: "auto"}}>
                        <img style={{width: "100%", marginLeft: "auto", marginRight: "auto"}} src={"/undraw/ninja.svg"}/>
                        <Typography style={{textAlign: "center"}} variant={"h5"}>Sign in to see what games you and you're friends have in
                            common.</Typography>
                    </div>
            }
        </div>
    )
}
