'use client'

import { useEffect, useState } from "react";
import { completedGamesRef } from "../firebase";
import { limit, onSnapshot, orderBy, query } from "firebase/firestore";

export default function HighScore() {
  const [highScore, setHighScore] = useState<number | null>(null);
  const highScoreQuery = query(completedGamesRef, orderBy('totalScore', 'desc'), limit(1))
  useEffect(() => {
    const unsubscribe = onSnapshot(highScoreQuery, (querySnapshot) => {
      setHighScore(querySnapshot.docs[0].data().totalScore);
    });
    return unsubscribe;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (highScore === null) return 'Loading...';
  return highScore;
}
