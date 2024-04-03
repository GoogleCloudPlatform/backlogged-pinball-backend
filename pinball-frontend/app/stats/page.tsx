'use client'

import AverageCard from "../components/average-card";
import MaxCard from "../components/max-card";

export default function Stats() {
  return (
    <main className="grid grid-cols-6">
      <MaxCard
        title="High Score"
        field="TotalScore"
        units="points"
      />
      <MaxCard
        title="Longest Game"
        field="GameLengthMilliseconds"
        mapper={(milliseconds: number) => Math.floor(milliseconds / 1000)}
        units="seconds"
      />
      <MaxCard
        title="Most Loops"
        field="LoopsHit"
        units="loops"
      />
      <MaxCard
        title="Most Targets"
        field="TargetsHit"
        units="hit"
      />
      <MaxCard
        title="Most Bugs"
        field="BugsSquashed"
        units="squashed"
      />
      <MaxCard
        title="Most PRs"
        field="PRsMerged"
        units="merged"
      />
      <AverageCard
        title="Average Score"
        field="TotalScore"
        units="points"
      />
      <AverageCard
        title="Average Game Length"
        field="GameLengthMilliseconds"
        mapper={(milliseconds: number) => Math.floor(milliseconds / 1000)}
        units="seconds"
      />
      <AverageCard
        title="Average Loops"
        field="LoopsHit"
        units="loops"
      />
      <AverageCard
        title="Average Targets"
        field="TargetsHit"
        units="hit"
      />
      <AverageCard
        title="Average Bugs"
        field="BugsSquashed"
        units="squashed"
      />
      <AverageCard
        title="Average PRs"
        field="PRsMerged"
        units="merged"
      />
    </main>
  );
}
