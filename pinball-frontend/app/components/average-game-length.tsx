'use client'

import { useEffect, useState } from "react";
import { completedGamesRef } from "../firebase";
import { average, getAggregateFromServer, onSnapshot, query } from "firebase/firestore";

export default function AverageGameLength() {
  const [gameLength, setGameLength] = useState<number | null>(null);
  useEffect(() => {
    const unsubscribe = onSnapshot(query(completedGamesRef), async () => {
      const gameLengthQueryResponse = await getAggregateFromServer(query(completedGamesRef), { averageGameLength: average('gameLengthMilliseconds') });
      const { averageGameLength } = gameLengthQueryResponse.data();
      if (averageGameLength) {
        setGameLength(Math.floor(averageGameLength / 1000));
      }
    });
    return unsubscribe;
  }, []);

  if (gameLength === null) return 'Loading...';
  return gameLength;
}
