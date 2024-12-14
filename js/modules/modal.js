// modules/modal.js

export default function initModal() {
  const storyButton = document.querySelector('[data-story-toggle]');
  const modal = document.querySelector('.modal');
  const modalContent = modal.querySelector('.modal__content');
  const closeButton = modal.querySelector('.modal__close');

  function openModal() {
    modal.style.display = 'block';
    setTimeout(() => modalContent.classList.add('active'), 10);
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modalContent.classList.remove('active');
    setTimeout(() => {
      modal.style.display = 'none';
      document.body.style.overflow = '';
    }, 300);
  }

  storyButton?.addEventListener('click', openModal);
  closeButton?.addEventListener('click', closeModal);
  modal?.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });

  // Escape-Taste schließt Modal
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.style.display === 'block') {
      closeModal();
    }
  });
}
