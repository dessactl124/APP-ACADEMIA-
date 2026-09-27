import { useEffect, useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAcademia } from '../../context/AcademiaContext'
import { AcademiaBrand } from '../../components/AcademiaBrand'
import { getSessao, logout } from '../../lib/auth'

const LINKS = [
  { to: '', label: 'Visão geral', end: true },
  { to: 'alunos', label: 'Alunos' },
  { to: 'treinos', label: 'Fichas de treino' },
  { to: 'configuracoes', label: 'Configurações' },
]

export default function AcademiaLayout() {
  const { academia, carregando } = useAcademia()
  const navigate = useNavigate()
  const [autorizado, setAutorizado] = useState(false)

  useEffect(() => {
    if (carregando) return
    if (!academia) return
    const s = getSessao()
    if (!s || s.tipo !== 'academia' || s.academiaId !== academia.id) {
      navigate(`/${academia.slug}/login`)
      return
    }
    setAutorizado(true)
  }, [academia, carregando, navigate])

  if (carregando || !academia || !autorizado) return null

  function onSair() {
    logout()
    navigate(`/${academia!.slug}/login`)
  }

  return (
    <div className="min-h-screen md:flex">
      <aside className="md:w-64 border-b md:border-b-0 md:border-r border-graphite-600 p-5 flex md:flex-col justify-between md:justify-start gap-6">
        <div>
          <div className="flex items-center gap-3 mb-8">
            <AcademiaBrand academia={academia} size="sm" />
            <p className="font-display text-lg tracking-wide leading-none">{academia.nome}</p>
          </div>
          <nav className="flex md:flex-col gap-1 flex-wrap">
            {LINKS.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.end}
                className={({ isActive }) =>
                  `text-sm rounded-lg px-3 py-2 transition-colors ${
                    isActive ? 'accent-bg text-graphite-900 font-semibold' : 'text-muted hover:text-ink'
                  }`
                }
              >
                {l.label}
              </NavLink>
            ))}
          </nav>
        </div>
        <button onClick={onSair} className="text-sm text-muted hover:text-ink text-left">
          Sair
        </button>
      </aside>
      <main className="flex-1 p-6 md:p-10">
        <Outlet />
      </main>
    </div>
  )
}
