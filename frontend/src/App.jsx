import React, { useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import {
  ArrowRight,
  ArrowUpRight,
  AudioLines,
  BookOpen,
  Clock3,
  Gauge,
  History,
  Keyboard,
  Menu,
  Moon,
  Sun,
  Timer,
  X,
  Zap,
} from "lucide-react";
import Test from "./Test";
import { info, routing } from "./pages";
import { read, write } from "./storage";
import s from "./style.module.css";
const nav = [
  ["/", "Home"],
  ["/typing-test", "Typing test"],
  ["/history", "History"],
  ["/typing-speed-tips", "Typing tips"],
];
function Brand() {
  return (
    <Link to="/" className={s.brand}>
      <span>
        <AudioLines size={22} />
      </span>
      Type<b>Arena</b>
    </Link>
  );
}
function Board() {
  const [active, setActive] = useState("F");
  useEffect(() => {
    function key(e) {
      if (e.key.length === 1) setActive(e.key.toUpperCase());
    }
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, []);
  return (
    <div
      className={s.art}
      role="img"
      aria-label="Violet mechanical keyboard with glowing keys that respond to typing"
    >
      <div className={s.halo} />
      <div className={s.board}>
        {["1234567890", "QWERTYUIOP", "ASDFGHJKL", "ZXCVBNM"].map((row, i) => (
          <div className={s.keyrow} key={row}>
            <i>{["esc", "tab", "⇪", "⇧"][i]}</i>
            {row.split("").map((k) => (
              <i
                key={k}
                data-lit={
                  k === active ? "on" : "ASDJ".includes(k) ? "mid" : "off"
                }
              >
                {k}
              </i>
            ))}
            <i>{["⌫", "↵", "↵", "⇧"][i]}</i>
          </div>
        ))}
        <div className={s.keyrow}>
          <i>ctrl</i>
          <i>alt</i>
          <i className={s.space}>TYPEARENA</i>
          <i>alt</i>
          <i>fn</i>
        </div>
      </div>
      <span className={s.artLabel}>
        <i /> KEY INPUT ONLINE
      </span>
    </div>
  );
}
const circuits = [
  [
    Zap,
    "Sprint",
    "15 seconds",
    "A short burst of speed. Find your rhythm in fifteen seconds.",
    "/typing-test?seconds=15",
  ],
  [
    Timer,
    "Classic",
    "1 minute",
    "Set your baseline with a balanced minute of focused typing.",
    "/typing-test/1-minute",
  ],
  [
    Gauge,
    "Endurance",
    "5 minutes",
    "Hold a steady pace across a longer stretch of text.",
    "/typing-test/5-minute",
  ],
];
function Home() {
  return (
    <>
      <section className={s.hero}>
        <div>
          <div className={s.eyebrow}>
            <i /> TYPING PERFORMANCE LAB
          </div>
          <h1>
            Master Your
            <br />
            <em>Typing Speed.</em>
          </h1>
          <p>
            Practice your rhythm, sharpen your accuracy, and put your keyboard
            skills to the test.
          </p>
          <div className={s.actions}>
            <Link className={s.primary} to="/typing-test">
              <Keyboard size={18} /> Start Typing Test <ArrowRight size={16} />
            </Link>
            <a href="#circuits">
              Explore challenges <ArrowUpRight size={16} />
            </a>
          </div>
        </div>
        <Board />
      </section>
      <section id="circuits">
        <div className={s.heading}>
          <h2>Pick your challenge</h2>
          <span>Timed sessions</span>
        </div>
        <div className={s.cards}>
          {circuits.map(([Icon, title, duration, desc, path], i) => (
            <Link data-color={i} key={title} to={path}>
              <div className={s.cardTop}>
                <span className={s.icon}>
                  <Icon />
                </span>
                <small>{duration}</small>
              </div>
              <h3>
                {title}
                <ArrowUpRight size={17} />
              </h3>
              <p>{desc}</p>
            </Link>
          ))}
        </div>
      </section>
      <Test quick />
      <section className={s.guide}>
        <BookOpen />
        <div>
          <h2>Build a steadier rhythm</h2>
          <p>Use your mistake distribution to choose what to practice next.</p>
        </div>
        <Link to="/typing-speed-tips">
          Read typing tips <ArrowRight size={16} />
        </Link>
      </section>
      <section>
        <h2>Common questions</h2>
        {[
          [
            "How is speed measured?",
            "Five correct characters count as one standard word. Net WPM divides that count by active minutes.",
          ],
          [
            "Can I practice without an account?",
            "Yes. Your recent results stay in this browser.",
          ],
          [
            "What happens when I switch tabs?",
            "Your test pauses. Focus the typing input or resume typing to continue.",
          ],
        ].map(([q, a]) => (
          <details key={q}>
            <summary>{q}</summary>
            <p>{a}</p>
          </details>
        ))}
      </section>
    </>
  );
}
function HistoryPage() {
  const [rows, setRows] = useState(() => read("history", []));
  return (
    <>
      <h1>Your typing history</h1>
      <p>Recent sessions on this device.</p>
      {rows.length ? (
        <>
          <div className={s.panel}>
            {rows.map((r, i) => (
              <p key={i}>
                <b>{r.net} WPM</b> · {r.accuracy}% accuracy · {r.mode} ·{" "}
                {new Date(r.date).toLocaleString()}
              </p>
            ))}
          </div>
          <button
            onClick={() => {
              if (
                confirm("Clear all typing results on this device?") &&
                write("history", [])
              )
                setRows([]);
            }}
          >
            Clear history
          </button>
        </>
      ) : (
        <div className={s.panel}>
          <History />
          <h2>Your first session starts here</h2>
          <Link to="/typing-test">Start a typing test →</Link>
        </div>
      )}
    </>
  );
}
export default function App() {
  const { pathname, search } = useLocation(),
    [menu, setMenu] = useState(false),
    [theme, setTheme] = useState(() => read("theme", "dark"));
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    write("theme", theme);
  }, [theme]);
  useEffect(() => {
    setMenu(false);
    window.scrollTo(0, 0);
    const meta = routing[pathname] || [
      "Page not found",
      "This page is unavailable.",
    ];
    document.title = meta[0];
    document
      .querySelector("meta[name=description]")
      ?.setAttribute("content", meta[1]);
    for (const [key, v] of [
      ["og:title", meta[0]],
      ["og:description", meta[1]],
      ["og:url", location.origin + pathname],
    ])
      document
        .querySelector('meta[property="' + key + '"]')
        ?.setAttribute("content", v);
    document
      .querySelector("link[rel=canonical]")
      ?.setAttribute(
        "href",
        (import.meta.env.VITE_SITE_URL || location.origin).replace(/\/$/, "") +
          pathname,
      );
  }, [pathname, search]);
  let content;
  if (pathname === "/") content = <Home />;
  else if (pathname === "/history") content = <HistoryPage />;
  else if (routing[pathname] && pathname.startsWith("/typing-test")) {
    const initial =
      Number(pathname.match(/(\d+)-minute/)?.[1]) * 60 ||
      (search === "?seconds=15" ? 15 : 30);
    content = (
      <>
        <div className={s.eyebrow}>
          <Clock3 size={14} /> TIMED SESSION
        </div>
        <h1>{routing[pathname][0]}</h1>
        <p>{routing[pathname][1]}</p>
        <Test key={pathname + search} initial={initial} />
      </>
    );
  } else if (info[pathname]) {
    const [title, desc, sections] = info[pathname];
    content = (
      <article className={s.article}>
        <h1>{title}</h1>
        <p>{desc}</p>
        {sections.map(([h, p]) => (
          <section key={h}>
            <h2>{h}</h2>
            <p>{p}</p>
          </section>
        ))}
        {pathname === "/contact" && (
          <a href="https://github.com/kalam1010hj-art/TypeArena/issues">
            Open project feedback ↗
          </a>
        )}
      </article>
    );
  } else
    content = (
      <>
        <h1>Page not found</h1>
        <Link to="/">Return home →</Link>
      </>
    );
  return (
    <>
      <a className={s.skip} href="#main">
        Skip to content
      </a>
      <header>
        <div className={s.header}>
          <Brand />
          <nav aria-label="Main navigation" data-open={menu}>
            {nav.map(([p, t]) => (
              <NavLink end={p === "/"} key={p} to={p}>
                {t}
              </NavLink>
            ))}
          </nav>
          <div className={s.navtools}>
            <button
              aria-label="Switch theme"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button
              className={s.mobile}
              aria-label="Toggle menu"
              aria-expanded={menu}
              onClick={() => setMenu(!menu)}
            >
              {menu ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </header>
      <main id="main">{content}</main>
      <footer>
        <div>
          <Brand />
          <p>Type Faster. Compete Smarter. Master Your Keyboard.</p>
        </div>
        <div>
          {Object.entries(info).map(([p, [t]]) => (
            <Link key={p} to={p}>
              {t}
            </Link>
          ))}
          <Link to="/typing-test/10-minute">10-minute test</Link>
        </div>
      </footer>
    </>
  );
}
