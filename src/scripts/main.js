(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!reduce) document.documentElement.classList.add('anim');
  const store = { get(k){ try { return localStorage.getItem(k); } catch { return null; } }, set(k,v){ try { localStorage.setItem(k,v); } catch {} } };
  const seeded = s => () => { s |= 0; s = s + 0x6D2B79F5 | 0; let x = Math.imul(s ^ s >>> 15, 1 | s); x = x + Math.imul(x ^ x >>> 7, 61 | x) ^ x; return ((x ^ x >>> 14) >>> 0) / 4294967296; };

  /* ================= content ================= */
  const T = {
    pt: {
      'nav.stack':'Stack','nav.proj':'Projetos','nav.gh':'GitHub','nav.traj':'Trajetória','nav.contact':'Contato',
      'nav.projl':'projetos','nav.trajl':'trajetória','nav.contactl':'contato','resume':'Currículo',
      'hero.status':'Disponível para novos projetos',
      'graph.head':n => `<b>${n}</b> contribuições em 2026`,'graph.less':'Menos','graph.more':'Mais',
      'graph.hint':'passe o mouse para commitar · clique no gráfico para um novo commit','graph.scroll':'role para explorar ↓',
      'role':[['Software'],['Engineer'],['full-stack.','acc']],
      'hero.lead':'Construo produtos web de ponta a ponta, do banco de dados à interface. Hoje focado em sistemas que aguentam escala e interfaces que dão vontade de usar.',
      'hero.cta1':'Baixar currículo','hero.cta2':'Ver projetos','hero.meta':'PDF em português · English version available',
      'hs.years':'anos escrevendo código','hs.projects':'projetos entregues','hs.commits':'contribuições em 2026','hs.uptime':'uptime nos sistemas que mantenho',
      'cm.stack':'front, back, dados e infra','cm.proj':'3 produtos no ar','cm.gh':'sequência de 12 dias','cm.traj':'experiência + formação','cm.contact':'aguardando seu merge',
      'stack.title':'Com o que eu trabalho','stack.lead':'Gosto de ter o sistema inteiro na cabeça, da modelagem dos dados à última animação da interface. Estas são as ferramentas do meu dia a dia.',
      'stack.yrs':n => `${n} anos`,
      'proj.title':'Coisas que eu construí','sample':'conteúdo de exemplo',
      'proj.arch':'arquitetura','proj.res':'resultados','proj.code':'Ver código','proj.live':'Ver ao vivo',
      'gh.title':'Atividade no GitHub','gh.sample':'dados de exemplo · no site real vêm da API do GitHub','gh.total':'contribuições no último ano',
      'gh.days':'dias ativos','gh.streak':'sequência atual','gh.best':'maior sequência','gh.top':'melhor dia','gh.year':'out 2025 — out 2026','gh.today':'hoje ▢',
      'traj.title':'Experiência e formação','traj.now':'atual',
      'contact.title':'Vamos conversar?','contact.lead':'Estou aberto a vagas de Software Engineer, remotas ou em São Paulo, e a projetos freelance. Respondo em até um dia útil.',
      'contact.copy':'Copiar e-mail','contact.copied':'Copiado ✓','contact.cv':'Currículo ↓',
      'footer':'Feito com Astro e muitos commits.'
    },
    en: {
      'nav.stack':'Stack','nav.proj':'Projects','nav.gh':'GitHub','nav.traj':'Journey','nav.contact':'Contact',
      'nav.projl':'projects','nav.trajl':'journey','nav.contactl':'contact','resume':'Résumé',
      'hero.status':'Open to new opportunities',
      'graph.head':n => `<b>${n}</b> contributions in 2026`,'graph.less':'Less','graph.more':'More',
      'graph.hint':'hover to commit · click the graph for a new commit','graph.scroll':'scroll to explore ↓',
      'role':[['Full-stack','acc'],['Software'],['Engineer.']],
      'hero.lead':'I build web products end to end, from the database to the interface. Currently focused on systems that scale and interfaces people enjoy using.',
      'hero.cta1':'Download résumé','hero.cta2':'See projects','hero.meta':'PDF in English · versão em português disponível',
      'hs.years':'years writing code','hs.projects':'projects shipped','hs.commits':'contributions in 2026','hs.uptime':'uptime on systems I run',
      'cm.stack':'front, back, data and infra','cm.proj':'3 products live','cm.gh':'12-day streak','cm.traj':'experience + education','cm.contact':'waiting for your merge',
      'stack.title':'What I work with','stack.lead':'I like keeping the whole system in my head, from data modeling to the last interface animation. These are my everyday tools.',
      'stack.yrs':n => `${n} years`,
      'proj.title':'Things I’ve built','sample':'sample content',
      'proj.arch':'architecture','proj.res':'results','proj.code':'View code','proj.live':'Live demo',
      'gh.title':'GitHub activity','gh.sample':'sample data · the live site reads the GitHub API','gh.total':'contributions in the last year',
      'gh.days':'active days','gh.streak':'current streak','gh.best':'longest streak','gh.top':'best day','gh.year':'Oct 2025 — Oct 2026','gh.today':'today ▢',
      'traj.title':'Experience & education','traj.now':'current',
      'contact.title':'Let’s talk','contact.lead':'I’m open to Software Engineer roles, remote or in São Paulo, and to freelance projects. I reply within one business day.',
      'contact.copy':'Copy e-mail','contact.copied':'Copied ✓','contact.cv':'Résumé ↓',
      'footer':'Built with Astro and a lot of commits.'
    }
  };
  const STACK = [
    { name:'Front-end', yrs:6, lv:5, desc:{pt:'Interfaces rápidas, acessíveis e com animação que tem propósito.',en:'Fast, accessible interfaces with purposeful motion.'}, items:['TypeScript','React','Next.js','Astro','Tailwind','GSAP'] },
    { name:'Back-end', yrs:5, lv:4, desc:{pt:'APIs bem desenhadas, filas e serviços que não caem às 3 da manhã.',en:'Well-designed APIs, queues and services that don’t page you at 3 a.m.'}, items:['Node.js','Go','NestJS','REST','GraphQL'] },
    { name:{pt:'Dados',en:'Data'}, yrs:5, lv:4, desc:{pt:'Modelagem, índices certos e cache onde faz diferença.',en:'Modeling, the right indexes and caching where it matters.'}, items:['PostgreSQL','Redis','Prisma','Kafka'] },
    { name:'Infra', yrs:3, lv:3, desc:{pt:'Do Dockerfile ao deploy automático, com observabilidade.',en:'From Dockerfile to automated deploys, with observability.'}, items:['Docker','AWS','Terraform','GitHub Actions'] }
  ];
  const PROJECTS = [
    { name:'Ledger', status:{pt:'em produção',en:'in production'}, kind:'fintech',
      desc:{pt:'Plataforma de conciliação financeira que cruza extratos bancários com o ERP e aponta divergências em minutos.',en:'Financial reconciliation platform that matches bank statements against the ERP and flags mismatches in minutes.'},
      flow:['React','API Node','Workers','PostgreSQL'],
      metrics:[['-70%',{pt:'tempo de fechamento mensal',en:'monthly close time'}],['1,2 mi',{pt:'transações por mês',en:'transactions per month'}]],
      tech:['TypeScript','NestJS','PostgreSQL','Redis','AWS'] },
    { name:'Pulse', status:{pt:'ao vivo',en:'live'}, kind:{pt:'observabilidade',en:'observability'},
      desc:{pt:'Monitoramento em tempo real de serviços, com alertas inteligentes e painéis que carregam em milissegundos.',en:'Real-time service monitoring with smart alerts and dashboards that load in milliseconds.'},
      flow:['Agent Go','Kafka','ClickHouse','Next.js'],
      metrics:[['~40 ms',{pt:'p95 de consulta',en:'p95 query time'}],['300+',{pt:'serviços monitorados',en:'services monitored'}]],
      tech:['Go','Kafka','ClickHouse','Next.js','Docker'] },
    { name:'Atlas UI', status:{pt:'open source',en:'open source'}, kind:'design system',
      desc:{pt:'Design system open source com componentes acessíveis, tokens de tema e documentação interativa.',en:'Open-source design system with accessible components, theme tokens and interactive docs.'},
      flow:['Tokens','React','Storybook','Astro docs'],
      metrics:[['1,4k ★',{pt:'estrelas no GitHub',en:'GitHub stars'}],['60',{pt:'componentes',en:'components'}]],
      tech:['React','TypeScript','Radix','Astro'] }
  ];
  const TIMELINE = [
    { work:true, now:true, role:'Software Engineer', org:'Empresa Exemplo', period:{pt:'2024 — hoje',en:'2024 — now'},
      items:{pt:['Liderei a migração de um monólito para serviços, reduzindo o deploy de 40 min para 6 min.','Criei a camada de cache que derrubou o p95 da API de 1,6 s para 180 ms.'],en:['Led the move from a monolith to services, cutting deploys from 40 min to 6 min.','Built the cache layer that dropped API p95 from 1.6 s to 180 ms.']} },
    { work:true, role:'Full-stack Developer', org:'Startup Exemplo', period:{pt:'2021 — 2024',en:'2021 — 2024'},
      items:{pt:['Construí o app web e a API do zero até 20 mil usuários ativos.','Montei CI/CD com testes de ponta a ponta.'],en:['Built the web app and API from zero to 20k active users.','Set up CI/CD with end-to-end tests.']} },
    { work:false, role:{pt:'Ciência da Computação',en:'B.Sc. Computer Science'}, org:'Universidade Exemplo', period:{pt:'2017 — 2021',en:'2017 — 2021'},
      items:{pt:['TCC sobre filas distribuídas e tolerância a falhas.'],en:['Thesis on distributed queues and fault tolerance.']} }
  ];
  const COMMITS = ['feat(api): rate limiting por cliente','fix(web): hidratação do gráfico no Safari','perf(db): índice parcial em payments','feat(ui): tema escuro com tokens','chore(ci): cache do pnpm no Actions','refactor(worker): fila com retry exponencial','test(e2e): fluxo de checkout','feat(auth): login com passkeys','perf(edge): cache de 60s nas rotas públicas','docs: guia de contribuição'];

  // PDFs live in /public; replace them with the real files
  const RESUME = { pt: '/curriculo-eduardo-toste.pdf', en: '/resume-eduardo-toste.pdf' };

  let lang = store.get('pf-lang') === 'en' ? 'en' : 'pt';
  let curProj = 0;
  const t = k => T[lang][k];
  const v = x => typeof x === 'string' ? x : x[lang];
  const loc = () => lang === 'pt' ? 'pt-BR' : 'en-US';

  /* ================= reveal system ================= */
  const revealIO = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); revealIO.unobserve(e.target); onIn(e.target); } }), { threshold: 0.18, rootMargin: '0px 0px -6% 0px' });
  const watch = el => { if (!el.classList.contains('in')) revealIO.observe(el); };
  function split(el, words) {
    const txt = words ? words.map(w => w[0]).join(' ') : el.textContent;
    el.setAttribute('aria-label', txt);
    el.innerHTML = (words || txt.split(' ').map(w => [w])).map((w, i) => `<span class="w" aria-hidden="true"><span style="--i:${i}"${w[1] ? ` class="${w[1]}"` : ''}>${w[0]}</span></span>`).join(' ');
  }
  function countUp(b) {
    const end = parseFloat(b.dataset.count), dec = +(b.dataset.dec || 0), suf = b.dataset.suffix || '';
    const fmt = n => n.toLocaleString(loc(), { minimumFractionDigits: dec, maximumFractionDigits: dec }) + suf;
    if (reduce) { b.textContent = fmt(end); b.dataset.done = 1; return; }
    const t0 = performance.now(), dur = 1500;
    const st = now => { const p = Math.min(1, (now - t0) / dur), e = 1 - Math.pow(1 - p, 4); b.textContent = fmt(dec ? +(end * e).toFixed(dec) : Math.round(end * e)); if (p < 1) requestAnimationFrame(st); else b.dataset.done = 1; };
    requestAnimationFrame(st);
  }
  function onIn(el) { el.querySelectorAll?.('[data-count]').forEach(countUp); }

  /* commit rows next to section kickers */
  const rc = seeded(5);
  document.querySelectorAll('.commits').forEach(row => {
    row.setAttribute('aria-hidden', 'true');
    row.innerHTML = Array.from({ length: 22 }, (_, k) => { const q = rc(); return `<i class="l${q < .2 ? 1 : q < .45 ? 2 : q < .75 ? 3 : 4}" style="--k:${k}"></i>`; }).join('');
  });

  /* ================= renderers ================= */
  function renderStack() {
    document.getElementById('stack-grid').innerHTML = STACK.map((s, i) => `
      <div class="card hov rv" style="--d:${120 + i * 90}ms">
        <div class="sk-head"><h3>${v(s.name)}</h3><span class="lv" title="${t('stack.yrs')(s.yrs)}">${Array.from({ length: 5 }, (_, k) => `<i class="${k < s.lv - 1 ? 'on' : k < s.lv ? 'mid' : ''}"></i>`).join('')}</span></div>
        <p class="sk-desc">${s.desc[lang]} <span style="font:12px var(--f-m)">· ${t('stack.yrs')(s.yrs)}</span></p>
        <div class="chips">${s.items.map(x => `<span>${x}</span>`).join('')}</div>
      </div>`).join('');
    document.querySelectorAll('#stack-grid .rv').forEach(watch);
  }
  function renderProjects(animate) {
    const tabs = document.getElementById('ptabs'), d = document.getElementById('pdetail');
    tabs.innerHTML = PROJECTS.map((p, i) => `<button class="ptab" role="tab" id="pt-${i}" aria-controls="pdetail" aria-selected="${i === curProj}" tabindex="${i === curProj ? 0 : -1}">${p.name}<span>${v(p.kind)} · ${p.status[lang]}</span></button>`).join('');
    const p = PROJECTS[curProj];
    d.setAttribute('aria-labelledby', `pt-${curProj}`);
    d.innerHTML = `
      <span class="pstatus">${p.status[lang]}</span>
      <h3>${p.name}</h3>
      <p>${p.desc[lang]}</p>
      <p class="sublabel">${t('proj.arch')}</p>
      <div class="flow">${p.flow.map(s => `<span>${s}</span>`).join('<i>→</i>')}</div>
      <p class="sublabel">${t('proj.res')}</p>
      <div class="metrics">${p.metrics.map(m => `<div><b>${m[0]}</b><span>${m[1][lang]}</span></div>`).join('')}</div>
      <div class="chips">${p.tech.map(s => `<span>${s}</span>`).join('')}</div>
      <div class="plinks"><a class="btn g sm" href="#projetos">${t('proj.code')} ↗</a><a class="btn g sm" href="#projetos">${t('proj.live')} ↗</a></div>`;
    if (animate && !reduce) { d.classList.remove('swap'); void d.offsetWidth; d.classList.add('swap'); }
    tabs.querySelectorAll('.ptab').forEach((b, i) => {
      b.addEventListener('click', () => { if (i === curProj) return; curProj = i; renderProjects(true); document.getElementById(`pt-${i}`).focus(); FX.pulse(); });
      b.addEventListener('keydown', e => {
        const dir = e.key === 'ArrowDown' || e.key === 'ArrowRight' ? 1 : e.key === 'ArrowUp' || e.key === 'ArrowLeft' ? -1 : 0;
        if (!dir) return; e.preventDefault();
        curProj = (curProj + dir + PROJECTS.length) % PROJECTS.length; renderProjects(true); document.getElementById(`pt-${curProj}`).focus(); FX.pulse();
      });
    });
  }
  function renderTimeline() {
    const tl = document.getElementById('tl');
    tl.innerHTML = TIMELINE.map((e, n) => `
      <div class="tl-item rv ${e.work ? 'work' : ''} ${e.now ? 'now' : ''}" style="--d:${200 + n * 220}ms;--n:${n}">
        <span class="tl-dot"></span>
        <div>
          <div class="tl-head"><h3>${v(e.role)}${e.now ? `<span class="now-tag">${t('traj.now')}</span>` : ''}</h3><span>${e.period[lang]}</span></div>
          <p class="tl-org">${e.org}</p>
          <ul>${e.items[lang].map(i => `<li>${i}</li>`).join('')}</ul>
        </div>
      </div>`).join('');
    const isIn = tl.classList.contains('in');
    tl.querySelectorAll('.rv').forEach(el => isIn ? el.classList.add('in') : null);
    if (!isIn) watch(tl);
  }
  function renderTicker() {
    const r = seeded(9), hex = () => Math.floor(r() * 0xfffffff).toString(16).padStart(7, '0');
    const items = COMMITS.map(c => { const [type, ...rest] = c.split(':'); const q = r(); return `<span><i style="background:var(--c${q < .3 ? 2 : q < .7 ? 3 : 4})"></i><b>${hex()}</b><em>${type}:</em>${rest.join(':')}</span>`; }).join('');
    document.getElementById('ticker').innerHTML = items + items;
  }
  function applyLang() {
    document.documentElement.lang = lang === 'pt' ? 'pt-BR' : 'en';
    document.querySelectorAll('[data-t]').forEach(el => { const s = t(el.dataset.t); if (typeof s === 'string') el.textContent = s; });
    document.querySelectorAll('[data-th]').forEach(el => el.innerHTML = t(el.dataset.th));
    document.querySelectorAll('h2.split').forEach(el => split(el));
    split(document.getElementById('role'), t('role'));
    document.querySelectorAll('.lang button').forEach(b => b.setAttribute('aria-pressed', b.dataset.lang === lang));
    renderStack(); renderProjects(false); renderTimeline(); renderGraphHead();
    document.querySelectorAll('[data-cv="auto"]').forEach(a => a.href = RESUME[lang]);
    document.querySelectorAll('[data-count]').forEach(b => { if (b.dataset.done) { const dec = +(b.dataset.dec || 0); b.textContent = parseFloat(b.dataset.count).toLocaleString(loc(), { minimumFractionDigits: dec, maximumFractionDigits: dec }) + (b.dataset.suffix || ''); } });
  }
  document.querySelectorAll('.lang button').forEach(b => b.addEventListener('click', () => { if (lang === b.dataset.lang) return; lang = b.dataset.lang; store.set('pf-lang', lang); applyLang(); }));

  /* ================= résumé, copy, clock ================= */
  const rBtn = document.getElementById('resume-btn'), rMenu = document.getElementById('resume-menu');
  rBtn.addEventListener('click', e => { e.stopPropagation(); const open = rMenu.hidden; rMenu.hidden = !open; rBtn.setAttribute('aria-expanded', open); });
  document.addEventListener('click', e => { if (!e.target.closest('.resume')) { rMenu.hidden = true; rBtn.setAttribute('aria-expanded', 'false'); } });
  rMenu.addEventListener('click', e => { if (e.target.closest('a')) { rMenu.hidden = true; rBtn.setAttribute('aria-expanded', 'false'); } });
  const copyBtn = document.getElementById('copy');
  copyBtn.addEventListener('click', () => {
    const email = document.getElementById('email');
    const done = () => { copyBtn.textContent = t('contact.copied'); FX.pulse(); setTimeout(() => copyBtn.textContent = t('contact.copy'), 1800); };
    if (navigator.clipboard) navigator.clipboard.writeText(email.textContent).then(done, () => getSelection().selectAllChildren(email));
    else getSelection().selectAllChildren(email);
  });
  const clockFmt = new Intl.DateTimeFormat('pt-BR', { hour:'2-digit', minute:'2-digit', timeZone:'America/Sao_Paulo' });
  const tickClock = () => document.getElementById('clock').textContent = clockFmt.format(new Date());
  tickClock(); setInterval(tickClock, 15000);

  /* ================= DOM heatmap ================= */
  const rh = seeded(7); let cells = '';
  for (let i = 0; i < 53 * 7; i++) {
    const r = rh(), col = Math.floor(i / 7), boost = col / 53;
    const l = r < 0.34 - boost * 0.14 ? 0 : r < 0.62 ? 1 : r < 0.82 ? 2 : r < 0.94 ? 3 : 4;
    cells += `<i class="l${l}${i === 53 * 7 - 1 ? ' today' : ''}" style="--c:${col}"></i>`;
  }
  document.getElementById('heat').innerHTML = cells;

  /* ================= nav state + progress ================= */
  const sections = [...document.querySelectorAll('main > section')];
  const navLinks = [...document.querySelectorAll('.nav a')];
  const prog = document.getElementById('progress');
  function onScroll() {
    const max = document.documentElement.scrollHeight - innerHeight;
    prog.style.transform = `scaleX(${max > 0 ? scrollY / max : 0})`;
    let cur = 0; sections.forEach((s, k) => { if (s.getBoundingClientRect().top <= innerHeight * 0.5) cur = k; });
    navLinks.forEach((a, k) => a.setAttribute('aria-current', k + 1 === cur ? 'true' : 'false'));
  }
  addEventListener('scroll', onScroll, { passive: true });
  document.addEventListener('pointermove', e => {
    const el = e.target.closest?.('.card,.cgrid a,.cgrid button,.ptab'); if (!el) return;
    const r = el.getBoundingClientRect(); el.style.setProperty('--mx', `${e.clientX - r.left}px`); el.style.setProperty('--my', `${e.clientY - r.top}px`);
  }, { passive: true });

  /* ================= pixel shapes ================= */
  const FONT = {
    A:['01110','10001','10001','11111','10001','10001','10001'],
    D:['11110','10001','10001','10001','10001','10001','11110'],
    E:['11111','10000','10000','11110','10000','10000','11111'],
    O:['01110','10001','10001','10001','10001','10001','01110'],
    R:['11110','10001','10001','11110','10100','10010','10001'],
    S:['01111','10000','10000','01110','00001','00001','11110'],
    T:['11111','00100','00100','00100','00100','00100','00100'],
    U:['10001','10001','10001','10001','10001','10001','01110']
  };
  const NAME = 'EDUARDO TOSTE';
  function textBitmap(lines) {
    const adv = ch => ch === ' ' ? 3 : 6;
    const widths = lines.map(s => [...s].reduce((a, c) => a + adv(c), 0) - 1);
    const w = Math.max(...widths), h = lines.length * 7 + (lines.length - 1) * 3, bm = new Uint8Array(w * h);
    lines.forEach((s, li) => {
      let x = Math.floor((w - widths[li]) / 2); const y0 = li * 10;
      for (const ch of s) { const g = FONT[ch]; if (g) for (let r = 0; r < 7; r++) for (let c = 0; c < 5; c++) if (g[r][c] === '1') bm[(y0 + r) * w + x + c] = 1; x += adv(ch); }
    });
    return { w, h, bm };
  }
  function Art(w, h) {
    const a = new Uint8Array(w * h);
    const set = (x, y, l) => { x = Math.round(x); y = Math.round(y); if (x >= 0 && y >= 0 && x < w && y < h && a[y * w + x] < l) a[y * w + x] = l; };
    return {
      w, h, a, set,
      rect(x, y, ww, hh, l) { for (let j = y; j < y + hh; j++) for (let i = x; i < x + ww; i++) set(i, j, l); },
      frame(x, y, ww, hh, l) { for (let i = x; i < x + ww; i++) { set(i, y, l); set(i, y + hh - 1, l); } for (let j = y; j < y + hh; j++) { set(x, j, l); set(x + ww - 1, j, l); } },
      line(x0, y0, x1, y1, l, th = 1) { const n = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0)) * 2 || 1; for (let k = 0; k <= n; k++) { const x = x0 + (x1 - x0) * k / n, y = y0 + (y1 - y0) * k / n; for (let i = 0; i < th; i++) for (let j = 0; j < th; j++) set(x + i, y + j, l); } },
      disc(cx, cy, r, l) { for (let j = Math.floor(cy - r); j <= cy + r; j++) for (let i = Math.floor(cx - r); i <= cx + r; i++) if ((i - cx) ** 2 + (j - cy) ** 2 <= r * r) set(i, j, l); }
    };
  }
  const ICONS = {
    layers() {
      const A = Art(31, 25), cx = 15;
      for (let r = 0; r <= 14; r++) { const dy = Math.abs(r - 7), hw = 15 - 2 * dy; for (let x = cx - hw; x <= cx + hw; x++) A.set(x, r, (x <= cx - hw + 1 || x >= cx + hw - 1) ? 4 : 3); }
      [[12, 3], [17, 2]].forEach(([c0, l]) => { for (let r = c0; r <= c0 + 7; r++) { const hw = 15 - 2 * (r - c0); [cx - hw, cx - hw + 1, cx + hw, cx + hw - 1].forEach(x => A.set(x, r, l)); } });
      return A;
    },
    browser() {
      const A = Art(32, 24);
      A.frame(0, 0, 32, 24, 2); A.rect(1, 1, 30, 3, 1);
      A.set(3, 2, 4); A.set(5, 2, 3); A.set(7, 2, 2); A.rect(11, 2, 17, 1, 2);
      A.rect(3, 6, 13, 7, 3); A.rect(3, 6, 13, 1, 4);
      A.rect(18, 6, 11, 1, 4); A.rect(18, 8, 9, 1, 2); A.rect(18, 10, 10, 1, 2); A.rect(18, 12, 5, 1, 4);
      for (let k = 0; k < 3; k++) { const x = 3 + k * 9; A.frame(x, 15, 8, 6, 2); A.rect(x + 1, 16, 6, 1, 4); A.rect(x + 1, 18, 4, 1, 1); }
      return A;
    },
    // activity panel: framed like the browser icon, with a title, a live dot and rising commit bars on a baseline
    bars() {
      const A = Art(32, 24), hs = [5, 7, 6, 9, 8, 11, 10, 12, 13];
      A.frame(0, 0, 32, 24, 2);
      A.rect(3, 3, 10, 1, 4); A.rect(3, 5, 6, 1, 2); A.rect(27, 3, 2, 2, 4);
      hs.forEach((h, k) => { const x = 3 + k * 3; for (let y = 21 - h; y <= 20; y++) A.rect(x, y, 2, 1, y === 21 - h ? 4 : k > 4 ? 3 : 2); });
      A.rect(2, 21, 28, 1, 1);
      return A;
    },
    branch() {
      const A = Art(27, 30);
      A.rect(7, 0, 2, 30, 2);
      A.line(9, 8, 17, 13, 2, 2); A.rect(17, 13, 2, 9, 2); A.line(17, 21, 9, 25, 2, 2);
      A.disc(7.5, 3.5, 3.8, 1); A.disc(7.5, 3.5, 2.6, 4);
      A.disc(7.5, 15.5, 2.3, 3); A.disc(7.5, 27, 2.3, 3); A.disc(17.5, 17, 2.3, 4);
      return A;
    },
    mail() {
      const A = Art(31, 21);
      A.rect(1, 1, 29, 19, 1); A.frame(0, 0, 31, 21, 3);
      A.line(1, 1, 15, 11, 4); A.line(29, 1, 15, 11, 4);
      A.line(1, 19, 11, 11, 2); A.line(29, 19, 19, 11, 2);
      return A;
    }
  };

  /* ================= cell engine ================= */
  // Each slot owns its cells and is clipped to its own frame, so nothing ever crosses the text.
  // Entering: cells fly up from below the frame on springs, in a left-to-right / bottom-up wave, and land with a soft glow.
  // Leaving: they fall back out in reverse. Visibility is smoothed over time so jumpy scrolling still reads as fluid motion.
  const CELLS = ['#161B22', '#0E4429', '#006D32', '#26A641', '#39D353'];
  const HOT = '126,231,135';
  const FX = (() => {
    const cv = document.getElementById('fx'), ctx = cv.getContext('2d');
    const slots = [...document.querySelectorAll('.slot')];
    let W = 0, H = 0, dpr = 1, shapes = [], mx = -1e4, my = -1e4, ripples = [], built = false, running = false, last = 0, onSlotClick = () => {};
    const clamp = x => x < 0 ? 0 : x > 1 ? 1 : x;
    const smooth = (a, b, x) => { const t = clamp((x - a) / (b - a)); return t * t * (3 - 2 * t); };
    const outCubic = x => 1 - Math.pow(1 - x, 3);
    const WIN = .3;

    function makeShape(slot, cells, cols, rows, pitch, sh) {
      const n = cells.length, f32 = () => new Float32Array(n);
      const S = { slot, n, pitch, s: pitch * .8, hx: f32(), hy: f32(), sx: f32(), sy: f32(), px: f32(), py: f32(), vx: f32(), vy: f32(), heat: f32(), th: f32(), l: new Uint8Array(n), seen: new Uint8Array(n), v: reduce ? 1 : 0, target: 0 };
      let maxT = 0;
      cells.forEach(([c, r, x, y, lv], i) => {
        S.hx[i] = x; S.hy[i] = y; S.l[i] = lv;
        S.sx[i] = x + (Math.random() - .5) * pitch * 7;
        S.sy[i] = sh + pitch * (2 + Math.random() * 7);
        S.px[i] = S.sx[i]; S.py[i] = S.sy[i];
        S.th[i] = (c / cols) * .5 + ((rows - 1 - r) / rows) * .18 + Math.random() * .07;
        maxT = Math.max(maxT, S.th[i]);
      });
      for (let i = 0; i < n; i++) S.th[i] *= (1 - WIN) / maxT;
      if (reduce) { S.px.set(S.hx); S.py.set(S.hy); }
      return S;
    }
    function heroShape(slot, sw, maxH) {
      const words = NAME.split(' ');
      const cfgs = [{ lines: words, s: 2, min: 7.5 }, { lines: [NAME], s: 2, min: 6 }, { lines: words, s: 1, min: 0 }];
      let pick;
      for (const cfg of cfgs) {
        const bm = textBitmap(cfg.lines), m = 2, s = cfg.s;
        const cols = (bm.w + 2 * m) * s, rows = (bm.h + 2 * m) * s, pitch = Math.min(sw / cols, maxH / rows);
        if (pitch >= cfg.min) { pick = { bm, m, s, rows, pitch: Math.max(4, Math.min(16, pitch)) }; break; }
      }
      const { bm, m, s, rows, pitch } = pick, nw = bm.w * s;
      let cols = Math.floor(sw / pitch); if ((cols - nw) % 2) cols--;
      const offC = (cols - nw) / 2, ox = (sw - cols * pitch) / 2, rnd = seeded(11), cells = [];
      for (let c = 0; c < cols; c++) for (let r = 0; r < rows; r++) {
        const fx = Math.floor((c - offC) / s), fy = Math.floor((r - m * s) / s);
        const lit = c >= offC && fx < bm.w && fy >= 0 && fy < bm.h && bm.bm[fy * bm.w + fx], q = rnd();
        cells.push([c, r, ox + c * pitch + pitch / 2, r * pitch + pitch / 2, lit ? (q < .15 ? 2 : q < .55 ? 3 : 4) : (q < .06 ? 1 : q < .075 ? 2 : 0)]);
      }
      slot.style.height = rows * pitch + 'px';
      return makeShape(slot, cells, cols, rows, pitch, rows * pitch);
    }
    // crops the art to its drawn pixels and centers it with equal margins on every side
    function iconShape(slot, A, sw, sh) {
      let x0 = A.w, x1 = -1, y0 = A.h, y1 = -1;
      for (let y = 0; y < A.h; y++) for (let x = 0; x < A.w; x++) if (A.a[y * A.w + x]) { x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y); }
      const bw = x1 - x0 + 1, bh = y1 - y0 + 1, pad = 3;
      const E = 6, p0 = Math.max(5, Math.min(20, Math.floor(Math.min(sw / (bw + 2 * pad), sh / (bh + 2 * pad)))));
      let cols = Math.floor((sw - 2 * E) / p0), rows = Math.floor((sh - 2 * E) / p0);
      if ((cols - bw) % 2) cols--; if ((rows - bh) % 2) rows--;
      const pitch = Math.min((sw - 2 * E) / cols, (sh - 2 * E) / rows); // stretch so every frame keeps the same edge gap
      const offC = (cols - bw) / 2, offR = (rows - bh) / 2, ox = (sw - cols * pitch) / 2, oy = (sh - rows * pitch) / 2, cells = [];
      for (let c = 0; c < cols; c++) for (let r = 0; r < rows; r++) {
        const ax = c - offC + x0, ay = r - offR + y0;
        const lv = ax >= x0 && ay >= y0 && ax <= x1 && ay <= y1 ? A.a[ay * A.w + ax] : 0;
        cells.push([c, r, ox + c * pitch + pitch / 2, oy + r * pitch + pitch / 2, lv]);
      }
      return makeShape(slot, cells, cols, rows, pitch, sh);
    }

    function build() {
      W = document.documentElement.clientWidth; H = document.documentElement.clientHeight; dpr = Math.min(2, devicePixelRatio || 1);
      cv.width = W * dpr; cv.height = H * dpr;
      const prev = shapes.map(s => s.v);
      shapes = slots.map((s, k) => k === 0 ? heroShape(s, s.clientWidth, Math.min(H * .44, 420)) : iconShape(s, ICONS[s.dataset.shape](), s.clientWidth, s.clientHeight));
      if (built) shapes.forEach((s, k) => { if (prev[k] > .5) { s.v = prev[k]; s.px.set(s.hx); s.py.set(s.hy); s.seen.fill(1); } });
      built = true;
      if (reduce) render(0, performance.now());
    }
    function render(dt, now) {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);
      const rr = typeof Path2D.prototype.roundRect === 'function';
      const k = 1 - Math.exp(-dt / 320), R = 74, R2 = R * R;
      ripples = ripples.filter(r => (now - r.t) * .85 < Math.max(W, H) * 1.2);
      for (const sh of shapes) {
        const r = sh.slot.getBoundingClientRect(), bx = r.left + sh.slot.clientLeft, by = r.top + sh.slot.clientTop;
        const vis = clamp((Math.min(r.bottom, H) - Math.max(r.top, 0)) / Math.max(1, r.height));
        sh.target = smooth(.2, .7, vis);
        sh.v = reduce ? sh.target : sh.v + (sh.target - sh.v) * k;
        if (Math.abs(sh.v - sh.target) < .0005) sh.v = sh.target;
        if (r.bottom < -40 || r.top > H + 40) { if (sh.v < .001) { sh.seen.fill(0); sh.px.set(sh.sx); sh.py.set(sh.sy); sh.vx.fill(0); sh.vy.fill(0); } continue; }
        if (sh.v < .001 && !reduce) continue;
        const base = CELLS.map(() => new Path2D()), glow = [0, 1, 2, 3, 4].map(() => new Path2D());
        const add = (path, x, y, s) => { const o = s / 2; if (rr) path.roundRect(x - o, y - o, s, s, s * .22); else path.rect(x - o, y - o, s, s); };
        const rising = sh.target >= sh.v, lmx = mx - bx, lmy = my - by;
        for (let i = 0; i < sh.n; i++) {
          const e = reduce ? 1 : clamp((sh.v - sh.th[i]) / WIN), ee = outCubic(e);
          let h = sh.heat[i];
          if (!reduce) {
            if (e > 0 && !sh.seen[i]) { sh.seen[i] = 1; if (rising && sh.l[i] > 0) h = Math.max(h, .7); }
            if (e <= 0) sh.seen[i] = 0;
            const tx = sh.sx[i] + (sh.hx[i] - sh.sx[i]) * ee, ty = sh.sy[i] + (sh.hy[i] - sh.sy[i]) * ee;
            let vx = (sh.vx[i] + (tx - sh.px[i]) * .11) * .8, vy = (sh.vy[i] + (ty - sh.py[i]) * .11) * .8;
            if (e > 0) {
              const dx = sh.px[i] - lmx, dy = sh.py[i] - lmy, d2 = dx * dx + dy * dy;
              if (d2 < R2) { const d = Math.sqrt(d2) || 1, f = 1 - d / R; h += (Math.max(h, .35 + f * .65) - h) * .3; vx += dx / d * f * .8; vy += dy / d * f * .8; }
              for (const rp of ripples) {
                const rad = (now - rp.t) * .85, ex = bx + sh.px[i] - rp.x, ey = by + sh.py[i] - rp.y, band = rad - Math.sqrt(ex * ex + ey * ey);
                if (band > 0 && band < 50) h = Math.max(h, Math.sin(band / 50 * Math.PI) * rp.p);
              }
            }
            sh.vx[i] = vx; sh.vy[i] = vy; sh.px[i] += vx; sh.py[i] += vy;
            h *= .955; sh.heat[i] = h;
          }
          if (e <= 0) continue;
          const s = sh.s * (.3 + .7 * ee) * (1 + Math.min(h, 1) * .22), x = bx + sh.px[i], y = by + sh.py[i];
          add(base[sh.l[i]], x, y, s);
          if (h > .06) add(glow[Math.min(4, h * 5 | 0)], x, y, s);
        }
        if (!reduce && sh.v > .9) for (let q = 0; q < 2; q++) { const i = Math.random() * sh.n | 0; if (sh.l[i] > 0 && sh.heat[i] < .3) sh.heat[i] = .3; }
        ctx.save();
        ctx.beginPath(); if (rr) ctx.roundRect(r.left - 2, r.top - 2, r.width + 4, r.height + 4, 14); else ctx.rect(r.left - 2, r.top - 2, r.width + 4, r.height + 4); ctx.clip();
        base.forEach((p, b) => { ctx.fillStyle = CELLS[b]; ctx.fill(p); });
        glow.forEach((p, b) => { ctx.fillStyle = `rgba(${HOT},${(b + 1) * .17})`; ctx.fill(p); });
        ctx.restore();
      }
    }
    function frame(now) {
      const dt = Math.min(64, now - (last || now)); last = now;
      if (!document.hidden) render(dt, now);
      requestAnimationFrame(frame);
    }
    // click on a drawing: cells burst away from the pointer, spring back home and light up in a ring
    function burst(sh, x, y) {
      const r = sh.slot.getBoundingClientRect(), lx = x - r.left - sh.slot.clientLeft, ly = y - r.top - sh.slot.clientTop, RB = Math.max(160, sh.pitch * 14);
      for (let i = 0; i < sh.n; i++) {
        const dx = sh.px[i] - lx, dy = sh.py[i] - ly, d = Math.sqrt(dx * dx + dy * dy) || 1;
        if (d < RB) { const f = Math.pow(1 - d / RB, 1.5); sh.vx[i] += dx / d * f * 16 + (Math.random() - .5) * f * 4; sh.vy[i] += dy / d * f * 16 + (Math.random() - .5) * f * 4; }
      }
      ripples.push({ x, y, t: performance.now(), p: 1 });
    }

    addEventListener('pointermove', e => { mx = e.clientX; my = e.clientY; }, { passive: true });
    document.addEventListener('pointerleave', () => { mx = my = -1e4; });
    addEventListener('blur', () => { mx = my = -1e4; });
    addEventListener('pointerdown', e => {
      if (reduce || e.target.closest('a,button,input,.card,.ptab,code,.menu,.commit-card,.cgrid')) return;
      const k = shapes.findIndex(sh => { const r = sh.slot.getBoundingClientRect(); return sh.v > .5 && e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom; });
      if (k >= 0) { burst(shapes[k], e.clientX, e.clientY); onSlotClick(k); }
      else ripples.push({ x: e.clientX, y: e.clientY, t: performance.now(), p: .55 });
    });
    let rw = innerWidth, rhh = innerHeight, rt;
    addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(() => { if (innerWidth !== rw || Math.abs(innerHeight - rhh) > 120) { rw = innerWidth; rhh = innerHeight; build(); } }, 160); });
    addEventListener('scroll', () => { if (reduce && built) render(0, performance.now()); }, { passive: true });

    return {
      start() { build(); if (!reduce && !running) { running = true; requestAnimationFrame(frame); } },
      onClick(fn) { onSlotClick = fn; },
      pulse() {
        if (reduce || !built) return;
        const sh = shapes.find(s => { const r = s.slot.getBoundingClientRect(); return r.top < H * .7 && r.bottom > H * .3; });
        if (sh) { const r = sh.slot.getBoundingClientRect(); ripples.push({ x: r.left + r.width / 2, y: r.top + r.height / 2, t: performance.now(), p: .8 }); }
      }
    };
  })();

  /* ================= commit feedback when a drawing is clicked ================= */
  let heroCount = 1248;
  const hexChars = '0123456789abcdef';
  function renderGraphHead() { document.getElementById('ghead').innerHTML = t('graph.head')(heroCount.toLocaleString(loc())); }
  FX.onClick(k => {
    if (k === 0) {
      heroCount++; renderGraphHead();
      const b = document.querySelector('#ghead b'); b.classList.add('bump');
      return;
    }
    const card = document.querySelectorAll('.slot')[k].parentElement.querySelector('.commit-card');
    const hash = card.querySelector('.ch b'), final = Array.from({ length: 7 }, () => hexChars[Math.random() * 16 | 0]).join('');
    let f = 0; const id = setInterval(() => { f++; hash.textContent = f >= 8 ? final : Array.from({ length: 7 }, (_, i) => i < f - 1 ? final[i] : hexChars[Math.random() * 16 | 0]).join(''); if (f >= 8) clearInterval(id); }, 40);
    const plus = document.createElement('span'); plus.className = 'plus'; plus.textContent = '+1 commit';
    card.appendChild(plus); setTimeout(() => plus.remove(), 1200);
  });

  renderTicker();
  applyLang();
  document.querySelectorAll('.rv, .split, .commits, .heat, .hstats').forEach(watch);
  onScroll();
  FX.start();
})();
