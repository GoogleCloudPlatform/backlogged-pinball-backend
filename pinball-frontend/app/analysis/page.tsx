'use client'

import { doc, getDoc, collection, onSnapshot, orderBy, query, limit } from "firebase/firestore";
import { gameAnalysesRef } from "../firebase";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from 'next/navigation';
import QRCode from 'react-qr-code';

export default function GameAnalysis() {
  const searchParams = useSearchParams();
  const [analysis, setAnalysis] = useState<any>(null);
  const [gameId, setGameId] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnalysis = async () => {
      const gameIdParam = searchParams.get('gameId');

      if (gameIdParam) {
        try {
          const analysisDocRef = doc(gameAnalysesRef, gameIdParam);
          const analysisDocSnap = await getDoc(analysisDocRef);

          if (analysisDocSnap.exists()) {
            const analysisData = analysisDocSnap.data();
            setAnalysis(analysisData);

            const docId = analysisDocSnap.id;
            setGameId(docId);
          } else {
            console.log("No such document!");
          }
        } catch (error) {
          console.error("Error fetching analysis:", error);
        }
      } else {
        const analysesQuery = query(
          gameAnalysesRef,
          orderBy('insertionTimestamp', 'desc'),
          limit(1)
        );

        const unsubscribe = onSnapshot(analysesQuery, (querySnapshot) => {
          console.log("Query Snapshot:", querySnapshot);

          if (!querySnapshot.empty) {
            const latestAnalysis = querySnapshot.docs[0].data();
            console.log("Latest Analysis:", latestAnalysis);
            const docId = querySnapshot.docs[0].id;
            setGameId(docId);
            setAnalysis(latestAnalysis);
          } else {
            console.log("No analysis documents found.");
          }
        });

        return unsubscribe;
      }
    };

    fetchAnalysis();
  }, [searchParams]);

  if (!analysis) {
    return <div>Loading analysis...</div>;
  }

  const fieldOrder = ['headline', 'grade', 'analysis', 'tips'];
  return (
    <main className="flex min-h-screen flex-col justify-between overflow-x-hidden m-4">
      <div className="w-full">
        <h1 className="text-3xl font-bold mb-4">Game Analysis</h1>
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
        <div className="mt-4">
          <QRCode
            value={`https://pinball-frontend-404073014646.us-west3.run.app/analysis?gameId=${gameId}`}
            size={256}
            level="H"
          />
        </div>
      </div>
    </main>
  );
}