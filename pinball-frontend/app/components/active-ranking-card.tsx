'use client'

import { useEffect, useState } from "react";
import { completedGamesRef } from "../firebase";
import { limit, onSnapshot, orderBy, query, where } from "firebase/firestore";
import Avatar from "@/app/components/avatar";
import { getYesterdayTimestamp } from "@/app/utils/timestamp";

const returnInput = (value: number) => value;

type Game = {
  gameId: string,
  avatar: string,
  playerName: string,
  value: number,
}

const defaultGames = [{
  gameId: '',
  avatar: 'beaver',
  playerName: 'Loading...',
  value: 0,
}];

const yesterdayUtcTimestamp = getYesterdayTimestamp();

export default function ActiveRankingCard({ title, field, units, mapper = returnInput, currentGame }: { title: string, field: string, units: string, mapper?: Function, currentGame: Game }) {
  const [higherGames, setHigherGames] = useState<Game[]>(defaultGames);
  const [lowerGames, setLowerGames] = useState<Game[]>(defaultGames);

  useEffect(() => {
    // limit to 98 to keep everything in 2 digits
    // 98 + 1 (for the player) is 99
    const maxValueQuery = query(completedGamesRef, where('utcTimestamp', '>', yesterdayUtcTimestamp), orderBy(field, 'desc'), limit(98))
    const unsubscribe = onSnapshot(maxValueQuery, (querySnapshot) => {
      const higherGames: Game[] = [];
      const lowerGames: Game[] = [];
      querySnapshot.docs.forEach(gameStats => {
        const data = gameStats.data();
        const game = {
          gameId: data.GameId,
          avatar: data.Avatar,
          playerName: data.PlayerName,
          value: mapper(data[field]).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","),
        };
        if (data[field] > currentGame.value) {
          higherGames.push(game);
        } else if (game.playerName !== currentGame.playerName) {
          // when the game ends, they will be added to the list without this check ^
          // don't push the player on after they have completed their game
          lowerGames.push(game);
        }
      });
      setHigherGames(higherGames);
      setLowerGames(lowerGames);
    });
    return unsubscribe;
  }, [currentGame.playerName, currentGame.value, field, mapper]);

  return (
    <div className="">
      <div className="my-4">
        <center className="text-xl">
          {title}
        </center>
        <div className="px-6 py-4">
          {higherGames.map((game, index) => ({ ...game, place: index + 1 })).slice(-5).map((game => (<div key={game.gameId}>
            <div className="flex justify-start w-72">
              <span className="font-mono">
                {game.place < 10 && '0'}
                {game.place}
              </span>
              <div className="flex justify-between w-full">
                <Avatar avatar={game.avatar} />
                <div className="text-right">
                  <div>{game.playerName}</div>
                  <div className="font-mono">{game.value}  {units}</div>
                </div>
              </div>
            </div>
            <hr className="m-2" />
          </div>)))}
          <div className="flex -ml-[120px]">
            <div className="text-right bg-[#FBBC04]">
              {'Current Player'}
            </div>
            <hr className="m-2" />
            <div className="flex justify-start w-72">

              <span className="font-mono">
                {higherGames.length < 9 && '0'}
                {higherGames.length + 1}
              </span>
              <div className="flex justify-between w-full">
                <Avatar avatar={currentGame.avatar} />
                <div className="text-right">
                  <div>{currentGame.playerName}</div>
                  <div className="font-mono">{mapper(currentGame.value).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}  {units}</div>
                </div>
              </div>
            </div>
          </div>
          {lowerGames.map((game, index) => ({ ...game, place: higherGames.length + 2 + index })).map((game => (<div key={game.gameId}>
            <hr className="m-2" />
            <div className="flex justify-start w-72">
              <span className="font-mono">
                {game.place < 10 && '0'}
                {game.place}
              </span>
              <div className="flex justify-between w-full">
                <Avatar avatar={game.avatar} />
                <div className="text-right">
                  <div>{game.playerName}</div>
                  <div className="font-mono">{game.value} {units}</div>
                </div>
              </div>
            </div>
          </div>)))}
        </div>
      </div>
    </div>
  );
}
