import { useState } from "react";
import type { NewDiaryEntry, Weather, Visibility } from "../types";
import { weatherValues, visibilityValues } from "../types";

interface Props {
  onCreate: (entry: NewDiaryEntry) => Promise<void>;
}

const NewDiaryForm = ({ onCreate }: Props) => {
  const [date, setDate] = useState<string>("");
  const [weather, setWeather] = useState<Weather>("sunny");
  const [visibility, setVisibility] = useState<Visibility>("good");
  const [comment, setComment] = useState<string>("");

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await onCreate({ date, weather, visibility, comment });

    setDate("");
    setWeather("sunny");
    setVisibility("good");
    setComment("");
  };

  return (
    <form onSubmit={submit}>
      <h2>Add new entry</h2>

      <div style={{ marginBottom: 8 }}>
        <label>
          date{" "}
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </label>
      </div>

      <div style={{ marginBottom: 8 }}>
        <div>weather</div>
        {weatherValues.map((w) => (
          <label key={w} style={{ marginRight: 12 }}>
            <input
              type="radio"
              name="weather"
              checked={weather === w}
              onChange={() => setWeather(w)}
            />
            {w}
          </label>
        ))}
      </div>

      <div style={{ marginBottom: 8 }}>
        <div>visibility</div>
        {visibilityValues.map((v) => (
          <label key={v} style={{ marginRight: 12 }}>
            <input
              type="radio"
              name="visibility"
              checked={visibility === v}
              onChange={() => setVisibility(v)}
            />
            {v}
          </label>
        ))}
      </div>

      <div style={{ marginBottom: 8 }}>
        <label>
          comment{" "}
          <input
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </label>
      </div>

      <button type="submit">add</button>
    </form>
  );
};

export default NewDiaryForm;
