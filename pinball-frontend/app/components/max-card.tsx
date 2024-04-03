'use client'

import { useEffect, useState } from "react";
import { completedGamesRef } from "../firebase";
import { limit, onSnapshot, orderBy, query } from "firebase/firestore";
import Avatar from "@/app/components/avatar";

const returnInput = (value: number) => value;

export default function MaxCard({ title, field, units, mapper = returnInput }: { title: string, field: string, units:string, mapper?: Function }) {
  const [highScore, setHighScore] = useState<string>('Loading...');
  const [avatar, setAvatar] = useState<string>('beaver');
  const [playerName, setPlayerName] = useState<string>('Loading...');
  useEffect(() => {
    const highScoreQuery = query(completedGamesRef, orderBy(field, 'desc'), limit(1))
    const unsubscribe = onSnapshot(highScoreQuery, (querySnapshot) => {
      setAvatar(querySnapshot.docs[0].data().Avatar);
      setPlayerName(querySnapshot.docs[0].data().PlayerName);
      setHighScore(mapper(querySnapshot.docs[0].data()[field]).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ","));
    });
    return unsubscribe;
  }, []);

  return (
    <div className="flex justify-center border rounded overflow-hidden shadow-lg m-2 mx-auto w-56">
      <div className="px-6 py-4 text-center">
        <div className="mb-2">{title}</div>
        <div className="font-bold text-4xl">
          <center>
            <Avatar
              avatar={avatar}
              playerName={playerName}
            />
            {highScore || 'Loading...'}
          </center>
        </div>
        <div className="mb-2 -mt-2">{units}</div>
      </div>
    </div>
  );
}
