import { Link } from 'react-router-dom'
import { listAcademias } from '../lib/db'

export default function Landing() {
  const academias = listAcademias().filter((a) => a.status === 'ativa')

  return (
    <div className="min-h-screen">
      <header className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
        <div className="font-display text-2xl tracking-wide">
          TREINO<span className="accent-text">SAAS</span>
        </div>
        <Link
          to="/admin/login"
          className="text-sm text-muted hover:text-ink border border-graphite-500 rounded-full px-4 py-2 transition-colors"
        >
          Acesso administrativo
        </Link>
      </header>

      <main className="max-w-6xl mx-auto px-6">
        <section className="pt-16 pb-20 grid md:grid-cols-2 gap-10 items-center">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-signal mb-4">
              Fichas de treino · white-label
            </p>
            <h1 className="font-display text-6xl md:text-7xl leading-[0.95] mb-6">
              CADA ACADEMIA,
              <br />
              COM O APP DELA.
            </h1>
            <p className="text-muted text-lg max-w-md mb-8">
              Uma plataforma só, um app diferente para cada academia: logo própria, cor própria,
              alunos com a ficha de treino sempre no bolso.
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href="#academias"
                className="accent-bg text-graphite-900 font-semibold rounded-full px-6 py-3 hover:opacity-90 transition-opacity"
              >
                Ver academias na plataforma
              </a>
              <Link
                to="/admin/login"
                className="border border-graphite-500 rounded-full px-6 py-3 hover:border-signal transition-colors"
              >
                Sou dono de academia
              </Link>
            </div>
          </div>

          <div className="bg-graphite-700 border border-graphite-500 rounded-2xl p-6">
            <p className="font-mono text-xs uppercase tracking-widest text-muted mb-4">
              O que cada academia tem
            </p>
            <ul className="space-y-3">
              {[
                'Marca própria: logo e cor em todas as telas',
                'Cadastro de alunos com código de acesso individual',
                'Montagem de fichas de treino por dia (A, B, C...)',
                'Aluno marca o treino como feito e acompanha evolução',
              ].map((item) => (
                <li key={item} className="flex gap-3 text-sm">
                  <span className="w-1.5 h-1.5 rounded-full accent-bg mt-2 shrink-0" />
                  <span className="text-ink/90">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section id="academias" className="pb-24">
          <h2 className="font-display text-3xl mb-6">Academias ativas na plataforma</h2>
          {academias.length === 0 ? (
            <p className="text-muted">Nenhuma academia ativa ainda.</p>
          ) : (
            <div className="grid sm:grid-cols-2 gap-4">
              {academias.map((a) => (
                <Link
                  key={a.id}
                  to={`/${a.slug}/login`}
                  className="border border-graphite-500 rounded-xl p-5 hover:border-signal transition-colors flex items-center justify-between"
                >
                  <div>
                    <p className="font-display text-2xl tracking-wide">{a.nome}</p>
                    <p className="text-muted text-sm font-mono">/{a.slug}</p>
                  </div>
                  <span className="text-sm text-muted">Entrar →</span>
                </Link>
              ))}
            </div>
          )}
        </section>
      </main>

      <footer className="border-t border-graphite-600 py-8 text-center text-muted text-sm">
        Demo local — dados salvos apenas no seu navegador. Veja o README para colocar em produção.
      </footer>
    </div>
  )
}
