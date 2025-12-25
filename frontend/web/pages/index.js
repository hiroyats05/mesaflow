import Link from 'next/link'
import Logo from '../components/Logo'
import { useState } from 'react'
import { useRouter } from 'next/router'

export default function Home() {
  const router = useRouter()
  const [chatbotEnabled, setChatbotEnabled] = useState(false)

  const handlePlanClick = (planName, basePrice) => {
    const planSlug = planName.toLowerCase().replace(' ', '-')
    router.push(`/assinatura?plano=${planSlug}&chatbot=${chatbotEnabled}`)
  }

  return (
    <div>
      <header className="site-header container">
        <h1 className="logo"><Logo size={72} />MesaFlow</h1>
        <nav style={{display: 'flex', gap: '1rem'}}>
          <Link href="/login" className="btn">Entrar</Link>
          <Link href="/register" className="btn" style={{borderColor: '#22C55E', color: '#22C55E'}}>Cadastro</Link>
        </nav>
      </header>

      <main className="hero">
        <div className="container">
          <h2>Gestão simples para restaurantes e bares</h2>
          <p>Controle mesas, pedidos, estoque e equipes em um só lugar.</p>
          <p>
            <Link href="/login" className="primary">Começar — Entrar</Link>
            <span style={{margin: '0 1rem', color: 'var(--text-sec)'}}>ou</span>
            <Link href="/register" className="primary" style={{background: '#22C55E'}}>Criar conta</Link>
          </p>
        </div>
      </main>

      <section className="features container">
        <div className="feature">
          <h3>Gestão completa do salão</h3>
          <p>App para garçom atender mesas e registrar pedidos, sistema de estoque integrado e fechamento de caixa automatizado. Tudo que você precisa para gerenciar o dia a dia do estabelecimento.</p>
        </div>
        <div className="feature">
          <h3>Perfis e funções</h3>
          <p>Fluxo natural do seu restaurante ou bar: pedido no salão ou delivery passa direto para a cozinha, que atualiza status de preparo, e vai para o entregador quando necessário. Simples e eficiente.</p>
        </div>
        <div className="feature highlight">
          <h3>🚚 Delivery inteligente</h3>
          <p>Rastreamento em tempo real via mapas dos seus entregadores. Sistema de expediente completo com atribuição manual opcional de entregas e logística inteligente para otimizar rotas e reduzir tempo de entrega.</p>
        </div>
        <div className="feature">
          <h3>📊 Relatórios inteligentes</h3>
          <p>Análise de pedidos: tempo de preparo, fluxo por horário e dias mais movimentados. Métricas de delivery com tempo médio e performance dos entregadores. Com base nos dados, o sistema sugere quais dias costumam precisar de mais ou menos entregadores na equipe.</p>
        </div>
      </section>

      <section className="pricing container">
        <h2 className="pricing-title">Escolha seu plano</h2>
        <p className="pricing-subtitle">Sem contratos longos. Cancele quando quiser.</p>
        
        <div className="pricing-cards">
          <div className="pricing-card">
            <h3>Teste Grátis</h3>
            <div className="price">
              <span className="amount">14 dias</span>
            </div>
            <ul className="features-list">
              <li>✓ Acesso completo</li>
              <li>✓ Sem cartão de crédito</li>
              <li>✓ Suporte via WhatsApp</li>
              <li>✓ API iFood incluída</li>
            </ul>
            <button className="plan-button" onClick={() => handlePlanClick('Teste Grátis', 0)}>Começar agora</button>
          </div>

          <div className="pricing-card">
            <h3>Mensal</h3>
            <div className="price">
              <span className="currency">R$</span>
              <span className="amount">120</span>
              <span className="period">/mês</span>
            </div>
            <ul className="features-list">
              <li>✓ Todas as funcionalidades</li>
              <li>✓ Suporte via WhatsApp</li>
              <li>✓ API iFood incluída</li>
              <li>✓ Atualizações gratuitas</li>
            </ul>
            <button className="plan-button" onClick={() => handlePlanClick('Mensal', 120)}>Assinar plano</button>
          </div>

          <div className="pricing-card popular">
            <div className="badge">Mais popular</div>
            <h3>Trimestral</h3>
            <div className="price">
              <span className="currency">R$</span>
              <span className="amount">320</span>
              <span className="period">/3 meses</span>
            </div>
            <div className="savings">Economize 11%</div>
            <ul className="features-list">
              <li>✓ Todas as funcionalidades</li>
              <li>✓ Suporte via WhatsApp</li>
              <li>✓ API iFood incluída</li>
              <li>✓ Atualizações gratuitas</li>
            </ul>
            <button className="plan-button primary-button" onClick={() => handlePlanClick('Trimestral', 107)}>Assinar plano</button>
          </div>

          <div className="pricing-card">
            <h3>Anual</h3>
            <div className="price">
              <span className="currency">R$</span>
              <span className="amount">999</span>
              <span className="period">/ano</span>
            </div>
            <div className="savings">Economize 30%</div>
            <ul className="features-list">
              <li>✓ Todas as funcionalidades</li>
              <li>✓ Suporte via WhatsApp</li>
              <li>✓ API iFood incluída</li>
              <li>✓ Atualizações gratuitas</li>
            </ul>
            <button className="plan-button" onClick={() => handlePlanClick('Anual', 83)}>Assinar plano</button>
          </div>
        </div>

        <div className="addon-section">
          <div className="addon-card">
            <div className="addon-content">
              <div className="addon-icon">💬</div>
              <div>
                <h4>Chatbot para WhatsApp</h4>
                <p>Automatize atendimento e pedidos via WhatsApp</p>
              </div>
            </div>
            <label className="toggle-switch">
              <input type="checkbox" checked={chatbotEnabled} onChange={(e) => setChatbotEnabled(e.target.checked)} />
              <span className="toggle-slider"></span>
              <span className="toggle-label"><strong>+R$ 49/mês</strong></span>
            </label>
          </div>
        </div>
      </section>

      <footer className="site-footer">
        <div className="container">© MesaFlow — 2025</div>
      </footer>
    </div>
  )
}
