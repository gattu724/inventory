const form = document.getElementById("itemForm");
const tableBody = document.querySelector("#inventoryTable tbody");
const resetBtn = document.getElementById("resetBtn");
let inventory = JSON.parse(localStorage.getItem("inventory")) || [];
let editIndex = null;

// Render table
function renderTable() {
  tableBody.innerHTML = "";
  inventory.forEach((item, index) => {
    const row = `
      <tr>
        <td>${item.name}</td>
        <td>${item.sku}</td>
        <td>${item.category}</td>
        <td>${item.quantity}</td>
        <td>₹${item.price.toFixed(2)}</td>
        <td>₹${(item.price * item.quantity).toFixed(2)}</td>
        <td>
          <button class="edit" onclick="editItem(${index})">Edit</button>
          <button class="delete" onclick="deleteItem(${index})">Delete</button>
        </td>
      </tr>
    `;
    tableBody.innerHTML += row;
  });
}

// Save data to localStorage
function saveData() {
  localStorage.setItem("inventory", JSON.stringify(inventory));
}

// Add or Update item
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const newItem = {
    name: document.getElementById("productName").value.trim(),
    sku: document.getElementById("sku").value.trim(),
    category: document.getElementById("category").value.trim(),
    quantity: Number(document.getElementById("quantity").value),
    price: Number(document.getElementById("price").value),
  };

  // Validate duplicate SKU
  const duplicate = inventory.some(
    (item, i) => item.sku.toLowerCase() === newItem.sku.toLowerCase() && i !== editIndex
  );
  if (duplicate) {
    alert("SKU already exists. Please use a unique SKU.");
    return;
  }

  if (editIndex === null) {
    inventory.push(newItem);
  } else {
    inventory[editIndex] = newItem;
    editIndex = null;
  }

  saveData();
  renderTable();
  form.reset();
});

// Edit item
function editItem(index) {
  const item = inventory[index];
  document.getElementById("productName").value = item.name;
  document.getElementById("sku").value = item.sku;
  document.getElementById("category").value = item.category;
  document.getElementById("quantity").value = item.quantity;
  document.getElementById("price").value = item.price;
  editIndex = index;
}

// Delete item
function deleteItem(index) {
  if (confirm("Are you sure you want to delete this item?")) {
    inventory.splice(index, 1);
    saveData();
    renderTable();
  }
}

// Reset form
resetBtn.addEventListener("click", () => {
  editIndex = null;
});

// Initialize
renderTable();
