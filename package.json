'use client'

import { useState } from 'react'

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('dashboard')

  const stats = {
    totalUsers: 1247,
    totalListings: 3856,
    pendingApproval: 12,
    totalRevenue: '₦2.4M'
  }

  const pendingListings = [
    { id: 1, title: 'iPhone 14 Pro', seller: 'John Doe', price: 950000 },
    { id: 2, title: 'Toyota Corolla 2019', seller: 'Jane Smith', price: 5200000 },
    { id: 3, title: 'Samsung TV 55"', seller: 'Mike Johnson', price: 450000 }
  ]

  const approveListing = (id) => alert(`Listing ${id} approved!`)
  const rejectListing = (id) => alert(`Listing ${id} rejected!`)

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f3f4f6' }}>
      <div style={{ width: '250px', backgroundColor: '#1f2937', color: 'white', padding: '20px' }}>
        <h2 style={{ fontSize: '24px', marginBottom: '30px' }}>NijaSwap Admin</h2>
        <nav>
          {['dashboard', 'listings', 'users', 'payments'].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} style={{
              display: 'block', width: '100%', padding: '12px', marginBottom: '8px',
              backgroundColor: activeTab === tab ? '#f97316' : 'transparent',
              color: 'white', border: 'none', borderRadius: '6px',
              textAlign: 'left', cursor: 'pointer', textTransform: 'capitalize'
            }}>
              {tab}
            </button>
          ))}
        </nav>
      </div>

      <div style={{ flex: 1, padding: '30px' }}>
        {activeTab === 'dashboard' && (
          <div>
            <h1 style={{ fontSize: '28px', marginBottom: '30px' }}>Dashboard Overview</h1>
            <div style={{
              display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '20px', marginBottom: '30px'
            }}>
              {Object.entries(stats).map(([key, value]) => (
                <div key={key} style={{
                  backgroundColor: 'white', padding: '20px', borderRadius: '8px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                }}>
                  <p style={{ color: '#666', fontSize: '14px', textTransform: 'capitalize' }}>
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </p>
                  <p style={{ fontSize: '28px', fontWeight: 'bold', color: '#1f2937' }}>{value}</p>
                </div>
              ))}
            </div>

            <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px' }}>
              <h2 style={{ fontSize: '20px', marginBottom: '20px' }}>Pending Approvals</h2>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #e5e7eb', textAlign: 'left' }}>
                    <th style={{ padding: '12px' }}>Item</th>
                    <th style={{ padding: '12px' }}>Seller</th>
                    <th style={{ padding: '12px' }}>Price</th>
                    <th style={{ padding: '12px' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingListings.map(listing => (
                    <tr key={listing.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                      <td style={{ padding: '12px' }}>{listing.title}</td>
                      <td style={{ padding: '12px' }}>{listing.seller}</td>
                      <td style={{ padding: '12px' }}>₦{listing.price.toLocaleString()}</td>
                      <td style={{ padding: '12px' }}>
                        <button onClick={() => approveListing(listing.id)} style={{
                          backgroundColor: '#10b981', color: 'white', padding: '6px 12px',
                          border: 'none', borderRadius: '4px', cursor: 'pointer', marginRight: '8px'
                        }}>Approve</button>
                        <button onClick={() => rejectListing(listing.id)} style={{
                          backgroundColor: '#ef4444', color: 'white', padding: '6px 12px',
                          border: 'none', borderRadius: '4px', cursor: 'pointer'
                        }}>Reject</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
