import type { Screen } from "./types";

// Version 1 "server": JSON files in this repo, read live from GitHub.
// Swapping in a real backend later means changing only this file.
const REPO = "wescyu/mba-sdui";
const BRANCH = "main";
const DIR = "server/screens";

export async function fetchScreen(id: string): Promise<Screen> {
  const api = `https://api.github.com/repos/${REPO}/contents/${DIR}/${id}.json?ref=${BRANCH}`;
  let res = await fetch(api, { headers: { Accept: "application/vnd.github.raw+json" } });
  if (!res.ok) {
    // Fallback if the API rate limit is hit. This copy can lag a few minutes.
    res = await fetch(`https://raw.githubusercontent.com/${REPO}/${BRANCH}/${DIR}/${id}.json`);
  }
  if (!res.ok) throw new Error(`The server has no screen called "${id}" (status ${res.status}).`);
  return (await res.json()) as Screen;
}
