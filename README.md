# mba-sdui

A self-paced MBA, delivered as a server-driven UI (SDUI) app for iOS, Android and web.

## How it fits together

| Folder | What it is | Changes when |
| --- | --- | --- |
| `schema/` | The contract: every block a screen may contain | Rarely, and carefully |
| `server/screens/` | The "server": one JSON file per screen | Every time a lesson changes |
| `app/` | The Expo app: draws whatever JSON it receives | Only when a new block type is needed |

The app contains no lesson content. At runtime it fetches a screen's JSON from
`server/screens/` and renders each block. Edit a JSON file, reload the app, and
the screen changes with no rebuild.

## Version 1 goal

Prove one thing: a lesson edited on the server shows up in the app without an app update.

## Run it locally

```
cd app
npm install
npx expo start
```

Press `w` for web, or scan the QR code with Expo Go.

## Checks

```
node server/validate.mjs
```

Confirms every screen file only uses blocks the contract allows.
