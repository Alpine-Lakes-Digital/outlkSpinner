# Spinner Signature for Outlook

An Outlook add-in that adds a random Claude Code spinner verb to your email signature every time you start a new message, reply, or forward:

```
Owen Allen
✻ Flibbertigibbeting…
```

The 187 verbs come from the [mandarBadve/SpinnerVerbs.ts gist](https://gist.github.com/mandarBadve/59cdd9a1e61ac919c89e2a0af63e1fdd). The add-in uses Outlook's event-based activation (`OnNewMessageCompose`) and the `setSignatureAsync()` API, the approach Microsoft documents in [Activate add-ins with events](https://learn.microsoft.com/en-us/office/dev/add-ins/develop/event-based-activation) and its [set-signature sample](https://learn.microsoft.com/en-us/samples/officedev/office-add-in-samples/outlook-add-in-set-signature/).

Works in Outlook on the web, new Outlook for Windows, classic Outlook for Windows (Windows 10 1903+), and new Outlook for Mac. Not included: Outlook mobile (see "Extending" below).

## What's in the folder

| File | Purpose |
|---|---|
| `manifest.xml` | Tells Outlook what the add-in is, where its files live, and which event to listen for. Already validated with `office-addin-manifest validate`. |
| `src/commands.js` | Everything that matters: your signature settings, the verb list, and the event handlers. |
| `src/commands.html` | Tiny page that loads Office.js and `commands.js` (used by web, new Outlook, and Mac). |
| `assets/icon-*.png` | Ribbon and add-in icons. |
| `preview.html` | Open in any browser to see the signature and click "Re-roll verb". No Outlook needed. |
| `set-base-url.sh` / `.ps1` | Points the manifest at wherever you host the files. |
| `.nojekyll` | Stops GitHub Pages from processing the files. |

## Setup (about 15 minutes)

### 1. Customize your signature

Open `src/commands.js` and edit `SIGNATURE_CONFIG` at the top:

```js
var SIGNATURE_CONFIG = {
  name: "Owen Allen",
  title: "",           // blank fields are hidden
  company: "",
  phone: "",
  website: "",
  verbPrefix: "\u273B ",   // "✻ "
  verbSuffix: "\u2026",    // "…"
  verbColor: "#D97757",    // Claude orange
  mode: "random"           // or "daily" for one verb per day
};
```

Open `preview.html` in a browser to check how it looks.

### 2. Host the files on GitHub Pages

Add-in files must be served over HTTPS. GitHub Pages is free and works well.

```bash
cd outlook-spinner-signature
git init && git add . && git commit -m "Spinner Signature"
gh repo create outlook-spinner-signature --public --source=. --push
```

Then in the repo on GitHub: **Settings → Pages → Build and deployment → Deploy from a branch → `main` / `(root)` → Save**.

After a minute or two, check that this loads in a browser:
`https://YOURNAME.github.io/outlook-spinner-signature/src/commands.js`

### 3. Point the manifest at your site

```bash
./set-base-url.sh https://YOURNAME.github.io/outlook-spinner-signature
# Windows: .\set-base-url.ps1 https://YOURNAME.github.io/outlook-spinner-signature
git commit -am "Set base URL" && git push
```

### 4. Turn off Outlook's own signature

If you skip this step, new emails get two signatures.

In Outlook: **Settings → Account → Signatures → Select default signatures**, then set both **For new messages** and **For replies/forwards** to **(no signature)**. In classic Outlook: **File → Options → Mail → Signatures**.

### 5. Install the add-in

1. Go to [aka.ms/olksideload](https://aka.ms/olksideload). It opens Outlook on the web with the add-ins dialog.
2. Choose **My add-ins** → **Custom Addins** → **Add a custom add-in** → **Add from File...**
3. Pick your `manifest.xml` and confirm.

The add-in is attached to your mailbox, so it shows up in Outlook on the web, new Outlook, classic Outlook, and Mac. Restart desktop Outlook if it was already open.

### 6. Test it

Start a new email. The signature should show up with a random verb. While composing, the **Re-roll verb** button on the ribbon (or under the "..." / Apps menu in new Outlook and on the web) swaps the verb.

## Changing things later

- **Edit the verbs or the signature layout:** change `src/commands.js` and push. You don't need to touch the manifest or reinstall.
- **Change the manifest:** increase `<Version>` (for example `1.0.0.1`), push, then remove and re-add the add-in.

## Troubleshooting

| Problem | Fix |
|---|---|
| No signature appears | Make sure `.../src/commands.js` loads in a browser and that the URLs in `manifest.xml` match exactly (they're case-sensitive). |
| Two signatures | Step 4 wasn't done for that account, or for replies/forwards. |
| Old verbs or old layout after you made changes | GitHub Pages can take a few minutes to update. Classic Outlook also caches add-in files: close Outlook and delete `%LOCALAPPDATA%\Microsoft\Office\16.0\Wef\`. |
| Works on the web but not in classic Outlook | You need Windows 10 version 1903 or later and a current Microsoft 365 build. Restart Outlook after installing. |
| Stops firing on its own | Microsoft notes that event-based add-ins are officially supported when deployed by an admin. If you run your own Microsoft 365 tenant, upload `manifest.xml` at **Microsoft 365 admin center → Settings → Integrated apps → Upload custom apps → Office Add-in** and assign it to yourself only. |
| Debugging | In Outlook on the web, open the browser's developer tools while composing. Errors are logged with the prefix `Spinner Signature:`. |

## Extending

- **Outlook mobile:** Mobile requires a separate manifest variant (Mailbox 1.5 plus a `MobileFormFactor` section). See [Event-based activation in Outlook mobile add-ins](https://learn.microsoft.com/office/dev/add-ins/outlook/mobile-event-based).
- **Account-specific signatures:** Handle `OnMessageFromChanged` to swap signatures when you change the From account. See [Microsoft's walkthrough](https://learn.microsoft.com/office/dev/add-ins/outlook/onmessagefromchanged-onappointmentfromchanged-events).
- **No repeats:** The handlers don't store anything between emails. To avoid repeating recent verbs, save recent picks with `OfficeRuntime.storage`.
