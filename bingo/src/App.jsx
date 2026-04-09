import { useEffect, useState } from 'react'
import affemgLogo from './assets/AFFEMG esfera (1).png'
import './App.css'

const CURRENT_YEAR = new Date().getFullYear()

const STORAGE_KEY = 'bingo-affemg-state-v1'

let cachedInitialState

function getInitialState() {
  if (cachedInitialState !== undefined) return cachedInitialState

  if (typeof globalThis === 'undefined' || !globalThis.localStorage) {
    cachedInitialState = null
    return cachedInitialState
  }

  try {
    const raw = globalThis.localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      cachedInitialState = null
      return cachedInitialState
    }
    cachedInitialState = JSON.parse(raw)
  } catch {
    cachedInitialState = null
  }

  return cachedInitialState
}

const MENSAGENS_ESPECIAIS = {
  1: 'Começou o jogo! O pequeno polegar.',
  10: 'Craque de bola!',
  11: 'Pernas de cambito!',
  13: 'Galo Forte e Vingador! 🐓',
  18: 'Idade da liberdade!',
  22: 'Dois patinhos na lagoa! 🦆🦆',
  31: 'Tudo que cai, cai em pé!',
  33: 'Idade de Cristo!',
  45: 'Fim do primeiro tempo!',
  50: 'Meio século!',
  51: 'Uma boa ideia! 🥃',
  60: 'E o tempo passa...',
  66: 'Um meia seis ou meia dúzia?',
  75: 'Fim da linha! É o fim do globo!',
}

