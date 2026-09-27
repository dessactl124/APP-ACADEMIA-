import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getAcademiaBySlug } from '../lib/db'
import type { Academia } from '../types'

interface Ctx {
  academia: Academia | null
  carregando: boolean
  recarregar: () => void
}

const AcademiaCtx = createContext<Ctx>({ academia: null, carregando: true, recarregar: () => {} })

export function AcademiaProvider({ children }: { children: React.ReactNode }) {
  const { slug } = useParams<{ slug: string }>()
  const [academia, setAcademia] = useState<Academia | null>(null)
  const [carregando, setCarregando] = useState(true)
  const [tick, setTick] = useState(0)

  useEffect(() => {
    if (!slug) {
      setAcademia(null)
      setCarregando(false)
      return
    }
    const a = getAcademiaBySlug(slug) ?? null
    setAcademia(a)
    setCarregando(false)
    if (a) {
      document.documentElement.style.setProperty('--academia-cor', a.corPrimaria)
      document.title = `${a.nome} — Treinos`
    }
  }, [slug, tick])

  const value = useMemo(
    () => ({ academia, carregando, recarregar: () => setTick((t) => t + 1) }),
    [academia, carregando],
  )

  return <AcademiaCtx.Provider value={value}>{children}</AcademiaCtx.Provider>
}

export function useAcademia() {
  return useContext(AcademiaCtx)
}
