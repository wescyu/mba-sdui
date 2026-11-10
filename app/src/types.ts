// The contract between server and app. Mirrors schema/README.md.
export type Action = { type: "navigate"; to: string };

export type Question = {
  prompt: string;
  options: { label: string; hint?: string }[];
  answer: number;
  why: string;
};

export type Block =
  | { type: "header"; title: string; eyebrow?: string; subtitle?: string }
  | { type: "text"; text: string }
  | { type: "rule"; text: string }
  | { type: "card"; title: string; eyebrow?: string; body?: string; action?: Action }
  | { type: "button"; label: string; action: Action }
  | { type: "quiz"; questions: Question[]; next?: { label: string; action: Action } };

export type Screen = { schemaVersion: number; id: string; blocks: Block[] };

export const SUPPORTED_SCHEMA = 1;
