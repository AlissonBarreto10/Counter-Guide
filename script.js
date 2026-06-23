document.addEventListener('DOMContentLoaded', () => {
    // Modal
    const modal = document.getElementById('video-modal');
    const modalTitle = document.getElementById('modal-title');
    const videoPlayer = document.getElementById('video-player');
    const closeButton = document.querySelector('.close-button');

    const closeModal = () => {
        if (modal) modal.style.display = 'none';
        if (videoPlayer) videoPlayer.innerHTML = '';
    };

    if (closeButton) closeButton.onclick = closeModal;
    window.onclick = (event) => {
        if (event.target === modal) closeModal();
    };

    const openModal = (title, videoId) => {
        if (modalTitle) modalTitle.textContent = title;
        if (videoPlayer) videoPlayer.innerHTML = `<iframe src="https://www.youtube.com/embed/${videoId}?autoplay=1" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
        if (modal) modal.style.display = 'flex';
    };

    // Utility selector
    const utilityButtons = document.querySelectorAll('.utility-btn');
    let currentType = 'smoke';

    utilityButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            utilityButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentType = btn.dataset.type;
            loadTutorials(currentType);
        });
    });

    // Create card
    const createTutorialCard = (tutorial) => {
        const card = document.createElement('div');
        card.className = 'tutorial-card';
        card.textContent = tutorial.name;
        card.onclick = () => openModal(tutorial.name, tutorial.video_id);
        return card;
    };

    // Load tutorials from local JSON
    const loadTutorials = (type = 'smoke') => {
        const pageTitleElement = document.querySelector('.page-title span');
        if (!pageTitleElement) return;

        const mapName = pageTitleElement.textContent.toLowerCase().replace(/\s+/g, '');
        const ctContainer = document.getElementById('ct-tutorials');
        const trContainer = document.getElementById('tr-tutorials');

        if (!ctContainer || !trContainer) return;

        fetch('data.json')
            .then(response => response.json())
            .then(data => {
                const tutorials = data.tutorials || [];

                ctContainer.innerHTML = '';
                trContainer.innerHTML = '';

                const filtered = tutorials.filter(t =>
                    t.map === mapName && t.type === type
                );

                const ctTutorials = filtered.filter(t => t.side === 'ct');
                const trTutorials = filtered.filter(t => t.side === 'tr');

                if (ctTutorials.length > 0) {
                    ctTutorials.forEach(t => ctContainer.appendChild(createTutorialCard(t)));
                } else {
                    ctContainer.innerHTML = '<p class="no-tutorials-message">Nenhum tutorial encontrado (CT).</p>';
                }

                if (trTutorials.length > 0) {
                    trTutorials.forEach(t => trContainer.appendChild(createTutorialCard(t)));
                } else {
                    trContainer.innerHTML = '<p class="no-tutorials-message">Nenhum tutorial encontrado (TR).</p>';
                }
            })
            .catch(error => {
                console.error('Erro ao carregar dados:', error);
                ctContainer.innerHTML = '<p class="no-tutorials-message">Erro ao carregar tutoriais.</p>';
                trContainer.innerHTML = '<p class="no-tutorials-message">Erro ao carregar tutoriais.</p>';
            });
    };

    // Initial load
    loadTutorials('smoke');
});