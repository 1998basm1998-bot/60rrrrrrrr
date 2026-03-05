function openTab(event, tabId) {
    let contents = document.querySelectorAll('.tab-content');
    contents.forEach(content => content.classList.remove('active'));

    let btns = document.querySelectorAll('.tab-btn');
    btns.forEach(btn => btn.classList.remove('active'));

    document.getElementById(tabId).classList.add('active');
    event.currentTarget.classList.add('active');
}

function showPlayers(categoryName) {
    const playersArea = document.getElementById('players-list-area');
    playersArea.style.display = 'block';
    document.getElementById('selected-category-title').innerText = 'قائمة اللاعبين - ' + categoryName;
}

function openModal(modalId) {
    document.getElementById(modalId).style.display = 'block';
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

window.onclick = function(event) {
    let modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    });
}

function formatCurrency(amount) {
    return Number(amount).toLocaleString('en-US') + ' د.ع';
}

function toggleElement(elementId) {
    const el = document.getElementById(elementId);
    if (el.style.display === "none" || el.style.display === "") {
        el.style.display = "block";
    } else {
        el.style.display = "none";
    }
}

let products = [];
let productIdCounter = 1;

function openStoreTab(event, subTabId) {
    document.querySelectorAll('.store-sub-tab').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.store-tabs .primary-btn').forEach(btn => btn.classList.remove('active'));
    
    document.getElementById(subTabId).classList.add('active');
    event.currentTarget.classList.add('active');
}

function saveProduct() {
    const name = document.getElementById('prodName').value;
    const price = document.getElementById('prodPrice').value;
    const qty = document.getElementById('prodQty').value;
    const editId = document.getElementById('prodEditId').value;

    if (!name || !price || !qty) return alert('يرجى ملء جميع الحقول');

    if (editId) {
        const prod = products.find(p => p.id == editId);
        prod.name = name;
        prod.price = Number(price);
        prod.qty = Number(qty);
        document.getElementById('prodEditId').value = '';
    } else {
        products.push({
            id: productIdCounter++,
            name: name,
            price: Number(price),
            qty: Number(qty)
        });
    }

    document.getElementById('prodName').value = '';
    document.getElementById('prodPrice').value = '';
    document.getElementById('prodQty').value = '';
    document.getElementById('addProductForm').style.display = 'none';

    renderProducts();
}

function editProduct(id) {
    const prod = products.find(p => p.id == id);
    document.getElementById('prodName').value = prod.name;
    document.getElementById('prodPrice').value = prod.price;
    document.getElementById('prodQty').value = prod.qty;
    document.getElementById('prodEditId').value = prod.id;
    document.getElementById('addProductForm').style.display = 'block';
}

function deleteProduct(id) {
    products = products.filter(p => p.id != id);
    renderProducts();
}

function renderProducts() {
    const container = document.getElementById('productsListContainer');
    container.innerHTML = '';
    
    if(products.length === 0) {
        container.innerHTML = '<p style="text-align:center; grid-column: 1/-1;">لا توجد منتجات حالياً.</p>';
        return;
    }

    products.forEach(prod => {
        container.innerHTML += `
            <div class="glass-panel item-card">
                <h3>${prod.name}</h3>
                <p style="color: var(--primary-color); font-weight: bold; font-size: 1.2rem;">${formatCurrency(prod.price)}</p>
                <div style="background: rgba(255,255,255,0.1); padding: 5px; border-radius: 5px; margin: 10px 0;">
                    المخزون الباقي: <span style="font-weight:bold;">${prod.qty}</span>
                </div>
                <div class="card-actions">
                    <button class="icon-btn edit-btn" onclick="editProduct(${prod.id})"><i class="fa-solid fa-pen-to-square"></i></button>
                    <button class="icon-btn delete-btn" onclick="deleteProduct(${prod.id})"><i class="fa-solid fa-trash"></i></button>
                </div>
            </div>
        `;
    });
}

let currentSaleItems = [];
let salesHistory = [];

function searchProductForSale() {
    const searchTerm = document.getElementById('saleSearchInput').value;
    const resultsContainer = document.getElementById('saleSearchResults');
    resultsContainer.innerHTML = '';

    if (searchTerm.length === 0) return;

    const matchedProducts = products.filter(p => p.name.startsWith(searchTerm));

    matchedProducts.forEach(prod => {
        resultsContainer.innerHTML += `
            <div style="display: flex; justify-content: space-between; align-items: center; background: rgba(0,0,0,0.3); padding: 10px; margin-bottom: 5px; border-radius: 5px;">
                <div>
                    <strong>${prod.name}</strong> - ${formatCurrency(prod.price)}
                    <br><small style="color: #aaa;">المخزون الباقي: ${prod.qty}</small>
                </div>
                <button class="primary-btn" onclick="addItemToCurrentSale(${prod.id})" style="padding: 5px 10px;">
                    <i class="fa-solid fa-plus"></i>
                </button>
            </div>
        `;
    });
}

function addItemToCurrentSale(prodId) {
    const prod = products.find(p => p.id == prodId);
    if (prod.qty <= 0) {
        alert('المخزون نفذ لهذه المادة!');
        return;
    }
    
    currentSaleItems.push({
        id: prod.id,
        name: prod.name,
        price: prod.price
    });

    document.getElementById('saleSearchInput').value = '';
    document.getElementById('saleSearchResults').innerHTML = '';
    renderCurrentSaleItems();
}

