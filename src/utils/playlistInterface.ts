export type MoodKey =
  | "happy"
  | "sad"
  | "relaxed"
  | "energetic"
  | "focus"
  | "anxious"
  | "romantic"
  | "chill";

export interface Track {
  id: string;
  title: string;
  artist: string;
  cover: string;
  link: string;
}

export interface Playlist {
  name: string;
  tracks: Track[];
}
