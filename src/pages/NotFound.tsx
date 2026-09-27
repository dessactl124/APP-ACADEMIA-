import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center text-center px-6">
      <div>
        <p className="font-display text-6xl mb-2">404</p>
        <p className="text-muted mb-6">Essa página não existe.</p>
        <Link to="/" className="accent-text underline">
          Voltar para a página inicial
        </Link>
      </div>
    </div>
  )
}
