import type { Academia, Aluno, DB, PlanoDeTreino, RegistroTreino } from '../types'

const STORAGE_KEY = 'treino-saas-db-v1'

function uid(prefix = ''): string {
  return `${prefix}${Math.random().toString(36).slice(2, 9)}${Date.now().toString(36).slice(-4)}`
}

function codigoAcesso(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let out = ''
  for (let i = 0; i < 6; i++) out += chars[Math.floor(Math.random() * chars.length)]
  return out
}

function seed(): DB {
  const academiaFitPowerId = uid('aca_')
  const academiaVertexId = uid('aca_')

  const academias: Academia[] = [
    {
      id: academiaFitPowerId,
      slug: 'fit-power',
      nome: 'Fit Power Academia',
      logoUrl: '',
      corPrimaria: '#D6FF3F',
      whatsapp: '5511999990000',
      email: 'dono@fitpower.com',
      senha: 'academia123',
      status: 'ativa',
      plano: 'pro',
      limiteAlunos: 300,
      criadoEm: new Date().toISOString(),
    },
    {
      id: academiaVertexId,
      slug: 'vertex-treinos',
      nome: 'Vertex Treinos',
      logoUrl: '',
      corPrimaria: '#FF5A36',
      whatsapp: '5511988880000',
      email: 'dono@vertex.com',
      senha: 'academia123',
      status: 'pendente',
      plano: 'trial',
      limiteAlunos: 30,
      criadoEm: new Date().toISOString(),
    },
  ]

  const planoAId = uid('plano_')
  const planos: PlanoDeTreino[] = [
    {
      id: planoAId,
      academiaId: academiaFitPowerId,
      nome: 'Hipertrofia - Iniciante',
      criadoEm: new Date().toISOString(),
      dias: [
        {
          id: uid('dia_'),
          nome: 'Treino A - Peito e Tríceps',
          exercicios: [
            { id: uid('ex_'), nome: 'Supino reto barra', series: 4, repeticoes: '10-12', carga: '40kg' },
            { id: uid('ex_'), nome: 'Supino inclinado halteres', series: 3, repeticoes: '10-12', carga: '16kg' },
            { id: uid('ex_'), nome: 'Crucifixo máquina', series: 3, repeticoes: '12-15' },
            { id: uid('ex_'), nome: 'Tríceps corda', series: 4, repeticoes: '12-15' },
          ],
        },
        {
          id: uid('dia_'),
          nome: 'Treino B - Costas e Bíceps',
          exercicios: [
            { id: uid('ex_'), nome: 'Puxada frente', series: 4, repeticoes: '10-12' },
            { id: uid('ex_'), nome: 'Remada baixa', series: 3, repeticoes: '10-12' },
            { id: uid('ex_'), nome: 'Rosca direta barra', series: 3, repeticoes: '10-12' },
            { id: uid('ex_'), nome: 'Rosca alternada', series: 3, repeticoes: '12' },
          ],
        },
        {
          id: uid('dia_'),
          nome: 'Treino C - Pernas',
          exercicios: [
            { id: uid('ex_'), nome: 'Agachamento livre', series: 4, repeticoes: '8-10', carga: '50kg' },
            { id: uid('ex_'), nome: 'Leg press', series: 4, repeticoes: '10-12' },
            { id: uid('ex_'), nome: 'Cadeira extensora', series: 3, repeticoes: '12-15' },
            { id: uid('ex_'), nome: 'Panturrilha em pé', series: 4, repeticoes: '15-20' },
          ],
        },
      ],
    },
  ]

  const aluno1Id = uid('alu_')
  const alunos: Aluno[] = [
    {
      id: aluno1Id,
      academiaId: academiaFitPowerId,
      nome: 'Marina Souza',
      email: 'marina@exemplo.com',
      codigoAcesso: 'DEMO01',
      planoTreinoId: planoAId,
      ativo: true,
      criadoEm: new Date().toISOString(),
    },
  ]

  const registros: RegistroTreino[] = []

  return {
    superAdmin: { email: 'admin@treinosaas.com', senha: 'admin123' },
    academias,
    alunos,
    planos,
    registros,
  }
}

export function getDB(): DB {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) {
    const initial = seed()
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initial))
    return initial
  }
  try {
    return JSON.parse(raw) as DB
  } catch {
    const initial = seed()
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initial))
    return initial
  }
}

function saveDB(db: DB) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(db))
}

export function resetDB() {
  localStorage.removeItem(STORAGE_KEY)
}

// ---------- Academias ----------
export function listAcademias(): Academia[] {
  return getDB().academias
}

