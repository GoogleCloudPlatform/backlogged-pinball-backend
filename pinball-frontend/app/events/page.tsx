'use client'

import { limit, onSnapshot, orderBy, query, where } from "firebase/firestore";
import { liveGameEventsRef } from "../firebase";
import { useEffect, useState } from "react";

type GameEvent = {
  messageId: string,
  gameId: string,
  machineId: string,
  pinballEventType: string,
  data: string,
}

export default function Stats() {
  const [gameEvents, setGameEvents] = useState<GameEvent[]>([]);
  const [showReal, setShowReal] = useState(true);
  const [showSimulated, setShowSimulated] = useState(true);
  useEffect(() => {
    const liveEventsQuery = query(liveGameEventsRef, where('Simulated', 'in', [showReal ? 'False' : '', showSimulated ? 'True' : '']), limit(100));
    const unsubscribe = onSnapshot(liveEventsQuery, (querySnapshot) => {
      const gameEvents = querySnapshot.docs.map((doc) => {
        const { GameId, ...data } = doc.data().data; // remove GameId from data
        // sorts the keys so they are always printed in the same order
        const sortedData = JSON.stringify(data, Object.keys(data).sort());
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
  }, [showReal, showSimulated]);

  return (
    <main className="flex min-h-screen flex-col justify-between overflow-x-hidden">
      <div className="w-full">
        <div className="flex justify-around p-12">
          <label>
            <input
              type="checkbox"
              checked={showReal}
              onChange={(event) => setShowReal(event.target.checked)}
            />
            Show Real
          </label>
          <label>
            <input
              type="checkbox"
              checked={showSimulated}
              onChange={(event) => setShowSimulated(event.target.checked)}
            />
            Show Simulated
          </label>
        </div>
        <table className="w-full text-left text-xs font-thin">
          <thead>
            <tr>
              <th scope="col" className="px-6 py-3">
                Message ID
              </th>
              <th scope="col" className="px-6 py-3">
                Machine ID
              </th>
              <th scope="col" className="px-6 py-3">
                Game ID
              </th>
              <th scope="col" className="px-6 py-3">
                Game Event
              </th>
              <th scope="col" className="px-6 py-3">
                Event Data
              </th>
            </tr>
          </thead>
          <tbody>
            {gameEvents.map((gameEvent) => (
              <tr key={gameEvent.messageId} className="" >
                <td scope="row" className="px-6 py-4 whitespace-nowrap">
                  {gameEvent.messageId}
                </td>
                <td className="px-6 py-4">
                  {gameEvent.machineId}
                </td>
                <td className="px-6 py-4">
                  {gameEvent.gameId}
                </td>
                <td scope="row" className="px-6 py-4 font-medium whitespace-nowrap text-xl">
                  {gameEvent.pinballEventType}
                </td>
                <td scope="row" className="px-6 py-4 font-medium whitespace-nowrap text-xl">
                  {gameEvent.data}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main >
  );
}
