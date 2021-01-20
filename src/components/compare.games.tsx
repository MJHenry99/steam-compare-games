import React, {useEffect, useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import {ISteamGamesDetails} from "../models/steam.game.details";
import {getSharedGames} from "../providers/data.provider";
import {ISelectableFriendModel} from "../models/selectable.friend.model";
import NoSteamIdsError from "../errors/no.steam.ids.error";
import Lists from "./list";
import {CircleLoading} from "./circle.loading";
import {Empty} from "./empty";

const useStyles = makeStyles({
    root: {
        width: '100%',
    },
    container: {
        height: "100%"
    },
});

interface ICompareGamesProps {
    steamFriends: ISelectableFriendModel[];
    friendsLoading: boolean;
}

export const CompareGames = (props: ICompareGamesProps) => {

    const {steamFriends, friendsLoading} = props;

    const [sharedGames, setSharedGames] = useState<ISteamGamesDetails[]>([]);
    const [selectedFriendIds, setSelectedFriendIds] = useState<string[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(true)

    useEffect(() => {

        setIsLoading(true);

        (async function () {

            const steamIds: string[] = [];
            for (let i = 0; i < steamFriends.length; i++) {
                const steamFriend = steamFriends[i];
                if (steamFriend.isChecked) {
                    steamIds.push(steamFriend.friend.steamId);
                }
            }
            setSelectedFriendIds(steamIds);

            await getSharedGames(steamIds)
                .then((games) => {
                    setSharedGames(games);
                })
                .catch((error) => {
                    if (!(error instanceof NoSteamIdsError))
                        console.log(error)
                    setSharedGames([]);
                })
                .finally(() => {
                    setIsLoading(false);
                });

        })();
    }, [steamFriends]);

    return isLoading || friendsLoading ?
        <CircleLoading sectionName={"your shared games."}/>
        :
        sharedGames.length > 0 ?
            <Lists steamGames={sharedGames}/>
            :
            <Empty
                message={selectedFriendIds.length > 0 ? "These people don't share any games." : "You have not selected any people."}/>
}
