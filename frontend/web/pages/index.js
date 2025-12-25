import Link from 'next/link'
import Logo from '../components/Logo'

export default function Home() {
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
      </section>

      <footer className="site-footer">
        <div className="container">© MesaFlow — 2025</div>
      </footer>
    </div>
  )
}
