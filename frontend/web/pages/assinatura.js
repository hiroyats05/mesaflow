import { useState } from 'react'
import { useRouter } from 'next/router'
import Logo from '../components/Logo'
import Link from 'next/link'

export default function Assinatura() {
  const router = useRouter()
  const { plano, chatbot } = router.query
  
  const [chatbotEnabled, setChatbotEnabled] = useState(chatbot === 'true')
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    nomeEmpresa: '',
    cnpj: '',
    cartao: '',
    validade: '',
    cvv: ''
  })

  const planos = {
    'teste': { nome: 'Teste Grátis', preco: 0, periodo: '14 dias', meses: 0 },
    'mensal': { nome: 'Mensal', preco: 120, periodo: '/mês', meses: 1 },
    'trimestral': { nome: 'Trimestral', preco: 320, periodo: '/3 meses', meses: 3 },
    'anual': { nome: 'Anual', preco: 999, periodo: '/ano', meses: 12 }
  }

  const planoSelecionado = planos[plano] || planos.mensal
  const chatbotAtivo = chatbotEnabled
  const valorChatbot = chatbotAtivo ? (49 * planoSelecionado.meses) : 0
  const valorTotal = planoSelecionado.preco + valorChatbot

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    alert(`Assinatura confirmada!\nPlano: ${planoSelecionado.nome}\nTotal: R$ ${valorTotal}`)
    // TODO: Integrar com API de pagamento
  }

  return (
    <div className="assinatura-page">
      <header className="site-header container">
        <Link href="/">
          <h1 className="logo" style={{cursor: 'pointer'}}><Logo size={48} />MesaFlow</h1>
        </Link>
      </header>

      <main className="assinatura-container">
        <div className="assinatura-content">
          <div className="assinatura-summary">
            <h2>Resumo da assinatura</h2>
            <div className="summary-card">
              <div className="summary-item">
                <span>Plano</span>
                <strong>{planoSelecionado.nome}</strong>
              </div>
              <div className="summary-item">
                <span>Valor</span>
                <strong>R$ {planoSelecionado.preco}{planoSelecionado.periodo}</strong>
              </div>
              {chatbotAtivo && (
                <div className="summary-item addon-item">
                  <span>💬 Chatbot WhatsApp × {planoSelecionado.meses}</span>
                  <strong>+R$ {valorChatbot}</strong>
                </div>
              )}
              <div className="summary-divider"></div>
              <div className="summary-total">
                <span>Total</span>
                <strong className="total-price">R$ {valorTotal}</strong>
              </div>
            </div>
            <ul className="summary-benefits">
              <li>✓ Todas as funcionalidades</li>
              <li>✓ Suporte via WhatsApp</li>
              <li>✓ API iFood incluída</li>
              <li>✓ Atualizações gratuitas</li>
              {chatbotAtivo && <li>✓ Chatbot WhatsApp integrado</li>}
            </ul>
            
            <div className="addon-card-assinatura">
              <div className="addon-content">
                <div className="addon-icon">💬</div>
                <div>
                  <h4>Chatbot para WhatsApp</h4>
                  <p>Automatize atendimento e pedidos</p>
                </div>
              </div>
              <label className="toggle-switch">
                <input type="checkbox" checked={chatbotAtivo} onChange={(e) => setChatbotEnabled(e.target.checked)} />
                <span className="toggle-slider"></span>
                <span className="toggle-label"><strong>+R$ 49/mês</strong></span>
              </label>
            </div>
          </div>

          <div className="assinatura-form-wrapper">
            <h2>Dados da assinatura</h2>
            <form onSubmit={handleSubmit} className="assinatura-form">
              <div className="form-section">
                <h3>Dados pessoais</h3>
                <label>
                  Nome completo
                  <input type="text" name="nome" value={formData.nome} onChange={handleChange} required placeholder="Seu nome" />
                </label>
                <label>
                  E-mail
                  <input type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="seu@email.com" />
                </label>
                <label>
                  Telefone
                  <input type="tel" name="telefone" value={formData.telefone} onChange={handleChange} required placeholder="(00) 00000-0000" />
                </label>
              </div>

              <div className="form-section">
                <h3>Dados da empresa</h3>
                <label>
                  Nome da empresa
                  <input type="text" name="nomeEmpresa" value={formData.nomeEmpresa} onChange={handleChange} required placeholder="Sua empresa" />
                </label>
                <label>
                  CNPJ
                  <input type="text" name="cnpj" value={formData.cnpj} onChange={handleChange} placeholder="00.000.000/0000-00" />
                </label>
              </div>

              {planoSelecionado.preco > 0 && (
                <div className="form-section">
                  <h3>Pagamento</h3>
                  <label>
                    Número do cartão
                    <input type="text" name="cartao" value={formData.cartao} onChange={handleChange} required placeholder="0000 0000 0000 0000" />
                  </label>
                  <div className="form-row">
                    <label>
                      Validade
                      <input type="text" name="validade" value={formData.validade} onChange={handleChange} required placeholder="MM/AA" />
                    </label>
                    <label>
                      CVV
                      <input type="text" name="cvv" value={formData.cvv} onChange={handleChange} required placeholder="000" />
                    </label>
                  </div>
                </div>
              )}

              <button type="submit" className="primary submit-button">
                {planoSelecionado.preco > 0 ? 'Confirmar assinatura' : 'Começar teste grátis'}
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  )
}
