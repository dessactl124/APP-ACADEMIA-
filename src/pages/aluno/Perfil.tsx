import { useOutletContext } from 'react-router-dom'
import { useAcademia } from '../../context/AcademiaContext'
import type { Aluno } from '../../types'

export default function Perfil() {
  const { aluno } = useOutletContext<{ aluno: Aluno }>()
  const { academia } = useAcademia()
  if (!academia) return null

  const textoWhats = `Oi! Aqui é o ${aluno.nome}, aluno da ${academia.nome}. Preciso de ajuda com meu treino.`
  const linkWhats = academia.whatsapp
    ? `https://wa.me/${academia.whatsapp}?text=${encodeURIComponent(textoWhats)}`
    : null

  return (
    <div>
      <h1 className="font-display text-4xl mb-6">Perfil</h1>
      <div className="border border-graphite-500 rounded-xl p-5 mb-4">
        <p className="font-semibold">{aluno.nome}</p>
        {aluno.email && <p className="text-muted text-sm">{aluno.email}</p>}
        <p className="text-muted text-sm font-mono mt-1">Código de acesso: {aluno.codigoAcesso}</p>
      </div>

      {linkWhats && (
        <a
          href={linkWhats}
          target="_blank"
          rel="noreferrer"
          className="block text-center accent-bg text-graphite-900 font-semibold rounded-full py-3 hover:opacity-90"
        >
          Falar com a academia no WhatsApp
        </a>
      )}
    </div>
  )
}
