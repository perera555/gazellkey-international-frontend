"use client";

import Link from "next/link";
import { FormEvent, Fragment, ReactNode, useEffect, useRef, useState } from "react";

type Turn = { role: "user" | "assistant"; content: string };

const STORAGE_KEY = "gazellekey-chat";
const GREETING = "Hi! I'm the Gazellekey assistant. Ask me about tours, the shop, event rentals, gems, vehicles or import and export.";
const SUGGESTIONS = ["Tours to Thailand?", "Chairs for a wedding of 150", "Do you sell Ceylon tea?", "Book an appointment"];

// [text](/path) links and **bold** in the assistant's replies; everything else is plain text
function renderInline(text: string): ReactNode[] {
  const parts: ReactNode[] = [];
  const pattern = /\[([^\]]+)\]\(([^)\s]+)\)|\*\*([^*]+)\*\*/g;
  let last = 0;
  let match: RegExpExecArray | null;
  while ((match = pattern.exec(text))) {
    parts.push(text.slice(last, match.index));
    if (match[1]) {
      const href = match[2];
      parts.push(
        href.startsWith("/") ? (
          <Link key={match.index} href={href} className="font-semibold text-navy-800 underline underline-offset-2 hover:text-gold-600">
            {match[1]}
          </Link>
        ) : (
          <a key={match.index} href={href} target="_blank" rel="noopener noreferrer" className="font-semibold underline">
            {match[1]}
          </a>
        ),
      );
    } else {
      parts.push(<strong key={match.index}>{match[3]}</strong>);
    }
    last = match.index + match[0].length;
  }
  parts.push(text.slice(last));
  return parts;
}

function Reply({ text }: { text: string }) {
  const lines = text.split("\n");
  return (
    <>
      {lines.map((line, index) => {
        const bullet = /^\s*[-*•]\s+/.test(line);
        const content = renderInline(line.replace(/^\s*[-*•]\s+/, ""));
        return (
          <Fragment key={index}>
            {bullet ? (
              <span className="flex gap-2">
                <span className="text-gold-600">•</span>
                <span>{content}</span>
              </span>
            ) : line.trim() == "" ? (
              <span className="block h-2" />
            ) : (
              <span className="block">{content}</span>
            )}
          </Fragment>
        );
      })}
    </>
  );
}

