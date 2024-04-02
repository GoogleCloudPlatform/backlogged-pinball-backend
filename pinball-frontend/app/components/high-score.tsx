'use client'

import { useEffect, useState } from "react";
import { completedGamesRef } from "../firebase";
import { limit, onSnapshot, orderBy, query } from "firebase/firestore";
import AvatarCard from "@/app/components/avatar-card";

export default function HighScore() {
  const [highScore, setHighScore] = useState<string | null>(null);
  const [avatar, setAvatar] = useState<string>('beaver');
  const [playerName, setPlayerName] = useState<string>('Loading...');
  useEffect(() => {
    const highScoreQuery = query(completedGamesRef, orderBy('TotalScore', 'desc'), limit(1))
    const unsubscribe = onSnapshot(highScoreQuery, (querySnapshot) => {
      setAvatar(querySnapshot.docs[0].data().Avatar);
      setPlayerName(querySnapshot.docs[0].data().PlayerName);
      setHighScore(querySnapshot.docs[0].data().TotalScore.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
    });
    return unsubscribe;
  }, []);

  return <center>
    <AvatarCard
      avatar={avatar}
      playerName={playerName}
    />
    {highScore || 'Loading...'}
  </center>;
}
