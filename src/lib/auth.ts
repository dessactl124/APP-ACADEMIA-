import { getDB, getAcademiaBySlug, getAlunoByCodigo } from './db'
import { supabase } from './supabase'

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

export async function logout() {
  sessionStorage.removeItem(SESSION_KEY)
  await supabase.auth.signOut()
}

export function loginSuperAdmin(email: string, senha: string): boolean {
  const db = getDB()

  if (db.superAdmin.email === email && db.superAdmin.senha === senha) {
    setSessao({ tipo: 'super' })
    return true
  }

  return false
}

export async function loginAcademia(
  _slug: string,
  email: string,
  senha: string,
): Promise<{ ok: boolean; erro?: string }> {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password: senha,
  })

  if (error || !data.user) {
    return {
      ok: false,
      erro: 'E-mail ou senha incorretos.',
    }
  }

  const { data: perfil, error: perfilError } = await supabase
    .from('perfis')
    .select('id, academia_id, tipo')
    .eq('id', data.user.id)
    .single()

  if (perfilError || !perfil?.academia_id) {
    await supabase.auth.signOut()

    return {
      ok: false,
      erro: 'Usuário não está vinculado a uma academia.',
    }
  }

  if (perfil.tipo !== 'academia') {
    await supabase.auth.signOut()

    return {
      ok: false,
      erro: 'Este usuário não possui acesso de academia.',
    }
  }

  setSessao({
    tipo: 'academia',
    academiaId: perfil.academia_id,
  })

  return { ok: true }
}

export function loginAluno(
  slug: string,
  codigo: string,
): { ok: boolean; erro?: string } {
  const academia = getAcademiaBySlug(slug)

  if (!academia) {
    return { ok: false, erro: 'Academia não encontrada.' }
  }

  const aluno = getAlunoByCodigo(academia.id, codigo)

  if (!aluno) {
    return { ok: false, erro: 'Código de acesso inválido.' }
  }

  if (!aluno.ativo) {
    return {
      ok: false,
      erro: 'Seu acesso está inativo. Fale com a academia.',
    }
  }

  setSessao({
    tipo: 'aluno',
    academiaId: academia.id,
    alunoId: aluno.id,
  })

  return { ok: true }
}

export type { Sessao }
