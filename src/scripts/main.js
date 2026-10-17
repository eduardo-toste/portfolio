import { loadGitHub } from './github.js';

(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const touch = matchMedia('(hover: none)').matches;
  if (!reduce) document.documentElement.classList.add('anim');
  const store = { get(k){ try { return localStorage.getItem(k); } catch { return null; } }, set(k,v){ try { localStorage.setItem(k,v); } catch {} } };
  const seeded = s => () => { s |= 0; s = s + 0x6D2B79F5 | 0; let x = Math.imul(s ^ s >>> 15, 1 | s); x = x + Math.imul(x ^ x >>> 7, 61 | x) ^ x; return ((x ^ x >>> 14) >>> 0) / 4294967296; };

  /* ================= content ================= */
  const GH_USER = 'eduardo-toste';
  const T = {
    pt: {
      'nav.stack':'Stack','nav.proj':'Projetos','nav.gh':'GitHub','nav.traj':'Trajetória','nav.contact':'Contato',
      'nav.projl':'projetos','nav.trajl':'trajetória','nav.contactl':'contato',
      'graph.head':n => `<b>${n}</b> contribuições no último ano`,'graph.less':'Menos','graph.more':'Mais',
      'graph.hint':'passe o mouse para commitar · clique no gráfico para um novo commit','graph.hintTouch':'toque no gráfico para um novo commit','graph.scroll':'role para explorar ↓',
      'role':[['Engenheiro'],['de'],['Software.','acc']],
      'hero.lead':'Engenheiro de Software que gosta de pensar o sistema inteiro: arquitetura, APIs, nuvem e qualidade. Hoje exploro como levar IA generativa para produtos e para o próprio jeito de construir software, com LLMs, agentes e automação.',
      'hero.cta2':'Ver projetos',
      'hs.years':'anos de experiência em tecnologia','hs.repos':'repositórios públicos no GitHub','hs.commits':'contribuições no último ano','hs.effort':'menos esforço para criar testes no framework que projetei',
      'cm.stack':'software, cloud e IA','cm.proj':'3 projetos em destaque','cm.gh':n => n > 0 ? `sequência de ${n} ${n === 1 ? 'dia' : 'dias'}` : 'sincronizado com o GitHub','cm.traj':'experiência + formação','cm.contact':'aguardando seu merge',
      'stack.title':'Com o que eu trabalho','stack.lead':'Engenharia de software de ponta a ponta: arquitetura, APIs, dados, nuvem e testes, com IA entrando cada vez mais no meio do caminho.',
      'proj.title':'Coisas que eu construí',
      'proj.arch':'arquitetura','proj.res':'destaques','proj.code':'Código da API','proj.ui':'Código do front-end','proj.live':'Ver ao vivo',
      'proj.updated':d => `atualizado ${d}`,'proj.stars':n => `${n} ★`,
      'gh.title':'Atividade no GitHub','gh.total':'contribuições no último ano',
      'gh.loading':'carregando dados do GitHub…','gh.live':'dados reais · API do GitHub','gh.error':'não foi possível carregar o GitHub agora · tente recarregar',
      'gh.cell':n => `${n} ${n === 1 ? 'contribuição' : 'contribuições'}`,'gh.days':'dias ativos','gh.streak':'sequência atual','gh.best':'maior sequência','gh.top':'melhor dia','gh.today':'hoje ▢',
      'gh.repos':'repositórios atualizados recentemente','gh.all':'Ver todos no GitHub ↗',
      'traj.title':'Experiência e formação','traj.now':'atual',
      'contact.title':'Vamos conversar?','contact.lead':'Quer falar sobre backend, Java ou algum projeto? Me chame no LinkedIn. Falo inglês em nível avançado (C1).',
      'footer':'Feito com Astro e muitos commits.',
      'a.nav':'Seções','a.lang':'Idioma','a.proj':'Projetos','a.heat':'Mapa de contribuições do último ano','a.name':'Eduardo Toste escrito com quadrados do gráfico de contribuições'
    },
    en: {
      'nav.stack':'Stack','nav.proj':'Projects','nav.gh':'GitHub','nav.traj':'Journey','nav.contact':'Contact',
      'nav.projl':'projects','nav.trajl':'journey','nav.contactl':'contact',
      'graph.head':n => `<b>${n}</b> contributions in the last year`,'graph.less':'Less','graph.more':'More',
      'graph.hint':'hover to commit · click the graph for a new commit','graph.hintTouch':'tap the graph for a new commit','graph.scroll':'scroll to explore ↓',
      'role':[['Software'],['Engineer.','acc']],
      'hero.lead':'Software engineer who likes thinking about the whole system: architecture, APIs, cloud and quality. These days I explore how to bring generative AI into products and into the way software gets built, with LLMs, agents and automation.',
      'hero.cta2':'See projects',
      'hs.years':'years of experience in tech','hs.repos':'public repositories on GitHub','hs.commits':'contributions in the last year','hs.effort':'less effort to write tests with the framework I designed',
      'cm.stack':'software, cloud and AI','cm.proj':'3 featured projects','cm.gh':n => n > 0 ? `${n}-day streak` : 'synced with GitHub','cm.traj':'experience + education','cm.contact':'waiting for your merge',
      'stack.title':'What I work with','stack.lead':'End-to-end software engineering: architecture, APIs, data, cloud and testing, with AI increasingly part of the path.',
      'proj.title':'Things I’ve built',
      'proj.arch':'architecture','proj.res':'highlights','proj.code':'API code','proj.ui':'Front-end code','proj.live':'Live demo',
      'proj.updated':d => `updated ${d}`,'proj.stars':n => `${n} ★`,
      'gh.title':'GitHub activity','gh.total':'contributions in the last year',
      'gh.loading':'loading GitHub data…','gh.live':'live data · GitHub API','gh.error':'couldn’t load GitHub right now · try reloading',
      'gh.cell':n => `${n} ${n === 1 ? 'contribution' : 'contributions'}`,'gh.days':'active days','gh.streak':'current streak','gh.best':'longest streak','gh.top':'best day','gh.today':'today ▢',
      'gh.repos':'recently updated repositories','gh.all':'See all on GitHub ↗',
      'traj.title':'Experience & education','traj.now':'current',
      'contact.title':'Let’s talk','contact.lead':'Want to talk about backend, Java or a project? Reach out on LinkedIn. My English is advanced (C1).',
      'footer':'Built with Astro and a lot of commits.',
      'a.nav':'Sections','a.lang':'Language','a.proj':'Projects','a.heat':'Contribution map for the last year','a.name':'Eduardo Toste written with contribution graph squares'
    }
  };
  const STACK = [
    { name:'Backend', desc:{pt:'APIs REST seguras, escaláveis e fáceis de manter.',en:'Secure, scalable and maintainable REST APIs.'},
      items:['Java','Spring Boot','Spring Data JPA','Spring Security','Spring Cloud','Eureka','OpenFeign','Hibernate','JWT','OAuth2','OpenAPI/Swagger'] },
    { name:{pt:'Arquitetura',en:'Architecture'}, desc:{pt:'Sistemas desacoplados, com regras de negócio isoladas da infraestrutura.',en:'Decoupled systems with business rules isolated from infrastructure.'},
      items:{pt:['Microsserviços','Arquitetura Hexagonal','Clean Architecture','Camadas','Spring Cloud Gateway','SOLID','Clean Code'],en:['Microservices','Hexagonal Architecture','Clean Architecture','Layered','Spring Cloud Gateway','SOLID','Clean Code']} },
    { name:{pt:'Dados e mensageria',en:'Data & messaging'}, desc:{pt:'Bancos relacionais e NoSQL, migrações versionadas e eventos assíncronos.',en:'Relational and NoSQL databases, versioned migrations and async events.'},
      items:['PostgreSQL','MySQL','SQL Server','MongoDB','Redis','Flyway','Apache Kafka','RabbitMQ'] },
    { name:'AWS & DevOps', desc:{pt:'Do container ao deploy automatizado, com observabilidade.',en:'From container to automated deploys, with observability.'},
      items:['EC2','Lambda','ECS','Fargate','S3','RDS','DynamoDB','SQS','API Gateway','CloudWatch','IAM','Secrets Manager','Docker','GitHub Actions','Maven'] },
    { name:{pt:'Testes e qualidade',en:'Testing & quality'}, desc:{pt:'Testes automatizados em todo o ciclo, da unidade à integração com containers reais.',en:'Automated tests across the cycle, from unit to integration with real containers.'},
      items:['JUnit 5','Mockito','Testcontainers','Rest Assured','JaCoCo','TDD'] },
    { name:{pt:'Outras linguagens',en:'Other languages'}, desc:{pt:'Para front-end, automação e scripts quando o projeto pede.',en:'For front-end, automation and scripting when the project calls for it.'},
      items:['TypeScript','JavaScript','Python','SQL','Node.js','React'] }
  ];
  const PROJECTS = [
    { name:'Lista.ai', repo:'Lista.ai', ui:'Lista.ai-Ui', kind:{pt:'microsserviços · IA',en:'microservices · AI'},
      desc:{pt:'Plataforma de gestão de listas de compras em microsserviços, que gera os itens automaticamente a partir de receitas usando IA.',en:'Microservices platform for managing shopping lists that generates items automatically from recipes using AI.'},
      flow:['React + TS',{pt:'Serviços (Hexagonal)',en:'Services (Hexagonal)'},'OpenFeign · Kafka','Spring AI · GenAI','WhatsApp (Twilio)'],
      items:{pt:['Backend em Java 21 e Spring Boot com Arquitetura Hexagonal, estruturado em microsserviços desacoplados.','Google GenAI e Spring AI geram itens a partir de receitas; comunicação síncrona via OpenFeign e assíncrona via Kafka.','Notificações via WhatsApp com Twilio e API documentada com Swagger/OpenAPI.'],
             en:['Java 21 and Spring Boot backend with Hexagonal Architecture, split into decoupled microservices.','Google GenAI and Spring AI generate items from recipes; sync calls via OpenFeign and async via Kafka.','WhatsApp notifications through Twilio and an API documented with Swagger/OpenAPI.']},
      tech:['Java 21','Spring Boot','Apache Kafka','Spring AI','React','TypeScript'] },
    { name:'NextMove', repo:'NextMove', ui:'NextMoveUi', kind:{pt:'microsserviços · finanças',en:'microservices · finance'},
      desc:{pt:'Plataforma de gestão financeira pessoal em microsserviços, com cada serviço escalando de forma independente.',en:'Personal finance platform built on microservices, with each service scaling independently.'},
      flow:['React','API Gateway','Eureka',{pt:'Serviços Spring',en:'Spring services'},'RabbitMQ','PostgreSQL · MongoDB'],
      items:{pt:['API Gateway e Service Registry (Eureka) permitindo escalar cada serviço de forma independente.','RabbitMQ para eventos assíncronos e OpenFeign para chamadas síncronas, com dados em PostgreSQL e MongoDB.','Notificações por e-mail, scheduler de lembretes e API documentada com Swagger/OpenAPI.'],
             en:['API Gateway and Service Registry (Eureka) so each service scales independently.','RabbitMQ for async events and OpenFeign for sync calls, with data in PostgreSQL and MongoDB.','E-mail notifications, a reminder scheduler and an API documented with Swagger/OpenAPI.']},
      tech:['Java 21','Spring Boot','Spring Cloud','RabbitMQ','PostgreSQL','MongoDB'] },
    { name:'FightHub', repo:'FightHub', ui:'FightHubUi', kind:{pt:'API REST · gestão',en:'REST API · management'},
      desc:{pt:'Sistema de gestão para academias de Jiu-Jitsu, cobrindo o ciclo completo de alunos, turmas e presenças.',en:'Management system for Jiu-Jitsu academies, covering the full lifecycle of students, classes and attendance.'},
      flow:['React','Spring Security · JWT',{pt:'API em camadas',en:'Layered API'},'Swagger/OpenAPI'],
      items:{pt:['Backend em Java 21 e Spring Boot com Arquitetura em Camadas.','Autenticação JWT com Spring Security e controle de acesso por perfis (RBAC).','Regras de negócio cobertas com JUnit 5 e Mockito e API documentada com Swagger/OpenAPI.'],
             en:['Java 21 and Spring Boot backend with a Layered Architecture.','JWT authentication with Spring Security and role-based access control (RBAC).','Business rules covered with JUnit 5 and Mockito and an API documented with Swagger/OpenAPI.']},
      tech:['Java 21','Spring Boot','Spring Security','JWT','React','JUnit 5'] }
  ];
  const TIMELINE = [
    { work:true, now:true, role:{pt:'Engenheiro de Software Júnior',en:'Junior Software Engineer'}, org:'Itaú Unibanco', period:{pt:'out 2026 — hoje',en:'Oct 2026 — now'},
      items:{pt:['Desenvolvo e mantenho microsserviços e APIs REST em Java 21 com Spring Boot, aplicando Arquitetura Hexagonal, Clean Code e SOLID.','Integro serviços de forma assíncrona com Apache Kafka e Amazon SQS, tratando idempotência, retentativas e dead-letter queues.','Provisiono e evoluo infraestrutura na AWS (ECS Fargate, Lambda, RDS, DynamoDB, S3) como código com Terraform.','Automatizo build, testes e deploy em pipelines de CI/CD, com análise de qualidade e cobertura (JaCoCo, SonarQube) a cada Pull Request.','Monitoro os serviços em produção com Datadog (APM, logs, métricas e dashboards), configurando alertas e atuando na investigação de incidentes.','Garanto a qualidade com testes unitários e de integração (JUnit 5, Mockito, Testcontainers) e participo de code reviews e cerimônias ágeis.'],
             en:['Build and maintain microservices and REST APIs in Java 21 with Spring Boot, applying Hexagonal Architecture, Clean Code and SOLID.','Integrate services asynchronously with Apache Kafka and Amazon SQS, handling idempotency, retries and dead-letter queues.','Provision and evolve AWS infrastructure (ECS Fargate, Lambda, RDS, DynamoDB, S3) as code with Terraform.','Automate build, test and deploy in CI/CD pipelines, with quality and coverage checks (JaCoCo, SonarQube) on every Pull Request.','Monitor production services with Datadog (APM, logs, metrics and dashboards), setting up alerts and investigating incidents.','Ensure quality with unit and integration tests (JUnit 5, Mockito, Testcontainers) and take part in code reviews and agile ceremonies.']} },
    { work:true, role:{pt:'Analista de QA Júnior',en:'Junior QA Analyst'}, org:'NTT DATA Europe & Latam', period:{pt:'nov 2024 — out 2026',en:'Nov 2024 — Oct 2026'},
      items:{pt:['Projetei do zero um framework de automação para SAP com arquitetura modular, reduzindo em ~40% o esforço de criação de novos testes.','Desenvolvi testes automatizados de APIs REST em Java, validando contratos, autenticação e regras de negócio dos serviços backend.','Migrei o framework de Python para JavaScript, aumentando a aderência à stack do time e reduzindo o custo de manutenção.','Otimizei pipelines de CI/CD com GitHub Actions, executando os testes a cada Pull Request.','Liderei revisões de código e aprovação de PRs junto ao Tech Lead, além de documentação técnica e onboarding.'],
             en:['Designed from scratch a modular automation framework for SAP, cutting the effort to create new tests by ~40%.','Built automated REST API tests in Java, validating contracts, authentication and business rules of backend services.','Migrated the framework from Python to JavaScript, aligning it with the team’s stack and lowering maintenance cost.','Optimized CI/CD pipelines with GitHub Actions, running tests on every Pull Request.','Led code reviews and PR approvals with the Tech Lead, plus technical documentation and onboarding.']} },
    { work:true, role:{pt:'Desenvolvedor Full Stack Júnior',en:'Junior Full Stack Developer'}, org:'FKL Service Tecnologia', period:{pt:'set 2024 — nov 2024',en:'Sep 2024 — Nov 2024'},
      items:{pt:['Desenvolvi aplicações backend e frontend com Node.js, TypeScript e React, reduzindo em ~15% o tempo de tarefas logísticas.','Otimizei consultas SQL e corrigi falhas críticas em produção, reduzindo em ~25% os chamados de suporte.','Integrei APIs REST entre frontend e backend, garantindo consistência no fluxo de dados.'],
             en:['Built backend and frontend applications with Node.js, TypeScript and React, cutting logistics task time by ~15%.','Optimized SQL queries and fixed critical production failures, reducing support tickets by ~25%.','Integrated REST APIs between frontend and backend, keeping the data flow consistent.']} },
    { work:true, role:{pt:'Analista de Infra Services',en:'Infrastructure Services Analyst'}, org:'TOTVS Paulista', period:{pt:'ago 2023 — ago 2024',en:'Aug 2023 — Aug 2024'},
      items:{pt:['Sustentei ambientes corporativos de servidores e bancos de dados, mantendo SLA acima de 95%.','Ajustei o monitoramento no Zabbix, reduzindo em ~20% os alertas falsos e acelerando a resposta a incidentes.'],
             en:['Supported corporate server and database environments, keeping SLA above 95%.','Tuned Zabbix monitoring, cutting false alerts by ~20% and speeding up incident response.']} },
    { work:false, role:{pt:'Tecnólogo em Análise e Desenvolvimento de Sistemas',en:'Associate Degree in Systems Analysis and Development'}, org:'FACENS · Faculdade de Engenharia de Sorocaba', period:{pt:'2022 — 2024',en:'2022 — 2024'},
      items:{pt:['Estrutura de Dados, POO, Banco de Dados, Engenharia de Software, Arquitetura de Sistemas, Java e Testes de Software.'],
             en:['Data Structures, OOP, Databases, Software Engineering, Systems Architecture, Java and Software Testing.']} }
  ];
  // ticker fallback while GitHub loads (or if it fails); replaced by recently pushed repos
  const COMMITS = ['feat(lista-ai): itens gerados com Spring AI','feat(nextmove): API Gateway + Eureka','feat(fighthub): RBAC com Spring Security','test: integração com Testcontainers','chore(ci): testes a cada PR no GitHub Actions','feat(events): consumidores Kafka','feat(queue): eventos assíncronos com RabbitMQ','refactor: arquitetura hexagonal','docs: contratos com OpenAPI','perf(db): consultas SQL otimizadas'];


  let lang = store.get('pf-lang') === 'en' ? 'en' : 'pt';
  let curProj = 0, heroCount = null;
  const t = k => T[lang][k];
  const v = x => typeof x === 'string' ? x : x[lang];
  const loc = () => lang === 'pt' ? 'pt-BR' : 'en-US';

  /* ================= reveal system ================= */
  // 18% of an element, or a fifth of the screen for blocks taller than the viewport (the timeline on phones never reaches 18%)
  const shown = e => e.isIntersecting && (e.intersectionRatio >= 0.18 || e.intersectionRect.height >= innerHeight * 0.2);
  const revealIO = new IntersectionObserver(es => es.forEach(e => { if (shown(e)) { e.target.classList.add('in'); revealIO.unobserve(e.target); onIn(e.target); } }), { threshold: [0, 0.02, 0.05, 0.1, 0.18], rootMargin: '0px 0px -6% 0px' });
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
        <div class="sk-head"><h3>${v(s.name)}</h3></div>
        <p class="sk-desc">${s.desc[lang]}</p>
        <div class="chips">${(Array.isArray(s.items) ? s.items : s.items[lang]).map(x => `<span>${x}</span>`).join('')}</div>
      </div>`).join('');
    document.querySelectorAll('#stack-grid .rv').forEach(watch);
  }
  function renderProjects(animate) {
    const tabs = document.getElementById('ptabs'), d = document.getElementById('pdetail');
    tabs.innerHTML = PROJECTS.map((p, i) => `<button class="ptab" role="tab" id="pt-${i}" aria-controls="pdetail" aria-selected="${i === curProj}" tabindex="${i === curProj ? 0 : -1}">${v(p.name)}<span>${v(p.kind)}</span></button>`).join('');
    const p = PROJECTS[curProj], r = repoInfo(p.repo), ui = repoInfo(p.ui);
    const meta = r ? [r.lang, r.stars ? t('proj.stars')(r.stars) : '', r.pushed ? t('proj.updated')(fmtMonth(r.pushed)) : ''].filter(Boolean) : [];
    d.setAttribute('aria-labelledby', `pt-${curProj}`);
    d.innerHTML = `
      <span class="pstatus">${v(p.kind)}</span>
      <h3>${v(p.name)}</h3>
      <p>${r?.desc && lang === 'pt' ? esc(r.desc) : p.desc[lang]}</p>
      <p class="sublabel">${t('proj.arch')}</p>
      <div class="flow">${p.flow.map(s => `<span>${v(s)}</span>`).join('<i>→</i>')}</div>
      <p class="sublabel">${t('proj.res')}</p>
      <ul class="phl">${p.items[lang].map(x => `<li>${x}</li>`).join('')}</ul>
      <div class="chips">${p.tech.map(s => `<span>${s}</span>`).join('')}</div>
      ${meta.length ? `<p class="gmeta">${meta.map(esc).join(' · ')}</p>` : ''}
      <div class="plinks"><a class="btn g sm" href="${r?.url || `https://github.com/${GH_USER}/${p.repo}`}" target="_blank" rel="noopener">${t('proj.code')} ↗</a>${p.ui ? `<a class="btn g sm" href="${ui?.url || `https://github.com/${GH_USER}/${p.ui}`}" target="_blank" rel="noopener">${t('proj.ui')} ↗</a>` : ''}${r?.homepage ? `<a class="btn g sm" href="${esc(r.homepage)}" target="_blank" rel="noopener">${t('proj.live')} ↗</a>` : ''}</div>`;
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
          ${e.items ? `<ul>${e.items[lang].map(i => `<li>${i}</li>`).join('')}</ul>` : ''}
        </div>
      </div>`).join('');
    const isIn = tl.classList.contains('in');
    tl.querySelectorAll('.rv').forEach(el => isIn ? el.classList.add('in') : watch(el));
    if (!isIn) watch(tl);
  }
  function renderTicker() {
    const r = seeded(9), hex = () => Math.floor(r() * 0xfffffff).toString(16).padStart(7, '0');
    const dot = () => { const q = r(); return `<i style="background:var(--c${q < .3 ? 2 : q < .7 ? 3 : 4})"></i>`; };
    const repos = ownRepos().slice(0, 12);
    const items = repos.length
      ? repos.map(x => `<span>${dot()}<b>${fmtDay(x.pushed)}</b><em>push(${esc(x.name)}):</em> ${esc(x.desc ? x.desc.slice(0, 70) + (x.desc.length > 70 ? '…' : '') : x.lang || 'update')}</span>`).join('')
      : COMMITS.map(c => { const [type, ...rest] = c.split(':'); return `<span>${dot()}<b>${hex()}</b><em>${type}:</em>${rest.join(':')}</span>`; }).join('');
    document.getElementById('ticker').innerHTML = items + items;
  }
  function applyLang() {
    document.documentElement.lang = lang === 'pt' ? 'pt-BR' : 'en';
    document.querySelectorAll('[data-t]').forEach(el => { const s = t(el.dataset.t); if (typeof s === 'string') el.textContent = s; });
    document.querySelectorAll('[data-th]').forEach(el => el.innerHTML = t(el.dataset.th));
    document.querySelectorAll('[data-ta]').forEach(el => el.setAttribute('aria-label', t(el.dataset.ta)));
    document.querySelectorAll('h2.split').forEach(el => split(el));
    split(document.getElementById('role'), t('role'));
    document.querySelectorAll('.lang button').forEach(b => b.setAttribute('aria-pressed', b.dataset.lang === lang));
    renderStack(); renderProjects(false); renderTimeline(); renderGraphHead(); renderHeat(); renderGitHub(); renderTicker();
    document.querySelectorAll('[data-count]').forEach(b => { if (b.dataset.done) { const dec = +(b.dataset.dec || 0); b.textContent = parseFloat(b.dataset.count).toLocaleString(loc(), { minimumFractionDigits: dec, maximumFractionDigits: dec }) + (b.dataset.suffix || ''); } });
  }
  document.querySelectorAll('.lang button').forEach(b => b.addEventListener('click', () => { if (lang === b.dataset.lang) return; lang = b.dataset.lang; store.set('pf-lang', lang); applyLang(); }));

  /* ================= clock ================= */
  const clockFmt = new Intl.DateTimeFormat('pt-BR', { hour:'2-digit', minute:'2-digit', timeZone:'America/Sao_Paulo' });
  const tickClock = () => document.getElementById('clock').textContent = clockFmt.format(new Date());
  tickClock(); setInterval(tickClock, 15000);

  /* ================= GitHub (live) ================= */
  let gh = { state: 'loading', profile: null, repos: null, cal: null };
  const esc = x => String(x).replace(/[&<>"']/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c]));
  const toDate = x => new Date(x.length === 10 ? x + 'T12:00:00' : x);
  const mon = d => d.toLocaleDateString(loc(), { month: 'short' }).replace('.', '');
  const fmtMonth = x => { if (!x) return ''; const d = toDate(x); return `${mon(d)} ${d.getFullYear()}`; };
  const fmtDay = x => { if (!x) return ''; const d = toDate(x); return `${String(d.getDate()).padStart(2, '0')} ${mon(d)}`; };
  const repoInfo = name => gh.repos?.find(r => r.name.toLowerCase() === name?.toLowerCase()) || null;
  const ownRepos = () => (gh.repos || []).filter(r => !r.fork && !r.archived && r.name.toLowerCase() !== GH_USER);

  // fills a counter as soon as data arrives; animates it if its section is already on screen
  function setCount(id, n) {
    const b = document.getElementById(id); if (!b || n == null) return;
    const was = b.dataset.count; b.dataset.count = n;
    if (was == n && b.dataset.done) return;
    delete b.dataset.done;
    if (b.closest('.in')) countUp(b);
  }

  function renderHeat() {
    const el = document.getElementById('heat'), c = gh.cal;
    if (!c) { el.innerHTML = Array.from({ length: 53 * 7 }, (_, i) => `<i style="--c:${Math.floor(i / 7)}"></i>`).join(''); return; }
    const last = c.cells.findLastIndex(d => d);
    el.innerHTML = c.cells.map((d, i) => {
      const col = Math.floor(i / 7);
      if (!d) return `<i class="${d === undefined ? 'pad' : ''}" style="--c:${col}"></i>`;
      const label = `${t('gh.cell')(d.count)} · ${toDate(d.date).toLocaleDateString(loc())}`;
      return `<i class="l${d.level}${i === last ? ' today' : ''}" style="--c:${col}" title="${esc(label)}"></i>`;
    }).join('');
    const sc = document.getElementById('heat-scroll'); sc.scrollLeft = sc.scrollWidth;
  }

  function renderGitHub() {
    const src = document.getElementById('gh-src'), c = gh.cal;
    src.textContent = t(gh.state === 'ok' ? 'gh.live' : gh.state === 'error' ? 'gh.error' : 'gh.loading');
    document.getElementById('gh-year').textContent = c?.from ? `${fmtMonth(c.from)} — ${fmtMonth(c.to)}` : '';
    document.getElementById('cm-gh').textContent = t('cm.gh')(c?.current || 0);
    const top = document.getElementById('gh-top-l');
    top.textContent = c?.bestDate ? `${t('gh.top')} · ${fmtDay(c.bestDate)}` : t('gh.top');

    const list = ownRepos().slice(0, 4), box = document.getElementById('repos');
    document.getElementById('repos-wrap').hidden = !list.length;
    box.innerHTML = list.map((r, i) => `
      <a class="card hov repo rv in" style="--d:${i * 60}ms" href="${r.url || `https://github.com/${GH_USER}/${encodeURIComponent(r.name)}`}" target="_blank" rel="noopener">
        <b>${esc(r.name)}</b>
        <p>${esc(r.desc || '')}</p>
        <span class="rmeta">${[r.lang, r.stars ? `★ ${r.stars}` : '', fmtMonth(r.pushed)].filter(Boolean).map(esc).join(' · ')}</span>
      </a>`).join('');
  }

  async function initGitHub() {
    renderHeat();
    try {
      const { profile, repos, calendar, errors } = await loadGitHub(GH_USER);
      errors.forEach(e => console.warn('[github]', e));
      gh = { state: profile || repos || calendar ? 'ok' : 'error', profile, repos, cal: calendar };
    } catch (e) { console.warn('[github]', e); gh.state = 'error'; }
    const c = gh.cal;
    if (c) {
      heroCount = c.total; renderGraphHead();
      ['hs-commits', 'gh-total'].forEach(id => setCount(id, c.total));
      setCount('gh-days', c.active); setCount('gh-streak', c.current); setCount('gh-best', c.longest); setCount('gh-top', c.best);
      const heat = document.getElementById('heat'), shown = heat.classList.contains('in');
      heat.classList.remove('in'); renderHeat();
      if (shown) { void heat.offsetWidth; heat.classList.add('in'); }
    }
    setCount('hs-repos', gh.profile?.public_repos ?? (gh.repos ? ownRepos().length : null));
    renderGitHub(); renderProjects(false); renderTicker();
  }

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
    const el = e.target.closest?.('.card,.cgrid a,.ptab'); if (!el) return;
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
    // every slot draws on its own canvas inside it, so drawings scroll natively with the page
    // (a fixed full-screen canvas lagged behind touch scrolling on phones) and off-screen slots cost nothing
    const slots = [...document.querySelectorAll('.slot')];
    const near = new Set();
    let dpr = 1, shapes = [], mx = -1e4, my = -1e4, ripples = [], built = false, running = false, last = 0, onSlotClick = () => {};
    const clamp = x => x < 0 ? 0 : x > 1 ? 1 : x;
    const smooth = (a, b, x) => { const t = clamp((x - a) / (b - a)); return t * t * (3 - 2 * t); };
    const outCubic = x => 1 - Math.pow(1 - x, 3);
    const WIN = .3;
    const rr = typeof Path2D.prototype.roundRect === 'function';

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

    function canvasFor(slot) {
      let cv = slot.querySelector(':scope > canvas');
      if (!cv) { cv = document.createElement('canvas'); cv.setAttribute('aria-hidden', 'true'); slot.appendChild(cv); }
      return cv;
    }
    function build() {
      dpr = Math.min(2, devicePixelRatio || 1);
      const prev = shapes.map(s => s.v);
      shapes = slots.map((s, k) => k === 0 ? heroShape(s, s.clientWidth, Math.min(innerHeight * .44, 420)) : iconShape(s, ICONS[s.dataset.shape](), s.clientWidth, s.clientHeight));
      shapes.forEach(sh => {
        const cv = canvasFor(sh.slot);
        sh.w = sh.slot.clientWidth; sh.h = sh.slot.clientHeight;
        cv.width = Math.round(sh.w * dpr); cv.height = Math.round(sh.h * dpr);
        sh.ctx = cv.getContext('2d');
      });
      if (built) shapes.forEach((s, k) => { if (prev[k] > .5) { s.v = prev[k]; s.px.set(s.hx); s.py.set(s.hy); s.seen.fill(1); } });
      built = true;
      if (reduce) shapes.forEach(sh => draw(sh, 0, performance.now()));
    }
    function reset(sh) {
      sh.v = 0; sh.seen.fill(0); sh.px.set(sh.sx); sh.py.set(sh.sy); sh.vx.fill(0); sh.vy.fill(0); sh.heat.fill(0);
      sh.ctx.clearRect(0, 0, sh.ctx.canvas.width, sh.ctx.canvas.height);
    }
    function draw(sh, dt, now) {
      const H = innerHeight, k = 1 - Math.exp(-dt / 320), R = 74, R2 = R * R;
      const r = sh.slot.getBoundingClientRect(), bx = r.left + sh.slot.clientLeft, by = r.top + sh.slot.clientTop;
      const vis = clamp((Math.min(r.bottom, H) - Math.max(r.top, 0)) / Math.max(1, r.height));
      sh.target = smooth(.2, .7, vis);
      sh.v = reduce ? sh.target : sh.v + (sh.target - sh.v) * k;
      if (Math.abs(sh.v - sh.target) < .0005) sh.v = sh.target;
      const ctx = sh.ctx;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, sh.w, sh.h);
      if (sh.v < .001 && !reduce) return;
      const base = CELLS.map(() => new Path2D()), glow = [0, 1, 2, 3, 4].map(() => new Path2D());
      const add = (path, x, y, s) => { const o = s / 2; if (rr) path.roundRect(x - o, y - o, s, s, s * .22); else path.rect(x - o, y - o, s, s); };
      // ripples live in page coordinates, so they stay put while the page scrolls
      const rising = sh.target >= sh.v, lmx = mx - bx, lmy = my - by, ox = bx + scrollX, oy = by + scrollY;
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
              const rad = (now - rp.t) * .85, ex = ox + sh.px[i] - rp.x, ey = oy + sh.py[i] - rp.y, band = rad - Math.sqrt(ex * ex + ey * ey);
              if (band > 0 && band < 50) h = Math.max(h, Math.sin(band / 50 * Math.PI) * rp.p);
            }
          }
          sh.vx[i] = vx; sh.vy[i] = vy; sh.px[i] += vx; sh.py[i] += vy;
          h *= .955; sh.heat[i] = h;
        }
        if (e <= 0) continue;
        const s = sh.s * (.3 + .7 * ee) * (1 + Math.min(h, 1) * .22);
        add(base[sh.l[i]], sh.px[i], sh.py[i], s);
        if (h > .06) add(glow[Math.min(4, h * 5 | 0)], sh.px[i], sh.py[i], s);
      }
      if (!reduce && sh.v > .9) for (let q = 0; q < 2; q++) { const i = Math.random() * sh.n | 0; if (sh.l[i] > 0 && sh.heat[i] < .3) sh.heat[i] = .3; }
      base.forEach((p, b) => { ctx.fillStyle = CELLS[b]; ctx.fill(p); });
      glow.forEach((p, b) => { ctx.fillStyle = `rgba(${HOT},${(b + 1) * .17})`; ctx.fill(p); });
    }
    function frame(now) {
      const dt = Math.min(64, now - (last || now)); last = now;
      if (!document.hidden) {
        const reach = Math.max(innerWidth, innerHeight) * 1.2;
        ripples = ripples.filter(r => (now - r.t) * .85 < reach);
        for (const sh of shapes) if (near.has(sh.slot)) draw(sh, dt, now);
      }
      requestAnimationFrame(frame);
    }
    // click on a drawing: cells burst away from the pointer, spring back home and light up in a ring
    function burst(sh, x, y) {
      const r = sh.slot.getBoundingClientRect(), lx = x - r.left - sh.slot.clientLeft, ly = y - r.top - sh.slot.clientTop, RB = Math.max(160, sh.pitch * 14);
      for (let i = 0; i < sh.n; i++) {
        const dx = sh.px[i] - lx, dy = sh.py[i] - ly, d = Math.sqrt(dx * dx + dy * dy) || 1;
        if (d < RB) { const f = Math.pow(1 - d / RB, 1.5); sh.vx[i] += dx / d * f * 16 + (Math.random() - .5) * f * 4; sh.vy[i] += dy / d * f * 16 + (Math.random() - .5) * f * 4; }
      }
      ripples.push({ x: x + scrollX, y: y + scrollY, t: performance.now(), p: 1 });
    }

    // only slots near the viewport animate; leaving that band snaps a shape back to its start so it re-enters fresh
    const io = new IntersectionObserver(es => es.forEach(e => {
      if (e.isIntersecting) near.add(e.target);
      else { near.delete(e.target); const sh = shapes.find(s => s.slot === e.target); if (sh && !reduce) reset(sh); }
    }), { rootMargin: '40% 0px' });
    slots.forEach(s => io.observe(s));

    addEventListener('pointermove', e => { mx = e.clientX; my = e.clientY; }, { passive: true });
    // a finger leaves no hover behind: forget its position once the touch ends or turns into a scroll
    const forget = e => { if (e.pointerType !== 'mouse') mx = my = -1e4; };
    addEventListener('pointerup', forget, { passive: true });
    addEventListener('pointercancel', forget, { passive: true });
    document.addEventListener('pointerleave', () => { mx = my = -1e4; });
    addEventListener('blur', () => { mx = my = -1e4; });
    addEventListener('pointerdown', e => {
      if (reduce || e.target.closest('a,button,input,.card,.ptab,code,.commit-card,.cgrid')) return;
      const k = shapes.findIndex(sh => { const r = sh.slot.getBoundingClientRect(); return sh.v > .5 && e.clientX >= r.left && e.clientX <= r.right && e.clientY >= r.top && e.clientY <= r.bottom; });
      if (k >= 0) { burst(shapes[k], e.clientX, e.clientY); onSlotClick(k); }
      else ripples.push({ x: e.clientX + scrollX, y: e.clientY + scrollY, t: performance.now(), p: .55 });
    });
    // shapes are laid out from their slot's size, so rebuild whenever a slot's box changes:
    // late CSS/fonts, rotation, breakpoints. The hero sets its own height, so only its width counts.
    const seen = new Map(); let rt;
    const ro = new ResizeObserver(es => {
      let changed = false;
      for (const e of es) {
        const w = Math.round(e.contentRect.width), h = e.target === slots[0] ? 0 : Math.round(e.contentRect.height), key = `${w}x${h}`;
        if (seen.get(e.target) !== key) { seen.set(e.target, key); changed = true; }
      }
      if (changed && built) { clearTimeout(rt); rt = setTimeout(build, 120); }
    });
    slots.forEach(s => ro.observe(s));

    return {
      start() { build(); if (!reduce && !running) { running = true; requestAnimationFrame(frame); } },
      onClick(fn) { onSlotClick = fn; },
      pulse() {
        if (reduce || !built) return;
        const H = innerHeight, sh = shapes.find(s => { const r = s.slot.getBoundingClientRect(); return r.top < H * .7 && r.bottom > H * .3; });
        if (sh) { const r = sh.slot.getBoundingClientRect(); ripples.push({ x: r.left + r.width / 2 + scrollX, y: r.top + r.height / 2 + scrollY, t: performance.now(), p: .8 }); }
      }
    };
  })();

  /* ================= commit feedback when a drawing is clicked ================= */
  const hexChars = '0123456789abcdef';
  function renderGraphHead() { document.getElementById('ghead').innerHTML = t('graph.head')(heroCount == null ? '—' : heroCount.toLocaleString(loc())); }
  FX.onClick(k => {
    if (k === 0) {
      if (heroCount == null) return;
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

  if (touch) document.querySelector('[data-t="graph.hint"]').dataset.t = 'graph.hintTouch';
  applyLang();
  document.querySelectorAll('.rv, .split, .commits, .heat, .hstats').forEach(watch);
  onScroll();
  FX.start();
  initGitHub();
})();
