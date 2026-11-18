const screens = [
  {id:'screen-login', label:'Login'},
  {id:'screen-home', label:'Home'},
  {id:'screen-path', label:'Trilha'},
  {id:'screen-lesson', label:'Aula'},
  {id:'screen-exercises', label:'Exercícios'},
  {id:'screen-exam', label:'Simulado'},
  {id:'screen-chat', label:'Chat IA'},
  {id:'screen-groups', label:'Grupos'},
  {id:'screen-profile', label:'Perfil'},
  {id:'screen-thanks', label:'Agradecimento'}
];

let current = 0;

const pillTrack = document.getElementById('pillTrack');
screens.forEach((s,i)=>{
  const b = document.createElement('button');
  b.className = 'pill' + (i===0?' active':'');
  b.textContent = s.label;
  b.onclick = ()=>goTo(s.id);
  pillTrack.appendChild(b);
});
document.getElementById('screenTotal').textContent = screens.length;

function goTo(id){
  const idx = screens.findIndex(s=>s.id===id);
  if(idx===-1) return;
  current = idx;
  document.querySelectorAll('.screen').forEach(el=>el.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  document.querySelectorAll('.pill').forEach((el,i)=>el.classList.toggle('active', i===idx));
  document.getElementById('screenTitle').textContent = screens[idx].label;
  document.getElementById('screenIndex').textContent = idx+1;
  renderNotes(id);
  if(id==='screen-exercises') initExercises();
  if(id==='screen-exam') initExamGrid();
  if(id==='screen-groups') initGroups();
  if(id==='screen-path') pathClose();
}

/* =========================================================
   BALÕES DE APOIO — EDITE AQUI
   Um bloco por tela. "mvp" = como funciona neste protótipo
   (Mágico de Oz). "real" = como seria na plataforma de fato.
   title: título curto | text: explicação | tech: etiquetas
   Também dá para clicar no texto do balão e digitar ao vivo
   (a edição vale até recarregar a página).
   ========================================================= */
const notes = {
  'screen-login': {
    mvp:  {title:'Login simulado', text:'Formulário em HTML. O botão só alterna entre Entrar e Cadastrar com JS. Nenhum dado é enviado ou salvo.', tech:['HTML','CSS','JS']},
    real: {title:'Autenticação segura', text:'O back-end valida e-mail e senha. Senha guardada com hash, nunca em texto puro. Dados protegidos conforme a LGPD.', tech:['API','Banco de dados','Hash de senha']}
  },
  'screen-home': {
    mvp:  {title:'Dados fixos', text:'Nome, XP, nível e trilhas estão escritos direto no HTML, e o CSS cuida do visual. O JS só troca de tela quando um atalho é clicado. Nada é lido de um servidor: para mudar um dado, é preciso editar o código.', tech:['HTML','CSS','JS']},
    real: {title:'Home personalizada', text:'Ao abrir a Home, o front-end pede os dados do aluno à API: uma requisição HTTPS que devolve JSON. O back-end, em Python, consulta o banco de dados relacional (usuários, XP, trilhas) e responde só com o que pertence àquele aluno.', tech:['Python','API REST (JSON)','PostgreSQL','HTTPS']}
  },
  'screen-profile': {
    mvp:  {title:'Perfil de exemplo', text:'Estatísticas, conquistas e domínio por matéria são valores fixos, escritos no HTML e desenhados com CSS (barras, medalhas). O JS não calcula nada: o XP e o nível mostrados são só texto.', tech:['HTML','CSS','JS']},
    real: {title:'Perfil dinâmico', text:'XP, nível, sequência e conquistas seriam calculados no servidor por regras de gamificação, e não no navegador, para o aluno não conseguir alterar a própria pontuação. Cada evento (aula, acerto) seria gravado no banco e o perfil, somado a partir dele.', tech:['Python','Regras de gamificação','Banco de dados','API REST']}
  },
  'screen-path': {
    mvp:  {title:'Mapa de trilha estático', text:'O mapa é um SVG desenhado pelo JS a partir de uma lista fixa de 6 módulos. Concluído = hexágono dourado; não concluído = só contorno com fundo escuro. Ao clicar, o JS abre o painel com as informações. O estado de cada módulo está escrito no código: não existe controle real de quem avançou.', tech:['HTML','SVG','CSS','JS']},
    real: {title:'Trilha por progresso', text:'Trilhas e módulos seriam tabelas do banco, ligadas ao progresso de cada aluno. Ao concluir uma etapa, o back-end registra e libera a próxima. A liberação é checada no servidor, então um módulo bloqueado não abre nem por tentativa direta na API.', tech:['Python','PostgreSQL','Relação entre tabelas','API REST']}
  },
  'screen-lesson': {
    mvp:  {title:'Aula de demonstração', text:'O vídeo é só uma caixa desenhada com HTML e CSS. As abas Vídeo, Notas e Recursos trocam o texto com JS, a partir de um objeto escrito no próprio script. Nenhum arquivo é carregado.', tech:['HTML','CSS','JS']},
    real: {title:'Vídeo e materiais reais', text:'Os vídeos ficariam em um serviço de hospedagem de mídia, que entrega o vídeo em partes (streaming) para rodar bem em qualquer conexão. Notas e PDFs ficariam em armazenamento de arquivos; o banco guardaria só o endereço de cada material e a aula a que ele pertence.', tech:['Hospedagem de vídeo','Armazenamento de arquivos','PostgreSQL','API REST']}
  },
  'screen-exercises': {
    mvp:  {title:'Questões em lista JS', text:'As 3 questões ficam em um array dentro do script. O JS compara a opção clicada com a resposta certa, que está no próprio código, e soma 30 XP por acerto. O HTML e o CSS mostram o feedback verde ou vermelho.', tech:['HTML','CSS','JS']},
    real: {title:'Banco de questões', text:'Questões por matéria, tema e dificuldade ficariam no banco e seriam buscadas com consultas SQL. A correção seria feita no back-end: o gabarito não vai para o navegador, e o XP ganho é gravado no perfil junto com o registro da resposta.', tech:['Python','SQL','PostgreSQL','API REST']}
  },
  'screen-exam': {
    mvp:  {title:'Simulado demonstrativo', text:'O cronômetro regressivo é um contador em JS, que reinicia ao recarregar a página. A grade de questões e a questão de exemplo são HTML e CSS, e o clique só marca a alternativa na tela.', tech:['HTML','CSS','JS']},
    real: {title:'Simulados ENEM', text:'O servidor guardaria o horário de início da prova, então recarregar a página não reinicia o tempo. Ao final, o back-end corrige automaticamente, compara com o gabarito e monta o relatório de acertos por área, que o aluno poderia usar para decidir o que estudar.', tech:['Python','PostgreSQL','Controle de tempo no servidor','API REST']}
  },
  'screen-groups': {
    mvp:  {title:'Grupos simulados', text:'Os 4 grupos e os comentários são dados de exemplo escritos no script. Entrar, sair, criar, curtir, comentar e denunciar funcionam só na memória do navegador: ao reabrir a tela, tudo volta ao início. O HTML monta a tela, o CSS dá o visual e o JS guarda o estado.', tech:['HTML','CSS','JS']},
    real: {title:'Comunidade de estudo', text:'Grupos, membros e comentários seriam tabelas do banco, ligadas a cada aluno. O back-end, em Python, checaria no servidor quem pode comentar ou moderar, e a API entregaria os comentários novos quase em tempo real. Denúncias iriam para uma fila de moderação, com cuidado extra com menores (LGPD).', tech:['Python','PostgreSQL','API REST','WebSocket','Moderação']}
  },
  'screen-chat': {
    mvp:  {title:'IA simulada', text:'As respostas estão prontas, escritas no código JS. O que o aluno digita não é interpretado: o botão só espera um tempo e mostra o texto fixo. O HTML e o CSS fazem apenas a aparência do chat.', tech:['HTML','CSS','JS']},
    real: {title:'IA da INQUIRA', text:'O front-end enviaria a pergunta ao back-end, que chamaria a API de um modelo de linguagem com instruções para guiar o raciocínio, sem entregar a resposta pronta. A chave de acesso ficaria guardada só no servidor, nunca no navegador, e dados pessoais de menores não seriam enviados (LGPD).', tech:['Python','API de modelo de linguagem','Chave de API no servidor','LGPD']}
  },
  'screen-thanks': {
    mvp:  {title:'Encerramento', text:'Tela estática em HTML e CSS. O único botão chama goTo() e volta ao Login para reiniciar a demonstração. Nada é salvo ou enviado.', tech:['HTML','CSS','JS']},
    real: {title:'Logout e sessão', text:'Na plataforma de fato, o encerramento seria a saída da conta (logout) e o retorno ao login, com a sessão encerrada no servidor.', tech:['Sessão','Logout','API REST']}
  }
};

function renderNotes(id){
  const n = notes[id] || {};
  ['mvp','real'].forEach(side=>{
    const d = n[side] || {title:'', text:'', tech:[]};
    const box = document.getElementById(side==='mvp' ? 'balloonMvp' : 'balloonReal');
    box.querySelector('[data-field="title"]').textContent = d.title || '';
    box.querySelector('[data-field="text"]').textContent = d.text || '';
    const tech = document.getElementById(side==='mvp' ? 'techMvp' : 'techReal');
    tech.innerHTML = '';
    (d.tech || []).forEach(t=>{
      const s = document.createElement('span');
      s.textContent = t;
      tech.appendChild(s);
    });
    box.classList.remove('animate'); void box.offsetWidth; box.classList.add('animate');
  });
}
/* guarda a edição ao vivo na memória (some ao recarregar) */
document.querySelectorAll('.balloon [contenteditable]').forEach(el=>{
  el.addEventListener('blur', ()=>{
    const id = screens[current].id;
    notes[id] = notes[id] || {};
    notes[id][el.dataset.side] = notes[id][el.dataset.side] || {tech:[]};
    notes[id][el.dataset.side][el.dataset.field] = el.textContent.trim();
  });
});
/* setas do teclado trocam de tela (exceto ao digitar) */
document.addEventListener('keydown', e=>{
  const t = e.target;
  if(t.isContentEditable || t.tagName==='INPUT' || t.tagName==='TEXTAREA') return;
  if(e.key==='ArrowRight') nextScreen();
  if(e.key==='ArrowLeft') prevScreen();
});

function prevScreen(){ goTo(screens[(current-1+screens.length)%screens.length].id); }
function nextScreen(){ goTo(screens[(current+1)%screens.length].id); }

/* TRILHA — mapa de hexágonos
   status: 'done' (preenchido em dourado) | 'current' e 'locked' (só contorno, fundo escuro) */
const pathModules = [
  {name:'Ângulos e Triângulos', status:'done',    xp:40, parts:['Vídeo','Exercícios'], desc:'Classificação de triângulos e medida de ângulos. É a base para tudo o que vem depois na trilha.'},
  {name:'Seno e Cosseno',       status:'done',    xp:40, parts:['Vídeo','Exercícios'], desc:'Razões trigonométricas no triângulo retângulo, partindo dos ângulos que você já conhece.'},
  {name:'Tangente',             status:'done',    xp:40, parts:['Vídeo','Exercícios'], desc:'Terceira razão trigonométrica e como ela se relaciona com seno e cosseno.'},
  {name:'Lei dos Senos',        status:'current', xp:50, parts:['Vídeo','Notas','Exercícios'], progress:68, desc:'Relaciona os lados de um triângulo qualquer aos senos dos ângulos opostos. Retoma o que você viu em Seno e Cosseno.'},
  {name:'Lei dos Cossenos',     status:'locked',  xp:50, parts:['Vídeo','Exercícios'], desc:'Generaliza o Teorema de Pitágoras para triângulos quaisquer.', req:'Lei dos Senos'},
  {name:'Aplicações no ENEM',   status:'locked',  xp:60, parts:['Questões','Simulado'], desc:'Questões contextualizadas no estilo do ENEM usando tudo o que a trilha cobriu.', req:'Lei dos Cossenos'}
];
let pathSel = -1;
const PATH_X = [150,215,150,85,150,215], PATH_Y0 = 62, PATH_DY = 108, PATH_R = 34;

function hexPoints(r){
  const w = r*0.866;
  return [[0,-r],[w,-r/2],[w,r/2],[0,r],[-w,r/2],[-w,-r/2]].map(p=>p.join(',')).join(' ');
}
function hexIcon(status){
  if(status==='done') return '<path d="M-10 0 L-3 7 L11 -8" fill="none" stroke="#111111" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/>';
  if(status==='current') return '<path d="M-6 -9 L10 0 L-6 9 Z" fill="#C9A227" stroke="#C9A227" stroke-width="2" stroke-linejoin="round"/>';
  return '<rect x="-8" y="-3" width="16" height="12" rx="2.5" fill="#8C6F1D"/><path d="M-5 -3 V-7 a5 5 0 0 1 10 0 V-3" fill="none" stroke="#8C6F1D" stroke-width="2.6" stroke-linecap="round"/>';
}
function renderPath(){
  const n = pathModules.length, H = PATH_Y0 + (n-1)*PATH_DY + 70;
  const doneCount = pathModules.filter(m=>m.status==='done').length;
  document.getElementById('pathSummary').textContent = `${doneCount} de ${n} módulos concluídos`;
  let links = '', nodes = '';
  for(let i=0;i<n-1;i++){
    const x1=PATH_X[i], y1=PATH_Y0+i*PATH_DY, x2=PATH_X[i+1], y2=PATH_Y0+(i+1)*PATH_DY, ym=(y1+y2)/2;
    const reached = pathModules[i+1].status!=='locked';
    links += `<path d="M${x1} ${y1} C${x1} ${ym} ${x2} ${ym} ${x2} ${y2}" fill="none" stroke="${reached?'#C9A227':'#3a3a3d'}" stroke-width="${reached?4:3}" stroke-linecap="round"${reached?'':' stroke-dasharray="1 9"'}/>`;
  }
  pathModules.forEach((m,i)=>{
    const x=PATH_X[i], y=PATH_Y0+i*PATH_DY, done=m.status==='done', locked=m.status==='locked';
    const fill = done ? '#C9A227' : '#222222';
    const stroke = locked ? '#8C6F1D' : '#C9A227';
    const ring = m.status==='current' ? `<polygon class="hex-ring" points="${hexPoints(PATH_R)}" fill="none" stroke="#C9A227" stroke-width="2"/>` : '';
    const here = m.status==='current' ? `<g transform="translate(0,${-PATH_R-15})"><rect x="-42" y="-9" width="84" height="17" rx="8.5" fill="#C9A227"/><text class="hex-here" text-anchor="middle" y="3" fill="#111111">VOCÊ ESTÁ AQUI</text></g>` : '';
    const state = done?'concluído':(locked?'bloqueado':'em andamento');
    nodes += `<g class="hex ${m.status}${i===pathSel?' sel':''}" transform="translate(${x},${y})" tabindex="0" role="button" aria-label="${m.name}, ${state}" onclick="event.stopPropagation();pathSelect(${i})" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();pathSelect(${i});}">
      ${ring}<g class="hex-shape"><polygon points="${hexPoints(PATH_R)}" fill="${fill}" stroke="${stroke}" stroke-width="3.5" stroke-linejoin="round"/>${hexIcon(m.status)}</g>
      ${here}<text class="hex-label" y="${PATH_R+20}">${m.name}</text></g>`;
  });
  document.getElementById('pathMap').innerHTML = `<svg viewBox="0 0 300 ${H}" xmlns="http://www.w3.org/2000/svg">${links}${nodes}</svg>`;
}
function pathSelect(i){
  pathSel = i; renderPath();
  const m = pathModules[i];
  const label = {done:'CONCLUÍDO', current:'EM ANDAMENTO', locked:'BLOQUEADO'}[m.status];
  const prog = m.status==='current' ? `<div class="xp-bar-track" style="margin:0 0 12px;"><div class="xp-bar-fill" style="width:${m.progress}%;"></div></div>` : '';
  let btn;
  if(m.status==='current') btn = `<button class="btn-gold sheet-btn" onclick="goTo('screen-lesson')">Continuar · ${m.progress}%</button>`;
  else if(m.status==='done') btn = `<button class="btn-gold sheet-btn ghost" onclick="goTo('screen-lesson')">Revisar módulo</button>`;
  else btn = `<button class="btn-gold sheet-btn" disabled>Conclua “${m.req}” para liberar</button>`;
  document.getElementById('pathSheet').innerHTML = `
    <div class="sheet-handle"></div>
    <div class="sheet-head"><h3 class="sheet-title">${m.name}</h3><button class="sheet-close" onclick="pathClose()" aria-label="Fechar">×</button></div>
    <span class="sheet-status ${m.status}">${label}</span>
    <p class="sheet-desc">${m.desc}</p>
    ${prog}
    <div class="sheet-meta"><span>Módulo ${i+1} de ${pathModules.length}</span><span>+${m.xp} XP</span>${m.parts.map(p=>`<span>${p}</span>`).join('')}</div>
    ${btn}`;
  document.getElementById('pathStage').classList.add('open');
  /* rola o mapa para o hexágono ficar visível acima do painel */
  const body = document.getElementById('pathBody'), sheet = document.getElementById('pathSheet');
  body.style.paddingBottom = (sheet.offsetHeight + 24) + 'px';
  const node = document.querySelectorAll('#pathMap .hex')[i];
  const visible = body.clientHeight - sheet.offsetHeight;
  const delta = (node.getBoundingClientRect().top + node.getBoundingClientRect().height/2) - (body.getBoundingClientRect().top + visible/2);
  body.scrollBy({top:delta, behavior:'smooth'});
}
function pathClose(){
  pathSel = -1;
  document.getElementById('pathStage').classList.remove('open');
  document.getElementById('pathBody').style.paddingBottom = '';
  renderPath();
}

/* LOGIN */
function setLoginMode(mode){
  const isLogin = mode==='login';
  document.getElementById('loginModeBtn').classList.toggle('active', isLogin);
  document.getElementById('signupModeBtn').classList.toggle('active', !isLogin);
  document.getElementById('nameField').style.display = isLogin ? 'none' : 'block';
  document.getElementById('loginSubmitBtn').textContent = isLogin ? 'Entrar' : 'Criar conta';
}

/* LESSON TABS */
const lessonTabs = {
  video: `<div class="lesson-idx-item"><span class="time">00:00</span><span>Introdução ao problema</span></div>
          <div class="lesson-idx-item"><span class="time">02:15</span><span>Demonstração da fórmula</span></div>
          <div class="lesson-idx-item"><span class="time">05:40</span><span>Exemplo resolvido</span></div>
          <div class="lesson-idx-item"><span class="time">08:20</span><span>Erros comuns</span></div>`,
  notas: `<div class="card" style="font-size:12.5px;line-height:1.6;">A Lei dos Senos relaciona os lados de um triângulo aos senos de seus ângulos opostos: a/sen(A) = b/sen(B) = c/sen(C). Use quando souber um par lado-ângulo opostos completo.</div>`,
  recursos: `<div class="resource-item">📄 Resumo — Lei dos Senos.pdf</div>
             <div class="resource-item">📄 Lista de exercícios extra.pdf</div>
             <div class="resource-item">📄 Fórmulas de Trigonometria.pdf</div>`
};
function setLessonTab(btn, tab){
  document.querySelectorAll('#screen-lesson .tab-pill-row button').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById('lessonTabContent').innerHTML = lessonTabs[tab];
}

/* EXERCISES */
const exQuestions = [
  {q:"Qual é o valor de sen(30°)?", opts:["0","1/2","√2/2","√3/2"], correct:1, exp:"sen(30°) = 1/2 é um valor notável da trigonometria, usado com frequência em problemas de ângulos especiais."},
  {q:"Em um triângulo retângulo, qual razão trigonométrica é cateto oposto sobre hipotenusa?", opts:["Cosseno","Tangente","Seno","Cotangente"], correct:2, exp:"Seno é definido como cateto oposto dividido pela hipotenusa (SOH da regra SOH-CAH-TOA)."},
  {q:"Se um ângulo mede 45°, qual é o valor da tangente desse ângulo?", opts:["0","1","√3","1/2"], correct:1, exp:"tan(45°) = 1, porque nesse ângulo o cateto oposto e o cateto adjacente têm o mesmo comprimento."}
];
let exIndex = 0, exScore = 0, exSelected = null, exAnswered = false;

function initExercises(){
  exIndex = 0; exScore = 0;
  renderExercise();
}
function renderExercise(){
  exSelected = null; exAnswered = false;
  const body = document.getElementById('exBody');
  if(exIndex >= exQuestions.length){
    body.innerHTML = `<div class="results-box"><div class="muted">CONCLUÍDO</div><div class="big">+${exScore} XP</div><div class="muted" style="margin-top:6px;">${exQuestions.length} de ${exQuestions.length} questões respondidas</div><button class="btn-gold" style="margin-top:22px;" onclick="initExercises()">Refazer</button></div>`;
    return;
  }
  const item = exQuestions[exIndex];
  const letters = ['A','B','C','D'];
  body.innerHTML = `
    <div class="q-progress">Questão ${exIndex+1} de ${exQuestions.length}</div>
    <div class="q-text">${item.q}</div>
    <div id="exOptions">
      ${item.opts.map((o,i)=>`<div class="option" data-i="${i}" onclick="selectExOption(${i})"><div class="letter">${letters[i]}</div>${o}</div>`).join('')}
    </div>
    <div id="exExplain"></div>
    <button class="btn-gold" id="exActionBtn" style="margin-top:8px;" onclick="exAction()" disabled>Confirmar</button>
  `;
}
function selectExOption(i){
  if(exAnswered) return;
  exSelected = i;
  document.querySelectorAll('#exOptions .option').forEach((el,idx)=>el.classList.toggle('selected', idx===i));
  document.getElementById('exActionBtn').disabled = false;
}
function exAction(){
  if(!exAnswered){
    exAnswered = true;
    const item = exQuestions[exIndex];
    document.querySelectorAll('#exOptions .option').forEach((el,idx)=>{
      if(idx===item.correct) el.classList.add('correct');
      else if(idx===exSelected) el.classList.add('incorrect');
    });
    if(exSelected===item.correct) exScore += 30;
    document.getElementById('exExplain').innerHTML = `<div class="explain-box">${item.exp}</div>`;
    document.getElementById('exActionBtn').textContent = exIndex < exQuestions.length-1 ? 'Próxima' : 'Ver resultado';
  } else {
    exIndex++;
    renderExercise();
  }
}

/* MOCK EXAM */
function initExamGrid(){
  const grid = document.getElementById('examGrid');
  if(grid.children.length) return;
  for(let i=1;i<=16;i++){
    const answered = i<=9;
    grid.innerHTML += `<div class="n ${answered?'answered':''}" onclick="this.classList.toggle('answered')">${i}</div>`;
  }
  let h=4,m=58,s=32;
  setInterval(()=>{
    if(s>0) s--; else { s=59; if(m>0) m--; else { m=59; if(h>0) h--; } }
    document.getElementById('examTimer').textContent =
      String(h).padStart(2,'0')+':'+String(m).padStart(2,'0')+':'+String(s).padStart(2,'0');
  }, 1000);
}
function selectExamOption(el){
  document.querySelectorAll('#screen-exam .option').forEach(o=>o.classList.remove('selected'));
  el.classList.add('selected');
}

/* AI CHAT */
function checkChatInput(){
  const val = document.getElementById('chatInput').value.trim();
  document.getElementById('sendBtn').classList.toggle('ready', val.length>0);
}
function sendChat(){
  const input = document.getElementById('chatInput');
  const val = input.value.trim();
  if(!val) return;
  const scroll = document.getElementById('chatScroll');
  scroll.innerHTML += `<div class="bubble user">${val}</div>`;
  input.value=''; checkChatInput();
  scroll.innerHTML += `<div class="typing" id="typingNow"><span></span><span></span><span></span></div>`;
  scroll.scrollTop = scroll.scrollHeight;
  setTimeout(()=>{
    document.getElementById('typingNow').remove();
    scroll.innerHTML += `<div class="bubble ai">Boa pergunta. Antes de eu te explicar direto, o que você já tentou até agora? Assim consigo te ajudar no ponto exato onde travou.</div>`;
    scroll.scrollTop = scroll.scrollHeight;
  }, 1100);
}
function chatQuick(type){
  const scroll = document.getElementById('chatScroll');
  const msg = type==='dica'
    ? "Dica: reescreva a proporção da Lei dos Senos substituindo só os valores que você já tem. O que sobra pra descobrir?"
    : "Resolução: a/sen(A) = b/sen(B) → substitua os valores conhecidos e isole o lado desconhecido. Quer que eu mostre o primeiro passo?";
  scroll.innerHTML += `<div class="bubble ai">${msg}</div>`;
  scroll.scrollTop = scroll.scrollHeight;
}

/* =========================================================
   GRUPOS DE ESTUDO (simulado — tudo fica só na memória)
   Visões: 'list' (Meus grupos / Explorar), 'detail' (comentários), 'create'.
   Dados de exemplo; initGroups() recomeça do zero a cada vez que a tela abre.
   ========================================================= */
const grpSubjects = ['Matemática','Português','Física','Química','Geografia'];
function grpDefaults(){
  return [
    {id:1, name:'Trigonometria na Prática', subject:'Matemática', members:12, joined:true, admin:false, posts:[
      {a:'Ana P.',  t:'Alguém conseguiu a questão 3 da lista de seno e cosseno? Travei na hora de montar a proporção.', likes:3, liked:false, reported:false},
      {a:'Lucas M.',t:'Tenta achar primeiro o lado oposto ao ângulo dado. Depois a proporção sai quase sozinha.', likes:5, liked:false, reported:false}
    ]},
    {id:2, name:'Redação ENEM', subject:'Português', members:24, joined:false, admin:false, posts:[
      {a:'Beatriz S.', t:'Vamos combinar uma proposta de intervenção por semana e comentar a do outro?', likes:7, liked:false, reported:false}
    ]},
    {id:3, name:'Física: Mecânica', subject:'Física', members:9, joined:false, admin:false, posts:[
      {a:'Rafael T.', t:'Quem tem um bom resumo de leis de Newton para compartilhar?', likes:2, liked:false, reported:false}
    ]},
    {id:4, name:'Química Orgânica', subject:'Química', members:15, joined:false, admin:false, posts:[
      {a:'Júlia C.', t:'Dica: montar um quadro com as funções orgânicas ajuda muito na revisão.', likes:4, liked:false, reported:false}
    ]}
  ];
}
let grpData = [], grpTab = 'mine', grpView = 'list', grpOpen = null, grpNewSubject = 'Matemática', grpNextId = 100;

function grpEsc(s){
  return String(s).replace(/[&<>"']/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}
function grpInitials(n){
  return n.split(' ').filter(Boolean).slice(0,2).map(p=>p[0].toUpperCase()).join('');
}
function grpFind(id){ return grpData.find(g=>g.id===id); }

function initGroups(){
  grpData = grpDefaults();
  grpTab = 'mine'; grpView = 'list'; grpOpen = null; grpNewSubject = grpSubjects[0];
  renderGroups();
}
function renderGroups(){
  const body = document.getElementById('grpBody');
  const footer = document.getElementById('grpFooter');
  footer.style.display = (grpView === 'detail') ? 'flex' : 'none';
  if(grpView === 'detail') return renderGroupDetail(body);
  if(grpView === 'create') return renderGroupCreate(body);

  const list = grpData.filter(g => grpTab==='mine' ? g.joined : !g.joined);
  const cards = list.map(g=>`
    <div class="card grp-card" onclick="grpOpenDetail(${g.id})">
      <div class="info">
        <div class="name">${grpEsc(g.name)}${g.admin?'<span class="grp-badge">ADMIN</span>':''}</div>
        <div class="meta">${grpEsc(g.subject)} · ${g.members} ${g.members===1?'membro':'membros'}</div>
      </div>
      ${g.joined ? '' : `<button class="grp-btn" onclick="event.stopPropagation();grpToggleJoin(${g.id})">Entrar</button>`}
    </div>`).join('');
  const empty = grpTab==='mine'
    ? `<div class="card grp-empty"><div class="muted" style="margin-bottom:12px;">Você ainda não participa de nenhum grupo.</div><button class="grp-btn" onclick="grpSetTab('explore')">Explorar grupos</button></div>`
    : `<div class="card grp-empty"><div class="muted">Você já participa de todos os grupos de exemplo.</div></div>`;
  body.innerHTML = `
    <div class="grp-head">
      <div><h2 class="h-serif">Grupos de estudo</h2><div class="muted">Estude junto com outros alunos</div></div>
      <button class="grp-new" onclick="grpShowCreate()">+ Criar</button>
    </div>
    <div class="tab-pill-row">
      <button class="${grpTab==='mine'?'active':''}" onclick="grpSetTab('mine')">Meus grupos</button>
      <button class="${grpTab==='explore'?'active':''}" onclick="grpSetTab('explore')">Explorar</button>
    </div>
    ${cards || empty}`;
}
function grpSetTab(t){ grpTab = t; grpView = 'list'; renderGroups(); }
function grpToggleJoin(id){
  const g = grpFind(id); if(!g) return;
  g.joined = !g.joined;
  g.members += g.joined ? 1 : -1;
  renderGroups();
}
function grpOpenDetail(id){ grpOpen = id; grpView = 'detail'; renderGroups(); }
function grpBack(){ grpView = 'list'; grpOpen = null; renderGroups(); }

function renderGroupDetail(body){
  const g = grpFind(grpOpen); if(!g) return grpBack();
  const posts = g.posts.map((p,i)=>`
    <div class="card grp-post">
      <div class="top"><div class="grp-av">${grpEsc(grpInitials(p.a))}</div><div class="who">${grpEsc(p.a)}</div></div>
      <div class="txt">${grpEsc(p.t)}</div>
      <div class="acts">
        <button class="grp-act ${p.liked?'on':''}" onclick="grpLike(${i})">${p.liked?'♥':'♡'} Curtir · ${p.likes}</button>
        <button class="grp-act ${p.reported?'on':''}" ${p.reported?'disabled':''} onclick="grpReport(${i})">${p.reported?'Denunciado ✓':'Denunciar'}</button>
      </div>
    </div>`).join('');
  body.innerHTML = `
    <button class="grp-back" onclick="grpBack()">‹ Voltar</button>
    <div class="grp-head">
      <div>
        <h2 class="h-serif">${grpEsc(g.name)}</h2>
        <div class="muted">${grpEsc(g.subject)} · ${g.members} ${g.members===1?'membro':'membros'}${g.admin?' · você é admin':''}</div>
      </div>
      <button class="grp-btn ${g.joined?'ghost':''}" onclick="grpToggleJoin(${g.id})">${g.joined?'Sair':'Entrar'}</button>
    </div>
    <div class="section-title">COMENTÁRIOS</div>
    ${posts || '<div class="card grp-empty"><div class="muted">Ainda não há comentários. Seja a primeira pessoa a escrever!</div></div>'}`;
  const input = document.getElementById('grpInput');
  input.disabled = !g.joined;
  input.value = '';
  input.placeholder = g.joined ? 'Escreva um comentário...' : 'Entre no grupo para comentar';
  grpCheckInput();
}
function grpCheckInput(){
  const input = document.getElementById('grpInput');
  document.getElementById('grpSendBtn').classList.toggle('ready', !input.disabled && input.value.trim().length > 0);
}
function grpSendComment(){
  const g = grpFind(grpOpen); const input = document.getElementById('grpInput');
  const txt = input.value.trim();
  if(!g || !g.joined || !txt) return;
  g.posts.push({a:'Você', t:txt, likes:0, liked:false, reported:false});
  renderGroups();
  const body = document.getElementById('grpBody'); body.scrollTop = body.scrollHeight;
}
function grpLike(i){
  const p = grpFind(grpOpen).posts[i];
  p.liked = !p.liked; p.likes += p.liked ? 1 : -1;
  const keep = document.getElementById('grpBody').scrollTop;
  renderGroups(); document.getElementById('grpBody').scrollTop = keep;
}
function grpReport(i){
  grpFind(grpOpen).posts[i].reported = true;
  const keep = document.getElementById('grpBody').scrollTop;
  renderGroups(); document.getElementById('grpBody').scrollTop = keep;
}

function grpShowCreate(){ grpView = 'create'; renderGroups(); }
function renderGroupCreate(body){
  body.innerHTML = `
    <button class="grp-back" onclick="grpBack()">‹ Cancelar</button>
    <h2 class="h-serif">Novo grupo</h2>
    <div class="muted">Convide colegas para estudar o mesmo tema</div>
    <div class="grp-form">
      <label for="grpName">Nome do grupo</label>
      <input type="text" id="grpName" maxlength="30" placeholder="Ex.: Geometria para o ENEM" oninput="grpCheckName()">
      <label>Matéria</label>
      <div class="grp-chips">
        ${grpSubjects.map(s=>`<button class="chip ${s===grpNewSubject?'active':''}" onclick="grpPickSubject('${s}')">${s}</button>`).join('')}
      </div>
    </div>
    <button class="btn-gold" id="grpCreateBtn" style="margin-top:22px;" onclick="grpCreate()" disabled>Criar grupo</button>`;
}
function grpCheckName(){
  document.getElementById('grpCreateBtn').disabled = document.getElementById('grpName').value.trim().length === 0;
}
function grpPickSubject(s){
  const name = document.getElementById('grpName').value;
  grpNewSubject = s; renderGroups();
  const el = document.getElementById('grpName'); el.value = name; grpCheckName();
}
function grpCreate(){
  const name = document.getElementById('grpName').value.trim();
  if(!name) return;
  grpData.unshift({id:grpNextId++, name, subject:grpNewSubject, members:1, joined:true, admin:true, posts:[]});
  grpTab = 'mine'; grpView = 'list'; renderGroups();
}

renderNotes('screen-login');

renderPath();
