import { useAcademia } from '../../context/AcademiaContext'
import { listAlunos, listPlanos } from '../../lib/db'

export default function Overview() {
  const { academia } = useAcademia()
  if (!academia) return null
  const alunos = listAlunos(academia.id)
  const planos = listPlanos(academia.id)
  const ativos = alunos.filter((a) => a.ativo).length

  const cards = [
    { label: 'Alunos cadastrados', valor: alunos.length },
    { label: 'Alunos ativos', valor: ativos },
    { label: 'Fichas de treino', valor: planos.length },
    { label: 'Limite do plano', valor: `${alunos.length}/${academia.limiteAlunos}` },
  ]

  return (
    <div>
      <h1 className="font-display text-4xl mb-1">Visão geral</h1>
      <p className="text-muted mb-8">Plano {academia.plano} · status {academia.status}</p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {cards.map((c) => (
          <div key={c.label} className="border border-graphite-500 rounded-xl p-5">
            <p className="font-display text-4xl accent-text">{c.valor}</p>
            <p className="text-muted text-sm mt-1">{c.label}</p>
          </div>
        ))}
      </div>

      <div className="border border-graphite-500 rounded-xl p-6">
        <p className="font-display text-xl mb-2">Link para os alunos</p>
        <p className="text-muted text-sm mb-3">
          Compartilhe este link (ou um QR code apontando pra ele) com seus alunos:
        </p>
        <code className="block bg-graphite-700 border border-graphite-500 rounded-lg px-4 py-3 text-sm font-mono break-all">
          {window.location.origin}/{academia.slug}/login
        </code>
      </div>
    </div>
  )
}
