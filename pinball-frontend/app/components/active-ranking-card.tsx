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

const yesterdayUtcTimestamp = getYesterdayTimestamp();

const twoDigitPad = (number: number) => {
  return ('0' + number).slice(-2);
}

export default function ActiveRankingCard({ title, field, units, mapper = returnInput, currentGame }: { title: string, field: string, units: string, mapper?: Function, currentGame: RawGame }) {
  const [topHundredRawGames, setTopHundredRawGames] = useState<RawGame[]>([]);
  const topHundredGames: Game[] = topHundredRawGames.filter((game) => game.playerName !== currentGame.playerName).map((rawGame, index) => {
    const higher = rawGame.value > currentGame.value;
    const numericPlace = higher ? index + 1 : index + 2;
    const place = twoDigitPad(numericPlace);
    const value = mapper(rawGame.value).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    return { ...rawGame, place, higher, value }
  });
  const higherGames = topHundredGames.filter(game => game.higher);
  const currentPlayerPlace = higherGames.length + 1;

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!currentGame.avatar) return '';

  return (
    <div className="-z-10 w-96 hidden lg:block">
      <div className="">
        {/* <center className="text-xl">
          {title}
        </center> */}
        <div className="absolute right-8 px-6 bg-white w-full transition-all duration-1000" style={{ height: `${(Math.min(6, currentPlayerPlace)) * 70 - 15}px` }}>
          <div className="absolute right-0 overflow-y-clip transition-all duration-1000" style={{ height: `${(Math.min(5, higherGames.length)) * 70}px` }}>
            {topHundredGames.map((game, index) => (
              <div key={game.gameId} className="absolute right-0 transition-all duration-1000" style={{ top: `${(index - Math.max(0, higherGames.length - 5)) * 70}px` }}>
                <div className="flex justify-start w-72">
                  <span className="font-mono">
                    {Number(game.place) < currentPlayerPlace ? game.place : twoDigitPad(currentPlayerPlace)}
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
              </div>
            ))}
          </div>
          <div className="absolute right-0 transition-all duration-1000 -py-2 bg-white z-10" style={{ top: `${Math.min(higherGames.length, 5) * 70}px` }}>
            <div className="absolute text-right bg-[#FBBC04] -ml-32">
              {'Current Player'}
            </div>
            <div className="flex justify-start w-72">
              <span className="font-mono">
                {higherGames.length < 9 && '0'}
                {currentPlayerPlace}
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
          <div className="absolute right-0 -z-50">
            {topHundredGames.map((game, index) => (
              <div key={game.gameId} className="absolute right-0 transition-all duration-1000 bg-white" style={{ top: `${(index - Math.max(-1, higherGames.length - 6)) * 70 - 15}px` }}>
                <hr className="m-2" />
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
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
