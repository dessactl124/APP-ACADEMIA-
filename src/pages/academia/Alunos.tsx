import { FormEvent, useEffect, useState } from 'react'
import { useAcademia } from '../../context/AcademiaContext'
import { createAluno, deleteAluno, listAlunos, listPlanos, updateAluno } from '../../lib/db'
import type { Aluno, PlanoDeTreino } from '../../types'

export default function Alunos() {
  const { academia } = useAcademia()
  const [alunos, setAlunos] = useState<Aluno[]>([])
  const [planos, setPlanos] = useState<PlanoDeTreino[]>([])
  const [mostrarForm, setMostrarForm] = useState(false)

  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [telefone, setTelefone] = useState('')
  const [planoTreinoId, setPlanoTreinoId] = useState('')
  const [erro, setErro] = useState('')

  useEffect(() => {
    if (academia) refresh()
  }, [academia])

  function refresh() {
    if (!academia) return
    setAlunos(listAlunos(academia.id))
    setPlanos(listPlanos(academia.id))
  }

  if (!academia) return null

  function onCriar(e: FormEvent) {
    e.preventDefault()
    setErro('')
    if (!nome.trim()) {
      setErro('Informe o nome do aluno.')
      return
    }
    if (alunos.length >= academia!.limiteAlunos) {
      setErro(`Limite de ${academia!.limiteAlunos} alunos do plano atingido.`)
      return
    }
    createAluno({
      academiaId: academia!.id,
      nome: nome.trim(),
      email: email.trim(),
      telefone: telefone.replace(/\D/g, '') || undefined,
      planoTreinoId: planoTreinoId || undefined,
    })
    setNome('')
    setEmail('')
    setTelefone('')
    setPlanoTreinoId('')
    setMostrarForm(false)
    refresh()
  }

  function alternarAtivo(a: Aluno) {
    updateAluno(a.id, { ativo: !a.ativo })
    refresh()
  }

  function trocarPlano(a: Aluno, planoId: string) {
    updateAluno(a.id, { planoTreinoId: planoId || undefined })
    refresh()
  }

  function remover(a: Aluno) {
    if (confirm(`Remover ${a.nome}?`)) {
      deleteAluno(a.id)
      refresh()
    }
  }

  function linkWhatsapp(a: Aluno): string | null {
    if (!a.telefone) return null
    const texto = `Oi ${a.nome}! Seu acesso ao app de treino da ${academia!.nome} está liberado.\n\nAcesse: ${window.location.origin}/${academia!.slug}/login\nSeu código de acesso: ${a.codigoAcesso}`
    return `https://wa.me/${a.telefone}?text=${encodeURIComponent(texto)}`
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <h1 className="font-display text-4xl">Alunos</h1>
        <button
          onClick={() => setMostrarForm((v) => !v)}
          className="accent-bg text-graphite-900 font-semibold rounded-full px-5 py-2.5 hover:opacity-90"
        >
          {mostrarForm ? 'Cancelar' : '+ Novo aluno'}
        </button>
      </div>

      {mostrarForm && (
        <form onSubmit={onCriar} className="border border-graphite-500 rounded-xl p-6 mb-8 space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs uppercase tracking-wide text-muted">Nome</label>
              <input
                className="w-full mt-1 bg-graphite-700 border border-graphite-500 rounded-lg px-3 py-2.5 focus:border-signal outline-none"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
              />
            </div>
            <div>
              <label className="text-xs uppercase tracking-wide text-muted">E-mail (opcional)</label>
              <input
                className="w-full mt-1 bg-graphite-700 border border-graphite-500 rounded-lg px-3 py-2.5 focus:border-signal outline-none"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
              />
            </div>
            <div>
              <label className="text-xs uppercase tracking-wide text-muted">WhatsApp (com DDI/DDD)</label>
              <input
                className="w-full mt-1 bg-graphite-700 border border-graphite-500 rounded-lg px-3 py-2.5 focus:border-signal outline-none"
                value={telefone}
                onChange={(e) => setTelefone(e.target.value)}
                placeholder="5511999998888"
              />
            </div>
            <div>
              <label className="text-xs uppercase tracking-wide text-muted">Ficha de treino</label>
              <select
                className="w-full mt-1 bg-graphite-700 border border-graphite-500 rounded-lg px-3 py-2.5 focus:border-signal outline-none"
                value={planoTreinoId}
                onChange={(e) => setPlanoTreinoId(e.target.value)}
              >
                <option value="">Sem ficha ainda</option>
                {planos.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.nome}
                  </option>
                ))}
              </select>
            </div>
          </div>
          {erro && <p className="text-ember text-sm">{erro}</p>}
          <button
            type="submit"
            className="accent-bg text-graphite-900 font-semibold rounded-full px-6 py-2.5 hover:opacity-90"
          >
            Cadastrar aluno
          </button>
        </form>
      )}

      <div className="space-y-3">
        {alunos.length === 0 && <p className="text-muted">Nenhum aluno cadastrado ainda.</p>}
        {alunos.map((a) => {
          const wa = linkWhatsapp(a)
          return (
            <div key={a.id} className="border border-graphite-500 rounded-xl p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-semibold">
                    {a.nome}{' '}
                    {!a.ativo && (
                      <span className="text-[10px] uppercase text-ember border border-ember/40 rounded-full px-2 py-0.5 ml-1">
                        Inativo
                      </span>
                    )}
                  </p>
                  <p className="text-muted text-sm font-mono">Código: {a.codigoAcesso}</p>
                </div>
                <div className="flex gap-2 flex-wrap items-center">
                  {wa && (
                    <a
                      href={wa}
                      target="_blank"
                      rel="noreferrer"
                      className="text-sm border border-graphite-500 rounded-full px-4 py-2 hover:border-signal"
                    >
                      Enviar código no WhatsApp
                    </a>
                  )}
                  <button
                    onClick={() => alternarAtivo(a)}
                    className="text-sm border border-graphite-500 rounded-full px-4 py-2 hover:border-signal"
                  >
                    {a.ativo ? 'Desativar' : 'Ativar'}
                  </button>
                  <button onClick={() => remover(a)} className="text-sm text-muted hover:text-ember px-2">
                    Remover
                  </button>
                </div>
              </div>
              <div className="mt-3">
                <label className="text-xs uppercase tracking-wide text-muted mr-2">Ficha de treino</label>
                <select
                  className="bg-graphite-700 border border-graphite-500 rounded-lg px-3 py-1.5 text-sm focus:border-signal outline-none"
                  value={a.planoTreinoId ?? ''}
                  onChange={(e) => trocarPlano(a, e.target.value)}
                >
                  <option value="">Sem ficha</option>
                  {planos.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.nome}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
