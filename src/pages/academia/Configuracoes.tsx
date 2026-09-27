import { ChangeEvent, FormEvent, useState } from 'react'
import { useAcademia } from '../../context/AcademiaContext'
import { AcademiaBrand } from '../../components/AcademiaBrand'
import { updateAcademia } from '../../lib/db'

export default function Configuracoes() {
  const { academia, recarregar } = useAcademia()
  const [nome, setNome] = useState(academia?.nome ?? '')
  const [whatsapp, setWhatsapp] = useState(academia?.whatsapp ?? '')
  const [cor, setCor] = useState(academia?.corPrimaria ?? '#D6FF3F')
  const [logoUrl, setLogoUrl] = useState(academia?.logoUrl ?? '')
  const [salvo, setSalvo] = useState(false)

  if (!academia) return null

  function onLogo(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setLogoUrl(reader.result as string)
    reader.readAsDataURL(file)
  }

  function onSalvar(e: FormEvent) {
    e.preventDefault()
    const a = academia!
    updateAcademia(a.id, {
      nome: nome.trim() || a.nome,
      whatsapp: whatsapp.replace(/\D/g, ''),
      corPrimaria: cor,
      logoUrl,
    })
    recarregar()
    setSalvo(true)
    setTimeout(() => setSalvo(false), 2500)
  }

  return (
    <div className="max-w-xl">
      <h1 className="font-display text-4xl mb-6">Configurações</h1>

      <form onSubmit={onSalvar} className="space-y-6">
        <div className="flex items-center gap-4">
          <AcademiaBrand academia={{ ...academia, logoUrl, corPrimaria: cor }} size="lg" />
          <div>
            <label className="text-sm border border-graphite-500 rounded-full px-4 py-2 cursor-pointer hover:border-signal inline-block">
              Trocar logo
              <input type="file" accept="image/*" className="hidden" onChange={onLogo} />
            </label>
            {logoUrl && (
              <button
                type="button"
                onClick={() => setLogoUrl('')}
                className="text-xs text-muted hover:text-ember ml-3"
              >
                remover
              </button>
            )}
          </div>
        </div>

        <div>
          <label className="text-xs uppercase tracking-wide text-muted">Nome da academia</label>
          <input
            className="w-full mt-1 bg-graphite-700 border border-graphite-500 rounded-lg px-3 py-2.5 focus:border-signal outline-none"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
          />
        </div>

        <div>
          <label className="text-xs uppercase tracking-wide text-muted">Cor de marca</label>
          <input
            className="w-full mt-1 h-11 bg-graphite-700 border border-graphite-500 rounded-lg px-2"
            type="color"
            value={cor}
            onChange={(e) => setCor(e.target.value)}
          />
        </div>

        <div>
          <label className="text-xs uppercase tracking-wide text-muted">WhatsApp de contato</label>
          <input
            className="w-full mt-1 bg-graphite-700 border border-graphite-500 rounded-lg px-3 py-2.5 focus:border-signal outline-none"
            value={whatsapp}
            onChange={(e) => setWhatsapp(e.target.value)}
            placeholder="5511999998888"
          />
        </div>

        <div className="flex items-center gap-3">
          <button
            type="submit"
            className="accent-bg text-graphite-900 font-semibold rounded-full px-6 py-2.5 hover:opacity-90"
          >
            Salvar alterações
          </button>
          {salvo && <span className="text-sm accent-text">Salvo!</span>}
        </div>
      </form>
    </div>
  )
}
