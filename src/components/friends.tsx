import {Avatar, Checkbox, CheckboxProps, FormControlLabel, FormGroup, withStyles} from "@material-ui/core";
import React, {useEffect, useState} from "react";
import {getFriendsDetails} from "../providers/data.provider";
import {IUser} from "../models/user.model";
import {CurrentUserContext} from "../../pages/_app";
import theme from "../theme";
import {CircleLoading} from "./circle.loading";


const CustomCheckbox = withStyles({
    root: {
        color: "#ffffff",
        '&$checked': {
            color: theme.palette.secondary.light,
        },
    },
    checked: {},
})((props: CheckboxProps) => <Checkbox color="default" {...props} />);

export const Friends = () => {

    const user = React.useContext(CurrentUserContext);

    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [friends, setFriends] = useState<{ isChecked: boolean, friend: IUser }[]>([])

    useEffect(() => {
        getFriendsDetails().then((returnedFriends) => {
            let innerFriends = [];

            innerFriends.push({isChecked: true, friend: user});

            if (returnedFriends) {
                for (let i = 0; i < returnedFriends.length; i++) {
                    innerFriends.push({isChecked: false, friend: returnedFriends[i]});
                }
            }

            setFriends(innerFriends);
        }).finally(() => {
            setIsLoading(false);
        });
    }, [])


    return isLoading ?
        <div style={{width: "100%", height: "100%", minWidth: 200}}>
            <CircleLoading sectionName={"your friends."}/>
        </div>
        :
        (
            <FormGroup row={false}
                       style={{maxHeight: "100%", flexWrap: "nowrap", overflowY: "auto"}}>
                {
                    friends.map((friendObject, index) => {

                        let labelText: string = "";

                        const nameSplit = friendObject.friend.steamName.split(" ");

                        for (let i = 0; i < nameSplit.length; i++) {
                            if (nameSplit[i].length > 20) {
                                labelText += " " + nameSplit[i].substring(0, 20);
                                labelText += "…";
                                break;
                            }
                            labelText += " " + nameSplit[i];
                        }

                        labelText += friendObject.friend.steamName === user.steamName ? " (me)" : ""

                        return (
                            <FormControlLabel
                                style={{marginLeft: 5, marginRight: 20, marginTop: 5, marginBottom: 5,}}
                                key={friendObject.friend.steamId + index}
                                control={
                                    <>
                                        <CustomCheckbox
                                            checked={friendObject.isChecked}
                                            onChange={() => {
                                                let clonedList = friends.slice();
                                                clonedList[index].isChecked = !clonedList[index].isChecked;
                                                setFriends(clonedList);
                                            }}
                                            name="checkedB"
                                            color={"default"}
                                        />
                                        <Avatar style={{marginRight: 10}} src={friendObject.friend.avatarUrl}/>
                                    </>
                                }
                                label={labelText}
                            />

                        )
                    })
                }
            </FormGroup>
        )
}
