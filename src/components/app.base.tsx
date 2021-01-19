import {MyAppBar} from "./appbar";
import {Card, CardContent, createStyles, useTheme} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles((theme) =>
    createStyles({
        main: {
            height: "calc(100vh - 64px)",
            width: "100%",
            padding: 30,
        },
        card: {
            height: "100%",
            backgroundColor: "#424242",
        },
        cardContent: {
            height: "100%",
            overflowY: "auto"
        }
    })
);

export const AppBase = (props) => {

    const classes = useStyles();


    return (
        <>

            <MyAppBar/>

            <main className={classes.main}>
                <Card className={classes.card}>
                    <CardContent className={classes.cardContent} style={{padding: 30}}>
                        {props.children}
                    </CardContent>
                </Card>
            </main>

        </>
    )
}
