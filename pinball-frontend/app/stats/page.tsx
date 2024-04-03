'use client'

import QRCodeLink from "../components/qr-code-link";
import StatsCard from "../components/stats-card";

export default function Stats() {
  return (
    <main className="grid grid-cols-6">
      <QRCodeLink url="https://goo.gle/backlogged-stats" />
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
    </main>
  );
}
