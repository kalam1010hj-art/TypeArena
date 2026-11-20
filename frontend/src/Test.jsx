import React, { useState, useRef, useEffect, useReducer } from "react";
import {
  Clock3,
  RotateCcw,
  Activity,
  Target,
  Flag,
  Share2,
  Download,
  Keyboard,
} from "lucide-react";
import { durations, letters, Session } from "./engine";
import { modes, passage } from "./passages";
import { read, write } from "./storage";
import s from "./style.module.css";
export const durationName = (n) => (n < 60 ? n + "s" : n / 60 + "m");
function Chart({ samples, field, label }) {
  const values = samples.map((p) => p[field]);
  const max = field === "accuracy" ? 100 : Math.max(1, ...values);
  const points = values.map((v, i) =>
    [(samples[i].ms / samples.at(-1).ms) * 198, 46 - (v / max) * 42].join(","),
  );
  return (
    <figure>
      <figcaption>{label}</figcaption>
      <svg
        viewBox="0 0 200 50"
        role="img"
        aria-label={label + ": " + values.join(", ")}
      >
        <path d="M0 46H200 M0 24H200" stroke="currentColor" opacity=".15" />
        <polyline
          points={
            "0," + (46 - ((values[0] || 0) / max) * 42) + " " + points.join(" ")
          }
          fill="none"
          stroke="var(--accent)"
          strokeWidth="2"
        />
      </svg>
    </figure>
  );
}
function Results({ run, retry, fresh }) {
  const m = run.stats(performance.now());
  const [message, setMessage] = useState("");
  const summary =
    "TypeArena · " + m.net + " WPM · " + m.accuracy + "% accuracy";
  async function share() {
    try {
      if (navigator.share) await navigator.share({ text: summary });
      else await navigator.clipboard.writeText(summary);
      setMessage("Result shared or copied.");
    } catch {
      setMessage(summary);
    }
  }
  function save() {
    const a = document.createElement("a");
    const url = URL.createObjectURL(
      new Blob(
        [
          JSON.stringify(
            { statistics: m, samples: run.samples, mistakes: run.errors },
            null,
            2,
          ),
        ],
        { type: "application/json" },
      ),
    );
    a.href = url;
    a.download = "typearena-result.json";
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  return (
    <section className={s.panel}>
      <div className={s.panelTitle}>
        <Flag /> Session complete
      </div>
      <h2>{m.net} WPM</h2>
      <p>
        {m.accuracy >= 98
          ? "Precision finish"
          : m.accuracy >= 90
            ? "Steady finish"
            : "Accuracy practice"}{" "}
        · {(m.ms / 1000).toFixed(1)} seconds
      </p>
      <Metrics m={m} />
      <div className={s.charts}>
        <Chart samples={run.samples} field="net" label="Net WPM over time" />
        <Chart
          samples={run.samples}
          field="accuracy"
          label="Accuracy over time"
        />
      </div>
      <h3>Mistake distribution</h3>
      {Object.keys(run.errors).length ? (
        Object.entries(run.errors)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 10)
          .map(([c, n]) => (
            <span className={s.tag} key={c}>
              {c === " " ? "Space" : c} × {n}
            </span>
          ))
      ) : (
        <p>No mistyped characters.</p>
      )}
      <div className={s.actions}>
        <button onClick={retry}>Retry passage</button>
        <button onClick={fresh}>New test</button>
        <button onClick={share}>
          <Share2 size={15} /> Share
        </button>
        <button onClick={save}>
          <Download size={15} /> Save results
        </button>
      </div>
      <small role="status">{message}</small>
    </section>
  );
}
function Metrics({ m }) {
  return (
    <dl className={s.metrics}>
      {Object.entries({
        "Net WPM": m.net,
        "Gross WPM": m.gross,
        "Raw WPM": m.raw,
        Accuracy: m.accuracy + "%",
        Correct: m.correct,
        Incorrect: m.incorrect,
        Attempts: m.total,
        Consistency: m.consistency === null ? "—" : m.consistency + "%",
      }).map(([k, v]) => (
        <div key={k}>
          <dt>{k}</dt>
          <dd>{v}</dd>
        </div>
      ))}
    </dl>
  );
}
export default function Test({ initial = 30, quick = false }) {
  const [duration, setDuration] = useState(initial),
    [mode, setMode] = useState("Words"),
    [custom, setCustom] = useState(""),
    [value, setValue] = useState("");
  const [run, setRun] = useState(() => new Session(passage("Words"), initial)),
    [, render] = useReducer((n) => n + 1, 0);
  const field = useRef(),
    composing = useRef(false),
    saved = useRef(),
    [historyError, setHistoryError] = useState(false);
  function reset(
    seconds = duration,
    type = mode,
    text = passage(type, custom),
  ) {
    setValue("");
    setHistoryError(false);
    setRun(new Session(text, seconds));
  }
  useEffect(() => {
    function pause() {
      run.pause(performance.now());
      render();
    }
    function hide() {
      if (document.hidden) pause();
    }
    window.addEventListener("blur", pause);
    document.addEventListener("visibilitychange", hide);
    const id = setInterval(() => {
      if (run.since !== null) {
        run.tick(performance.now());
        render();
      }
    }, 100);
    return () => {
      clearInterval(id);
      window.removeEventListener("blur", pause);
      document.removeEventListener("visibilitychange", hide);
    };
  }, [run]);
  useEffect(() => {
    if (!run.done || saved.current === run) return;
    saved.current = run;
    const history = read("history", []);
    setHistoryError(
      !write(
        "history",
        [
          {
            ...run.stats(performance.now()),
            date: new Date().toISOString(),
            mode,
          },
          ...(Array.isArray(history) ? history : []),
        ].slice(0, 50),
      ),
    );
  }, [run.done, run, mode]);
  function apply(text) {
    if (mode !== "Custom" && run.target.length - run.input.length < 180) {
      run.target.push(...letters(" " + passage(mode)));
    }
    run.edit(text, performance.now());
    setValue(run.input.join(""));
    render();
  }
  const stats = run.stats(performance.now()),
    idx = run.input.length;
  // Render a bounded window even for long custom passages.
  const start = Math.floor(idx / 90) * 90;
  return (
    <div id={quick ? "quick-test" : "typing-workspace"}>
      {run.done ? (
        <>
          <Results
            run={run}
            retry={() => reset(duration, mode, run.target.join(""))}
            fresh={() => reset()}
          />
          {historyError && (
            <p>
              Device history is unavailable. Use Save results to keep a copy.
            </p>
          )}
        </>
      ) : (
        <section className={s.panel}>
          <div className={s.testhead}>
            <div className={s.panelTitle}>
              <Keyboard /> {quick ? "Quick typing test" : "Typing workspace"}
            </div>
            <span className={s.tag}>
              <Clock3 size={14} /> {Math.ceil((run.limit - stats.ms) / 1000)}s
            </span>
          </div>
          <div className={s.controls}>
            <label>
              Mode{" "}
              <select
                value={mode}
                onChange={(e) => {
                  setMode(e.target.value);
                  reset(duration, e.target.value);
                }}
              >
                {modes.map((m) => (
                  <option key={m}>{m}</option>
                ))}
              </select>
            </label>
            <div className={s.segments} aria-label="Duration">
              {durations.map((n) => (
                <button
                  aria-pressed={duration === n}
                  key={n}
                  onClick={() => {
                    setDuration(n);
                    reset(n);
                  }}
                >
                  {durationName(n)}
                </button>
              ))}
            </div>
          </div>
          {mode === "Custom" && (
            <label>
              Custom passage
              <textarea
                value={custom}
                maxLength={12000}
                onChange={(e) => {
                  setCustom(e.target.value);
                  reset(duration, mode, e.target.value.trim());
                }}
              />
            </label>
          )}
          <div
            className={s.prompt}
            dir="auto"
            onClick={() => field.current?.focus()}
          >
            {run.target.slice(start, start + 180).map((c, j) => {
              const i = j + start;
              return (
                <span
                  key={i}
                  className={
                    i === idx
                      ? s.cursor
                      : i < idx
                        ? run.input[i] === c
                          ? s.hit
                          : s.miss
                        : ""
                  }
                >
                  {c}
                </span>
              );
            })}
          </div>
          <textarea
            ref={field}
            rows="1"
            aria-label="Typing input"
            className={s.input}
            placeholder="Type here to start…"
            disabled={!run.target.length}
            autoComplete="off"
            autoCapitalize="off"
            autoCorrect="off"
            spellCheck={false}
            value={value}
            onPaste={(e) => e.preventDefault()}
            onDrop={(e) => e.preventDefault()}
            onCompositionStart={() => (composing.current = true)}
            onCompositionEnd={(e) => {
              composing.current = false;
              apply(e.currentTarget.value);
            }}
            onChange={(e) =>
              composing.current
                ? setValue(e.target.value)
                : apply(e.target.value)
            }
            onFocus={() => run.resume(performance.now())}
            onBlur={() => {
              run.pause(performance.now());
              render();
            }}
            onKeyDown={(e) => {
              if (e.key === "Escape") {
                reset();
                e.preventDefault();
              }
            }}
          />
          <div className={s.live}>
            <span>
              <Activity size={15} /> {stats.net} WPM
            </span>
            <span>
              <Target size={15} /> {stats.accuracy}% accuracy
            </span>
            <button onClick={() => reset()}>
              <RotateCcw size={15} /> Restart
            </button>
          </div>
          {!quick && (
            <>
              <Metrics m={stats} />
              <p className={s.note}>
                The clock starts on your first character. Leaving the input
                pauses it. Press Esc in the input to restart.
              </p>
            </>
          )}
        </section>
      )}
    </div>
  );
}
