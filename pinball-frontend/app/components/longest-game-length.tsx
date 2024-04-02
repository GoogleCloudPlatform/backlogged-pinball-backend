'use client'

import { useEffect, useState } from "react";
import { completedGamesRef } from "../firebase";
import { limit, onSnapshot, orderBy, query } from "firebase/firestore";
import AvatarCard from "@/app/components/avatar-card";

export default function LongestGameLength() {
  const [gameLength, setGameLength] = useState<string | null>(null);
  const [avatar, setAvatar] = useState<string>('beaver');
  const [playerName, setPlayerName] = useState<string>('Loading...');
  useEffect(() => {
    const gameLengthQuery = query(completedGamesRef, orderBy('GameLengthMilliseconds', 'desc'), limit(1));
    const unsubscribe = onSnapshot(gameLengthQuery, (querySnapshot) => {
      setAvatar(querySnapshot.docs[0].data().Avatar);
      setPlayerName(querySnapshot.docs[0].data().PlayerName);
      setGameLength(Math.floor(querySnapshot.docs[0].data().GameLengthMilliseconds / 1000).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
    });
    return unsubscribe;
  }, []);

  return <center>
    <AvatarCard
      avatar={avatar}
      playerName={playerName}
    />
    {gameLength || 'Loading...'}
  </center>;;
}
