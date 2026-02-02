// ===== Lightbox Configurator =====

// Prix de base
const basePrices = {
    'S': 39.99,
    'M': 49.99,
    'L': 64.99,
    'XL': 89.99
};

// État du configurateur
let config = {
    size: 'M',
    color: 'noir',
    led: 'blanc-chaud',
    quantity: 1,
    photo: null,
    text: ''
};

// Mise à jour du prix
function updatePrice() {
    let price = basePrices[config.size];

    // Supplément RGB
    if (config.led === 'rgb') {
        price += 10;
    }

    const total = price * config.quantity;

    document.getElementById('totalPrice').textContent = total.toFixed(2).replace('.', ',') + '€';
    document.getElementById('btnPrice').textContent = total.toFixed(2).replace('.', ',') + '€';
}

// Gestion des tailles
document.querySelectorAll('input[name="size"]').forEach(input => {
    input.addEventListener('change', (e) => {
        config.size = e.target.value;
        updatePrice();
    });
});

// Gestion des couleurs
document.querySelectorAll('input[name="color"]').forEach(input => {
    input.addEventListener('change', (e) => {
        config.color = e.target.value;
        updateLightboxPreview();
    });
});

// Gestion des LED
document.querySelectorAll('input[name="led"]').forEach(input => {
    input.addEventListener('change', (e) => {
        config.led = e.target.value;
        updatePrice();
        updateLightboxPreview();
    });
});

// Gestion de la quantité
const qtyInput = document.getElementById('quantity');
const qtyMinus = document.getElementById('qtyMinus');
const qtyPlus = document.getElementById('qtyPlus');

qtyMinus.addEventListener('click', () => {
    if (config.quantity > 1) {
        config.quantity--;
        qtyInput.value = config.quantity;
        updatePrice();
    }
});

qtyPlus.addEventListener('click', () => {
    if (config.quantity < 10) {
        config.quantity++;
        qtyInput.value = config.quantity;
        updatePrice();
    }
});

qtyInput.addEventListener('change', (e) => {
    let val = parseInt(e.target.value);
    if (val < 1) val = 1;
    if (val > 10) val = 10;
    config.quantity = val;
    qtyInput.value = val;
    updatePrice();
});

// Gestion de l'upload photo
const uploadZone = document.getElementById('uploadZone');
const photoUpload = document.getElementById('photoUpload');
const uploadPreview = document.getElementById('uploadPreview');
const previewImage = document.getElementById('previewImage');
const removePhoto = document.getElementById('removePhoto');

uploadZone.addEventListener('click', () => {
    photoUpload.click();
});

uploadZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadZone.classList.add('dragover');
});

uploadZone.addEventListener('dragleave', () => {
    uploadZone.classList.remove('dragover');
});

uploadZone.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadZone.classList.remove('dragover');

    const file = e.dataTransfer.files[0];
    if (file) {
        handleFileUpload(file);
    }
});

photoUpload.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        handleFileUpload(file);
    }
});

function handleFileUpload(file) {
    if (file.size > 50 * 1024 * 1024) {
        alert('Le fichier est trop volumineux. Maximum 50 Mo.');
        return;
    }

    config.photo = file;
    config.fileName = file.name;
    config.fileType = file.type;

    const previewContent = document.getElementById('previewContent');

    // Si c'est une image, afficher l'aperçu
    if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
            config.photoData = e.target.result;
            previewContent.innerHTML = `<img src="${e.target.result}" alt="Aperçu" style="width: 100%; height: 200px; object-fit: cover; border-radius: 12px;">`;
            updateLightboxPreview();
        };
        reader.readAsDataURL(file);
    } else {
        // Pour les autres fichiers, afficher le nom et l'icône
        const icon = getFileIcon(file.name);
        previewContent.innerHTML = `
            <div class="file-preview">
                <span class="file-icon">${icon}</span>
                <div class="file-info">
                    <span class="file-name">${file.name}</span>
                    <span class="file-size">${formatFileSize(file.size)}</span>
                </div>
            </div>
        `;
        config.photoData = null;
        updateLightboxPreview();
    }

    uploadZone.style.display = 'none';
    uploadPreview.style.display = 'block';
}

function getFileIcon(filename) {
    const ext = filename.split('.').pop().toLowerCase();
    const icons = {
        'pdf': '📄',
        'svg': '🎨',
        'ai': '🎨',
        'psd': '🖼️',
        'stl': '🧊',
        'obj': '🧊',
        '3mf': '🧊',
        'step': '🧊',
        'iges': '🧊',
        'doc': '📝',
        'docx': '📝',
        'zip': '📦',
        'rar': '📦'
    };
    return icons[ext] || '📁';
}

