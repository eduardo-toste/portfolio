// Live GitHub data for the portfolio.
// - profile + repos: official REST API (no token; 60 req/h per visitor IP, so results are cached)
// - contribution calendar: GitHub has no public REST endpoint for it, so it comes from
//   github-contributions-api.jogruber.de, which mirrors the public profile graph with CORS enabled.
// Each source settles on its own: if one fails, the others still render.

const TTL = 30 * 60 * 1000;
// bump the version when the cached shape changes, so old entries are ignored
const cacheKey = (user, k) => `gh2:${user}:${k}`;

function readCache(key) {
  try {
    const raw = localStorage.getItem(key); if (!raw) return null;
    const { t, d } = JSON.parse(raw);
    return Date.now() - t < TTL ? d : null;
  } catch { return null; }
}
function writeCache(key, d) { try { localStorage.setItem(key, JSON.stringify({ t: Date.now(), d })); } catch {} }

async function getJSON(url) {
  const res = await fetch(url, { headers: { Accept: 'application/vnd.github+json' } });
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  return res.json();
}

async function cached(user, k, load) {
  const key = cacheKey(user, k), hit = readCache(key);
  if (hit) return hit;
  const d = await load();
  writeCache(key, d);
  return d;
}

const str = x => typeof x === 'string' && x ? x : null;
const num = x => Math.max(0, Number(x) | 0);
// only https links (optionally on one host) are allowed into hrefs
function safeUrl(u, host) {
  try { const x = new URL(u); return x.protocol === 'https:' && (!host || x.hostname === host) ? x.href : null; } catch { return null; }
}

const ymd = d => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

// Turns the raw day list into what the page shows: a 53-week grid ending on today, plus streaks.
export function summarizeCalendar(days, today = new Date()) {
  const todayKey = ymd(today);
  const past = days.filter(d => d.date <= todayKey).sort((a, b) => a.date < b.date ? -1 : 1);
  const dow = today.getDay();
  const want = 52 * 7 + dow + 1;
  const win = past.slice(-want);
  const pad = Array.from({ length: want - win.length }, () => null);
  const cells = [...pad, ...win, ...Array.from({ length: 6 - dow }, () => undefined)];

  let total = 0, active = 0, best = 0, bestDate = null, longest = 0, run = 0;
  for (const d of win) {
    total += d.count;
    if (d.count > 0) { active++; run++; longest = Math.max(longest, run); } else run = 0;
    if (d.count > best) { best = d.count; bestDate = d.date; }
  }
  // like GitHub: a streak is still alive if today has no commits yet
  let current = 0, i = win.length - 1;
  if (i >= 0 && win[i].count === 0 && win[i].date === todayKey) i--;
  for (; i >= 0 && win[i].count > 0; i--) current++;

  return { cells, total, active, current, longest, best, bestDate, from: win[0]?.date, to: win[win.length - 1]?.date };
}

export async function loadGitHub(user) {
  const [profile, repos, calendar] = await Promise.allSettled([
    cached(user, 'profile', () => getJSON(`https://api.github.com/users/${user}`)),
    cached(user, 'repos', async () => {
      const list = await getJSON(`https://api.github.com/users/${user}/repos?per_page=100&sort=pushed`);
      if (!Array.isArray(list)) throw new Error('repos: unexpected format');
      return list.filter(r => r && typeof r.name === 'string').map(r => ({
        name: r.name, url: safeUrl(r.html_url, 'github.com'), desc: str(r.description), lang: str(r.language), stars: num(r.stargazers_count),
        fork: !!r.fork, archived: !!r.archived, pushed: str(r.pushed_at), homepage: safeUrl(r.homepage)
      }));
    }),
    // third-party mirror: normalize every field so nothing unexpected reaches the page
    cached(user, 'calendar', async () => {
      const list = (await getJSON(`https://github-contributions-api.jogruber.de/v4/${user}?y=last`)).contributions;
      if (!Array.isArray(list)) throw new Error('calendar: unexpected format');
      return list.filter(d => d && /^\d{4}-\d{2}-\d{2}$/.test(d.date))
        .map(d => ({ date: d.date, count: num(d.count), level: Math.min(4, num(d.level)) }));
    })
  ]);
  const val = p => p.status === 'fulfilled' ? p.value : null;
  return {
    profile: val(profile),
    repos: val(repos),
    calendar: val(calendar) ? summarizeCalendar(val(calendar)) : null,
    errors: [profile, repos, calendar].filter(p => p.status === 'rejected').map(p => p.reason)
  };
}
