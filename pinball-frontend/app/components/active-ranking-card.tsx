'use client'

import { useEffect, useState } from "react";
import { completedGamesRef } from "../firebase";
import { limit, onSnapshot, orderBy, query, where } from "firebase/firestore";
import Avatar from "@/app/components/avatar";
import { getYesterdayTimestamp } from "@/app/utils/timestamp";

const returnInput = (value: number) => value;

type RawGame = {
  gameId: string,
  avatar: string,
  playerName: string,
  value: number,
}

type Game = {
  gameId: string,
  avatar: string,
  playerName: string,
  value: number,
  place: string,
  higher: boolean,
}

const defaultGames = [{
  gameId: '',
  avatar: 'beaver',
  playerName: 'Loading...',
  value: 0,
  place: '99',
  higher: false,
}];

const yesterdayUtcTimestamp = getYesterdayTimestamp();

const twoDigitPad = (number: number) => {
  return ('0' + number).slice(-2);
}

export default function ActiveRankingCard({ title, field, units, mapper = returnInput, currentGame }: { title: string, field: string, units: string, mapper?: Function, currentGame: RawGame }) {
  const [topHundredRawGames, setTopHundredRawGames] = useState<RawGame[]>(defaultGames);
  const topHundredGames: Game[] = topHundredRawGames.map((rawGame, index) => {
    const higher = rawGame.value > currentGame.value;
    const numericPlace = higher ? index + 1 : index + 2;
    const place = twoDigitPad(numericPlace);
    const value = mapper(rawGame.value).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    return {...rawGame, place, higher, value }
  });
  const higherGames = topHundredGames.filter(game => game.higher);
  const lowerGames = topHundredGames.filter(game => !game.higher && game.playerName !== currentGame.playerName);

  useEffect(() => {
    // limit to 98 to keep everything in 2 digits
    // 98 + 1 (for the player) is 99
    const maxValueQuery = query(completedGamesRef, where('utcTimestamp', '>', yesterdayUtcTimestamp), orderBy(field, 'desc'), limit(98))
    const unsubscribe = onSnapshot(maxValueQuery, (querySnapshot) => {
      const topHundredRawGames: RawGame[] = querySnapshot.docs.map(gameStats => {
        const data = gameStats.data();
        return {
          gameId: data.GameId,
          avatar: data.Avatar,
          playerName: data.PlayerName,
          value: data[field],
        };
      });
      setTopHundredRawGames(topHundredRawGames);
    });
    return unsubscribe;
  }, [field, mapper]);

  return (
    <div className="">
      <div className="my-4">
        <center className="text-xl">
          {title}
        </center>
        <div className="px-6 py-4">
          {higherGames.slice(-5).map((game => (<div key={game.gameId}>
            <div className="flex justify-start w-72">
              <span className="font-mono">
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
          {lowerGames.map((game => (<div key={game.gameId}>
            <hr className="m-2" />
            <div className="flex justify-start w-72">
              <span className="font-mono">
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
