import { FormEvent, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getSessao, logout } from '../lib/auth'
import { createAcademia, listAcademias, updateAcademia, deleteAcademia } from '../lib/db'
import type { Academia, Plano } from '../types'

const PLANOS: { valor: Plano; label: string; limite: number }[] = [
  { valor: 'trial', label: 'Trial (grátis, 15 dias)', limite: 30 },
  { valor: 'starter', label: 'Starter', limite: 100 },
  { valor: 'pro', label: 'Pro', limite: 500 },
]

function slugify(nome: string): string {
  return nome
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export default function AdminDashboard() {
  const navigate = useNavigate()
  const [academias, setAcademias] = useState<Academia[]>([])
  const [mostrarForm, setMostrarForm] = useState(false)

  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [whatsapp, setWhatsapp] = useState('')
  const [cor, setCor] = useState('#D6FF3F')
  const [plano, setPlano] = useState<Plano>('trial')
  const [erro, setErro] = useState('')

  useEffect(() => {
    const s = getSessao()
    if (!s || s.tipo !== 'super') {
      navigate('/admin/login')
      return
    }
    refresh()
  }, [navigate])

  function refresh() {
    setAcademias(listAcademias())
  }

  function onSair() {
    logout()
    navigate('/')
  }

  function onCriar(e: FormEvent) {
    e.preventDefault()
    setErro('')
    if (!nome.trim() || !email.trim() || !senha.trim()) {
      setErro('Preencha nome, e-mail e senha.')
      return
    }
    const slug = slugify(nome)
    if (academias.some((a) => a.slug === slug)) {
      setErro('Já existe uma academia com um nome muito parecido (slug duplicado).')
      return
    }
    const planoInfo = PLANOS.find((p) => p.valor === plano)!
    createAcademia({
      slug,
      nome: nome.trim(),
      logoUrl: '',
      corPrimaria: cor,
      whatsapp: whatsapp.replace(/\D/g, ''),
      email: email.trim(),
      senha,
      plano,
      limiteAlunos: planoInfo.limite,
    })
    setNome('')
    setEmail('')
    setSenha('')
    setWhatsapp('')
    setCor('#D6FF3F')
    setPlano('trial')
    setMostrarForm(false)
    refresh()
  }

  function aprovar(id: string) {
    updateAcademia(id, { status: 'ativa' })
    refresh()
  }

  function suspender(id: string) {
    updateAcademia(id, { status: 'suspensa' })
    refresh()
  }

  function reativar(id: string) {
    updateAcademia(id, { status: 'ativa' })
    refresh()
  }

  function remover(id: string) {
    if (confirm('Remover esta academia e todos os alunos/planos dela? Essa ação não pode ser desfeita.')) {
      deleteAcademia(id)
      refresh()
    }
  }

  return (
    <div className="min-h-screen">
      <header className="border-b border-graphite-600">
        <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
          <Link to="/" className="font-display text-xl tracking-wide">
            TREINO<span className="accent-text">SAAS</span>{' '}
            <span className="text-muted text-sm font-body">/ admin</span>
          </Link>
          <button onClick={onSair} className="text-sm text-muted hover:text-ink">
            Sair
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <h1 className="font-display text-4xl">Academias</h1>
          <button
            onClick={() => setMostrarForm((v) => !v)}
            className="accent-bg text-graphite-900 font-semibold rounded-full px-5 py-2.5 hover:opacity-90"
          >
            {mostrarForm ? 'Cancelar' : '+ Nova academia'}
          </button>
        </div>

        {mostrarForm && (
          <form onSubmit={onCriar} className="bg-graphite-700 border border-graphite-500 rounded-xl p-6 mb-8 space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs uppercase tracking-wide text-muted">Nome da academia</label>
                <input
                  className="w-full mt-1 bg-graphite-600 border border-graphite-500 rounded-lg px-3 py-2.5 focus:border-signal outline-none"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  placeholder="Ex: Fit Power Academia"
                />
                {nome && <p className="text-xs text-muted mt-1 font-mono">URL: /{slugify(nome)}</p>}
              </div>
              <div>
                <label className="text-xs uppercase tracking-wide text-muted">WhatsApp (com DDI/DDD)</label>
                <input
                  className="w-full mt-1 bg-graphite-600 border border-graphite-500 rounded-lg px-3 py-2.5 focus:border-signal outline-none"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  placeholder="5511999998888"
                />
              </div>
              <div>
                <label className="text-xs uppercase tracking-wide text-muted">E-mail de login do dono</label>
                <input
                  className="w-full mt-1 bg-graphite-600 border border-graphite-500 rounded-lg px-3 py-2.5 focus:border-signal outline-none"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                />
              </div>
              <div>
                <label className="text-xs uppercase tracking-wide text-muted">Senha provisória</label>
                <input
                  className="w-full mt-1 bg-graphite-600 border border-graphite-500 rounded-lg px-3 py-2.5 focus:border-signal outline-none"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                />
              </div>
              <div>
                <label className="text-xs uppercase tracking-wide text-muted">Cor de marca</label>
                <input
                  className="w-full mt-1 h-11 bg-graphite-600 border border-graphite-500 rounded-lg px-2"
                  value={cor}
                  onChange={(e) => setCor(e.target.value)}
                  type="color"
                />
              </div>
              <div>
                <label className="text-xs uppercase tracking-wide text-muted">Plano</label>
                <select
                  className="w-full mt-1 bg-graphite-600 border border-graphite-500 rounded-lg px-3 py-2.5 focus:border-signal outline-none"
                  value={plano}
                  onChange={(e) => setPlano(e.target.value as Plano)}
                >
                  {PLANOS.map((p) => (
                    <option key={p.valor} value={p.valor}>
                      {p.label} · até {p.limite} alunos
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
              Cadastrar academia
            </button>
          </form>
        )}

        <div className="space-y-3">
          {academias.map((a) => (
            <div
              key={a.id}
              className="border border-graphite-500 rounded-xl p-5 flex flex-wrap items-center justify-between gap-4"
            >
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-display text-2xl tracking-wide">{a.nome}</p>
                  <StatusBadge status={a.status} />
                </div>
                <p className="text-muted text-sm font-mono">
                  /{a.slug} · plano {a.plano} · limite {a.limiteAlunos} alunos
                </p>
              </div>
              <div className="flex gap-2 flex-wrap">
                {a.status === 'pendente' && (
                  <button
                    onClick={() => aprovar(a.id)}
                    className="text-sm accent-bg text-graphite-900 font-semibold rounded-full px-4 py-2 hover:opacity-90"
                  >
                    Aprovar
                  </button>
                )}
                {a.status === 'ativa' && (
                  <button
                    onClick={() => suspender(a.id)}
                    className="text-sm border border-graphite-500 rounded-full px-4 py-2 hover:border-ember"
                  >
                    Suspender
                  </button>
                )}
                {a.status === 'suspensa' && (
                  <button
                    onClick={() => reativar(a.id)}
                    className="text-sm border border-graphite-500 rounded-full px-4 py-2 hover:border-signal"
                  >
                    Reativar
                  </button>
                )}
                <Link
                  to={`/${a.slug}/login`}
                  className="text-sm border border-graphite-500 rounded-full px-4 py-2 hover:border-signal"
                >
                  Ver app
                </Link>
                <button
                  onClick={() => remover(a.id)}
                  className="text-sm text-muted hover:text-ember px-2"
                >
                  Remover
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}

function StatusBadge({ status }: { status: Academia['status'] }) {
  const map = {
    ativa: 'bg-signal/20 text-signal border-signal/40',
    pendente: 'bg-graphite-500 text-muted border-graphite-500',
    suspensa: 'bg-ember/20 text-ember border-ember/40',
  }
  const label = { ativa: 'Ativa', pendente: 'Pendente', suspensa: 'Suspensa' }
  return (
    <span className={`text-[10px] uppercase tracking-wide border rounded-full px-2 py-0.5 ${map[status]}`}>
      {label[status]}
    </span>
  )
}
