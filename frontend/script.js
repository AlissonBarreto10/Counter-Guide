document.addEventListener('DOMContentLoaded', () => {
    // ===================================================================
    // ||                  LÓGICA DO MODAL DE VÍDEO                     ||
    // ===================================================================
    const modal = document.getElementById('video-modal');
    const modalTitle = document.getElementById('modal-title');
    const videoPlayer = document.getElementById('video-player');
    const closeButton = document.querySelector('.close-button');

    const closeModal = () => {
        if (modal) modal.style.display = 'none';
        if (videoPlayer) videoPlayer.innerHTML = ''; // Para o vídeo ao fechar
    };

    if (closeButton) closeButton.onclick = closeModal;
    window.onclick = (event) => {
        if (event.target == modal) closeModal();
    };

    const openModal = (title, videoId) => {
        if (modalTitle) modalTitle.textContent = title;
        // A linha abaixo cria o player do YouTube
        if (videoPlayer) videoPlayer.innerHTML = `<iframe src="https://www.youtube.com/embed/${videoId}?autoplay=1" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
        if (modal) modal.style.display = 'flex'; // Usa 'flex' para centralizar
    };

    // ===================================================================
    // ||                  FUNÇÃO DE CRIAR OS CARDS                     ||
    // ===================================================================
    const createTutorialCard = (tutorial) => {
        const card = document.createElement('div');
        card.className = 'tutorial-card';
        card.textContent = tutorial.name;
        // A linha abaixo REATIVA o clique para abrir o modal
        card.onclick = () => openModal(tutorial.name, tutorial.video_id);
        return card;
    };

    // ===================================================================
    // ||                  LÓGICA PRINCIPAL DE CS2                      ||
    // ===================================================================
    const pageTitleElement = document.querySelector('.page-title span');
    if (pageTitleElement && window.location.pathname.includes('-tutorials.html')) {

        const mapName = pageTitleElement.textContent.toLowerCase().replace(/\s+/g, '');
        const ctContainer = document.getElementById('ct-tutorials');
        const trContainer = document.getElementById('tr-tutorials');

        if (!ctContainer || !trContainer) return;

        fetch(`/api/tutorials/cs2/${mapName}`)
            .then(response => response.json())
            .then(tutorials => {
                ctContainer.innerHTML = '';
                trContainer.innerHTML = '';

                const ctTutorials = tutorials.filter(t => t.side === 'ct');
                const trTutorials = tutorials.filter(t => t.side === 'tr');

                if (ctTutorials.length > 0) {
                    ctTutorials.forEach(tutorial => ctContainer.appendChild(createTutorialCard(tutorial)));
                } else {
                    ctContainer.innerHTML = '<p class="no-tutorials-message">Nada encontrado (CT).</p>';
                }

                if (trTutorials.length > 0) {
                    trTutorials.forEach(tutorial => trContainer.appendChild(createTutorialCard(tutorial)));
                } else {
                    trContainer.innerHTML = '<p class="no-tutorials-message">Nada encontrado (TR).</p>';
                }
            })
            .catch(error => console.error('Erro ao buscar tutoriais:', error));
    }
});