function renderCurrentSaleItems() {
    const container = document.getElementById('currentSaleItems');
    let total = 0;

    if (currentSaleItems.length === 0) {
        container.innerHTML = '<p style="text-align: center; opacity: 0.5; margin: 0;">لم يتم إضافة مواد للبيع بعد</p>';
        document.getElementById('saleTotalAmount').innerText = 'المجموع: 0 د.ع';
        return;
    }

    container.innerHTML = '';
    currentSaleItems.forEach((item, index) => {
        total += item.price;
        container.innerHTML += `
            <div style="display: flex; justify-content: space-between; padding: 5px 0; border-bottom: 1px solid rgba(255,255,255,0.1);">
                <span>${item.name}</span>
                <span>${formatCurrency(item.price)} <i class="fa-solid fa-times" style="color:red; cursor:pointer;" onclick="removeCurrentSaleItem(${index})"></i></span>
            </div>
        `;
    });

    document.getElementById('saleTotalAmount').innerText = 'المجموع: ' + formatCurrency(total);
}

function removeCurrentSaleItem(index) {
    currentSaleItems.splice(index, 1);
    renderCurrentSaleItems();
}

function saveSale() {
    const playerName = document.getElementById('salePlayerName').value;
    if (!playerName) return alert('يرجى كتابة اسم اللاعب');
    if (currentSaleItems.length === 0) return alert('يرجى إضافة مواد للبيع');

    let totalAmount = currentSaleItems.reduce((sum, item) => sum + item.price, 0);

    currentSaleItems.forEach(saleItem => {
        const prod = products.find(p => p.id == saleItem.id);
        if (prod) prod.qty -= 1;
    });

    salesHistory.push({
        id: Date.now(),
        player: playerName,
        items: [...currentSaleItems],
        total: totalAmount,
        date: new Date().toLocaleDateString()
    });

    currentSaleItems = [];
    document.getElementById('salePlayerName').value = '';
    document.getElementById('newSaleForm').style.display = 'none';
    
    renderCurrentSaleItems();
    renderSalesHistory();
    renderProducts(); 
}

function renderSalesHistory() {
    const container = document.getElementById('salesHistoryContainer');
    container.innerHTML = '';

    if (salesHistory.length === 0) {
        container.innerHTML = '<p style="text-align: center; opacity: 0.7;">لا توجد عمليات بيع حالياً.</p>';
        return;
    }

    salesHistory.forEach(sale => {
        let itemsNames = sale.items.map(i => i.name).join('، ');
        container.innerHTML += `
            <div class="list-item">
                <div>
                    <h4>اللاعب: ${sale.player}</h4>
                    <p style="opacity: 0.8; font-size: 0.9em;">التاريخ: ${sale.date}</p>
                    <p style="opacity: 0.8; font-size: 0.9em;">المواد: ${itemsNames}</p>
                    <p style="color: var(--primary-color); font-weight: bold; margin-top: 5px;">الإجمالي: ${formatCurrency(sale.total)}</p>
                </div>
                <button class="icon-btn delete-btn" onclick="deleteSale(${sale.id})"><i class="fa-solid fa-trash"></i></button>
            </div>
        `;
    });
}

function deleteSale(id) {
    salesHistory = salesHistory.filter(s => s.id != id);
    renderSalesHistory();
}

let inventoryItems = [];
let invIdCounter = 1;

function saveInventoryItem() {
    const name = document.getElementById('invName').value;
    const qty = document.getElementById('invQty').value;
    const editId = document.getElementById('invEditId').value;

    if (!name || !qty) return alert('يرجى ملء الاسم والعدد');

    if (editId) {
        const item = inventoryItems.find(i => i.id == editId);
        item.name = name;
        item.qty = Number(qty);
        document.getElementById('invEditId').value = '';
    } else {
        inventoryItems.push({
            id: invIdCounter++,
            name: name,
            qty: Number(qty)
        });
    }

    document.getElementById('invName').value = '';
    document.getElementById('invQty').value = '';
    closeModal('inventoryModal');
    renderInventory();
}

function decreaseInventory(id) {
    const item = inventoryItems.find(i => i.id == id);
    if (item && item.qty > 0) {
        item.qty -= 1;
        renderInventory();
    }
}

function editInventory(id) {
    const item = inventoryItems.find(i => i.id == id);
    document.getElementById('invName').value = item.name;
    document.getElementById('invQty').value = item.qty;
    document.getElementById('invEditId').value = item.id;
    openModal('inventoryModal');
}

function deleteInventory(id) {
    inventoryItems = inventoryItems.filter(i => i.id != id);
    renderInventory();
}

function renderInventory() {
    const container = document.getElementById('inventoryListContainer');
    container.innerHTML = '';

    if(inventoryItems.length === 0) {
        container.innerHTML = '<p style="text-align: center; opacity: 0.7;">المخزن فارغ حالياً.</p>';
        return;
    }

    inventoryItems.forEach(item => {
        container.innerHTML += `
            <div class="list-item" style="display: flex; justify-content: space-between; align-items: center;">
                <div>
                    <h3 style="margin-bottom: 5px;">${item.name}</h3>
                    <div style="font-size: 1.2rem;">المتبقي: <span style="font-weight:bold; color:var(--primary-color);">${item.qty}</span></div>
                    <div class="card-actions" style="justify-content: flex-start; margin-top: 10px;">
                        <button class="icon-btn edit-btn" onclick="editInventory(${item.id})"><i class="fa-solid fa-pen-to-square"></i> تعديل</button>
                        <button class="icon-btn delete-btn" onclick="deleteInventory(${item.id})"><i class="fa-solid fa-trash"></i> حذف</button>
                    </div>
                </div>
                
                <button class="large-minus-btn" onclick="decreaseInventory(${item.id})" title="تنقيص المخزون">
                    <i class="fa-solid fa-minus"></i>
                </button>
            </div>
        `;
    });
}
