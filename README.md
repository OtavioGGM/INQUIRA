# INQUIRA — Protótipo de Apresentação (MVP Mágico de Oz)

Leia isto primeiro. Contexto completo do projeto em poucas linhas.

## O que é

- **INQUIRA**: proposta de plataforma educacional de incentivo ao aprendizado. Combina trilhas, exercícios, jogos educativos, simulados ENEM/vestibular, gamificação (XP, níveis, conquistas, ranking) e assistente de IA.
- Público: alunos do Ensino Fundamental e Médio, candidatos ao ENEM/vestibular, quem quer aprender.
- Origem: TCC do Curso Técnico em Desenvolvimento de Sistemas, E.E. Professora Carolina Cintra da Silveira, São Paulo, 2026.
- Base pedagógica: Paulo Freire (aprendizagem ativa, dialógica) e David Ausubel (aprendizagem significativa). Gamificação tem objetivo educativo, nunca é só decoração.

## O que este repositório é (e não é)

- **É**: protótipo visual **só front-end**, feito para **apresentação/defesa do TCC**. Estilo **Mágico de Oz**: parece funcionar, mas tudo é simulado.
- **Não é**: plataforma real. Não há back-end, banco de dados, API, login real, IA real nem pagamento.
- Tecnologia: **HTML + CSS + JavaScript puro**. Sem framework, sem build, sem dependência npm.
- Abra `inquira_prototipo.html` no navegador. Pronto.

## Metodologia do MVP

O protótipo segue o método **Mágico de Oz**: a interface parece funcionar, mas o funcionamento é simulado por trás. Etapas, na mesma ordem do slide 4 da apresentação (`INQUIRA.pptx`):

1. **Levantar**: formulário com o público-alvo, para entender necessidades (desmotivação, foco, interesse por jogos, personalização).
2. **Priorizar**: Matriz MoSCoW, mantendo só o essencial para a demonstração. Outras ferramentas de planejamento: metas SMART, Mapa da Empatia e Matriz CSD (slide 2).
3. **Prototipar**: 9 telas em HTML, CSS e JS puros, só front-end.
4. **Simular**: dados fixos e respostas prontas, sem back-end, banco de dados, API, login real ou IA real.
5. **Explicar**: em cada tela, dois balões separam o que é **MVP** (como funciona neste protótipo) do que seria a **plataforma de fato** (proposta futura).

O que o protótipo **não** é: não coleta dados, não substitui testes com usuários reais e não comprova a eficácia pedagógica. Em textos do TCC, descreva-o como demonstração da proposta.

## Arquivos

| Arquivo | Função |
|---|---|
| `inquira_prototipo.html` | Estrutura: barra superior, celular com as 9 telas, balões de apoio |
| `style.css` | Todo o visual: variáveis de cor/fonte, celular, telas, balões |
| `script.js` | Navegação, interações simuladas, textos dos balões (`notes`) |
| `INQUIRA.pptx` | Apresentação do TCC. Slide 4 = metodologia do MVP (ver seção acima) |
| `logo-inquira.png` | Logo. Não vem no pacote. O usuário coloca na mesma pasta |

Fonte **Comfortaa** vem do Google Fonts (precisa de internet). Sem internet, cai em `sans-serif`. Times New Roman é fonte do sistema.

## Layout da página

```
[logo INQUIRA]  Título + Subtítulo   ‹ lista de seções ›   Tela n de N      ← .topbar
[ celular (esquerda) ]                [ balão MVP  ]                         ← .stage
                                      [ balão real ]
```

- `.topbar`: logo (`.stage-logo-row`), `#screenTitle` + subtítulo (`.stage-header`), setas e pílulas (`.controls`, `#pillTrack`), contador (`.stage-note`, `#screenIndex` / `#screenTotal`).
- `.stage-left`: celular (`.phone-wrap` > `.phone` > `.phone-screen`). Altura se ajusta à janela (`clamp`) para evitar scroll da página.
- `.stage-right`: dois balões (`#balloonMvp`, `#balloonReal`) para apoio do apresentador.
- Abaixo de 1000px de largura tudo empilha.

