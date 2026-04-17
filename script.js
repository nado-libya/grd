let inventoryData = [];

// شاشة الترحيب وتحميل البيانات
window.onload = () => {
    setTimeout(() => {
        const welcome = document.getElementById('welcome-screen');
        welcome.style.opacity = '0';
        setTimeout(() => welcome.style.visibility = 'hidden', 800);
    }, 2000);

    loadSavedData();
};

function toggleCustomBranch() {
    const select = document.getElementById('branchSelect');
    const customInput = document.getElementById('customBranch');
    customInput.style.display = (select.value === 'custom') ? 'inline-block' : 'none';
}

function addToInventory() {
    const code = document.getElementById('itemCode').value;
    const name = document.getElementById('itemName').value;
    const sQty = parseInt(document.getElementById('sysQty').value) || 0;
    const pQty = parseInt(document.getElementById('phyQty').value) || 0;

    if (!code || !name) {
        alert("يرجى إدخال كود واسم القطعة ⚠️");
        return;
    }

    const variance = pQty - sQty;
    inventoryData.push({ code, name, sQty, pQty, variance });
    
    updateDisplay();
    saveData();

    // خيار مسح الحقول للباركود
    if (document.getElementById('autoClear').checked) {
        document.getElementById('itemCode').value = '';
        document.getElementById('itemName').value = '';
        document.getElementById('sysQty').value = '';
        document.getElementById('phyQty').value = '';
        document.getElementById('itemCode').focus();
    }
}

function deleteItem(index) {
    if(confirm("هل تريد حذف هذه القطعة؟")) {
        inventoryData.splice(index, 1);
        updateDisplay();
        saveData();
    }
}

function editItem(index) {
    const item = inventoryData[index];
    document.getElementById('itemCode').value = item.code;
    document.getElementById('itemName').value = item.name;
    document.getElementById('sysQty').value = item.sQty;
    document.getElementById('phyQty').value = item.pQty;
    
    inventoryData.splice(index, 1);
    updateDisplay();
    saveData();
}

function updateDisplay() {
    const tableBody = document.getElementById('inventoryBody');
    const title = document.getElementById('inventoryTitle').value || "تقرير جرد عام";
    const branch = (document.getElementById('branchSelect').value === 'custom') 
                 ? document.getElementById('customBranch').value 
                 : document.getElementById('branchSelect').value;

    document.getElementById('displayTitle').innerText = title;
    document.getElementById('displayBranch').innerText = "الفرع: " + (branch || "بنغازي");
    document.getElementById('displayDate').innerText = "التاريخ: " + new Date().toLocaleDateString('ar-LY');

    tableBody.innerHTML = inventoryData.map((item, index) => `
        <tr>
            <td>${item.code}</td>
            <td>${item.name}</td>
            <td>${item.sQty}</td>
            <td>${item.pQty}</td>
            <td class="${item.variance < 0 ? 'variance-neg' : 'variance-pos'}">
                ${item.variance > 0 ? '+' : ''}${item.variance}
            </td>
            <td class="no-print">
                <button onclick="editItem(${index})" class="btn-edit">✏️</button>
                <button onclick="deleteItem(${index})" class="btn-delete">🗑️</button>
            </td>
        </tr>
    `).join('');
}

// وظائف الحفظ التلقائي
function saveData() {
    const sessionData = {
        title: document.getElementById('inventoryTitle').value,
        branch: document.getElementById('branchSelect').value,
        customBranch: document.getElementById('customBranch').value,
        items: inventoryData
    };
    localStorage.setItem('nado_inventory_data', JSON.stringify(sessionData));
}

function loadSavedData() {
    const saved = localStorage.getItem('nado_inventory_data');
    if (saved) {
        const data = JSON.parse(saved);
        document.getElementById('inventoryTitle').value = data.title || "";
        document.getElementById('branchSelect').value = data.branch || "بنغازي";
        document.getElementById('customBranch').value = data.customBranch || "";
        inventoryData = data.items || [];
        toggleCustomBranch();
        updateDisplay();
    }
}

function clearAllData() {
    if(confirm("سيتم مسح كافة البيانات المسجلة، هل أنت متأكد؟")) {
        localStorage.removeItem('nado_inventory_data');
        inventoryData = [];
        location.reload();
    }
}

function generatePDF() {
    const element = document.getElementById('reportArea');
    const opt = {
        margin: 5,
        filename: 'NADO_LIBYA_Report.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 3, backgroundColor: '#ffffff' },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    html2pdf().set(opt).from(element).save();
}
