import { useEffect, useState } from "react";
import axios from "axios";
import type { NewDiaryEntry, NonSensitiveDiaryEntry } from "./types";
import { createDiary, getAllDiaries } from "./services/diaries";
import NewDiaryForm from "./components/NewDiaryForm";
import Notification from "./components/Notification";

const App = () => {
  const [diaries, setDiaries] = useState<NonSensitiveDiaryEntry[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getAllDiaries()
      .then(setDiaries)
      .catch((e: unknown) => {
        if (axios.isAxiosError(e)) {
          setError(e.message);
        } else {
          setError("Failed to fetch diaries");
        }
      });
  }, []);

  const showError = (message: string) => {
    setError(message);
    window.setTimeout(() => setError(null), 5000);
  };

  const addEntry = async (entry: NewDiaryEntry): Promise<void> => {
    try {
      const created = await createDiary(entry);
      const nonSensitive: NonSensitiveDiaryEntry = {
        id: created.id,
        date: created.date,
        weather: created.weather,
        visibility: created.visibility,
      };

      setDiaries((prev) => prev.concat(nonSensitive));
    } catch (e: unknown) {
      if (axios.isAxiosError(e)) {
        const backendMessage =
          typeof e.response?.data === "string" ? e.response.data : null;

        showError(backendMessage ?? e.message);
        return;
      }

      showError("Unknown error");
    }
  };

  return (
    <div>
      <h1>Flight diaries</h1>

      <Notification message={error} />

      <NewDiaryForm onCreate={addEntry} />

      <h2>Entries</h2>
      {diaries.map((d) => (
        <div key={d.id} style={{ marginBottom: 10 }}>
          <div>
            <strong>{d.date}</strong>
          </div>
          <div>visibility: {d.visibility}</div>
          <div>weather: {d.weather}</div>
        </div>
      ))}
    </div>
  );
};

export default App;
