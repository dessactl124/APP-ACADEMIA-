import { useEffect, useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAcademia } from '../../context/AcademiaContext'
import { AcademiaBrand } from '../../components/AcademiaBrand'
import { getSessao, logout } from '../../lib/auth'
import { getAlunoById } from '../../lib/db'
import type { Aluno } from '../../types'

const LINKS = [
  { to: '', label: 'Treino de hoje', end: true },
  { to: 'historico', label: 'Histórico' },
  { to: 'perfil', label: 'Perfil' },
]

export default function AlunoLayout() {
  const { academia, carregando } = useAcademia()
  const navigate = useNavigate()
  const [aluno, setAluno] = useState<Aluno | null>(null)

  useEffect(() => {
    if (carregando) return
    if (!academia) return
    const s = getSessao()
    if (!s || s.tipo !== 'aluno' || s.academiaId !== academia.id) {
      navigate(`/${academia.slug}/login`)
      return
    }
    const a = getAlunoById(s.alunoId)
    if (!a) {
      navigate(`/${academia.slug}/login`)
      return
    }
    setAluno(a)
  }, [academia, carregando, navigate])

  if (carregando || !academia || !aluno) return null

  function onSair() {
    logout()
    navigate(`/${academia!.slug}/login`)
  }

  return (
    <div className="min-h-screen pb-24 md:pb-0">
      <header className="border-b border-graphite-600 sticky top-0 bg-graphite-800/95 backdrop-blur z-10">
        <div className="max-w-2xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AcademiaBrand academia={academia} size="sm" />
            <div>
              <p className="font-display text-lg leading-none tracking-wide">{academia.nome}</p>
              <p className="text-muted text-xs">Olá, {aluno.nome.split(' ')[0]}</p>
            </div>
          </div>
          <button onClick={onSair} className="text-xs text-muted hover:text-ink">
            Sair
          </button>
        </div>
        <nav className="max-w-2xl mx-auto px-6 flex gap-4 border-t border-graphite-600 hidden md:flex">
          {LINKS.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              className={({ isActive }) =>
                `text-sm py-3 border-b-2 transition-colors ${
                  isActive ? 'border-signal accent-text' : 'border-transparent text-muted hover:text-ink'
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-6">
        <Outlet context={{ aluno } satisfies { aluno: Aluno }} />
      </main>

      <nav className="fixed bottom-0 left-0 right-0 border-t border-graphite-600 bg-graphite-800 flex md:hidden">
        {LINKS.map((l) => (
          <NavLink
            key={l.to}
            to={l.to}
            end={l.end}
            className={({ isActive }) =>
              `flex-1 text-center text-xs py-3 ${isActive ? 'accent-text font-semibold' : 'text-muted'}`
            }
          >
            {l.label}
          </NavLink>
        ))}
      </nav>
    </div>
  )
}
