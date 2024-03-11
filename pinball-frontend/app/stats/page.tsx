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

import AverageGameLength from "../components/average-game-length";
import AverageScore from "../components/average-score";
import HighScore from "../components/high-score";
import LongestGameLength from "../components/longest-game-length";


// Stats page for pinball game
export default function Stats() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div>
        {'High Score: '}
        <HighScore />
      </div>
      <div>
        {'Longest Game: '}
        <LongestGameLength />
      </div>
      <div>
        {'Average Score: '}
        <AverageScore />
      </div>
      <div>
        {'Average Game Length: '}
        <AverageGameLength />
      </div>
    </main>
  );
}