function formatFileSize(bytes) {
    if (bytes < 1024) return bytes + ' o';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' Ko';
    return (bytes / (1024 * 1024)).toFixed(1) + ' Mo';
}

removePhoto.addEventListener('click', () => {
    config.photo = null;
    photoUpload.value = '';
    uploadZone.style.display = 'block';
    uploadPreview.style.display = 'none';
    updateLightboxPreview();
});

// Gestion du texte personnalisé
const customText = document.getElementById('customText');
customText.addEventListener('input', (e) => {
    config.text = e.target.value;
});

// Mise à jour de l'aperçu lightbox
function updateLightboxPreview() {
    const preview = document.getElementById('lightboxPreview');
    const lightboxContent = preview.querySelector('.lightbox-content');
    const lightboxGlow = preview.querySelector('.lightbox-glow');

    // Couleur du cadre
    const frameColors = {
        'noir': '#1a1a1a',
        'blanc': '#f5f5f5',
        'bois': '#8B4513'
    };
    preview.querySelector('.lightbox-frame').style.borderColor = frameColors[config.color];

    // Couleur LED
    const ledColors = {
        'blanc-chaud': 'rgba(255, 228, 181, 0.6)',
        'blanc-froid': 'rgba(240, 248, 255, 0.6)',
        'rgb': 'linear-gradient(45deg, rgba(255,0,0,0.4), rgba(0,255,0,0.4), rgba(0,0,255,0.4))'
    };

    if (config.led === 'rgb') {
        lightboxGlow.style.background = ledColors[config.led];
    } else {
        lightboxGlow.style.background = `radial-gradient(circle, ${ledColors[config.led]} 0%, transparent 70%)`;
    }

    // Fichier uploadé
    if (config.photo && config.photoData) {
        // C'est une image
        lightboxContent.innerHTML = `<img src="${config.photoData}" alt="Votre image" style="width: 100%; height: 100%; object-fit: cover; border-radius: 8px;">`;
    } else if (config.photo && config.fileName) {
        // C'est un autre type de fichier
        const icon = getFileIcon(config.fileName);
        lightboxContent.innerHTML = `
            <span class="lightbox-icon">${icon}</span>
            <p style="font-size: 12px;">${config.fileName}</p>
        `;
    } else {
        lightboxContent.innerHTML = `
            <span class="lightbox-icon">💡</span>
            <p>Votre fichier ici</p>
        `;
    }
}

// Bouton Commander
const addToCart = document.getElementById('addToCart');
addToCart.addEventListener('click', () => {
    if (!config.photo) {
        alert('Veuillez uploader un fichier pour personnaliser votre lightbox.');
        uploadZone.scrollIntoView({ behavior: 'smooth' });
        return;
    }

    // Récapitulatif de la commande
    const recap = `
Récapitulatif de votre commande :
- Fichier : ${config.fileName}
- Taille : ${config.size}
- Couleur cadre : ${config.color}
- Éclairage : ${config.led}
- Quantité : ${config.quantity}
- Texte : ${config.text || '(aucun)'}
- Total : ${document.getElementById('totalPrice').textContent}

Pour finaliser votre commande, vous allez être redirigé vers la page contact.
    `;

    if (confirm(recap)) {
        // Stocker la config dans localStorage pour la page contact
        localStorage.setItem('lightboxOrder', JSON.stringify({
            fileName: config.fileName,
            fileType: config.fileType,
            size: config.size,
            color: config.color,
            led: config.led,
            quantity: config.quantity,
            text: config.text,
            price: document.getElementById('totalPrice').textContent
        }));

        window.location.href = 'contact.html';
    }
});

// Galerie thumbs - Changement d'image principale
function changeMainImage(imageUrl, thumbElement) {
    // Mettre à jour l'image principale
    const mainImage = document.getElementById('mainPreviewImage');
    if (mainImage) {
        mainImage.src = imageUrl;
    }

    // Mettre à jour la classe active sur les thumbnails
    document.querySelectorAll('.gallery-thumbs .thumb').forEach(t => t.classList.remove('active'));
    if (thumbElement) {
        thumbElement.classList.add('active');
    }
}

document.querySelectorAll('.gallery-thumbs .thumb').forEach((thumb, index) => {
    thumb.addEventListener('click', () => {
        document.querySelectorAll('.gallery-thumbs .thumb').forEach(t => t.classList.remove('active'));
        thumb.classList.add('active');
    });
});

// Initialisation
updatePrice();
updateLightboxPreview();