## Telas (9)

Cada tela é um `div.screen` com `id`. Só uma tem a classe `active`. A lista `screens` no `script.js` define ordem e rótulo das pílulas.

| # | id | Rótulo | O que simula |
|---|---|---|---|
| 1 | `screen-login` | Login | Alterna Entrar/Cadastrar. Não envia nem salva nada |
| 2 | `screen-home` | Home | XP, nível, trilhas, atalhos. Dados fixos no HTML |
| 3 | `screen-profile` | Perfil | Estatísticas, conquistas, domínio por matéria. Fixos |
| 4 | `screen-path` | Trilha | Módulos concluído / atual / bloqueado por classe CSS |
| 5 | `screen-lesson` | Aula | Caixa de vídeo falsa. Abas Vídeo / Notas / Recursos |
| 6 | `screen-exercises` | Exercícios | 3 questões de trigonometria, +30 XP por acerto |
| 7 | `screen-exam` | Simulado | Cronômetro regressivo, grade de 16 questões, 1 questão exemplo |
| 8 | `screen-groups` | Grupos | Grupos de estudo (visão do aluno): entrar/sair, criar, comentar, curtir, denunciar. Estado só em memória |
| 9 | `screen-chat` | Chat IA | Respostas prontas. Texto digitado não é interpretado |

Navegação: pílulas, setas ‹ ›, atalhos da home (`goTo('screen-...')`) e teclado ← → (desligado ao digitar).

## `script.js` — mapa

- `screens`, `current`: lista de telas e índice atual.
- `goTo(id)`: troca tela, atualiza pílula, título, contador, chama `renderNotes(id)` e inicializa telas dinâmicas (`initExercises`, `initExamGrid`, `initGroups`).
- `prevScreen()` / `nextScreen()`: navegação circular.
- `setLoginMode(mode)`: `'login'` ou `'signup'`.
- `lessonTabs` + `setLessonTab(btn, tab)`: conteúdo das abas da aula.
- Exercícios: `exQuestions` (array), `initExercises`, `renderExercise`, `selectExOption`, `exAction`. Acerto = +30 XP.
- `initExamGrid()`, `selectExamOption(el)`: grade de questões e cronômetro (começa em 04:58:32). Roda uma vez.
- Grupos: `grpDefaults()` (4 grupos de exemplo), `initGroups()` (zera o estado a cada abertura), `renderGroups()` e as visões `list` / `detail` / `create`. Ações: `grpToggleJoin`, `grpSendComment`, `grpLike`, `grpReport`, `grpCreate`. Só quem entrou no grupo comenta. Textos digitados passam por `grpEsc()` antes de entrar no HTML.
- Chat: `checkChatInput`, `sendChat` (responde com texto pronto após 1100 ms), `chatQuick('dica' | 'resolucao')`.
- **Balões**: objeto `notes`, `renderNotes(id)`. Veja abaixo.

## Balões de apoio — como customizar

Objeto `notes` no `script.js`. Uma chave por id de tela:

```js
'screen-chat': {
  mvp:  {title:'IA simulada', text:'Respostas prontas escritas no código.', tech:['JS','Respostas fixas']},
  real: {title:'IA da INQUIRA', text:'Integração via API com modelo de linguagem.', tech:['API','Modelo de linguagem']}
}
```

- `mvp` = como funciona **neste protótipo**. `real` = como seria **na plataforma de fato**.
- `title`: título curto. `text`: explicação. `tech`: etiquetas (chips).
- Edição ao vivo: clicar no título/texto do balão e digitar. Fica só em memória. Recarregar apaga.
- Para mudar de forma permanente, edite `notes`.
- Os textos de `real` descrevem **propostas futuras**. Nunca apresente como implementado.

