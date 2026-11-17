const screens = [
  {id:'screen-login', label:'Login'},
  {id:'screen-home', label:'Home'},
  {id:'screen-profile', label:'Perfil'},
  {id:'screen-path', label:'Trilha'},
  {id:'screen-lesson', label:'Aula'},
  {id:'screen-exercises', label:'Exercícios'},
  {id:'screen-exam', label:'Simulado'},
  {id:'screen-chat', label:'Chat IA'}
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
    mvp:  {title:'Dados fixos', text:'Nome, XP, nível e trilhas estão escritos direto no HTML. Os cards só navegam entre telas.', tech:['HTML','JS']},
    real: {title:'Home personalizada', text:'A tela seria montada com o perfil e o progresso de cada aluno, lidos do banco de dados.', tech:['API','Banco de dados']}
  },
  'screen-profile': {
    mvp:  {title:'Perfil de exemplo', text:'Estatísticas, conquistas e domínio por matéria são valores fixos desenhados com CSS.', tech:['HTML','CSS']},
    real: {title:'Perfil dinâmico', text:'XP, nível, sequência, ranking e conquistas seriam calculados a partir da atividade real do aluno.', tech:['API','Banco de dados','Regras de gamificação']}
  },
  'screen-path': {
    mvp:  {title:'Trilha estática', text:'Os estados concluído, atual e bloqueado são classes CSS aplicadas à mão.', tech:['HTML','CSS']},
    real: {title:'Trilha por progresso', text:'Módulos seriam cadastrados no banco e liberados conforme o aluno conclui cada etapa.', tech:['API','Banco de dados']}
  },
  'screen-lesson': {
    mvp:  {title:'Aula de demonstração', text:'O vídeo é uma caixa visual. As abas Vídeo, Notas e Recursos trocam o texto com JS.', tech:['HTML','CSS','JS']},
    real: {title:'Vídeo e materiais reais', text:'Vídeos em serviço de hospedagem de mídia. Notas e PDFs vindos do banco, ligados a cada aula.', tech:['Hospedagem de vídeo','API','Banco de dados']}
  },
  'screen-exercises': {
    mvp:  {title:'Questões em lista JS', text:'3 questões ficam num array no script. O JS confere a resposta e soma 30 XP por acerto.', tech:['JS (array)','DOM']},
    real: {title:'Banco de questões', text:'Questões por matéria, tema e dificuldade no banco. XP gravado no perfil a cada resposta.', tech:['API','Banco de dados']}
  },
  'screen-exam': {
    mvp:  {title:'Simulado demonstrativo', text:'Cronômetro regressivo em JS, 1 questão de exemplo e grade de questões clicável.', tech:['JS','CSS']},
    real: {title:'Simulados ENEM', text:'Provas montadas por área. Tempo controlado pelo servidor, correção automática e relatório por área.', tech:['API','Banco de dados','Back-end']}
  },
  'screen-chat': {
    mvp:  {title:'IA simulada', text:'Respostas prontas escritas no código. O que o aluno digita não é interpretado.', tech:['JS','Respostas fixas']},
    real: {title:'IA da INQUIRA', text:'Integração via API com um modelo de linguagem, instruído a guiar o raciocínio em vez de entregar a resposta.', tech:['API','Modelo de linguagem']}
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

renderNotes('screen-login');