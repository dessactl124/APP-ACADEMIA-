export type StatusAcademia = 'pendente' | 'ativa' | 'suspensa'
export type Plano = 'trial' | 'starter' | 'pro'

export interface Academia {
  id: string
  slug: string
  nome: string
  logoUrl: string // pode ser data URL (upload) ou vazio (usa iniciais)
  corPrimaria: string // hex
  whatsapp: string
  email: string // login do dono da academia
  senha: string // ATENÇÃO: texto puro só para fins de demo local, ver README
  status: StatusAcademia
  plano: Plano
  limiteAlunos: number
  criadoEm: string
}

export interface Aluno {
  id: string
  academiaId: string
  nome: string
  email: string
  telefone?: string // usado para enviar o código de acesso via WhatsApp
  codigoAcesso: string // código curto usado como "login" do aluno
  planoTreinoId?: string
  ativo: boolean
  criadoEm: string
}

export interface Exercicio {
  id: string
  nome: string
  series: number
  repeticoes: string
  carga?: string
  observacao?: string
}

export interface DiaDeTreino {
  id: string
  nome: string
  exercicios: Exercicio[]
}

export interface PlanoDeTreino {
  id: string
  academiaId: string
  nome: string
  dias: DiaDeTreino[]
  criadoEm: string
}

export interface RegistroTreino {
  id: string
  alunoId: string
  diaId: string
  data: string // ISO date
  exerciciosConcluidos: string[]
  pesoCorporal?: number
}

export interface SuperAdmin {
  email: string
  senha: string
}

export interface DB {
  superAdmin: SuperAdmin
  academias: Academia[]
  alunos: Aluno[]
  planos: PlanoDeTreino[]
  registros: RegistroTreino[]
}
