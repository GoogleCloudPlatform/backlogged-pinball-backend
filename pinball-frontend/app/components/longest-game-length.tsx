'use client'

import { useEffect, useState } from "react";
import { completedGamesRef } from "../firebase";
import { limit, onSnapshot, orderBy, query } from "firebase/firestore";

export default function LongestGameLength() {
  const [gameLength, setGameLength] = useState<number | null>(null);
  const gameLengthQuery = query(completedGamesRef, orderBy('gameLengthMilliseconds', 'desc'), limit(1));
  useEffect(() => {
    const unsubscribe = onSnapshot(gameLengthQuery, (querySnapshot) => {
      setGameLength(Math.floor(querySnapshot.docs[0].data().gameLengthMilliseconds / 1000));
    });
    return unsubscribe;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (gameLength === null) return 'Loading...';
  return gameLength;
}
