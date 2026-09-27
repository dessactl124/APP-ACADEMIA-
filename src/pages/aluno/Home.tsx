import { useEffect, useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { createRegistro, getPlanoById } from '../../lib/db'
import type { Aluno, PlanoDeTreino } from '../../types'

export default function Home() {
  const { aluno } = useOutletContext<{ aluno: Aluno }>()
  const [plano, setPlano] = useState<PlanoDeTreino | null>(null)
  const [diaId, setDiaId] = useState<string>('')
  const [concluidos, setConcluidos] = useState<Set<string>>(new Set())
  const [peso, setPeso] = useState('')
  const [salvo, setSalvo] = useState(false)

  useEffect(() => {
    if (aluno.planoTreinoId) {
      const p = getPlanoById(aluno.planoTreinoId)
      setPlano(p ?? null)
      if (p && p.dias.length > 0) setDiaId(p.dias[0].id)
    }
  }, [aluno.planoTreinoId])

  if (!plano) {
    return (
      <div className="text-center py-16">
        <p className="font-display text-3xl mb-2">Sem ficha de treino ainda</p>
        <p className="text-muted">Fale com a sua academia para receber a sua ficha.</p>
      </div>
    )
  }

  const dia = plano.dias.find((d) => d.id === diaId) ?? plano.dias[0]

  function alternar(exId: string) {
    setConcluidos((s) => {
      const novo = new Set(s)
      if (novo.has(exId)) novo.delete(exId)
      else novo.add(exId)
      return novo
    })
  }

  function salvarTreino() {
    createRegistro({
      alunoId: aluno.id,
      diaId: dia.id,
      data: new Date().toISOString(),
      exerciciosConcluidos: Array.from(concluidos),
      pesoCorporal: peso ? Number(peso) : undefined,
    })
    setConcluidos(new Set())
    setPeso('')
    setSalvo(true)
    setTimeout(() => setSalvo(false), 3000)
  }

  const progresso = dia.exercicios.length > 0 ? Math.round((concluidos.size / dia.exercicios.length) * 100) : 0

  return (
    <div>
      <p className="font-mono text-xs uppercase tracking-widest text-muted mb-1">{plano.nome}</p>
      <h1 className="font-display text-4xl mb-5">Treino de hoje</h1>

      <div className="flex gap-2 mb-6 flex-wrap">
        {plano.dias.map((d) => (
          <button
            key={d.id}
            onClick={() => {
              setDiaId(d.id)
              setConcluidos(new Set())
            }}
            className={`text-sm rounded-full px-4 py-2 border transition-colors ${
              d.id === dia.id ? 'accent-bg text-graphite-900 font-semibold border-transparent' : 'border-graphite-500 text-muted'
            }`}
          >
            {d.nome}
          </button>
        ))}
      </div>

      <div className="mb-4">
        <div className="h-1.5 bg-graphite-600 rounded-full overflow-hidden">
          <div className="h-full accent-bg transition-all" style={{ width: `${progresso}%` }} />
        </div>
        <p className="text-xs text-muted mt-1">{progresso}% concluído</p>
      </div>

      <div className="space-y-2 mb-8">
        {dia.exercicios.map((ex) => {
          const feito = concluidos.has(ex.id)
          return (
            <button
              key={ex.id}
              onClick={() => alternar(ex.id)}
              className={`w-full text-left border rounded-xl p-4 flex items-center justify-between transition-colors ${
                feito ? 'border-signal bg-signal/10' : 'border-graphite-500'
              }`}
            >
              <div>
                <p className={`font-semibold ${feito ? 'line-through text-muted' : ''}`}>{ex.nome}</p>
                <p className="text-muted text-sm">
                  {ex.series}x{ex.repeticoes}
                  {ex.carga ? ` · ${ex.carga}` : ''}
                  {ex.observacao ? ` · ${ex.observacao}` : ''}
                </p>
              </div>
              <span
                className={`w-6 h-6 rounded-full border flex items-center justify-center shrink-0 ${
                  feito ? 'accent-bg border-transparent text-graphite-900' : 'border-graphite-500'
                }`}
              >
                {feito ? '✓' : ''}
              </span>
            </button>
          )
        })}
      </div>

      <div className="border border-graphite-500 rounded-xl p-4 mb-6">
        <label className="text-xs uppercase tracking-wide text-muted">Peso corporal hoje (opcional, kg)</label>
        <input
          className="w-full mt-1 bg-graphite-700 border border-graphite-500 rounded-lg px-3 py-2.5 focus:border-signal outline-none"
          value={peso}
          onChange={(e) => setPeso(e.target.value)}
          type="number"
          step="0.1"
        />
      </div>

      <button
        onClick={salvarTreino}
        className="w-full accent-bg text-graphite-900 font-semibold rounded-full py-3 hover:opacity-90"
      >
        Concluir treino de hoje
      </button>
      {salvo && <p className="text-center accent-text text-sm mt-3">Treino registrado. Bom trabalho! 💪</p>}
    </div>
  )
}
