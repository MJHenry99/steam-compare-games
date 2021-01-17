import {Checkbox, FormControlLabel, FormGroup} from "@material-ui/core";
import {useEffect, useState} from "react";
import {getFriendsDetails} from "../providers/data.provider";
import {IUser} from "../models/user";

export const Friends = () => {

    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [friends, setFriends] = useState<IUser[]>([])

    useEffect(() => {
        getFriendsDetails().then((returnedFriends) => {
            if (!returnedFriends) {
                setFriends([]);
            } else {
                setFriends(returnedFriends);
            }
            setIsLoading(false);
        });
    })


    const states = {};

    return isLoading ?
        null
        :
        (
            <FormGroup row>
                {
                    friends.map((friend, index) => {
                        states[friend.steamId] = false;
                        const [state, setState] = useState<boolean>(false);
                        return (
                            <FormControlLabel
                                key={friend.steamId + index}
                                control={
                                    <Checkbox
                                        checked={state}
                                        onChange={() => {
                                            states[friend.steamId] = !states[friend.steamId];
                                            setState((prevState) => !prevState);
                                            console.log(states);
                                        }}
                                        name="checkedB"
                                        color={"secondary"}
                                    />
                                }
                                label={friend.steamName}
                            />
                        )
                    })
                }
            </FormGroup>
        )
}
