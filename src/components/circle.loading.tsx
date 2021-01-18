import {CircularProgress, Typography} from "@material-ui/core";

export const CircleLoading = ({sectionName}) => {

    return (
        <div style={{width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center"}}>

            <CircularProgress style={{marginLeft: "auto", marginRight: "auto"}} />
            {
                sectionName ?
                    <Typography style={{marginLeft: "auto", marginRight: "auto"}}>
                        {"Loading " + sectionName}
                    </Typography>
                    :
                    null
            }

        </div>
    )
}
