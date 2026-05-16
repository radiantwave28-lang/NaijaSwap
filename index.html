// ===== DATA STORE =====
let listings = [
    { id: 1, name: 'iPhone 15 Pro Max', price: 1200000, location: 'lagos', category: 'phones', seller: 'John Doe', status: 'approved' },
    { id: 2, name: 'Toyota Camry 2020', price: 8500000, location: 'abuja', category: 'cars', seller: 'Jane Smith', status: 'approved' },
    { id: 3, name: 'MacBook Pro M3', price: 2500000, location: 'lagos', category: 'laptops', seller: 'Mike Johnson', status: 'approved' },
    { id: 4, name: 'PlayStation 5', price: 450000, location: 'ph', category: 'gaming', seller: 'Sarah Lee', status: 'approved' },
    { id: 5, name: 'Samsung 65" TV', price: 680000, location: 'kano', category: 'electronics', seller: 'David Brown', status: 'approved' },
    { id: 6, name: 'Nike Air Jordan', price: 85000, location: 'lagos', category: 'fashion', seller: 'Chris Wilson', status: 'approved' }
];

let pendingApprovals = [
    { id: 7, name: 'iPhone 14 Pro', price: 950000, seller: 'John Doe', date: '2026-05-16' },
    { id: 8, name: 'Toyota Corolla 2019', price: 5200000, seller: 'Jane Smith', date: '2026-05-16' },
    { id: 9, name: 'Samsung TV 55"', price: 450000, seller: 'Mike Johnson', date: '2026-05-15' }
];

// ===== NAVIGATION =====
function showPage(pageName) {
    // Hide all pages
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.admin-page').forEach(p => p.classList.remove('active'));
    
    // Show selected page
    const page = document.getElementById(pageName);
    if (page) {
        page.classList.add('active');
        window.scrollTo(0, 0);
    }
    
    // Update page-specific content
    if (pageName === 'listings') renderListings();
    if (pageName === 'admin') renderApprovals();
}

function showSection(sectionName) {
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    document.getElementById(sectionName).classList.add('active');
    
    document.querySelectorAll('.sidebar button').forEach(b => b.classList.remove('active'));
    if (event && event.target) {
        event.target.classList.add('active');
    }
}

// ===== LISTINGS =====
function renderListings() {
    const grid = document.getElementById('listings-grid');
    const categoryFilter = document.getElementById('category-filter')?.value || 'all';
    const locationFilter = document.getElementById('location-filter')?.value || 'all';
    
    const filtered = listings.filter(item => {
        const catMatch = categoryFilter === 'all' || item.category === categoryFilter;
        const locMatch = locationFilter === 'all' || item.location === locationFilter;
        return catMatch && locMatch && item.status === 'approved';
    });
    
    grid.innerHTML = filtered.map(item => `
        <div class="card">
            <h3>${item.name}</h3>
            <p class="price">₦${item.price.toLocaleString()}</p>
            <p class="location">📍 ${item.location.charAt(0).toUpperCase() + item.location.slice(1)}</p>
            <span class="category">${item.category}</span>
            <button class="btn btn-primary btn-full" style="margin-top: 15px;" onclick="contactSeller('${item.seller}')">
                Contact Seller
            </button>
        </div>
    `).join('');
}

function filterListings() {
    renderListings();
}

function contactSeller(seller) {
    alert(`Contacting ${seller}... (Feature coming soon!)`);
}

// ===== SELL FORM =====
function handleSell(event) {
    event.preventDefault();
    
    const newItem = {
        id: Date.now(),
        name: document.getElementById('item-name').value,
        price: parseInt(document.getElementById('item-price').value),
        category: document.getElementById('item-category').value,
        location: document.getElementById('item-location').value,
        seller: 'Current User',
        status: 'pending'
    };
    
    pendingApprovals.push({
        id: newItem.id,
        name: newItem.name,
        price: newItem.price,
        seller: newItem.seller,
        date: new Date().toISOString().split('T')[0]
    });
    
    listings.push(newItem);
    
    alert('Item submitted for approval! It will be visible once approved by admin.');
    event.target.reset();
    showPage('listings');
    
    // Update admin stats
    updateAdminStats();
}

// ===== AUTH =====
function handleLogin(event) {
    event.preventDefault();
    alert('Login successful! Welcome back.');
    showPage('home');
}

function handleRegister(event) {
    event.preventDefault();
    alert('Account created successfully! Please login.');
    showPage('login');
}

// ===== ADMIN =====
function renderApprovals() {
    const tbody = document.getElementById('approvals-list');
    if (!tbody) return;
    
    tbody.innerHTML = pendingApprovals.map(item => `
        <tr>
            <td>${item.name}</td>
            <td>${item.seller}</td>
            <td>₦${item.price.toLocaleString()}</td>
            <td>${item.date}</td>
            <td>
                <button class="btn-approve" onclick="approveItem(${item.id})">Approve</button>
                <button class="btn-reject" onclick="rejectItem(${item.id})">Reject</button>
            </td>
        </tr>
    `).join('');
    
    updateAdminStats();
}

function approveItem(id) {
    const item = listings.find(l => l.id === id);
    if (item) item.status = 'approved';
    
    pendingApprovals = pendingApprovals.filter(p => p.id !== id);
    renderApprovals();
    alert('Item approved and is now live!');
}

function rejectItem(id) {
    listings = listings.filter(l => l.id !== id);
    pendingApprovals = pendingApprovals.filter(p => p.id !== id);
    renderApprovals();
    alert('Item rejected and removed.');
}

function updateAdminStats() {
    const usersEl = document.getElementById('stat-users');
    const listingsEl = document.getElementById('stat-listings');
    const pendingEl = document.getElementById('stat-pending');
    
    if (usersEl) usersEl.textContent = '1,247';
    if (listingsEl) listingsEl.textContent = listings.filter(l => l.status === 'approved').length.toLocaleString();
    if (pendingEl) pendingEl.textContent = pendingApprovals.length;
}

// ===== INITIALIZE =====
document.addEventListener('DOMContentLoaded', () => {
    renderListings();
    renderApprovals();
    updateAdminStats();
});
