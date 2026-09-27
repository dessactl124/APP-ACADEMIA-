import { Routes, Route, Outlet } from 'react-router-dom'
import Landing from './pages/Landing'
import AdminLogin from './pages/AdminLogin'
import AdminDashboard from './pages/AdminDashboard'
import AcademiaLogin from './pages/AcademiaLogin'
import { AcademiaProvider } from './context/AcademiaContext'
import AcademiaLayout from './pages/academia/AcademiaLayout'
import Overview from './pages/academia/Overview'
import Alunos from './pages/academia/Alunos'
import Treinos from './pages/academia/Treinos'
import Configuracoes from './pages/academia/Configuracoes'
import AlunoLayout from './pages/aluno/AlunoLayout'
import Home from './pages/aluno/Home'
import Historico from './pages/aluno/Historico'
import Perfil from './pages/aluno/Perfil'
import NotFound from './pages/NotFound'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin" element={<AdminDashboard />} />

      <Route path="/:slug" element={<AcademiaProvider><Outlet /></AcademiaProvider>}>
        <Route path="login" element={<AcademiaLogin />} />

        <Route path="dashboard" element={<AcademiaLayout />}>
          <Route index element={<Overview />} />
          <Route path="alunos" element={<Alunos />} />
          <Route path="treinos" element={<Treinos />} />
          <Route path="configuracoes" element={<Configuracoes />} />
        </Route>

        <Route path="aluno" element={<AlunoLayout />}>
          <Route index element={<Home />} />
          <Route path="historico" element={<Historico />} />
          <Route path="perfil" element={<Perfil />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
