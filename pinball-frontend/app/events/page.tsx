'use client'

import { limit, onSnapshot, orderBy, query } from "firebase/firestore";
import { liveGameEventsRef } from "../firebase";
import { useEffect, useState } from "react";
import QRCodeLink from "@/app/components/qr-code-link";
import ActiveRankingCard from "../components/active-ranking-card";
import { getNowTimestamp } from "../utils/timestamp";

type GameEvent = {
  messageId: string,
  pinballEventType: string,
  dataString: string,
  gameLengthMilliseconds: number,
  utcTimestamp: number,
  data: any,
}

export default function Stats() {
  const [gameEvents, setGameEvents] = useState<GameEvent[]>([]);
  const [gameStartEvent, setGameStartEvent] = useState<GameEvent | null>(null);
  const gameStartTimestamp = gameStartEvent?.utcTimestamp || getNowTimestamp();
  const [timeElapsedMillis, setTimeElapsedMillis] = useState(0);
  const [machineId, setMachineId] = useState('');
  const [gameId, setGameId] = useState('');
  const lastPrEvent = gameEvents.find((gameEvent) => gameEvent?.data?.BacklogName === 'PR');
  const prCount = lastPrEvent ? lastPrEvent.data.BacklogCount : gameStartEvent ? gameStartEvent.data.InitialPRCount : 0;
  const lastBugEvent = gameEvents.find((gameEvent) => gameEvent?.data?.BacklogName === 'Bug');
  const bugCount = lastBugEvent ? lastBugEvent.data.BacklogCount : gameStartEvent ? gameStartEvent.data.InitialBugCount : 0;
  const lastBallDrainEvent = gameEvents.find((gameEvent) => gameEvent.pinballEventType === 'BallDrained');
  const ballDrainCount = lastBallDrainEvent ? lastBallDrainEvent.data.TotalDrains : 0;
  const lastBallLaunchEvent = gameEvents.find((gameEvent) => gameEvent.pinballEventType === 'BallLaunched');
  const ballLaunchCount = lastBallLaunchEvent ? lastBallLaunchEvent.data.LaunchedBallCount : 0;
  const lastLoopHitEvent = gameEvents.find((gameEvent) => gameEvent.pinballEventType === 'LoopHit');
  const loopHitCount = lastLoopHitEvent ? lastLoopHitEvent.data.TotalLoops : 0;
  const [currentGame, setCurrentGame] = useState({
    gameId: 'CURRENT_GAME',
    playerName: '',
    avatar: '',
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
    const liveEventsQuery = query(liveGameEventsRef, orderBy('publishTime', 'desc'), limit(1000));
    const unsubscribe = onSnapshot(liveEventsQuery, (querySnapshot) => {
      const gameEvents = querySnapshot.docs.map((doc) => {
        const { GameId, ...data } = doc.data().data; // remove GameId from data
        // sorts the keys so they are always printed in the same order
        const dataString = JSON.stringify(data, Object.keys(data).sort(), 2);
        const pinballEventType = doc.data().PinballEventType;
        const utcTimestamp = doc.data().utcTimestamp;
        if (doc.data().MachineId) {
          setMachineId(doc.data().MachineId);
        }
        if (doc.data().GameId) {
          setGameId(doc.data().GameId);
        }
        const gameEvent = {
          messageId: doc.data().messageId,
          publishTime: doc.data().publishTime,
          pinballEventType,
          utcTimestamp,
          gameLengthMilliseconds: data.GameLengthMilliseconds,
          dataString,
          data,
        };
        if (pinballEventType === 'GameStarted') {
          console.log({ docData: doc.data() })
          setGameStartEvent(gameEvent)
          setCurrentGame({
            ...currentGame,
            playerName: data.PlayerName,
            avatar: data.Avatar,
          });
        }
        return gameEvent;
      });
      setGameEvents(gameEvents);
    });
    return unsubscribe;
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
          <div className="grid grid-cols-2 xl:grid-cols-3">
            <div>
              <span className="font-bold">Game Events:</span>
              <span className="font-mono">{' '}{gameEvents.length}</span>
            </div>
            <div>
              <span className="font-bold">PR Count:</span>
              <span className="font-mono">{' '}{prCount}</span>
            </div>
            <div>
              <span className="font-bold">Bug Count:</span>
              <span className="font-mono">{' '}{bugCount}</span>
            </div>
            <div>
              <span className="font-bold">Ball Drain Count:</span>
              <span className="font-mono">{' '}{ballDrainCount}</span>
            </div>
            <div>
              <span className="font-bold">Launched Ball Count:</span>
              <span className="font-mono">{' '}{ballLaunchCount}</span>
            </div>
            <div>
              <span className="font-bold">Loop Hit Count:</span>
              <span className="font-mono">{' '}{loopHitCount}</span>
            </div>
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
                      {gameEvent.dataString}
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
