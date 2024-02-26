// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

'use client'

import { useEffect, useState } from "react";
import { completedGamesRef } from "../firebase";
import { limit, onSnapshot, orderBy, query } from "firebase/firestore";

export default function LongestGameLength() {
  const [gameLength, setGameLength] = useState<number | null>(null);
  const gameLengthQuery = query(completedGamesRef, orderBy('gameLengthMilliseconds', 'desc'), limit(1));
  useEffect(() => {
    const unsubscribe = onSnapshot(gameLengthQuery, (querySnapshot) => {
      setGameLength(querySnapshot.docs[0].data().gameLengthMilliseconds);
    });
    return unsubscribe;
  });

  if (gameLength === null) return 'Loading...';
  return gameLength;
}
