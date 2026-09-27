import { FormEvent, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { loginSuperAdmin } from '../lib/auth'

export default function AdminLogin() {
  const [email, setEmail] = useState('admin@treinosaas.com')
  const [senha, setSenha] = useState('admin123')
  const [erro, setErro] = useState('')
  const navigate = useNavigate()

  function onSubmit(e: FormEvent) {
    e.preventDefault()
    if (loginSuperAdmin(email, senha)) {
      navigate('/admin')
    } else {
      setErro('E-mail ou senha incorretos.')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <Link to="/" className="font-display text-xl tracking-wide">
          TREINO<span className="accent-text">SAAS</span>
        </Link>
        <h1 className="font-display text-3xl mt-6 mb-1">Acesso administrativo</h1>
        <p className="text-muted text-sm mb-8">Painel de quem administra a plataforma.</p>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="text-xs uppercase tracking-wide text-muted">E-mail</label>
            <input
              className="w-full mt-1 bg-graphite-700 border border-graphite-500 rounded-lg px-3 py-2.5 focus:border-signal outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              required
            />
          </div>
          <div>
            <label className="text-xs uppercase tracking-wide text-muted">Senha</label>
            <input
              className="w-full mt-1 bg-graphite-700 border border-graphite-500 rounded-lg px-3 py-2.5 focus:border-signal outline-none"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              type="password"
              required
            />
          </div>
          {erro && <p className="text-ember text-sm">{erro}</p>}
          <button
            type="submit"
            className="w-full accent-bg text-graphite-900 font-semibold rounded-full py-2.5 hover:opacity-90 transition-opacity"
          >
            Entrar
          </button>
          <p className="text-xs text-muted font-mono">
            Login de demonstração já preenchido: admin@treinosaas.com / admin123
          </p>
        </form>
      </div>
    </div>
  )
}
