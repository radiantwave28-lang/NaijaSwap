export default function HomePage() {
  return (
    <main style={{
      minHeight: '100vh',
      background: 'linear-gradient(to bottom right, #f97316, #dc2626)',
      color: 'white',
      padding: '20px'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        textAlign: 'center',
        paddingTop: '80px'
      }}>
        <h1 style={{ fontSize: '60px', fontWeight: 'bold', marginBottom: '20px' }}>
          NijaSwap
        </h1>
        <p style={{ fontSize: '28px', marginBottom: '10px' }}>
          Buy & Sell in Nigeria
        </p>
        <p style={{ fontSize: '18px', opacity: '0.8', marginBottom: '40px' }}>
          Under RadiantWaves Media
        </p>
        <div>
          <button style={{
            backgroundColor: 'white', color: '#f97316', padding: '15px 30px',
            borderRadius: '30px', border: 'none', fontSize: '18px',
            fontWeight: 'bold', marginRight: '15px', cursor: 'pointer'
          }}>
            Login
          </button>
          <button style={{
            backgroundColor: 'transparent', color: 'white', padding: '15px 30px',
            borderRadius: '30px', border: '2px solid white', fontSize: '18px',
            fontWeight: 'bold', cursor: 'pointer'
          }}>
            Register
          </button>
        </div>
        <div style={{
          marginTop: '60px', display: 'flex', justifyContent: 'center',
          gap: '40px', fontSize: '14px'
        }}>
          <span>✅ Verified Sellers</span>
          <span>🔒 Secure Payments</span>
          <span>⚡ Fast Delivery</span>
        </div>
      </div>
    </main>
  )
}