export function getAcademiaBySlug(slug: string): Academia | undefined {
  return getDB().academias.find((a) => a.slug === slug)
}

export function getAcademiaById(id: string): Academia | undefined {
  return getDB().academias.find((a) => a.id === id)
}

export function createAcademia(data: Omit<Academia, 'id' | 'criadoEm' | 'status'>): Academia {
  const db = getDB()
  const nova: Academia = {
    ...data,
    id: uid('aca_'),
    status: 'pendente',
    criadoEm: new Date().toISOString(),
  }
  db.academias.push(nova)
  saveDB(db)
  return nova
}

export function updateAcademia(id: string, patch: Partial<Academia>): Academia | undefined {
  const db = getDB()
  const idx = db.academias.findIndex((a) => a.id === id)
  if (idx === -1) return undefined
  db.academias[idx] = { ...db.academias[idx], ...patch }
  saveDB(db)
  return db.academias[idx]
}

export function deleteAcademia(id: string) {
  const db = getDB()
  db.academias = db.academias.filter((a) => a.id !== id)
  db.alunos = db.alunos.filter((al) => al.academiaId !== id)
  db.planos = db.planos.filter((p) => p.academiaId !== id)
  saveDB(db)
}

// ---------- Alunos ----------
export function listAlunos(academiaId: string): Aluno[] {
  return getDB().alunos.filter((a) => a.academiaId === academiaId)
}

export function getAlunoByCodigo(academiaId: string, codigo: string): Aluno | undefined {
  return getDB().alunos.find(
    (a) => a.academiaId === academiaId && a.codigoAcesso.toUpperCase() === codigo.toUpperCase(),
  )
}

export function getAlunoById(id: string): Aluno | undefined {
  return getDB().alunos.find((a) => a.id === id)
}

export function createAluno(data: Omit<Aluno, 'id' | 'criadoEm' | 'codigoAcesso' | 'ativo'>): Aluno {
  const db = getDB()
  const novo: Aluno = {
    ...data,
    id: uid('alu_'),
    codigoAcesso: codigoAcesso(),
    ativo: true,
    criadoEm: new Date().toISOString(),
  }
  db.alunos.push(novo)
  saveDB(db)
  return novo
}

export function updateAluno(id: string, patch: Partial<Aluno>): Aluno | undefined {
  const db = getDB()
  const idx = db.alunos.findIndex((a) => a.id === id)
  if (idx === -1) return undefined
  db.alunos[idx] = { ...db.alunos[idx], ...patch }
  saveDB(db)
  return db.alunos[idx]
}

export function deleteAluno(id: string) {
  const db = getDB()
  db.alunos = db.alunos.filter((a) => a.id !== id)
  db.registros = db.registros.filter((r) => r.alunoId !== id)
  saveDB(db)
}

// ---------- Planos de treino ----------
export function listPlanos(academiaId: string): PlanoDeTreino[] {
  return getDB().planos.filter((p) => p.academiaId === academiaId)
}

export function getPlanoById(id: string): PlanoDeTreino | undefined {
  return getDB().planos.find((p) => p.id === id)
}

export function createPlano(data: Omit<PlanoDeTreino, 'id' | 'criadoEm'>): PlanoDeTreino {
  const db = getDB()
  const novo: PlanoDeTreino = { ...data, id: uid('plano_'), criadoEm: new Date().toISOString() }
  db.planos.push(novo)
  saveDB(db)
  return novo
}

export function updatePlano(id: string, patch: Partial<PlanoDeTreino>): PlanoDeTreino | undefined {
  const db = getDB()
  const idx = db.planos.findIndex((p) => p.id === id)
  if (idx === -1) return undefined
  db.planos[idx] = { ...db.planos[idx], ...patch }
  saveDB(db)
  return db.planos[idx]
}

export function deletePlano(id: string) {
  const db = getDB()
  db.planos = db.planos.filter((p) => p.id !== id)
  saveDB(db)
}

// ---------- Registros de treino (histórico do aluno) ----------
export function listRegistros(alunoId: string): RegistroTreino[] {
  return getDB()
    .registros.filter((r) => r.alunoId === alunoId)
    .sort((a, b) => (a.data < b.data ? 1 : -1))
}

export function createRegistro(data: Omit<RegistroTreino, 'id'>): RegistroTreino {
  const db = getDB()
  const novo: RegistroTreino = { ...data, id: uid('reg_') }
  db.registros.push(novo)
  saveDB(db)
  return novo
}

export { uid, codigoAcesso }
