'use client'

import { useState } from 'react'

export default function ListingsPage() {
  const [listings] = useState([
    { id: '1', title: 'iPhone 15 Pro Max', price: 1200000, location: 'Lagos', category: 'Phones' },
    { id: '2', title: 'Toyota Camry 2020', price: 8500000, location: 'Abuja', category: 'Cars' },
    { id: '3', title: 'MacBook Pro M3', price: 2500000, location: 'Lagos', category: 'Laptops' }
  ])

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '32px', marginBottom: '20px' }}>All Listings</h1>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '20px'
      }}>
        {listings.map(item => (
          <div key={item.id} style={{
            border: '1px solid #ddd', borderRadius: '8px',
            overflow: 'hidden', backgroundColor: 'white', padding: '15px'
          }}>
            <h3 style={{ fontSize: '18px', marginBottom: '10px' }}>{item.title}</h3>
            <p style={{ color: '#f97316', fontSize: '20px', fontWeight: 'bold' }}>
              ₦{item.price.toLocaleString()}
            </p>
            <p style={{ color: '#666', fontSize: '14px' }}>{item.location}</p>
            <span style={{
              display: 'inline-block', backgroundColor: '#f3f4f6',
              padding: '4px 8px', borderRadius: '4px', fontSize: '12px', marginTop: '10px'
            }}>
              {item.category}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
