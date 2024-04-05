'use client'

import QRCodeLink from "../components/qr-code-link";
import StatsCard from "../components/stats-card";
import TotalGames from "../components/total-games";

export default function Stats() {
  return (
    <main>
      <QRCodeLink url="https://goo.gle/backlogged-stats" />
      <TotalGames />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-6">
        <StatsCard
          title="Score"
          field="TotalScore"
          units="points"
        />
        <StatsCard
          title="Game Length"
          field="GameLengthMilliseconds"
          mapper={(milliseconds: number) => Math.floor(milliseconds / 1000)}
          units="seconds"
        />
        <StatsCard
          title="Loops"
          field="LoopsHit"
          units="loops"
        />
        <StatsCard
          title="Targets"
          field="TargetsHit"
          units="hit"
        />
        <StatsCard
          title="Bugs"
          field="BugsSquashed"
          units="squashed"
        />
        <StatsCard
          title="PRs"
          field="PRsMerged"
          units="merged"
        />
      </div>
    </main>
  );
}
