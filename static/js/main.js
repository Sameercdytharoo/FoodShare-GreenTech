document.addEventListener('DOMContentLoaded', () => {
    const foodGrid = document.getElementById('food-grid');
    const donateBtn = document.getElementById('btn-donate');
    const modal = document.getElementById('donate-modal');
    const closeBtn = document.querySelector('.close');
    const donateForm = document.getElementById('donate-form');
    const submitBtn = donateForm.querySelector('button[type="submit"]');
    const userSelect = document.getElementById('user-select');
    const donorIdInput = document.getElementById('donor_id');

    let map;
    let markers = [];
    let currentUserId = userSelect.value;

    // Initialize Map
    initMap();

    // Initial Fetch
    fetchFoodItems();

    // User Switcher Event
    userSelect.addEventListener('change', (e) => {
        currentUserId = e.target.value;
        donorIdInput.value = currentUserId;
        showToast('Persona Switched', `Now acting as User ID: ${currentUserId}`, 'success');
        fetchFoodItems(); // Refresh items to show donor names correctly if needed
    });

    // Modal Events
    donateBtn.addEventListener('click', () => {
        modal.classList.add('active');
    });

    closeBtn.addEventListener('click', () => {
        modal.classList.remove('active');
    });

    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
        }
    });

    // Handle Form Submission
    donateForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const originalBtnText = submitBtn.textContent;
        submitBtn.textContent = 'Posting...';
        submitBtn.disabled = true;

        const formData = new FormData(donateForm);
        const data = Object.fromEntries(formData.entries());

        try {
            const response = await fetch('/api/food-items', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if (response.ok) {
                showToast('Success', 'Food item posted successfully!', 'success');
                modal.classList.remove('active');
                donateForm.reset();
                donorIdInput.value = currentUserId; // Reset hidden field after form reset
                fetchFoodItems();
            } else {
                showToast('Error', 'Failed to post item. Please try again.', 'error');
            }
        } catch (error) {
            console.error('Error:', error);
            showToast('Error', 'An error occurred. Check console.', 'error');
        } finally {
            submitBtn.textContent = originalBtnText;
            submitBtn.disabled = false;
        }
    });

    async function fetchFoodItems() {
        try {
            foodGrid.innerHTML = '<p class="loading">Refreshing feed...</p>';
            clearMarkers();

            const response = await fetch('/api/food-items');
            const items = await response.json();

            foodGrid.innerHTML = '';

            if (items.length === 0) {
                foodGrid.innerHTML = `<div style="grid-column: 1/-1; text-align: center; color: #666;">
                    <h3>No items found</h3>
                    <p>Be the first to share something!</p>
                </div>`;
                return;
            }

            items.forEach((item, index) => {
                // Mock coordinates for demo (randomized around London)
                const lat = 51.5074 + (Math.random() - 0.5) * 0.1;
                const lng = -0.1278 + (Math.random() - 0.5) * 0.1;

                addMarker(lat, lng, item);

                const card = document.createElement('div');
                card.className = 'food-card';
                card.style.animation = `fadeIn 0.5s ease forwards ${index * 0.1}s`;
                card.style.opacity = '0';

                const expiryDate = new Date(item.expiry_date).toLocaleDateString(undefined, {
                    year: 'numeric', month: 'short', day: 'numeric'
                });

                card.innerHTML = `
                    <div class="card-header">
                        <span class="card-category">${item.category}</span>
                        <span class="card-status" style="color: ${item.status === 'available' ? '#2e7d32' : '#d32f2f'}">● ${item.status}</span>
                    </div>
                    <div class="card-body">
                        <h4>${item.name}</h4>
                        <p>${item.description}</p>
                        <div class="card-meta">
                            <span>📍 ${item.location}</span>
                            <span>⏳ Expires: ${expiryDate}</span>
                        </div>
                        <p class="donor-info"><small>Donated by: ${item.donor_name || 'Anonymous'}</small></p>
                        ${item.status === 'available' ? `<button class="btn btn-primary" style="width:100%; margin-top:auto;" onclick="claimItem(${item.id})">Claim Item</button>` : `<button class="btn btn-secondary" style="width:100%; margin-top:auto;" disabled>Claimed</button>`}
                    </div>
                `;
                foodGrid.appendChild(card);
            });

        } catch (error) {
            console.error('Error:', error);
            foodGrid.innerHTML = '<p>Error loading items. Please check the backend connection.</p>';
        }
    }

    function initMap() {
        if (!map) {
            map = L.map('map').setView([51.5074, -0.1278], 11);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; OpenStreetMap contributors'
            }).addTo(map);
        }
    }

    function addMarker(lat, lng, item) {
        const marker = L.marker([lat, lng]).addTo(map)
            .bindPopup(`<strong>${item.name}</strong><br>${item.location}<br><small>${item.category}</small>`);
        markers.push(marker);
    }

    function clearMarkers() {
        markers.forEach(m => map.removeLayer(m));
        markers = [];
    }

    // Exported function for onclick
    window.claimItem = async function (id) {
        try {
            const response = await fetch('/api/claim', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ item_id: id, receiver_id: currentUserId })
            });

            if (response.ok) {
                showToast('Success', 'Item claimed successfully!', 'success');
                fetchFoodItems();
            } else {
                const errData = await response.json();
                showToast('Error', errData.error || 'Failed to claim item.', 'error');
            }
        } catch (error) {
            console.error('Error:', error);
            showToast('Error', 'An error occurred. Check console.', 'error');
        }
    };

    function showToast(title, message, type = 'success') {
        const toast = document.createElement('div');
        Object.assign(toast.style, {
            position: 'fixed', bottom: '20px', right: '20px',
            backgroundColor: type === 'success' ? '#2e7d32' : '#d32f2f',
            color: 'white', padding: '1rem 2rem', borderRadius: '8px',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)', zIndex: '3000',
            animation: 'slideIn 0.3s ease forwards'
        });
        toast.innerHTML = `<strong>${title}</strong><br>${message}`;
        document.body.appendChild(toast);
        setTimeout(() => {
            toast.style.animation = 'fadeOut 0.3s ease forwards';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }
});
