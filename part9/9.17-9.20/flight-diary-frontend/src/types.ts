export const weatherValues = ["sunny", "rainy", "cloudy", "stormy", "windy"] as const;
export type Weather = (typeof weatherValues)[number];

export const visibilityValues = ["great", "good", "ok", "poor"] as const;
export type Visibility = (typeof visibilityValues)[number];

export interface DiaryEntry {
  id: number;
  date: string;
  weather: Weather;
  visibility: Visibility;
  comment: string;
}

export type NewDiaryEntry = Omit<DiaryEntry, "id">;

export type NonSensitiveDiaryEntry = Omit<DiaryEntry, "comment">;
