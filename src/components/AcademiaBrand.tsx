import type { Academia } from '../types'

function iniciais(nome: string): string {
  return nome
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join('')
}

export function AcademiaBrand({ academia, size = 'md' }: { academia: Academia; size?: 'sm' | 'md' | 'lg' }) {
  const dims = size === 'lg' ? 'w-16 h-16 text-xl' : size === 'sm' ? 'w-8 h-8 text-xs' : 'w-11 h-11 text-sm'
  if (academia.logoUrl) {
    return (
      <img
        src={academia.logoUrl}
        alt={`Logo ${academia.nome}`}
        className={`${dims} rounded-xl object-cover border border-graphite-500`}
      />
    )
  }
  return (
    <div
      className={`${dims} rounded-xl flex items-center justify-center font-display tracking-wider border border-graphite-500`}
      style={{ backgroundColor: 'var(--academia-cor)', color: '#131316' }}
    >
      {iniciais(academia.nome)}
    </div>
  )
}
