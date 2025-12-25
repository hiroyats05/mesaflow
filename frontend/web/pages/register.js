import { useState } from 'react'
import Router from 'next/router'
import Logo from '../components/Logo'

export default function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const submit = async (e) => {
    e.preventDefault()
    
    if (formData.password !== formData.confirmPassword) {
      alert('Senhas não conferem!')
      return
    }

    // TODO: integrar com API real
    alert('Cadastro simulado: ' + formData.email)
    Router.push('/login')
  }

  return (
    <main className="login-page">
      <div className="login-container">
        <div className="card wide">
          <h2><Logo />Criar conta</h2>
          <form onSubmit={submit}>
            <label>
              Nome completo
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Seu nome"
              />
            </label>
            <label>
              E-mail
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="seu@exemplo.com"
              />
            </label>
            <label>
              Senha
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="••••••••"
              />
            </label>
            <label>
              Confirmar senha
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                placeholder="••••••••"
              />
            </label>
            <button type="submit" className="primary">Criar conta</button>
          </form>
          <p className="muted">Já tem uma conta? <a href="/login" style={{color: 'var(--primary)', textDecoration: 'none'}}>Entre aqui</a></p>
        </div>
      </div>
    </main>
  )
}
