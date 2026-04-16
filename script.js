let inventoryData = [];

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
        alert("يرجى إدخال كود واسم القطعة أولاً ⚠️");
        return;
    }

    const variance = pQty - sQty;
    inventoryData.push({ code, name, sQty, pQty, variance });
    
    updateDisplay();
    // مسح الحقول بعد الإضافة
    document.getElementById('itemCode').value = '';
    document.getElementById('itemName').value = '';
    document.getElementById('sysQty').value = '';
    document.getElementById('phyQty').value = '';
}

function updateDisplay() {
    const tableBody = document.getElementById('inventoryBody');
    const titleInput = document.getElementById('inventoryTitle').value || "تقرير جرد جديد";
    const branch = (document.getElementById('branchSelect').value === 'custom') 
                 ? document.getElementById('customBranch').value 
                 : document.getElementById('branchSelect').value;

    document.getElementById('displayTitle').innerText = titleInput;
    document.getElementById('displayBranch').innerText = "الفرع: " + (branch || "غير محدد");
    document.getElementById('displayDate').innerText = "تاريخ الجرد: " + new Date().toLocaleDateString('ar-LY');

    tableBody.innerHTML = inventoryData.map(item => `
        <tr>
            <td>${item.code}</td>
            <td>${item.name}</td>
            <td>${item.sQty}</td>
            <td>${item.pQty}</td>
            <td class="${item.variance < 0 ? 'variance-neg' : 'variance-pos'}">
                ${item.variance > 0 ? '+' : ''}${item.variance}
            </td>
        </tr>
    `).join('');
}

function generatePDF() {
    const element = document.getElementById('reportArea');
    const opt = {
        margin: 10,
        filename: 'NADO_LIBYA_Inventory.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, backgroundColor: '#ffffff' },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    html2pdf().set(opt).from(element).save();
}