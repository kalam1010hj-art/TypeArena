const words =
  "river pulse window prism field code violet orbit lane echo silver drift signal rhythm keyboard focus bloom light paper forest glacier planet trail drive velvet lunar rhythm cloud bright tide quiet grain spark glow wind path coast city edge".split(
    " ",
  );
const lines = {
  Sentences: [
    "Leave a little space between each word.",
    "Rain drummed softly on the station roof.",
    "A good rhythm starts with an easy pace.",
    "The last train rolled past the empty platform.",
    "I saved a seat beside the window.",
  ],
  Paragraphs: [
    "The town woke slowly under a blanket of mist. At the corner shop a light came on. Someone wheeled a bicycle down the lane and the morning began.",
    "At dusk we climbed the hill above the harbor. Beyond the last bend the wind grew still, and we could hear the boats moving against the pier.",
  ],
  Punctuation: [
    "Ready, set, go!",
    "Wait... is that yours?",
    "Bring pens, paper, and clips.",
    "Yes: one more try.",
  ],
  Quotes: [
    "“A quiet minute can change the pace of a day.”",
    "“Every path begins beneath your feet.”",
    "“Leave space for the next good idea.”",
  ],
  Code: [
    "const total = values.reduce((sum, n) => sum + n, 0);",
    "def square(number): return number ** 2",
    "if (ready) { startTimer(); }",
  ],
};
export const modes = [
  "Words",
  "Sentences",
  "Paragraphs",
  "Numbers",
  "Punctuation",
  "Quotes",
  "Custom",
  "Code",
];
export function passage(mode, custom = "") {
  if (mode === "Custom") return custom.trim();
  const tokens = lines[mode] || words;
  return Array.from(
    { length: mode === "Numbers" || mode === "Words" ? 180 : 16 },
    () =>
      mode === "Numbers"
        ? String(Math.floor(Math.random() * 10000))
        : tokens[Math.floor(Math.random() * tokens.length)],
  ).join(" ");
}