// Floating chat bubble on every page: the Gazellekey AI assistant (POST /api/chat)
export default function ChatWidget({ raised = false }: { raised?: boolean }) {
  const [open, setOpen] = useState(false);
  const [turns, setTurns] = useState<Turn[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const list = useRef<HTMLDivElement>(null);
  const field = useRef<HTMLTextAreaElement>(null);

  // keep the conversation while the visitor moves between pages
  useEffect(() => {
    try {
      const saved = JSON.parse(sessionStorage.getItem(STORAGE_KEY) ?? "[]");
      if (Array.isArray(saved)) {
        setTurns(saved);
      }
    } catch {
      // storage blocked: the chat starts fresh on each page
    }
  }, []);
  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(turns.slice(-30)));
    } catch {
      // ignore
    }
    list.current?.scrollTo({ top: list.current.scrollHeight });
  }, [turns]);
  useEffect(() => {
    if (open) {
      field.current?.focus();
    }
  }, [open]);

  async function send(text: string) {
    const message = text.trim();
    if (!message || busy) {
      return;
    }
    const conversation: Turn[] = [...turns, { role: "user", content: message }];
    setTurns([...conversation, { role: "assistant", content: "" }]);
    setInput("");
    setBusy(true);

    const write = (reply: string) =>
      setTurns((current) => [...current.slice(0, -1), { role: "assistant", content: reply }]);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        // only real exchanges are sent (no empty or failed replies)
        body: JSON.stringify({ messages: conversation.filter((turn) => turn.content.trim() != "") }),
      });
      if (!response.ok || !response.body) {
        const data = await response.json().catch(() => ({}));
        write(data.message ?? "Sorry, the assistant is not available right now. Please use the Contact page.");
        return;
      }
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let reply = "";
      for (;;) {
        const { done, value } = await reader.read();
        if (done) {
          break;
        }
        reply += decoder.decode(value, { stream: true });
        write(reply);
      }
      if (reply.trim() == "") {
        write("Sorry, I could not answer that. Please try again or contact our team.");
      }
    } catch {
      write("Network problem - please check your connection and try again.");
    } finally {
      setBusy(false);
    }
  }

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    send(input);
  }

  const bottom = raised ? "bottom-24 sm:bottom-26" : "bottom-5 sm:bottom-6";

  return (
    <div className="print:hidden">
      {open ? (
        <section
          aria-label="Chat with the Gazellekey assistant"
          className={`fixed right-3 z-50 flex max-h-[min(36rem,calc(100dvh-7rem))] w-[calc(100vw-1.5rem)] flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_30px_80px_-20px_rgba(6,11,26,0.55)] sm:right-6 sm:w-96 ${bottom}`}
        >
          <header className="flex items-center gap-3 bg-navy-950 px-4 py-3 text-white">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-linear-to-br from-gold-400 to-gold-600 text-sm font-bold text-navy-950">GK</span>
            <div className="min-w-0 flex-1">
              <p className="font-semibold">Gazellekey assistant</p>
              <p className="text-xs text-white/60">AI helper · replies in seconds</p>
            </div>
            {turns.length > 0 ? (
              <button type="button" onClick={() => setTurns([])} disabled={busy} className="rounded-full px-2 py-1 text-xs text-white/70 hover:bg-white/10 hover:text-white">
                New chat
              </button>
            ) : null}
            <button type="button" onClick={() => setOpen(false)} aria-label="Close chat" className="grid h-8 w-8 place-items-center rounded-full text-xl hover:bg-white/10">
              ×
            </button>
          </header>

          <div ref={list} className="flex-1 space-y-3 overflow-y-auto bg-[#f7f8fb] px-4 py-4 text-sm leading-relaxed" aria-live="polite">
            <p className="max-w-[85%] rounded-2xl rounded-tl-sm bg-white px-3.5 py-2.5 text-slate-700 shadow-sm">{GREETING}</p>
            {turns.length == 0 ? (
              <div className="flex flex-wrap gap-2 pt-1">
                {SUGGESTIONS.map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => send(suggestion)}
                    className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-navy-800 hover:border-gold-500"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            ) : null}
            {turns.map((turn, index) =>
              turn.role == "user" ? (
                <p key={index} className="ml-auto max-w-[85%] rounded-2xl rounded-tr-sm bg-navy-900 px-3.5 py-2.5 whitespace-pre-line text-white">
                  {turn.content}
                </p>
              ) : (
                <div key={index} className="max-w-[90%] rounded-2xl rounded-tl-sm bg-white px-3.5 py-2.5 text-slate-700 shadow-sm">
                  {turn.content ? (
                    <Reply text={turn.content} />
                  ) : (
                    <span className="inline-flex gap-1" aria-label="Typing">
                      <span className="h-2 w-2 animate-bounce rounded-full bg-slate-300" />
                      <span className="h-2 w-2 animate-bounce rounded-full bg-slate-300 [animation-delay:120ms]" />
                      <span className="h-2 w-2 animate-bounce rounded-full bg-slate-300 [animation-delay:240ms]" />
                    </span>
                  )}
                </div>
              ),
            )}
          </div>

          <form onSubmit={onSubmit} className="flex items-end gap-2 border-t border-slate-100 bg-white p-3">
            <label htmlFor="chat-input" className="sr-only">
              Your message
            </label>
            <textarea
              id="chat-input"
              ref={field}
              rows={1}
              maxLength={1500}
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key == "Enter" && !event.shiftKey) {
                  event.preventDefault();
                  send(input);
                }
              }}
              placeholder="Type your question..."
              className="max-h-28 min-h-10 flex-1 resize-none rounded-2xl border border-slate-200 px-3.5 py-2.5 text-sm focus:border-gold-500 focus:outline-none"
            />
            <button type="submit" disabled={busy || input.trim() == ""} className="btn-gold h-10 shrink-0 px-4 py-0" aria-label="Send">
              Send
            </button>
          </form>
          <p className="bg-white px-4 pb-2 text-[11px] text-slate-400">AI answers can be wrong. Our team confirms prices and bookings.</p>
        </section>
      ) : null}

      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-label={open ? "Close chat" : "Chat with our assistant"}
        className={`fixed right-5 z-50 flex items-center gap-2 rounded-full bg-navy-950 p-3.5 text-gold-400 shadow-[0_16px_32px_-12px_rgba(6,11,26,0.8)] transition hover:-translate-y-0.5 sm:right-6 ${open ? "hidden" : ""} ${raised ? "bottom-24 sm:bottom-24" : "bottom-5 sm:bottom-6"}`}
      >
        <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 5h16v11H9l-5 4V5zM8 10h8M8 13h5" />}
        </svg>
      </button>
    </div>
  );
}
