'use client'

import { useEffect, useState } from "react";
import { completedGamesRef } from "../firebase";
import { count, getAggregateFromServer, onSnapshot, query, where } from "firebase/firestore";
import { getYesterdayTimestamp } from "@/app/utils/timestamp";

const yesterdayUtcTimestamp = getYesterdayTimestamp();

export default function TotalGames() {
  const [gameCount, setGameCount] = useState<string>('Loading...');

  useEffect(() => {
    const unsubscribe = onSnapshot(query(completedGamesRef), async () => {
      const gamesPlayedCount = await getAggregateFromServer(query(completedGamesRef, where('utcTimestamp', '>', yesterdayUtcTimestamp)), { gamesCount: count() });
      const { gamesCount } = gamesPlayedCount.data();
      if (gamesCount) {
        setGameCount(gamesCount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
      }
    });
    return unsubscribe;
  }, []);

  return (
    <div className="m-2">
      <center className="border rounded overflow-hidden shadow-lg mx-auto w-full align-text-bottom p-2">
          <div className="font-bold text-4xl font-mono pr-2">
            {gameCount}
          </div>
          <div className="font-bold align-baseline h-full  align-text-bottom">games played in the past 24 hours</div>
      </center>
    </div>
  );
}
