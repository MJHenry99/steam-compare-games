import {Typography} from "@material-ui/core";

interface IEmptyProps {
    message: string
}

export const Empty = (props: IEmptyProps) => {

    const {message} = props;

    return (<div
        style={{width: "100%", height: "100%", justifyContent: "center", display: "flex", flexDirection: "column"}}>
        <img style={{width: "50%", height: "50%", marginLeft: "auto", marginRight: "auto"}} src={"/undraw/empty.svg"}/>
        <Typography style={{marginLeft: "auto", marginRight: "auto"}} variant={"h5"} component={"p"}>{message}</Typography>
    </div>)
}
