const API_BASE_URL = 'https://jsonplaceholder.typicode.com/users';
const modal = document.getElementById('customerModal');
const closeBtn = document.querySelector('.close');
const addCustomerBtn = document.getElementById('addCustomerBtn');
const customerForm = document.getElementById('customerForm');
const customersData = document.getElementById('customersData');
document.addEventListener('DOMContentLoaded', initCustomers);
addCustomerBtn.addEventListener('click', () => openModal());
closeBtn.addEventListener('click', closeModal);
window.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
customerForm.addEventListener('submit', handleFormSubmit);
async function initCustomers() {
  let customers = JSON.parse(localStorage.getItem('customers'));
  if (!customers || customers.length === 0) {
    try {
      const response = await fetch(API_BASE_URL);
      const data = await response.json();
      customers = data.map(user => ({
        id: user.id,name: user.name,email: user.email,phone: user.phone || 'N/A',
        address: `${user.address.street}, ${user.address.city}`
      }));
      localStorage.setItem('customers', JSON.stringify(customers));
    } catch (err) {
      console.error('Failed to fetch from API:', err);
      alert('Failed to load customer data.');
      customers = [];
    }
  }
  displayCustomers(customers);
}
function displayCustomers(customers) {
  const html = customers.map(c => `
    <tr>
      <td>${c.id}</td>
      <td>${c.name}</td>
      <td>${c.email}</td>
      <td>${c.phone}</td>
      <td>${c.address}</td>
      <td>
        <button class="edit" onclick="editCustomer(${c.id})">Edit</button>
        <button class="delete" onclick="deleteCustomer(${c.id})">Delete</button>
      </td>
    </tr>
  `).join('');
  customersData.innerHTML = html;
}
function openModal(customer = null) {
  document.getElementById('modalTitle').textContent = customer ? 'Edit Customer' : 'Add New Customer';
  document.getElementById('customerId').value = customer?.id || '';
  document.getElementById('customerName').value = customer?.name || '';
  document.getElementById('customerEmail').value = customer?.email || '';
  document.getElementById('customerPhone').value = customer?.phone || '';
  document.getElementById('customerAddress').value = customer?.address || '';
  modal.style.display = 'block';
}
function closeModal() {
  modal.style.display = 'none';
  customerForm.reset();
}
function handleFormSubmit(e) {
  e.preventDefault();
  const id = document.getElementById('customerId').value;
  const name = document.getElementById('customerName').value;
  const email = document.getElementById('customerEmail').value;
  const phone = document.getElementById('customerPhone').value;
  const address = document.getElementById('customerAddress').value;
  let customers = JSON.parse(localStorage.getItem('customers')) || []
  if (id) {
    customers = customers.map(c => c.id === parseInt(id) ? { id: parseInt(id), name, email, phone, address } : c);
    alert('Customer updated successfully');
  } else {
    const newId = customers.length > 0 ? Math.max(...customers.map(c => c.id)) + 1 : 1;
    customers.push({ id: newId, name, email, phone, address });
    alert('Customer added successfully');
  }
  localStorage.setItem('customers', JSON.stringify(customers));
  closeModal();
  displayCustomers(customers);
}
function editCustomer(id) {
  const customers = JSON.parse(localStorage.getItem('customers')) || [];
  const customer = customers.find(c => c.id === id);
  if (customer) openModal(customer);
}
function deleteCustomer(id) {
  if (confirm('Are you sure you want to delete this customer?')) {
    let customers = JSON.parse(localStorage.getItem('customers')) || [];
    customers = customers.filter(c => c.id !== id);
    localStorage.setItem('customers', JSON.stringify(customers));
    displayCustomers(customers);
    alert('Customer deleted successfully');
  }
}

