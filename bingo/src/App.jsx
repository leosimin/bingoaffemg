import { useState } from 'react'
import affemgLogo from './assets/AFFEMG esfera (1).png'
import './App.css'

const CURRENT_YEAR = new Date().getFullYear()

function App() {
  const [marcados, setMarcados] = useState(() => new Set())

  const numeros = Array.from({ length: 75 }, (_, i) => i + 1)
  const totalNumeros = numeros.length
  const quantidadeMarcados = marcados.size

  const alternarNumero = (numero) => {
    setMarcados((anteriores) => {
      const proximo = new Set(anteriores)
      if (proximo.has(numero)) {
        proximo.delete(numero)
      } else {
        proximo.add(numero)
      }
      return proximo
    })
  }

  const limparMarcacoes = () => {
    setMarcados(new Set())
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
                Tela oficial para acompanhamento do sorteio, ideal para projeção em telão.
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
            <p>
              Toque ou clique para marcar e desmarcar cada número. Ideal para
              projetar em telão durante o bingo da AFFEMG.
            </p>
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
