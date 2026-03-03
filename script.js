// 1. دالة التبديل بين التبويبات (Tabs)
function openTab(tabId) {
    // إخفاء جميع التبويبات
    let contents = document.querySelectorAll('.tab-content');
    contents.forEach(content => {
        content.classList.remove('active');
    });

    // إزالة التفعيل من جميع الأزرار
    let btns = document.querySelectorAll('.tab-btn');
    btns.forEach(btn => {
        btn.classList.remove('active');
    });

    // إظهار التبويبة المحددة وتفعيل الزر الخاص بها
    document.getElementById(tabId).classList.add('active');
    event.currentTarget.classList.add('active');
}

// 2. دالة إظهار قسم اللاعبين عند الضغط على فئة عمرية
function showPlayers(categoryName) {
    // إظهار المنطقة المخفية
    const playersArea = document.getElementById('players-list-area');
    playersArea.style.display = 'block';
    
    // تغيير العنوان ليعكس الفئة المختارة
    document.getElementById('selected-category-title').innerText = 'قائمة اللاعبين - ' + categoryName;
}

// 3. دوال النوافذ المنبثقة (Modals)
function openModal(modalId) {
    document.getElementById(modalId).style.display = 'block';
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

// إغلاق النافذة عند الضغط في أي مكان خارجها
window.onclick = function(event) {
    let modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        if (event.target == modal) {
            modal.style.display = 'none';
        }
    });
}
