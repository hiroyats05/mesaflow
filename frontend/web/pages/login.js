import { useState } from 'react'
import Router from 'next/router'
import Logo from '../components/Logo'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const submit = async (e) => {
    e.preventDefault()
    // TODO: integrar com API real
    alert('Simulação de login: ' + email)
    Router.push('/')
  }

  return (
    <main className="login-page">
      <div className="login-container">
        <div className="card">
          <h2><Logo />Entrar</h2>
          <form onSubmit={submit}>
            <label>
              E-mail
              <input value={email} onChange={e=>setEmail(e.target.value)} type="email" name="email" required placeholder="seu@exemplo.com" />
            </label>
            <label>
              Senha
              <input value={password} onChange={e=>setPassword(e.target.value)} type="password" name="password" required placeholder="••••••••" />
            </label>
            <button type="submit" className="primary">Entrar</button>
          </form>
          <p className="muted">Ainda não tem conta? <a href="/register" style={{color: 'var(--primary)', textDecoration: 'none', fontWeight: '600'}}>Cadastre-se aqui</a></p>
        </div>
      </div>
    </main>
  )
}