function App() {
  const initialState = getInitialState()

  const [marcados, setMarcados] = useState(
    () =>
      initialState && Array.isArray(initialState.marcados)
        ? new Set(initialState.marcados)
        : new Set(),
  )
  const [ultimaFrase, setUltimaFrase] = useState(
    () =>
      initialState && typeof initialState.ultimaFrase === 'string'
        ? initialState.ultimaFrase
        : '',
  )
  const [rodadaAtual, setRodadaAtual] = useState(
    () =>
      initialState && typeof initialState.rodadaAtual === 'number'
        ? initialState.rodadaAtual
        : 1,
  )
  const [rodadaParaRegistrar, setRodadaParaRegistrar] = useState(
    () =>
      initialState && (initialState.rodadaParaRegistrar === null || typeof initialState.rodadaParaRegistrar === 'number')
        ? initialState.rodadaParaRegistrar
        : null,
  )
  const [nomeVencedor, setNomeVencedor] = useState(
    () =>
      initialState && typeof initialState.nomeVencedor === 'string'
        ? initialState.nomeVencedor
        : '',
  )
  const [vencedores, setVencedores] = useState(
    () =>
      initialState && Array.isArray(initialState.vencedores)
        ? initialState.vencedores
        : [],
  )

  const numeros = Array.from({ length: 75 }, (_, i) => i + 1)
  const totalNumeros = numeros.length
  const quantidadeMarcados = marcados.size

  // Salva estado sempre que algo importante mudar
  useEffect(() => {
    try {
      const data = {
        marcados: Array.from(marcados),
        ultimaFrase,
        rodadaAtual,
        rodadaParaRegistrar,
        nomeVencedor,
        vencedores,
      }
      globalThis.localStorage?.setItem(STORAGE_KEY, JSON.stringify(data))
    } catch (error) {
      console.error('Erro ao salvar estado do bingo:', error)
    }
  }, [marcados, ultimaFrase, rodadaAtual, rodadaParaRegistrar, nomeVencedor, vencedores])

  const alternarNumero = (numero) => {
    setMarcados((anteriores) => {
      const proximo = new Set(anteriores)
      const jaMarcado = proximo.has(numero)

      if (jaMarcado) {
        proximo.delete(numero)
      } else {
        proximo.add(numero)
        const frase = MENSAGENS_ESPECIAIS[numero]
        if (frase) {
          setUltimaFrase(`${numero}: ${frase}`)
        }
      }

      return proximo
    })
  }

  const limparMarcacoes = () => {
    setMarcados(new Set())
    setUltimaFrase('')
  }

  const registrarVencedor = () => {
    const nome = nomeVencedor.trim()
    if (!nome || !rodadaParaRegistrar) return

    setVencedores((anteriores) => [
      ...anteriores,
      { rodada: rodadaParaRegistrar, nome },
    ])
    setNomeVencedor('')
    setRodadaParaRegistrar(null)
    setRodadaAtual((atual) => atual + 1)
  }

  const marcarBingo = () => {
    if (rodadaParaRegistrar) return
    setRodadaParaRegistrar(rodadaAtual)
    setNomeVencedor('')
  }

  const limparVencedores = () => {
    setVencedores([])
  }

  const numerosMarcadosOrdenados = Array.from(marcados).sort((a, b) => a - b)

  return (
    <div className="bingo-app">
      <header className="ba-header">
        <div className="ba-header-inner">
          <div className="ba-brand">
            <div className="ba-logo-wrapper">
              <img
                src={affemgLogo}
                alt="Logo da AFFEMG"
                className="ba-logo"
              />
            </div>
            <div className="ba-title-group">
              <span className="ba-tagline">ASSOCIAÇÃO DOS FUNCIONÁRIOS DO FISCO DE MINAS GERAIS</span>
              <h1>Bingo AFFEMG</h1>
              <p className="ba-subtitle">
                Encontro de Pensionistas
              </p>
            </div>
          </div>

          <div className="ba-header-meta">
            <div className="ba-chip ba-chip--primary">Evento especial</div>
            <div className="ba-chip">Presencial</div>
          </div>
        </div>

        <div className="ba-header-bottom">
          <span className="ba-header-pill">Bolas de 1 a 75</span>
          <span className="ba-header-pill ba-header-pill--muted">
            Clique para marcar os números já sorteados
          </span>
        </div>
      </header>

      <main className="ba-main">
        <section className="ba-board-card" aria-label="Painel de números do bingo">
          <div className="ba-board-header">
            <h2>Números do sorteio</h2>
          </div>

          <div className="ba-board-legend" aria-hidden="true">
            <span className="ba-legend-item">
              <span className="ba-dot ba-dot--disponivel" aria-hidden="true"></span>
              <span>Disponível</span>
            </span>
            <span className="ba-legend-item">
              <span className="ba-dot ba-dot--marcado" aria-hidden="true"></span>
              <span>Sorteado</span>
            </span>
          </div>

          <div className="ba-grid" role="grid" aria-label="Números de 1 a 90">
            {numeros.map((numero) => (
              <button
                key={numero}
                type="button"
                className={`ba-cell ${
                  marcados.has(numero) ? 'ba-cell--marcado' : ''
                }`}
                onClick={() => alternarNumero(numero)}
                aria-pressed={marcados.has(numero)}
              >
                {numero}
              </button>
            ))}
          </div>
        </section>

        <aside className="ba-side-card">
          <h3>Resumo do sorteio</h3>
          <p className="ba-resume">
            <strong>{quantidadeMarcados}</strong> de {totalNumeros} números
            marcados
          </p>

          {quantidadeMarcados > 0 ? (
            <>
              <h4>Números já sorteados</h4>
              <div className="ba-selected-list" aria-live="polite">
                {numerosMarcadosOrdenados.map((numero) => (
                  <span key={numero} className="ba-pill">
                    {numero}
                  </span>
                ))}
              </div>
            </>
          ) : (
            <p className="ba-muted">Nenhum número marcado ainda.</p>
          )}

          <button
            type="button"
            className="ba-reset"
            onClick={limparMarcacoes}
            disabled={quantidadeMarcados === 0}
          >
            Limpar marcações
          </button>

          <p className="ba-footnote">
            As bolas continuam sendo sorteadas presencialmente; esta tela serve
            apenas como apoio visual para o público.
          </p>

          {ultimaFrase && (
            <div className="ba-callout" aria-live="polite">
              <span className="ba-callout-label">Última bolinha especial</span>
              <p className="ba-callout-text">{ultimaFrase}</p>
            </div>
          )}

          <div className="ba-rounds">
            <h4>Rodadas</h4>
            <p className="ba-rounds-current">
              Rodada atual: <strong>{rodadaAtual}</strong>
            </p>
            <button
              type="button"
              className="ba-button"
              onClick={marcarBingo}
              disabled={!!rodadaParaRegistrar}
            >
              Bingo!
            </button>

            {rodadaParaRegistrar && (
              <div className="ba-rounds-form-card">
                <p className="ba-rounds-info">
                  Registrar vencedor da rodada <strong>{rodadaParaRegistrar}</strong>
                </p>
                <div className="ba-rounds-form">
                  <input
                    type="text"
                    className="ba-input"
                    placeholder="Digite o nome do vencedor"
                    value={nomeVencedor}
                    onChange={(event) => setNomeVencedor(event.target.value)}
                  />
                  <button
                    type="button"
                    className="ba-button"
                    onClick={registrarVencedor}
                    disabled={!nomeVencedor.trim()}
                  >
                    Registrar vencedor
                  </button>
                </div>
              </div>
            )}

            {vencedores.length > 0 && (
              <ul className="ba-rounds-list">
                {vencedores.map((item, index) => (
                  <li key={`${item.rodada}-${index}`} className="ba-rounds-item">
                    <span className="ba-round-pill">Rodada {item.rodada}</span>
                    <span className="ba-round-name">{item.nome}</span>
                  </li>
                ))}
              </ul>
            )}
            {vencedores.length > 0 && (
              <button
                type="button"
                className="ba-reset ba-reset--small"
                onClick={limparVencedores}
              >
                Limpar vencedores
              </button>
            )}
          </div>
        </aside>
      </main>

      <footer className="ba-footer">
        <span>Bingo AFFEMG • {CURRENT_YEAR}</span>
        <span>Ative o modo tela cheia para uma melhor experiência.</span>
      </footer>
    </div>
  )
}

export default App
