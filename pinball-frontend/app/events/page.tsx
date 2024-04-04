'use client'

import { limit, onSnapshot, query } from "firebase/firestore";
import { liveGameEventsRef } from "../firebase";
import { useEffect, useState } from "react";
import QRCodeLink from "@/app/components/qr-code-link";
import ActiveRankingCard from "../components/active-ranking-card";
import { getNowTimestamp } from "../utils/timestamp";

type GameEvent = {
  messageId: string,
  pinballEventType: string,
  data: string,
  gameLengthMilliseconds: number,
  utcTimestamp: number,
}

export default function Stats() {
  const [gameEvents, setGameEvents] = useState<GameEvent[]>([]);
  const [gameStartTimestamp, setGameStartTimestamp] = useState(0);
  const [timeElapsedMillis, setTimeElapsedMillis] = useState(0);
  const [machineId, setMachineId] = useState('');
  const [gameId, setGameId] = useState('');
  const [currentGame, setCurrentGame] = useState({
    gameId: 'CURRENT_GAME',
    playerName: 'Current Game',
    avatar: 'beaver',
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const gameEndEvent = gameEvents.find((gameEvent) => (gameEvent.pinballEventType === 'GameEnded'));
      if (gameEndEvent) {
        setTimeElapsedMillis(gameEndEvent.gameLengthMilliseconds);
      } else if (gameStartTimestamp) {
        const now = getNowTimestamp();
        setTimeElapsedMillis(now - gameStartTimestamp);
      } else {
        setTimeElapsedMillis(0);
      }
    }, 1000);

    //Clearing the interval
    return () => clearInterval(interval);
  }, [gameEvents, gameStartTimestamp, timeElapsedMillis]);

  useEffect(() => {
    const liveEventsQuery = query(liveGameEventsRef, limit(100));
    const unsubscribe = onSnapshot(liveEventsQuery, (querySnapshot) => {
      const gameEvents = querySnapshot.docs.map((doc) => {
        const { GameId, ...data } = doc.data().data; // remove GameId from data
        // sorts the keys so they are always printed in the same order
        const sortedData = JSON.stringify(data, Object.keys(data).sort(), 2);
        const pinballEventType = doc.data().PinballEventType;
        const utcTimestamp = doc.data().utcTimestamp;
        if (doc.data().MachineId) {
          setMachineId(doc.data().MachineId);
        }
        if (doc.data().GameId) {
          setGameId(doc.data().GameId);
        }
        if (pinballEventType === 'GameStarted') {
          console.log({docData: doc.data()})
          setGameStartTimestamp(utcTimestamp);
          setCurrentGame({
            ...currentGame,
            playerName: data.PlayerName,
            avatar: data.Avatar,
          });
        }
        return ({
          messageId: doc.data().messageId,
          publishTime: doc.data().publishTime,
          pinballEventType,
          utcTimestamp,
          gameLengthMilliseconds: data.GameLengthMilliseconds,
          data: sortedData,
        })
      });
      const sortedGameEvents = gameEvents.sort((a, b) => a.publishTime < b.publishTime ? 1 : -1)
      setGameEvents(sortedGameEvents);
    });
    return unsubscribe;
  }, []);

  return (
    <main className="flex min-h-screen flex-col justify-between overflow-x-hidden">
      <QRCodeLink url="https://goo.gle/backlogged-events" />
      <div className="flex">
        <div className="w-full">
          <div>
            <span className="font-bold">Machine ID:</span>
            <span className="font-mono">{' '}{machineId}</span>
          </div>
          <div>
            <span className="font-bold">Game ID:</span>
            <span className="font-mono">{' '}{gameId}</span>
          </div>
          <table className="text-left font-thin m-2">
            <thead>
              <tr>
                <th scope="col" className="px-6 py-3 w-[10ch]">
                  Message ID
                </th>
                <th scope="col" className="px-6 py-3 w-[20ch]">
                  Game Event
                </th>
                <th scope="col" className="px-6 py-3">
                  Event Data
                </th>
              </tr>
            </thead>
            <tbody>
              {gameEvents.map((gameEvent) => (
                <tr key={gameEvent.messageId} className="border border-t-1 border-b-0 border-l-0 border-r-0" >
                  <td scope="row" className="px-6 py-4 whitespace-nowrap font-mono text-xs">
                    {gameEvent.messageId}
                  </td>
                  <td scope="row" className="px-6 py-4 font-medium whitespace-nowrap text-xl font-mono">
                    {gameEvent.pinballEventType}
                  </td>
                  <td scope="row" className="px-6 py-4 whitespace-nowrap font-mono text-xl">
                    <pre>
                      {gameEvent.data}
                    </pre>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <ActiveRankingCard
          title="Game Length Leader Board"
          field="GameLengthMilliseconds"
          mapper={(milliseconds: number) => Math.floor(milliseconds / 1000)}
          units="seconds"
          currentGame={{
            ...currentGame,
            value: timeElapsedMillis,
          }}
        />
      </div>
    </main >
  );
}
