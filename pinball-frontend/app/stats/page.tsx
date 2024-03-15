'use client'

import AverageGameLength from "../components/average-game-length";
import AverageScore from "../components/average-score";
import HighScore from "../components/high-score";
import LongestGameLength from "../components/longest-game-length";

export default function Stats() {
  return (
    <main className="grid grid-cols-2 p-24">
      <div className="border max-w-sm rounded overflow-hidden shadow-lg m-2">
        <div className="px-6 py-4 text-center">
          <div className="mb-2">High Score</div>
          <div className="font-bold text-4xl">
            <HighScore />
          </div>
          <div className="mb-2 -mt-2">points</div>
        </div>
      </div>
      <div className="border max-w-sm rounded overflow-hidden shadow-lg m-2">
        <div className="px-6 py-4 text-center">
          <div className="mb-2">Longest Game</div>
          <div className="font-bold text-4xl">
            <LongestGameLength />
          </div>
          <div className="mb-2 -mt-2">seconds</div>
        </div>
      </div>
      <div className="border max-w-sm rounded overflow-hidden shadow-lg m-2">
        <div className="px-6 py-4 text-center">
          <div className="mb-2">Average Score</div>
          <div className="font-bold text-4xl">
            <AverageScore />
          </div>
          <div className="mb-2 -mt-2">points</div>
        </div>
      </div>
      <div className="border max-w-sm rounded overflow-hidden shadow-lg m-2">
        <div className="px-6 py-4 text-center">
          <div className="mb-2">Average Game Length</div>
          <div className="font-bold text-4xl">
            <AverageGameLength />
          </div>
          <div className="mb-2 -mt-2">seconds</div>
        </div>
      </div>
    </main>
  );
}
