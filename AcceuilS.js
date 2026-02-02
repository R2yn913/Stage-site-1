// AcceuilS.js

/* Animation d'apparition au scroll */
document.addEventListener('DOMContentLoaded', function(){
    // Sélectionner les éléments à animer et leur ajouter la classe de base
    const selectors = ['.hero-content', '.choice-card', '.service-card', '.gallery-item', '.material-card', '.pricing-card', '.cta-content', '.contact-info', '.footer-brand'];
    selectors.forEach(sel => document.querySelectorAll(sel).forEach((el, i) => {
        // ajouter une légère variation de délai pour les listes
        el.classList.add('fade-up');
        // optionnel: appliquer un delay pour les éléments enfants (stagger)
        el.style.transitionDelay = (i * 60) + 'ms';
}));

const io = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
if (entry.isIntersecting) {
    entry.target.classList.add('appear');
    obs.unobserve(entry.target);
}
    });
}, { threshold: 0.15 });

document.querySelectorAll('.fade-up, .fade-left, .fade-right').forEach(el => io.observe(el));
    });

/* Animation CSS */
    const stats = document.querySelectorAll('.stat-number[data-target]');
    const speed = 200; // Plus le chiffre est petit, plus c'est rapide

    stats.forEach(counter => {
        const updateCount = () => {
            // Récupérer la valeur cible (ex: 500)
            const target = +counter.getAttribute('data-target');
            // Récupérer la valeur actuelle (ce qui est affiché)
            const count = +counter.innerText;

            // Calculer l'incrément (la vitesse de progression)
            const increment = target / speed;

            if (count < target) {
                // Ajouter l'incrément et arrondir à l'entier supérieur
                counter.innerText = Math.ceil(count + increment);
                // Relancer la fonction après un court délai (1ms)
                setTimeout(updateCount, 10);
            } else {
                // S'assurer que le chiffre final est exact
                counter.innerText = target;
            }
        };

        updateCount();
    });
// Menu toggle for mobile
        const menuToggle = document.getElementById('menuToggle');
        const mainNav = document.getElementById('mainNav');

        menuToggle.addEventListener('click', () => {
            mainNav.classList.toggle('active');
            menuToggle.classList.toggle('active');
        });
        // Check auth state and update header
        document.addEventListener('DOMContentLoaded', function() {
            const token = localStorage.getItem('token');
            const userStr = localStorage.getItem('user');

            if (token && userStr) {
                const user = JSON.parse(userStr);
                document.getElementById('authButtons').style.display = 'none';
                document.getElementById('userMenu').style.display = 'flex';
                document.getElementById('headerName').textContent = user.firstName;
                document.getElementById('headerAvatar').src = user.avatar || 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23ccc"><circle cx="12" cy="8" r="4"/><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/></svg>';

                // Afficher la section choix uniquement pour les clients
                if (user.role === 'client' || user.role === 'both') {
                    const clientSection = document.getElementById('clientChoiceSection');
                    if (clientSection) {
                        clientSection.style.display = 'block';
                    }
                }
            }
        });