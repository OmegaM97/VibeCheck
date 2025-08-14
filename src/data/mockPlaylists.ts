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
  preview: string; // 30-sec playable URL
  link: string; // full song link (optional)
}

export interface Playlist {
  name: string;
  tracks: Track[];
}

// Example mock playlists per mood
export const MOCK_PLAYLISTS: Record<MoodKey, Playlist> = {
  happy: {
    name: "Happy Vibes",
    tracks: [
      {
        id: "1",
        title: "Happy Song 1",
        artist: "Artist A",
        cover: "https://picsum.photos/200/200?random=1",
        preview:
          "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
        link: "#",
      },
      {
        id: "2",
        title: "Happy Song 2",
        artist: "Artist B",
        cover: "https://picsum.photos/200/200?random=2",
        preview:
          "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
        link: "#",
      },
    ],
  },
  sad: {
    name: "Sad Vibes",
    tracks: [
      {
        id: "3",
        title: "Sad Song 1",
        artist: "Artist C",
        cover: "https://picsum.photos/200/200?random=3",
        preview:
          "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
        link: "#",
      },
    ],
  },
  relaxed: {
    name: "Relaxed Vibes",
    tracks: [
      {
        id: "4",
        title: "Chill Song 1",
        artist: "Artist D",
        cover: "https://picsum.photos/200/200?random=4",
        preview:
          "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
        link: "#",
      },
    ],
  },
  energetic: {
    name: "Energetic Vibes",
    tracks: [
      {
        id: "5",
        title: "Energy Song 1",
        artist: "Artist E",
        cover: "https://picsum.photos/200/200?random=5",
        preview:
          "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
        link: "#",
      },
    ],
  },
  focus: {
    name: "Focus Beats",
    tracks: [
      {
        id: "6",
        title: "Focus Song 1",
        artist: "Artist F",
        cover: "https://picsum.photos/200/200?random=6",
        preview:
          "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3",
        link: "#",
      },
    ],
  },
  anxious: {
    name: "Calm Anxiety",
    tracks: [
      {
        id: "7",
        title: "Calm Song 1",
        artist: "Artist G",
        cover: "https://picsum.photos/200/200?random=7",
        preview:
          "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3",
        link: "#",
      },
    ],
  },
  romantic: {
    name: "Romantic Vibes",
    tracks: [
      {
        id: "8",
        title: "Love Song 1",
        artist: "Artist H",
        cover: "https://picsum.photos/200/200?random=8",
        preview:
          "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3",
        link: "#",
      },
    ],
  },
  chill: {
    name: "Chill Vibes",
    tracks: [
      {
        id: "9",
        title: "Chill Song 2",
        artist: "Artist I",
        cover: "https://picsum.photos/200/200?random=9",
        preview:
          "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3",
        link: "#",
      },
    ],
  },
};
