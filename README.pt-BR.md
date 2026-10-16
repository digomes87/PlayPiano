# PlayPiano

*[English](README.md)*

Aprenda piano básico no iPad. A tela grande comporta um teclado de duas oitavas e meia; a próxima tecla a tocar acende em azul, a que você aperta acende em âmbar e a errada acende em vermelho. A cada nota certa, a tecla se enche durante o tempo da nota, e a próxima luz só aparece quando essa nota termina, então quem segue as luzes toca no ritmo.

A primeira música é **Butter-Fly**, a abertura de Digimon Adventure.

**Jogar:** https://digomes87.github.io/PlayPiano/

Funciona melhor no Safari do iPad na horizontal. Também funciona com mouse no computador.

## Como funciona

- **Teclado:** do Dó4 ao Mi6, multitoque (acordes funcionam), e dá pra deslizar o dedo pelas teclas num glissando.
- **Prática guiada:** luz azul na próxima tecla; âmbar quando acerta, vermelho quando erra. Uma barra azul sobe dentro da tecla durante o tempo da nota. Numa nota repetida, a luz apaga e acende de novo na mesma tecla.
- **Ouvir:** toca a melodia no ritmo, acendendo cada tecla, pra você ouvir antes de tentar.
- **Próximas notas:** as seis próximas notas em Dó-Ré-Mi, com barra de progresso e botão de recomeçar.

## Músicas

| Música | Trecho | Notas |
|--------|--------|-------|
| Butter-Fly (Digimon Adventure) | Estrofe | 60 notas, Sol♯4 a Si5, 82 bpm |
| Butter-Fly (Digimon Adventure) | Primeira metade do refrão | 33 notas, Mi5 a Ré6, 82 bpm |
| Ode à Alegria (Beethoven) | Tema principal | 30 notas, Dó4 a Sol4, 100 bpm |

A melodia de Butter-Fly é a voz mais aguda da mão direita de um [arranjo gratuito em letras](https://pianoletternotes.blogspot.com/2021/12/butterfly-digimon-opening.html). A segunda metade do refrão mistura melodia e riffs de guitarra nesse arranjo e ainda não entrou.

## Rodando

Precisa de Node 22+.

```bash
npm install
npm run dev        # http://localhost:5173/PlayPiano/
npm test           # testes de domínio e de áudio (Vitest)
npm run test:e2e   # usa o app num iPad emulado (Playwright + WebKit; na primeira vez: npx playwright install webkit)
npm run typecheck  # tsc
npm run build      # typecheck + build de produção em dist/
npm run preview    # serve o build
```

Pra testar num iPad de verdade antes de publicar, rode `npm run dev -- --host` e abra no iPad o endereço que aparecer, na mesma rede Wi-Fi.

## Branches e publicação

Git flow: `feature/*` → pull request pra `develop` → CI → promoção automática pra `main` → GitHub Pages.

- `.github/workflows/ci.yml` roda `scripts/ci.sh` (instalação, testes unitários, build, testes e2e) em todo push e pull request pra `develop` e `main`.
- `.github/workflows/promote.yml` roda quando o CI passa num push em `develop`: faz o merge do commit testado em `main` (fast-forward quando possível) e chama o deploy.
- `.github/workflows/deploy.yml` faz o build e publica no GitHub Pages. Também roda num push manual em `main`.

`develop` só aceita pull request com CI verde; `main` exige CI verde e recusa force push.

## Arquitetura

```
src/
  music/      Pitch (número MIDI, nome, frequência), PitchRange, Tempo. Sem DOM.
  song/       Melody (parser da partitura), Lesson (progresso imutável), Song, Practice,
              a biblioteca de músicas e a interface do modo música: painel, seletor e
              os efeitos de luz no tempo.
  keyboard/   Teclado, teclas, toques multitoque e a interface do juiz de toques.
  audio/      Sintetizador Web Audio e vozes; destrava o áudio nos gestos do iPad.
  i18n/       Textos da interface (pt-BR), títulos das músicas e nomes das notas.
  styles/     Tokens de design e estilos globais.
e2e/          Testes Playwright num iPad emulado.
```

O teclado não sabe nada de músicas: ele informa cada toque a um `PressJudge` e mostra as luzes de guia e de duração quando mandado. O modo música é o juiz.

### Áudio no iPad

O Safari do iPad só deixa o áudio começar dentro de um gesto de ativação (soltar o dedo, clicar, apertar uma tecla); encostar o dedo não conta. O sintetizador religa o áudio em todo gesto desses e antes de cada nota, então o som volta mesmo depois de o sistema pausar o áudio. Com o iPad no modo silencioso, o Safari fica mudo.

## Adicionando uma música

1. Escreva a melodia como partitura em `src/song/library.ts`: um token `nota:tempos` por nota, por exemplo `E4:1 F#4:0.5 G4:2`. `|` e quebras de linha servem só pra leitura.
2. Adicione a música em `SONGS` com um id e um `Tempo` em batidas por minuto.
3. Adicione o id em `SongId` (`src/song/song.ts`) e o título em `songTitles` no `src/i18n/catalog.ts`.
4. Rode `npm test`. Um teste confere se todas as notas cabem no teclado.

## Stack

Vite, TypeScript, Web Audio, Vitest e Playwright. Sem framework, sem backend, sem analytics.
