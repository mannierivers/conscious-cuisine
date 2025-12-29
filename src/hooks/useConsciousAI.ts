import { useState } from 'react';

export function useConsciousAI() {
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<string | null>(null);

  const getAnalysis = async (recipe: any, medicalHistory: string[], userName: string) => {
    setLoading(true);
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recipe, medicalHistory, userName }),
      });
      const data = await response.json();
      setAnalysis(data.analysis);
    } catch (err) {
      console.error("Error fetching AI analysis:", err);
    } finally {
      setLoading(false);
    }
  };

  return { getAnalysis, analysis, loading };
}