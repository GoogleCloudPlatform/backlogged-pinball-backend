'use client'

import { useEffect, useState } from "react";
import { completedGamesRef } from "../firebase";
import { average, getAggregateFromServer, onSnapshot, query } from "firebase/firestore";

const returnInput = (value: number) => value;

export default function AverageCard({ title, field, units, mapper=returnInput }: { title: string, field: string, units:string, mapper?: Function }) {
  const [gameLength, setGameLength] = useState<string>('Loading...');
  useEffect(() => {
    const unsubscribe = onSnapshot(query(completedGamesRef), async () => {
      const gameLengthQueryResponse = await getAggregateFromServer(query(completedGamesRef), { averageGameLength: average(field) });
      const { averageGameLength } = gameLengthQueryResponse.data();
      if (averageGameLength) {
        setGameLength(Math.floor(mapper(averageGameLength)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
      }
    });
    return unsubscribe;
  }, []);
  return (
    <div className="flex justify-center border rounded overflow-hidden shadow-lg m-2 mx-auto w-56">
      <div className="px-6 py-4 text-center">
        <div className="mb-2">{title}</div>
        <div className="font-bold text-4xl">
          {gameLength}
        </div>
        <div className="mb-2 -mt-2">{units}</div>
      </div>
    </div>
  );
}
