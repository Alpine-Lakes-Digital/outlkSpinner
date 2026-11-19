/*
 * Spinner Signature for Outlook
 * Adds a random Claude Code spinner verb (from the mandarBadve/SpinnerVerbs.ts gist)
 * to your email signature every time you start a new message, reply, or forward.
 *
 * Uses old-school ES5 syntax on purpose: classic Outlook on Windows runs this file in a
 * JavaScript-only runtime, and keeping it to one plain file avoids compatibility surprises.
 */

/* ---------- 1. Your settings: edit these ---------- */
var SIGNATURE_CONFIG = {
  name: "Owen Allen",
  title: "",                 // e.g. "Software Developer" (leave "" to hide)
  company: "",               // leave "" to hide
  phone: "",                 // leave "" to hide
  website: "",               // e.g. "https://example.com" (leave "" to hide)
  verbPrefix: "\u273B ",     // the Claude-style asterisk "✻ " in front of the verb
  verbSuffix: "\u2026",      // the ellipsis "…" after the verb
  verbColor: "#D97757",      // Claude orange; any CSS color works
  mode: "random"             // "random" = new verb on every email, "daily" = one verb per day
};

/* ---------- 2. The verbs (187, copied from the gist) ---------- */
var SPINNER_VERBS = [
    "Accomplishing", "Actioning", "Actualizing", "Architecting", "Baking", "Beaming",
    "Beboppin'", "Befuddling", "Billowing", "Blanching", "Bloviating", "Boogieing",
    "Boondoggling", "Booping", "Bootstrapping", "Brewing", "Bunning", "Burrowing",
    "Calculating", "Canoodling", "Caramelizing", "Cascading", "Catapulting", "Cerebrating",
    "Channeling", "Channelling", "Choreographing", "Churning", "Clauding", "Coalescing",
    "Cogitating", "Combobulating", "Composing", "Computing", "Concocting", "Considering",
    "Contemplating", "Cooking", "Crafting", "Creating", "Crunching", "Crystallizing",
    "Cultivating", "Deciphering", "Deliberating", "Determining", "Dilly-dallying", "Discombobulating",
    "Doing", "Doodling", "Drizzling", "Ebbing", "Effecting", "Elucidating",
    "Embellishing", "Enchanting", "Envisioning", "Evaporating", "Fermenting", "Fiddle-faddling",
    "Finagling", "Flambéing", "Flibbertigibbeting", "Flowing", "Flummoxing", "Fluttering",
    "Forging", "Forming", "Frolicking", "Frosting", "Gallivanting", "Galloping",
    "Garnishing", "Generating", "Gesticulating", "Germinating", "Gitifying", "Grooving",
    "Gusting", "Harmonizing", "Hashing", "Hatching", "Herding", "Honking",
    "Hullaballooing", "Hyperspacing", "Ideating", "Imagining", "Improvising", "Incubating",
    "Inferring", "Infusing", "Ionizing", "Jitterbugging", "Julienning", "Kneading",
    "Leavening", "Levitating", "Lollygagging", "Manifesting", "Marinating", "Meandering",
    "Metamorphosing", "Misting", "Moonwalking", "Moseying", "Mulling", "Mustering",
    "Musing", "Nebulizing", "Nesting", "Newspapering", "Noodling", "Nucleating",
    "Orbiting", "Orchestrating", "Osmosing", "Perambulating", "Percolating", "Perusing",
    "Philosophising", "Photosynthesizing", "Pollinating", "Pondering", "Pontificating", "Pouncing",
    "Precipitating", "Prestidigitating", "Processing", "Proofing", "Propagating", "Puttering",
    "Puzzling", "Quantumizing", "Razzle-dazzling", "Razzmatazzing", "Recombobulating", "Reticulating",
    "Roosting", "Ruminating", "Sautéing", "Scampering", "Schlepping", "Scurrying",
    "Seasoning", "Shenaniganing", "Shimmying", "Simmering", "Skedaddling", "Sketching",
    "Slithering", "Smooshing", "Sock-hopping", "Spelunking", "Spinning", "Sprouting",
    "Stewing", "Sublimating", "Swirling", "Swooping", "Symbioting", "Synthesizing",
    "Tempering", "Thinking", "Thundering", "Tinkering", "Tomfoolering", "Topsy-turvying",
    "Transfiguring", "Transmuting", "Twisting", "Undulating", "Unfurling", "Unravelling",
    "Vibing", "Waddling", "Wandering", "Warping", "Whatchamacalliting", "Whirlpooling",
    "Whirring", "Whisking", "Wibbling", "Working", "Wrangling", "Zesting",
    "Zigzagging"
];

/* ---------- 3. Picking a verb ---------- */
function pickVerb() {
  if (SIGNATURE_CONFIG.mode === "daily") {
    // Same verb all day: hash today's date into an index.
    var d = new Date();
    var key = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
    var h = 0;
    for (var i = 0; i < key.length; i++) {
      h = (h * 31 + key.charCodeAt(i)) >>> 0;
    }
    return SPINNER_VERBS[h % SPINNER_VERBS.length];
  }
  return SPINNER_VERBS[Math.floor(Math.random() * SPINNER_VERBS.length)];
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/* ---------- 4. Building the signature HTML ---------- */
function buildSignatureHtml(verb) {
  var c = SIGNATURE_CONFIG;
  var font = "font-family:'Segoe UI',Calibri,Arial,sans-serif;";
  var html = "<div style=\"" + font + "font-size:10.5pt;color:#222222;line-height:1.4;\">";
  html += "<div style=\"font-weight:600;\">" + escapeHtml(c.name) + "</div>";

  var line2 = [];
  if (c.title) line2.push(escapeHtml(c.title));
  if (c.company) line2.push(escapeHtml(c.company));
  if (line2.length) html += "<div style=\"color:#555555;\">" + line2.join(" &middot; ") + "</div>";

  var line3 = [];
  if (c.phone) line3.push(escapeHtml(c.phone));
  if (c.website) {
    line3.push("<a href=\"" + escapeHtml(c.website) + "\" style=\"color:#555555;\">" +
      escapeHtml(c.website.replace(/^https?:\/\//, "")) + "</a>");
  }
  if (line3.length) html += "<div style=\"color:#555555;\">" + line3.join(" &middot; ") + "</div>";

  html += "<div style=\"margin-top:4px;color:" + escapeHtml(c.verbColor) + ";\">" +
    escapeHtml(c.verbPrefix + verb + c.verbSuffix) + "</div>";
  html += "</div>";
  return html;
}

/* ---------- 5. Outlook handlers ---------- */
function applySignature(event) {
  var html = buildSignatureHtml(pickVerb());
  Office.context.mailbox.item.body.setSignatureAsync(
    html,
    { coercionType: Office.CoercionType.Html, asyncContext: event },
    function (result) {
      if (result.status === Office.AsyncResultStatus.Failed) {
        console.log("Spinner Signature: " + result.error.message);
      }
      if (result.asyncContext && result.asyncContext.completed) {
        result.asyncContext.completed();
      }
    }
  );
}

// Runs automatically on every new message, reply, and forward.
function onNewMessageComposeHandler(event) {
  applySignature(event);
}

// Runs when you click the "Re-roll verb" button on the ribbon while composing.
function rerollSignature(event) {
  applySignature(event);
}

/* ---------- 6. Wiring (names must match manifest.xml) ---------- */
if (typeof Office !== "undefined") {
  Office.onReady(function () {});
  Office.actions.associate("onNewMessageComposeHandler", onNewMessageComposeHandler);
  Office.actions.associate("rerollSignature", rerollSignature);
}
