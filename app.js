// Infamous AI v2.0 — shared frontend helpers
// Uses supabase-js v2 from CDN (loaded via <script> tag in each HTML).

const CFG = window.INFAMOUS_CONFIG;

// Plan definitions (must match backend)
const PLANS = [
  { id: "dirt",     name: "Dirt",     price: "Free",   chat: 25,  codingDays: 7,  popular: false },
  { id: "stone",    name: "Stone",    price: "$3",     chat: 50,  codingDays: 7,  popular: false },
  { id: "glass",    name: "Glass",    price: "$6",     chat: 100, codingDays: 8,  popular: true  },
  { id: "bricks",   name: "Bricks",   price: "$10",    chat: 150, codingDays: 9,  popular: false },
  { id: "obsidian", name: "Obsidian", price: "$15",    chat: 200, codingDays: 10, popular: false },
  { id: "bedrock",  name: "Bedrock",  price: "$25",    chat: 300, codingDays: 10, popular: false },
];

// --- Supabase client (singleton) ---
let _sb = null;
function sb() {
  if (_sb) return _sb;
  if (!window.supabase) throw new Error("Supabase JS not loaded");
  _sb = window.supabase.createClient(CFG.SUPABASE_URL, CFG.SUPABASE_ANON_KEY, {
    auth: { persistSession: true, autoRefreshToken: true },
  });
  return _sb;
}

// --- Toast ---
function toast(message, type = "info") {
  let host = document.querySelector(".toast-host");
  if (!host) {
    host = document.createElement("div");
    host.className = "toast-host";
    document.body.appendChild(host);
  }
  const el = document.createElement("div");
  el.className = "toast " + type;
  el.textContent = message;
  host.appendChild(el);
  setTimeout(() => el.remove(), 4500);
}

// --- Header / Footer injection ---
function renderHeader(target) {
  const el = typeof target === "string" ? document.querySelector(target) : target;
  if (!el) return;
  el.innerHTML = `
    <header class="site-header">
      <a href="index.html" class="brand">
        <div class="logo">i</div>
        <span>${CFG.BRAND_NAME}</span><small>${CFG.BRAND_VERSION}</small>
      </a>
      <nav class="nav" id="nav-actions">
        <a href="login.html" class="btn btn-ghost">Login</a>
        <a href="signup.html" class="btn btn-primary">Sign Up</a>
      </nav>
    </header>`;
  // Swap buttons if logged in
  sb().auth.getSession().then(({ data }) => {
    const nav = document.getElementById("nav-actions");
    if (!nav) return;
    if (data.session) {
      nav.innerHTML = `
        <a href="chat.html" class="btn btn-ghost">Chat</a>
        <button class="btn" id="logout-btn">Sign out</button>`;
      document.getElementById("logout-btn").onclick = async () => {
        await sb().auth.signOut();
        location.href = "index.html";
      };
    }
  });
}

function renderFooter(target) {
  const el = typeof target === "string" ? document.querySelector(target) : target;
  if (!el) return;
  el.innerHTML = `
    <footer class="site-footer">
      ${CFG.TAGLINE} · © ${new Date().getFullYear()} ${CFG.BRAND_NAME} ${CFG.BRAND_VERSION}
    </footer>`;
}

// --- Auth guards ---
async function requireAuth() {
  const { data } = await sb().auth.getSession();
  if (!data.session) {
    location.href = "login.html";
    return null;
  }
  return data.session;
}

async function redirectIfAuthed() {
  const { data } = await sb().auth.getSession();
  if (data.session) location.href = CFG.AFTER_AUTH;
}

// --- Tiny markdown-ish renderer (escape + code fences + bold/italic + links) ---
function escapeHtml(s) {
  return s.replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
}
function renderMarkdown(text) {
  if (!text) return "";
  // Code fences
  let out = "";
  const parts = text.split(/```/);
  for (let i = 0; i < parts.length; i++) {
    if (i % 2 === 1) {
      // Code block
      const firstLine = parts[i].split("\n")[0];
      const lang = /^[a-zA-Z0-9_+-]+$/.test(firstLine) ? firstLine : "";
      const code = lang ? parts[i].slice(firstLine.length + 1) : parts[i];
      out += `<pre><code>${escapeHtml(code.replace(/\n$/, ""))}</code></pre>`;
    } else {
      let inline = escapeHtml(parts[i]);
      // inline code
      inline = inline.replace(/`([^`\n]+)`/g, "<code>$1</code>");
      // bold
      inline = inline.replace(/\*\*([^*\n]+)\*\*/g, "<strong>$1</strong>");
      // italic
      inline = inline.replace(/(^|[^*])\*([^*\n]+)\*/g, "$1<em>$2</em>");
      // links
      inline = inline.replace(/\[([^\]]+)\]\((https?:[^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>');
      // newlines
      inline = inline.replace(/\n/g, "<br>");
      out += inline;
    }
  }
  return out;
}
