// ===== DATA MENU (FOTO TETAP SEPERTI KODE ASLIMU) =====
const menuData = [{
    id: 1,
    name: 'Mochi Buah',
    price: 20000,
    desc: 'Mochi dengan isian wippy cream dan buah serta topping buah diatasnya',
    image: 'gambar/mochi.jpeg',
    bestSeller: true
}, {
    id: 2,
    name: 'Fudgy Brownies',
    price: 30000,
    desc: 'Brownies cokelat dengan tekstur fudgy yang lembut, padat, dan kaya rasa.',
    image: 'gambar/fudgy.jpeg',
    bestSeller: true
}, {
    id: 3,
    name: 'Bolu Ketan Lumer',
    price: 10000,
    desc: 'Bolu ketan yang lembut dengan saus keju creamy yang gurih dan lezat.',
    image: 'gambar/ketan lumer.jpeg',
    bestSeller: true
}, {
    id: 4,
    name: 'Brownies Alpukat',
    price: 10000,
    desc: 'Brownies kukus lembut dengan perpaduan alpukat creamy, whipped cream, dan cokelat lumer yang bikin nagih.',
    image: 'gambar/brokat.jpeg',
    bestSeller: false
}, {
    id: 5,
    name: 'Bento Cake 10cm',
    price: 25000,
    desc: 'Cake mini yang lembut dengan krim creamy, sempurna untuk hadiah dan momen spesial.',
    image: 'gambar/bento.jpeg',
    bestSeller: false
}, {
    id: 6,
    name: 'Ketan Keju Karamel',
    price: 30000,
    desc: 'Perpaduan bolu ketan yang lembut dengan lapisan keju creamy dan karamel yang kaya rasa.',
    image: 'gambar/karamel.jpeg',
    bestSeller: false
}, {
    id: 7,
    name: 'Brownies Kukus',
    price: 30000,
    desc: 'Brownies kukus lembut dengan taburan keju parut dan ceres yang manis dan lezat.',
    image: 'gambar/bronis.jpeg',
    bestSeller: false
}, {
    id: 8,
    name: 'Bolu Pandan',
    price: 35000,
    desc: 'Bolu pandan lembut dengan topping keju parut dan cokelat parut yang kaya rasa.',
    image: 'gambar/pandan.jpeg',
    bestSeller: false
}];

// ===== STATE =====
let cart = [];
let currentPage = 'home';

// ===== RENDER FUNCTIONS =====
function renderCards(data, containerId) {
    const container = document.getElementById(containerId);
    container.innerHTML = data.map(item => `
                <div class="card">
                    <img src="${item.image}" alt="${item.name}" loading="lazy" />
                    <div class="card-body">
                        <h3>${item.name}</h3>
                        <div class="price">Rp ${item.price.toLocaleString()}</div>
                        <div class="desc">${item.desc}</div>
                        <button class="btn-add" onclick="addToCart(${item.id})">+ Tambah ke Keranjang</button>
                    </div>
                </div>
            `).join('');
}

function renderBestSeller() {
    const best = menuData.filter(m => m.bestSeller);
    renderCards(best, 'bestSellerGrid');
}

function renderOtherMenu() {
    // Ambil 3 item pertama yang BUKAN best seller
    const nonBest = menuData.filter(m => !m.bestSeller);
    const limited = nonBest.slice(0, 3); // hanya 3 item
    renderCards(limited, 'otherMenuGrid');
}

function renderFullMenu() {
    // Tampilkan SEMUA menu (8 item)
    renderCards(menuData, 'fullMenuGrid');
}

// ===== CART =====
function addToCart(id) {
    const item = menuData.find(m => m.id === id);
    const existing = cart.find(c => c.id === id);
    if (existing) {
        existing.qty++;
    } else {
        cart.push({ ...item, qty: 1 });
    }
    updateCartUI();
    // feedback
    const btn = event.target;
    btn.textContent = '✅ Ditambahkan!';
    setTimeout(() => btn.textContent = '+ Tambah ke Keranjang', 1000);
}

function removeFromCart(id) {
    const existing = cart.find(c => c.id === id);
    if (existing) {
        if (existing.qty > 1) {
            existing.qty--;
        } else {
            cart = cart.filter(c => c.id !== id);
        }
    }
    updateCartUI();
}

function updateCartUI() {
    const count = cart.reduce((sum, c) => sum + c.qty, 0);
    document.getElementById('cartCount').textContent = count;

    const container = document.getElementById('cartItems');
    if (cart.length === 0) {
        container.innerHTML = `<p style="color:#999; text-align:center; padding:30px 0;">Keranjang kosong 😢</p>`;
    } else {
        container.innerHTML = cart.map(c => `
                    <div class="cart-item">
                        <div class="item-info">
                            <h4>${c.name}</h4>
                            <p>Rp ${(c.price * c.qty).toLocaleString()}</p>
                        </div>
                        <div class="qty-control">
                            <button onclick="removeFromCart(${c.id})">−</button>
                            <span>${c.qty}</span>
                            <button onclick="addToCart(${c.id})">+</button>
                        </div>
                    </div>
                `).join('');
    }

    const total = cart.reduce((sum, c) => sum + c.price * c.qty, 0);
    document.getElementById('cartTotal').textContent = `Rp ${total.toLocaleString()}`;
    document.getElementById('checkoutTotal').textContent = `Rp ${total.toLocaleString()}`;
}

// ===== TOGGLE CART =====
function toggleCart() {
    const sidebar = document.getElementById('cartSidebar');
    const overlay = document.getElementById('overlay');
    sidebar.classList.toggle('open');
    overlay.classList.toggle('show');
}

// ===== PAGE NAVIGATION =====
function showPage(page) {
    document.getElementById('cartSidebar').classList.remove('open');
    document.getElementById('overlay').classList.remove('show');

    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById(`page-${page}`).classList.add('active');
    currentPage = page;

    if (page === 'checkout') {
        const total = cart.reduce((sum, c) => sum + c.price * c.qty, 0);
        document.getElementById('checkoutTotal').textContent = `Rp ${total.toLocaleString()}`;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function goToCheckout() {
    if (cart.length === 0) {
        alert('Keranjang masih kosong! Tambahkan menu dulu ya.');
        return;
    }
    showPage('checkout');
}

// ===== PROSES CHECKOUT =====
function prosesCheckout() {
    const nama = document.getElementById('nama').value.trim();
    const alamat = document.getElementById('alamat').value.trim();
    const telp = document.getElementById('telp').value.trim();

    if (!nama || !alamat || !telp) {
        alert('Harap isi semua data diri!');
        return;
    }

    if (cart.length === 0) {
        alert('Keranjang kosong!');
        return;
    }

    const total = cart.reduce((sum, c) => sum + c.price * c.qty, 0);
    const detail = cart.map(c => `${c.name} x${c.qty}`).join(', ');

    alert(`✅ Pesanan berhasil!\n\nNama: ${nama}\nAlamat: ${alamat}\nTelp: ${telp}\nPesanan: ${detail}\nTotal: Rp ${total.toLocaleString()}\n\nTerima kasih telah memesan! 🙏`);

    cart = [];
    updateCartUI();
    showPage('home');
    document.getElementById('nama').value = '';
    document.getElementById('alamat').value = '';
    document.getElementById('telp').value = '';
    document.getElementById('catatan').value = '';
}

// ===== INIT =====
renderBestSeller();
renderOtherMenu();
renderFullMenu();
updateCartUI();