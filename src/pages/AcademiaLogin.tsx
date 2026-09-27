import { FormEvent, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAcademia } from '../context/AcademiaContext'
import { AcademiaBrand } from '../components/AcademiaBrand'
import { loginAcademia, loginAluno } from '../lib/auth'

export default function AcademiaLogin() {
  const { academia, carregando } = useAcademia()
  const navigate = useNavigate()
  const [aba, setAba] = useState<'aluno' | 'academia'>('aluno')

  const [codigo, setCodigo] = useState('')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')

  if (carregando) return null

  if (!academia) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6 text-center">
        <div>
          <p className="font-display text-3xl mb-2">Academia não encontrada</p>
          <p className="text-muted mb-6">Confira o link com a sua academia.</p>
          <Link to="/" className="accent-text underline">
            Voltar para a página inicial
          </Link>
        </div>
      </div>
    )
  }

  function onEntrarAluno(e: FormEvent) {
    e.preventDefault()
    setErro('')
    const r = loginAluno(academia!.slug, codigo)
    if (r.ok) navigate(`/${academia!.slug}/aluno`)
    else setErro(r.erro || 'Não foi possível entrar.')
  }

  function onEntrarAcademia(e: FormEvent) {
    e.preventDefault()
    setErro('')
    const r = loginAcademia(academia!.slug, email, senha)
    if (r.ok) navigate(`/${academia!.slug}/dashboard`)
    else setErro(r.erro || 'Não foi possível entrar.')
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="flex items-center gap-3 mb-8">
          <AcademiaBrand academia={academia} />
          <div>
            <p className="font-display text-2xl leading-none tracking-wide">{academia.nome}</p>
            <p className="text-muted text-xs">Plataforma de treinos</p>
          </div>
        </div>

        <div className="flex border border-graphite-500 rounded-full p-1 mb-6">
          <button
            onClick={() => setAba('aluno')}
            className={`flex-1 text-sm rounded-full py-2 transition-colors ${
              aba === 'aluno' ? 'accent-bg text-graphite-900 font-semibold' : 'text-muted'
            }`}
          >
            Sou aluno
          </button>
          <button
            onClick={() => setAba('academia')}
            className={`flex-1 text-sm rounded-full py-2 transition-colors ${
              aba === 'academia' ? 'accent-bg text-graphite-900 font-semibold' : 'text-muted'
            }`}
          >
            Sou a academia
          </button>
        </div>

        {aba === 'aluno' ? (
          <form onSubmit={onEntrarAluno} className="space-y-4">
            <div>
              <label className="text-xs uppercase tracking-wide text-muted">Código de acesso</label>
              <input
                className="w-full mt-1 bg-graphite-700 border border-graphite-500 rounded-lg px-3 py-2.5 focus:border-signal outline-none font-mono tracking-widest uppercase"
                value={codigo}
                onChange={(e) => setCodigo(e.target.value)}
                placeholder="EX: A1B2C3"
                maxLength={6}
              />
              <p className="text-xs text-muted mt-1">Recebido da sua academia. Código de demonstração: DEMO01 (Fit Power).</p>
            </div>
            {erro && <p className="text-ember text-sm">{erro}</p>}
            <button
              type="submit"
              className="w-full accent-bg text-graphite-900 font-semibold rounded-full py-2.5 hover:opacity-90"
            >
              Ver meu treino
            </button>
          </form>
        ) : (
          <form onSubmit={onEntrarAcademia} className="space-y-4">
            <div>
              <label className="text-xs uppercase tracking-wide text-muted">E-mail</label>
              <input
                className="w-full mt-1 bg-graphite-700 border border-graphite-500 rounded-lg px-3 py-2.5 focus:border-signal outline-none"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
              />
            </div>
            <div>
              <label className="text-xs uppercase tracking-wide text-muted">Senha</label>
              <input
                className="w-full mt-1 bg-graphite-700 border border-graphite-500 rounded-lg px-3 py-2.5 focus:border-signal outline-none"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                type="password"
              />
            </div>
            {erro && <p className="text-ember text-sm">{erro}</p>}
            <button
              type="submit"
              className="w-full accent-bg text-graphite-900 font-semibold rounded-full py-2.5 hover:opacity-90"
            >
              Entrar no painel
            </button>
            <p className="text-xs text-muted font-mono">Demo: dono@fitpower.com / academia123</p>
          </form>
        )}

        <Link to="/" className="block text-center text-xs text-muted hover:text-ink mt-8">
          ← outra plataforma / voltar
        </Link>
      </div>
    </div>
  )
}
