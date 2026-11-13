# Canvas Aces — Version 1

A self-contained, turn-based dogfighting game for a desktop or mobile browser.

This is the first version of Canvas Aces. The game is single-player against the computer. Two-device multiplayer is not implemented.

## Play on a PC

1. Extract the ZIP.
2. Double-click `index.html` and open it in Edge, Chrome, Firefox, or Safari.
3. Click **How to play** for the quick guide, or **Practice flight** for three guided exercises.

No installation, build step, account, or internet connection is required to play the downloaded game. Browser storage availability determines whether a sortie can be saved; the game displays its save status.

## Upload to GitHub

1. Extract this ZIP first. Upload the extracted files, not the ZIP itself.
2. Create or open the GitHub repository you want to use.
3. Choose **Add file → Upload files**. A new empty repository may instead show an **uploading an existing file** link.
4. Drag the extracted contents into the upload area. Keep `index.html` and `README.md` at the repository root, with `tests/` alongside them.
5. Commit the upload. A suitable message is `Release Canvas Aces version 1`.

You can also place these files in a local repository and publish it using GitHub Desktop or Git.

## Optional: publish with GitHub Pages

After committing the files:

1. Open the repository's **Settings → Pages**.
2. Under **Build and deployment**, choose **Deploy from a branch**.
3. Select the branch containing these files, normally `main`, and the **/(root)** folder.
4. Save, then use the site URL shown by GitHub when deployment completes.

Open that hosted URL in iPhone Safari to test the mobile layout. Uploading these files alone does not enable Pages. No domain name or build service is needed for this static game.

GitHub instructions:

- [Uploading existing files](https://docs.github.com/en/repositories/working-with-files/managing-files/adding-a-file-to-a-repository)
- [Configuring GitHub Pages publishing](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)

## Included features

- Simultaneous hidden maneuvers, cockpit and tactical views, and a rear-view camera.
- Easy, Normal, and Hard computer opponents.
- Dogfight, First blood, and Break contact objectives.
- Three guided practice exercises.
- Illustrated maneuver cards, altitude and energy management, and automatic firing.
- Last-turn replay, browser saves, and career totals.
- A hidden solo test console; assisted flights do not earn career credit.

### Solo cheat console

Press the backtick/tilde key (`~`) while no dialog is open, or tap the version line at the bottom five times in quick succession. The console is unavailable during movement or practice. It accepts:

| Code | Effect |
| --- | --- |
| `repair` | Restore hull to 10 |
| `energy` | Refill energy to 6 |
| `ammo` | Refill ammunition to 12 bursts |
| `god` | Toggle invulnerability |
| `reveal` | Toggle the rival's planned maneuver display |
| `win` | End the sortie with a test victory |

Using any valid cheat marks that sortie as assisted, including after saving and reopening it. Starting a new sortie clears the cheat state.

## Files

| File | Purpose |
| --- | --- |
| `index.html` | Complete game: HTML, CSS, JavaScript, and generated vector graphics |
| `tests/check-game.cjs` | Automated game-logic checks using Node.js built-ins |
| `package.json` | Provides the optional `npm test` command; no package dependencies |
| `BASELINE.md` | Snapshot identity, original filename, and validation limits |
| `SHA256SUMS` | Checksums of the packaged files |

## Optional developer checks

With Node.js 20 or newer installed, open a terminal in this directory and run:

```sh
npm test
```

Or run the checks directly:

```sh
node tests/check-game.cjs
```

No `npm install` is needed. The checks simulate the DOM and Canvas API to exercise game logic; they do not launch a real browser or prove the visual layout or iPhone compatibility.

## Validation and scope

Previous checks covered 225 regular-duel simulations and 72 short-objective simulations, with targeted checks for difficulty selection, practice preservation, save/restore, replay, and solo cheats. The included automated suite covers the regular duels and core state behavior; it is not the complete set of earlier targeted checks.

Canvas images were inspected during development. Full browser and physical iPhone testing remains outstanding. Save data belongs to the browser origin: opening a local file and opening a hosted site may use different saves.

No Fly Casual or Plane Tactics code, assets, archives, or dependencies are included. Those projects were reviewed as possible references for later development. Their proposed integrations have not been applied to version 1.
