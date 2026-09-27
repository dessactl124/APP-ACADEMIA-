import { useEffect, useState } from 'react'
import { useAcademia } from '../../context/AcademiaContext'
import { createPlano, deletePlano, listPlanos, updatePlano, uid } from '../../lib/db'
import type { DiaDeTreino, Exercicio, PlanoDeTreino } from '../../types'

function diaVazio(): DiaDeTreino {
  return { id: uid('dia_'), nome: '', exercicios: [] }
}

function exercicioVazio(): Exercicio {
  return { id: uid('ex_'), nome: '', series: 3, repeticoes: '10-12' }
}

export default function Treinos() {
  const { academia } = useAcademia()
  const [planos, setPlanos] = useState<PlanoDeTreino[]>([])
  const [editandoId, setEditandoId] = useState<string | null>(null)
  const [mostrarForm, setMostrarForm] = useState(false)
  const [expandido, setExpandido] = useState<string | null>(null)

  const [nomePlano, setNomePlano] = useState('')
  const [dias, setDias] = useState<DiaDeTreino[]>([diaVazio()])
  const [erro, setErro] = useState('')

  useEffect(() => {
    if (academia) refresh()
  }, [academia])

  function refresh() {
    if (!academia) return
    setPlanos(listPlanos(academia.id))
  }

  if (!academia) return null

  function novoForm() {
    setEditandoId(null)
    setNomePlano('')
    setDias([diaVazio()])
    setErro('')
    setMostrarForm(true)
  }

  function editar(p: PlanoDeTreino) {
    setEditandoId(p.id)
    setNomePlano(p.nome)
    setDias(p.dias.map((d) => ({ ...d, exercicios: d.exercicios.map((e) => ({ ...e })) })))
    setErro('')
    setMostrarForm(true)
  }

  function addDia() {
    setDias((d) => [...d, diaVazio()])
  }

  function removerDia(diaId: string) {
    setDias((d) => d.filter((x) => x.id !== diaId))
  }

  function renomearDia(diaId: string, nome: string) {
    setDias((d) => d.map((x) => (x.id === diaId ? { ...x, nome } : x)))
  }

  function addExercicio(diaId: string) {
    setDias((d) => d.map((x) => (x.id === diaId ? { ...x, exercicios: [...x.exercicios, exercicioVazio()] } : x)))
  }

  function removerExercicio(diaId: string, exId: string) {
    setDias((d) =>
      d.map((x) => (x.id === diaId ? { ...x, exercicios: x.exercicios.filter((e) => e.id !== exId) } : x)),
    )
  }

  function atualizarExercicio(diaId: string, exId: string, patch: Partial<Exercicio>) {
    setDias((d) =>
      d.map((x) =>
        x.id === diaId
          ? { ...x, exercicios: x.exercicios.map((e) => (e.id === exId ? { ...e, ...patch } : e)) }
          : x,
      ),
    )
  }

  function salvar() {
    setErro('')
    if (!nomePlano.trim()) {
      setErro('Dê um nome para a ficha (ex: Hipertrofia - Iniciante).')
      return
    }
    if (dias.length === 0 || dias.some((d) => !d.nome.trim())) {
      setErro('Todo dia de treino precisa de um nome (ex: Treino A - Peito).')
      return
    }
    if (editandoId) {
      updatePlano(editandoId, { nome: nomePlano.trim(), dias })
    } else {
      createPlano({ academiaId: academia!.id, nome: nomePlano.trim(), dias })
    }
    setMostrarForm(false)
    refresh()
  }

  function remover(id: string) {
    if (confirm('Remover esta ficha de treino? Alunos usando ela ficarão sem ficha.')) {
      deletePlano(id)
      refresh()
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <h1 className="font-display text-4xl">Fichas de treino</h1>
        {!mostrarForm && (
          <button
            onClick={novoForm}
            className="accent-bg text-graphite-900 font-semibold rounded-full px-5 py-2.5 hover:opacity-90"
          >
            + Nova ficha
          </button>
        )}
      </div>

      {mostrarForm && (
        <div className="border border-graphite-500 rounded-xl p-6 mb-8 space-y-6">
          <div>
            <label className="text-xs uppercase tracking-wide text-muted">Nome da ficha</label>
            <input
              className="w-full mt-1 bg-graphite-700 border border-graphite-500 rounded-lg px-3 py-2.5 focus:border-signal outline-none"
              value={nomePlano}
              onChange={(e) => setNomePlano(e.target.value)}
              placeholder="Ex: Hipertrofia - Iniciante"
            />
          </div>

          <div className="space-y-5">
            {dias.map((dia, di) => (
              <div key={dia.id} className="bg-graphite-700 border border-graphite-500 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <input
                    className="flex-1 bg-graphite-600 border border-graphite-500 rounded-lg px-3 py-2 text-sm focus:border-signal outline-none"
                    value={dia.nome}
                    onChange={(e) => renomearDia(dia.id, e.target.value)}
                    placeholder={`Treino ${String.fromCharCode(65 + di)} - ex: Peito e Tríceps`}
                  />
                  {dias.length > 1 && (
                    <button onClick={() => removerDia(dia.id)} className="text-muted hover:text-ember text-sm px-2">
                      Remover dia
                    </button>
                  )}
                </div>

                <div className="space-y-2">
                  {dia.exercicios.map((ex) => (
                    <div key={ex.id} className="grid grid-cols-12 gap-2 items-center">
                      <input
                        className="col-span-4 bg-graphite-600 border border-graphite-500 rounded-lg px-2 py-1.5 text-sm focus:border-signal outline-none"
                        placeholder="Exercício"
                        value={ex.nome}
                        onChange={(e) => atualizarExercicio(dia.id, ex.id, { nome: e.target.value })}
                      />
                      <input
                        className="col-span-2 bg-graphite-600 border border-graphite-500 rounded-lg px-2 py-1.5 text-sm focus:border-signal outline-none"
                        type="number"
                        min={1}
                        placeholder="Séries"
                        value={ex.series}
                        onChange={(e) => atualizarExercicio(dia.id, ex.id, { series: Number(e.target.value) })}
                      />
                      <input
                        className="col-span-2 bg-graphite-600 border border-graphite-500 rounded-lg px-2 py-1.5 text-sm focus:border-signal outline-none"
                        placeholder="Reps"
                        value={ex.repeticoes}
                        onChange={(e) => atualizarExercicio(dia.id, ex.id, { repeticoes: e.target.value })}
                      />
                      <input
                        className="col-span-2 bg-graphite-600 border border-graphite-500 rounded-lg px-2 py-1.5 text-sm focus:border-signal outline-none"
                        placeholder="Carga"
                        value={ex.carga ?? ''}
                        onChange={(e) => atualizarExercicio(dia.id, ex.id, { carga: e.target.value })}
                      />
                      <button
                        onClick={() => removerExercicio(dia.id, ex.id)}
                        className="col-span-2 text-muted hover:text-ember text-xs"
                      >
                        remover
                      </button>
                    </div>
                  ))}
                </div>
                <button onClick={() => addExercicio(dia.id)} className="text-xs accent-text mt-3 hover:underline">
                  + adicionar exercício
                </button>
              </div>
            ))}
          </div>

          <button onClick={addDia} className="text-sm border border-graphite-500 rounded-full px-4 py-2 hover:border-signal">
            + adicionar dia de treino
          </button>

          {erro && <p className="text-ember text-sm">{erro}</p>}

          <div className="flex gap-3">
            <button
              onClick={salvar}
              className="accent-bg text-graphite-900 font-semibold rounded-full px-6 py-2.5 hover:opacity-90"
            >
              Salvar ficha
            </button>
            <button
              onClick={() => setMostrarForm(false)}
              className="text-sm border border-graphite-500 rounded-full px-6 py-2.5 hover:border-signal"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {planos.length === 0 && !mostrarForm && <p className="text-muted">Nenhuma ficha criada ainda.</p>}
        {planos.map((p) => (
          <div key={p.id} className="border border-graphite-500 rounded-xl p-5">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <button onClick={() => setExpandido(expandido === p.id ? null : p.id)} className="text-left">
                <p className="font-display text-2xl tracking-wide">{p.nome}</p>
                <p className="text-muted text-sm">{p.dias.length} dia(s) de treino</p>
              </button>
              <div className="flex gap-2">
                <button
                  onClick={() => editar(p)}
                  className="text-sm border border-graphite-500 rounded-full px-4 py-2 hover:border-signal"
                >
                  Editar
                </button>
                <button onClick={() => remover(p.id)} className="text-sm text-muted hover:text-ember px-2">
                  Remover
                </button>
              </div>
            </div>
            {expandido === p.id && (
              <div className="mt-4 grid sm:grid-cols-2 gap-4">
                {p.dias.map((dia) => (
                  <div key={dia.id} className="bg-graphite-700 border border-graphite-500 rounded-lg p-4">
                    <p className="font-semibold mb-2">{dia.nome}</p>
                    <ul className="text-sm text-muted space-y-1">
                      {dia.exercicios.map((ex) => (
                        <li key={ex.id}>
                          {ex.nome} — {ex.series}x{ex.repeticoes}
                          {ex.carga ? ` · ${ex.carga}` : ''}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
