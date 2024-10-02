'use client'

import { collection, onSnapshot, orderBy, query, limit } from "firebase/firestore";
import { gameAnalysesRef, completedGamesRef } from "../firebase";
import { useEffect, useState } from "react";

export default function GameAnalysis() {
  const [analysis, setAnalysis] = useState<any>(null); 

  useEffect(() => {
    const analysesQuery = query(
      gameAnalysesRef, 
      orderBy('insertionTimestamp', 'desc'), 
      limit(1)
    );

    const unsubscribe = onSnapshot(analysesQuery, (querySnapshot) => {
        console.log("Query Snapshot:", querySnapshot); // Log the querySnapshot
  
        if (!querySnapshot.empty) {
          const latestAnalysis = querySnapshot.docs[0].data();
          console.log("Latest Analysis:", latestAnalysis); // Log the retrieved analysis
          setAnalysis(latestAnalysis);
        } else {
          console.log("No analysis documents found."); // Log if no documents are found
        }
      });

    return unsubscribe; 
  }, []);

  if (!analysis) {
    return <div>Loading analysis...</div>;
  }

  // Extract the keys and values from the analysis object
  const analysisKeys = Object.keys(analysis);
  const analysisValues = Object.values(analysis);

  const fieldOrder = ['headline', 'grade', 'analysis', 'tips'];
  return (
    <main className="flex min-h-screen flex-col justify-between overflow-x-hidden m-4">
      <div className="w-full">
        <h1 className="text-3xl font-bold mb-4">Latest Game Analysis</h1>
        <table className="table-auto w-full">
          <tbody>
            {fieldOrder.map((key) => (
              <tr key={key} className="border-b border-gray-200">
                <td className="px-4 py-2 font-bold">{key}</td>
                <td className="px-4 py-2">
                  {typeof analysis[key] === 'object' ? (
                    <pre className="text-sm whitespace-pre-wrap">{JSON.stringify(analysis[key], null, 2)}</pre>
                  ) : (
                    analysis[key]
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}