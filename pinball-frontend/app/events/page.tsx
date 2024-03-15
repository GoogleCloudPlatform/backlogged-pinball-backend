'use client'

import { limit, onSnapshot, orderBy, query } from "firebase/firestore";
import { liveGameEventsRef } from "../firebase";
import { useEffect, useState } from "react";

type GameEvent = {
  id: string,
  gameId: string,
  machineId: string,
  pinballEventType: string,
}

export default function Stats() {
  const [gameEvents, setGameEvents] = useState<GameEvent[]>([]);
  const liveEventsQuery = query(liveGameEventsRef, orderBy('publishTime', 'desc'), limit(20))
  useEffect(() => {
    const unsubscribe = onSnapshot(liveEventsQuery, (querySnapshot) => {
      const gameEvents = querySnapshot.docs;
      console.log(gameEvents)
      setGameEvents(gameEvents.map((doc) => {
        const data = doc.data();
        console.log({data})
        debugger;
        return ({
          id: doc.data().messageId,
          gameId: doc.data().data.GameId,
          machineId: doc.data().attributes.MachineId,
          pinballEventType: doc.data().attributes.PinballEventType,
        })
      }));
    });
    return unsubscribe;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="relative overflow-x-auto">
        <table className="w-full text-sm text-left rtl:text-right">
          <thead className="text-xs uppercase">
            <tr>
              <th scope="col" className="px-6 py-3">
                Game Event
              </th>
              <th scope="col" className="px-6 py-3">
                Machine ID
              </th>
            </tr>
          </thead>
          <tbody>
            {gameEvents.map((gameEvent) => (
              <tr key={gameEvent.id} className="" >
                <th scope="row" className="px-6 py-4 font-medium whitespace-nowrap">
                  {gameEvent.pinballEventType}
                </th>
                <td className="px-6 py-4">
                  {gameEvent.machineId}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </main >
  );
}
