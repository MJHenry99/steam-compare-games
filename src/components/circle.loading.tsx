import {CircularProgress, Typography} from "@material-ui/core";

interface CircleLoadingProps {
    sectionName?: string;
}

export const CircleLoading = (props: CircleLoadingProps) => {

    const {sectionName} = props;

    return (
        <div style={{width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center"}}>

            <CircularProgress color={"secondary"} style={{marginLeft: "auto", marginRight: "auto"}} />
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