## Identidade visual (obrigatória)

- Proporção de cor: **cinza escuro 60%**, **amarelo/dourado 20%**, **branco 10%**, 10% restantes em variações harmônicas das cores primárias.
- Fontes, **somente estas duas**: **Times New Roman** (títulos, texto corporativo, elegância) e **Comfortaa** (apoio, destaques, tom moderno e amigável).
- Tom: elegante, sofisticado, equilibrado. Preto domina. Dourado dá ênfase e valor. Branco dá contraste e leitura.
- Variáveis em `:root` no `style.css`: `--ink` (preto), `--gold`, `--gold-soft`, `--gold-deep`, `--paper` (creme de fundo), `--success`, `--danger`, `--serif`, `--round`.
- Logo: troque **só** `--logo-url` (e `--logo-url-light-bg` para fundo claro) no `style.css`. Aceita arquivo ou base64.
- Balão MVP = preto com dourado. Balão real = branco com dourado.

## Escopo — status das funcionalidades

- **Implementado (simulado no protótipo)**: as 9 telas acima.
- **Proposto / futuro** (não existe aqui): login real, banco de dados, API, IA real, Speed Quiz e demais jogos educativos, tela de Progresso com histórico de atividade, grupos de estudo reais (com contas, banco de dados e comentários compartilhados entre pessoas), chat colaborativo, amigos, biblioteca digital, loja virtual, conteúdo premium, pagamento, doações, moderação de verdade (o botão Denunciar do protótipo só muda o texto na tela), certificação por instituições parceiras.
- Em textos para o TCC, trate INQUIRA como proposta. Use "propõe", "busca", "pretende", "pode". Nunca afirme que resolve o problema.

## Regras para IAs que editam este projeto

1. Mantenha **HTML + CSS + JS puro**. Não troque a stack nem adicione framework sem motivo claro.
2. Não mude cores nem fontes fora da identidade visual acima.
3. Não invente dados, estatísticas, autores ou funcionalidades reais. Tudo aqui é demonstração.
4. Não apresente item simulado como real. Sempre separe **MVP** de **plataforma de fato**.
5. Mantenha os `id` das telas e os nomes de função. HTML, `screens` e `notes` dependem deles.
6. Nova tela: crie `div.screen` com `id="screen-..."`, adicione em `screens`, adicione bloco em `notes`.
7. Nunca sugira guardar senha em texto puro. Considere LGPD. Dados de menores exigem cuidado extra.
8. Prefira soluções simples e fáceis de explicar na defesa do TCC.
9. Idioma: português brasileiro.

## Histórico de alterações

- Adicionada a tela **Grupos** (9 telas): visão do estudante com Meus grupos / Explorar, entrar e sair, criar grupo, comentar, curtir e denunciar. É simulada: dados de exemplo no script, nada é salvo ou compartilhado, e a tela recomeça do zero ao ser aberta. Acesso pelo atalho "Grupos" na Home e pelas pílulas do topo.
- Adicionado o **slide 4** à apresentação (`INQUIRA.pptx`), sobre a metodologia do MVP, e documentada a metodologia neste README.
- Removidas as telas **Speed Quiz** e **Progresso** (HTML, CSS, JS e balões). O protótipo passou de 10 para 8 telas. Jogos educativos e histórico de atividade continuam como **proposta futura**. Estatísticas, conquistas e domínio por matéria permanecem na tela de Perfil.
- A barra inferior do celular agora tem 4 itens: Início, Trilhas, IA e Perfil.
- A Home mantém só o atalho do Simulado.

## Pendências conhecidas

- `logo-inquira.png` precisa estar na pasta. Sem ele, o logo some.
- Comfortaa depende de internet para carregar.
- Dados de exemplo (usuário, XP, ranking) são fixos e escritos no HTML.
- Cronômetro do simulado só inicia ao abrir a tela de Simulado pela primeira vez.