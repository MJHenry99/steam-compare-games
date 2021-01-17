import {Checkbox, FormControlLabel, FormGroup} from "@material-ui/core";
import React, {useEffect, useState} from "react";
import {getFriendsDetails} from "../providers/data.provider";
import {IUser} from "../models/user.model";
import {CurrentUserContext} from "../../pages/_app";
import Button from "@material-ui/core/Button";

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
            <div style={{display: "flex", flexDirection: "row", width: "100%"}}>
                <div style={{width: "90%"}}>
                    <FormGroup row style={{maxHeight: "20%", overflowY: "auto"}}>
                        {
                            friends.map((friendObject, index) => {
                                return (
                                    <FormControlLabel
                                        // style={friendObject.isChecked ? null : {display: "none"}}
                                        key={friendObject.friend.steamId + index}
                                        control={
                                            <Checkbox
                                                checked={friendObject.isChecked}
                                                onChange={() => {
                                                    let clonedList = friends.slice();
                                                    clonedList[index].isChecked = !clonedList[index].isChecked;
                                                    setFriends(clonedList);
                                                }}
                                                name="checkedB"
                                                color={"secondary"}
                                            />
                                        }
                                        label={friendObject.friend.steamName + (friendObject.friend.steamName === user.steamName ? " (Me)" : "")}
                                    />
                                )
                            })
                        }
                    </FormGroup>
                </div>
                <div style={{width: "10%", textAlign: "center"}}>
                    <Button variant={"outlined"}>Compare...</Button>
                </div>
            </div>
        )
}
