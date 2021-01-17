import {Checkbox, CheckboxProps, FormControlLabel, FormGroup, withStyles} from "@material-ui/core";
import React, {useEffect, useState} from "react";
import {getFriendsDetails} from "../providers/data.provider";
import {IUser} from "../models/user.model";
import {CurrentUserContext} from "../../pages/_app";
import theme from "../theme";


const CustomCheckbox = withStyles({
    root: {
        color: "#ffffff",
        '&$checked': {
            color: theme.palette.secondary.main,
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
        null
        :
        (
            <FormGroup row={false} style={{maxHeight: "100%", flexWrap: "nowrap", overflowY: "auto"}}>
                {
                    friends.map((friendObject, index) => {
                        return (
                            <FormControlLabel
                                style={{marginLeft: 5}}
                                // style={friendObject.isChecked ? null : {display: "none"}}
                                key={friendObject.friend.steamId + index}
                                control={
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
                                }
                                label={friendObject.friend.steamName + (friendObject.friend.steamName === user.steamName ? " (Me)" : "")}
                            />
                        )
                    })
                }
            </FormGroup>
        )
}
