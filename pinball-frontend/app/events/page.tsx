'use client'

import { limit, onSnapshot, query } from "firebase/firestore";
import { liveGameEventsRef } from "../firebase";
import { useEffect, useState } from "react";
import QRCodeLink from "@/app/components/qr-code-link";

type GameEvent = {
  messageId: string,
  gameId: string,
  machineId: string,
  pinballEventType: string,
  data: string,
}

export default function Stats() {
  const [gameEvents, setGameEvents] = useState<GameEvent[]>([]);
  useEffect(() => {
    const liveEventsQuery = query(liveGameEventsRef, limit(100));
    const unsubscribe = onSnapshot(liveEventsQuery, (querySnapshot) => {
      const gameEvents = querySnapshot.docs.map((doc) => {
        const { GameId, ...data } = doc.data().data; // remove GameId from data
        // sorts the keys so they are always printed in the same order
        const sortedData = JSON.stringify(data, Object.keys(data).sort(), 2);
        return ({
          messageId: doc.data().messageId,
          publishTime: doc.data().publishTime,
          gameId: doc.data().GameId,
          machineId: doc.data().MachineId,
          pinballEventType: doc.data().PinballEventType,
          data: sortedData,
        })
      });
      const sortedGameEvents = gameEvents.sort((a, b) => a.publishTime < b.publishTime ? 1 : -1)
      setGameEvents(sortedGameEvents);
    });
    return unsubscribe;
  }, []);

  const firstEvent = gameEvents.slice(0, 1)[0] || { machineId: '', gameId: '' };

  return (
    <main className="flex min-h-screen flex-col justify-between overflow-x-hidden">
      <QRCodeLink url="https://goo.gle/backlogged-events"/>
      <div className="w-full">
        <div>
          <span className="font-bold">Machine ID:</span>
          <span className="font-mono">{' '}{firstEvent.machineId}</span>
        </div>
        <div>
          <span className="font-bold">Game ID:</span>
          <span className="font-mono">{' '}{firstEvent.gameId}</span>
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
    </main >
  );
}
