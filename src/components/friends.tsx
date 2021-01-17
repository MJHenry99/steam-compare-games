import {Checkbox, FormControlLabel, FormGroup} from "@material-ui/core";
import {useEffect, useState} from "react";
import {getFriendsDetails} from "../providers/data.provider";
import {IUser} from "../models/user.model";

export const Friends = () => {

    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [friends, setFriends] = useState<{isChecked: boolean, friend: IUser}[]>([])

    useEffect(() => {
        getFriendsDetails().then((returnedFriends) => {
            if (!returnedFriends) {
                setFriends([]);
            } else {
                let innerFriends = []
                for (let i = 0; i < returnedFriends.length; i++) {
                    innerFriends.push({isChecked: false, friend: returnedFriends[i]});
                }
                setFriends(innerFriends);
            }
        }).finally(() => {
            setIsLoading(false);
        });
    }, [])


    const [stateList, setStateList] = useState<{steamId: string, isChecked: boolean}[]>([])

    const states = {};

    return isLoading ?
        null
        :
        (
            <FormGroup row>
                {
                    friends.map((friendObject, index) => {
                        // states[friend.steamId] = false;

                        // const [state, setState] = useState<boolean>(false);
                        return (
                            <FormControlLabel
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
                                label={friendObject.friend.steamName}
                            />
                        )
                    })
                }
            </FormGroup>
        )
}
