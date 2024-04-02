'use client'

import { useEffect, useState } from "react";
import { completedGamesRef } from "../firebase";
import { average, getAggregateFromServer, onSnapshot, query } from "firebase/firestore";

export default function AverageScore() {
  const [gameLength, setGameLength] = useState<string | null>(null);
  useEffect(() => {
    const unsubscribe = onSnapshot(query(completedGamesRef), async () => {
      const gameLengthQueryResponse = await getAggregateFromServer(query(completedGamesRef), { averageScore: average('TotalScore') });
      const { averageScore } = gameLengthQueryResponse.data();
      if (averageScore) {
        setGameLength(Math.floor(averageScore).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
      }
    });
    return unsubscribe;
  }, []);

  if (gameLength === null) return 'Loading...';
  return gameLength;
}
