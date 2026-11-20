export const info = {
  "/typing-speed-tips": [
    "Typing speed tips",
    "Build speed with a repeatable practice routine.",
    [
      [
        "Start with a baseline",
        "Take a one-minute words test at a comfortable pace. Write down your net WPM and accuracy. Use the same duration and mode when you compare another session.",
      ],
      [
        "Find the difficult transition",
        "Look at the mistake distribution after a test. If the same letter keeps appearing, copy a few words containing that letter into Custom mode. Repeat them slowly, then put them back into sentences.",
      ],
      [
        "Learn touch typing",
        "Place your index fingers on the raised marks on F and J. Try short groups of home-row letters with your eyes on the passage. Add one new key at a time and return to the home row between reaches.",
      ],
      [
        "Read your score",
        "One standard word equals five characters including spaces. Net WPM counts correct characters remaining, gross WPM counts all characters remaining, and raw WPM includes corrected attempts. Each count is divided by five and by active minutes. Accuracy uses all attempts. Consistency compares the variation in typing rates across timed samples.",
      ],
      [
        "Practice for a typing exam",
        "Choose a duration and copy a representative passage from your recruitment notice into Custom mode. Check the notice for its own scoring, language, keyboard and correction rules. Compare practice results across several attempts.",
      ],
    ],
  ],
  "/about": [
    "About TypeArena",
    "A keyboard-first space for deliberate typing practice.",
    [
      [
        "Our purpose",
        "Type Faster. Compete Smarter. Master Your Keyboard. TypeArena lets you measure speed, study errors and come back to a passage at your own pace.",
      ],
    ],
  ],
  "/contact": [
    "Contact TypeArena",
    "Send feedback about a passage, score or accessibility issue.",
    [
      [
        "Project feedback",
        "Open an issue in the TypeArena GitHub repository. Include the test mode, duration and browser so the maintainer can reproduce the problem. Issue reports are public.",
      ],
    ],
  ],
  "/privacy": [
    "Privacy policy",
    "How the guest typing workspace handles your data.",
    [
      [
        "Typing and results",
        "Guest tests run in your browser. Recent scores and your theme preference are saved on this device. Custom passages stay in the current page. Clearing site data removes saved history.",
      ],
      [
        "Hosting and sharing",
        "Your host receives normal page requests. Sharing or exporting a result sends the information to the destination you choose.",
      ],
    ],
  ],
  "/terms": [
    "Terms and conditions",
    "Terms for using the TypeArena practice tools.",
    [
      [
        "Using the platform",
        "Use the tools for personal practice. Submit custom text you have permission to use. Practice scores are estimates and are intended for learning.",
      ],
    ],
  ],
  "/cookies": [
    "Cookie policy",
    "Storage used by the typing workspace.",
    [
      [
        "Device preferences",
        "Guest mode uses local storage for your theme and your last 50 results. You can clear history from the history page. This release includes no advertising or analytics scripts.",
      ],
    ],
  ],
  "/disclaimer": [
    "Disclaimer",
    "Understand the scope of TypeArena practice results.",
    [
      [
        "Independent practice",
        "TypeArena is an independent practice project. Scores do not certify eligibility, employment or examination performance. Recruitment authorities define their own assessment rules.",
      ],
    ],
  ],
};
export const routing = {
  "/": [
    "TypeArena — Master Your Typing Speed",
    "Measure your typing speed, compare accuracy and practice at your own pace.",
  ],
  "/typing-test": [
    "Typing Speed Test",
    "Choose a duration and text mode, then review detailed speed and accuracy charts.",
  ],
  "/history": [
    "Your typing history",
    "Review recent typing results saved on this device.",
  ],
  ...Object.fromEntries(
    [1, 5, 10].map((n) => [
      "/typing-test/" + n + "-minute",
      [
        n + "-minute typing test",
        "Measure " +
          n +
          " minute" +
          (n > 1 ? "s" : "") +
          " of active typing with character-level feedback.",
      ],
    ]),
  ),
  ...Object.fromEntries(
    Object.entries(info).map(([url, [title, desc]]) => [url, [title, desc]]),
  ),
};
