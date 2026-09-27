import { useOutletContext } from 'react-router-dom'
import { getPlanoById, listRegistros } from '../../lib/db'
import type { Aluno } from '../../types'

export default function Historico() {
  const { aluno } = useOutletContext<{ aluno: Aluno }>()
  const registros = listRegistros(aluno.id)
  const plano = aluno.planoTreinoId ? getPlanoById(aluno.planoTreinoId) : undefined

  return (
    <div>
      <h1 className="font-display text-4xl mb-6">Histórico</h1>
      {registros.length === 0 && <p className="text-muted">Nenhum treino registrado ainda.</p>}
      <div className="space-y-3">
        {registros.map((r) => {
          const dia = plano?.dias.find((d) => d.id === r.diaId)
          const data = new Date(r.data)
          return (
            <div key={r.id} className="border border-graphite-500 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <p className="font-semibold">{dia?.nome ?? 'Treino'}</p>
                <p className="text-muted text-sm">
                  {data.toLocaleDateString('pt-BR')} às {data.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
              <p className="text-muted text-sm mt-1">
                {r.exerciciosConcluidos.length} exercício(s) concluído(s)
                {r.pesoCorporal ? ` · ${r.pesoCorporal}kg` : ''}
              </p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
