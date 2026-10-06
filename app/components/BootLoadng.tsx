"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

const MEMORY_TOTAL = 65536;

const wait = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

const DETECT_LINES: { text: string; delay: number }[] = [
  { text: "", delay: 200 },
  { text: "Detecting Primary Master ... Projects HDD", delay: 500 },
  { text: "Detecting Primary Slave  ... Skills CD-ROM", delay: 1000 },
  { text: "Detecting Secondary Master ... None", delay: 400 },
  { text: "", delay: 200 },
  { text: "Loading Windows 2000 ...", delay: 600 },
];

export function BootLoading() {
  const [memory, setMemory] = useState(0);
  const [lines, setLines] = useState<string[]>([]);
  const [date, setDate] = useState("");

  function formatBiosDate(d: Date) {
    const mm = String(d.getMonth() + 1).padStart(2, "0"); // months start at 0
    const dd = String(d.getDate()).padStart(2, "0");
    const yy = String(d.getFullYear()).slice(-2);
    return `${mm}/${dd}/${yy}`;
  }
  useEffect(() => {
    setDate(formatBiosDate(new Date()));
  }, []);

  useEffect(() => {
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    let cancelled = false;

    (async () => {
      // 1. Memory test
      const steps = reduced ? 1 : 24;
      for (let i = 1; i <= steps; i++) {
        if (cancelled) return;
        setMemory(Math.round((MEMORY_TOTAL * i) / steps));
        if (!reduced) await wait(40);
      }

      // 2. Detection lines, one at a time
      for (const line of DETECT_LINES) {
        if (!reduced) await wait(line.delay);
        if (cancelled) return;
        setLines((prev) => [...prev, line.text]);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const memoryDone = memory === MEMORY_TOTAL;

  return (
    <div className="bios" role="status" aria-live="polite" aria-label="Loading">
      <div className="logo">
        <Image
          src="/assets/img/energy_star.png"
          alt=""
          width={120}
          height={120}
          style={{ width: "100%", height: "auto" }}
          priority
        />
      </div>

      <div className="text">
        <p className="title">
          Crazy Modular BIOS v3.201PGA, An Energy Star Ally
        </p>
        <p>Copyright (C) 2000-26, Crazy Software, Inc.</p>
        <p className="gap" />
        <p className="bright">377E20</p>
        <p className="gap" />
        <p>Pentium-II CPU at 450MHz</p>
        <p>
          Memory Test : {memory} KB{memoryDone && " OK"}
          {!memoryDone && <span className="cursor">_</span>}
        </p>

        {lines.map((text, i) => (
          <p key={i} className={text.startsWith("Loading") ? "bright" : ""}>
            {text || "\u00A0"}
            {i === lines.length - 1 && text && (
              <span className="cursor">_</span>
            )}
          </p>
        ))}
      </div>

      <footer className="footer">
        <p>Press DEL to enter SETUP</p>
        <p>{date}-i440BX-W977-2A69KP19C-00</p>
      </footer>

      <style jsx>{`
        .bios {
          position: fixed;
          inset: 0;
          z-index: 9999;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          background: #000;
          color: #b4b4b4;
          font-family: "Courier New", Courier, monospace;
          font-size: clamp(13px, 2.2vw, 18px);
          line-height: 1.4;
          padding: clamp(12px, 3vw, 28px);
          overflow: hidden;
          user-select: none;
        }
        .text p,
        .footer p {
          margin: 0;
          white-space: pre-wrap;
        }
        .title,
        .bright {
          color: #fff;
        }
        .gap {
          height: 1.4em;
        }
        .logo {
          position: absolute;
          top: clamp(12px, 3vw, 28px);
          right: clamp(12px, 3vw, 28px);
          width: clamp(64px, 14vw, 120px);
        }
        .footer {
          color: #8a8a8a;
        }
        .cursor {
          margin-left: 2px;
          animation: blink 1s steps(1) infinite;
        }
        @keyframes blink {
          50% {
            opacity: 0;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .cursor {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}