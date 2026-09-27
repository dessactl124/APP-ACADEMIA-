import { getDB, getAcademiaBySlug, getAlunoByCodigo } from './db'

type Sessao =
  | { tipo: 'super' }
  | { tipo: 'academia'; academiaId: string }
  | { tipo: 'aluno'; academiaId: string; alunoId: string }

const SESSION_KEY = 'treino-saas-sessao-v1'

export function getSessao(): Sessao | null {
  const raw = sessionStorage.getItem(SESSION_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw) as Sessao
  } catch {
    return null
  }
}

function setSessao(s: Sessao) {
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(s))
}

export function logout() {
  sessionStorage.removeItem(SESSION_KEY)
}

export function loginSuperAdmin(email: string, senha: string): boolean {
  const db = getDB()
  if (db.superAdmin.email === email && db.superAdmin.senha === senha) {
    setSessao({ tipo: 'super' })
    return true
  }
  return false
}

export function loginAcademia(slug: string, email: string, senha: string): { ok: boolean; erro?: string } {
  const academia = getAcademiaBySlug(slug)
  if (!academia) return { ok: false, erro: 'Academia não encontrada.' }
  if (academia.email !== email || academia.senha !== senha) {
    return { ok: false, erro: 'E-mail ou senha incorretos.' }
  }
  if (academia.status === 'suspensa') {
    return { ok: false, erro: 'Esta academia está com o acesso suspenso.' }
  }
  setSessao({ tipo: 'academia', academiaId: academia.id })
  return { ok: true }
}

export function loginAluno(slug: string, codigo: string): { ok: boolean; erro?: string } {
  const academia = getAcademiaBySlug(slug)
  if (!academia) return { ok: false, erro: 'Academia não encontrada.' }
  const aluno = getAlunoByCodigo(academia.id, codigo)
  if (!aluno) return { ok: false, erro: 'Código de acesso inválido.' }
  if (!aluno.ativo) return { ok: false, erro: 'Seu acesso está inativo. Fale com a academia.' }
  setSessao({ tipo: 'aluno', academiaId: academia.id, alunoId: aluno.id })
  return { ok: true }
}

export type { Sessao }
