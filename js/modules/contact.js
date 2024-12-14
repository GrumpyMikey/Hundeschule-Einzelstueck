// modules/contact.js

export function initContactForm() {
  const form = document.getElementById('contactForm');

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const formData = new FormData(form);
      const button = form.querySelector('button[type="submit"]');

      try {
        button.disabled = true;
        button.textContent = 'Wird gesendet...';

        // Hier später den tatsächlichen Endpoint einsetzen
        const response = await fetch('send-mail.php', {
          method: 'POST',
          body: formData
        });

        if (response.ok) {
          showMessage('Nachricht erfolgreich gesendet!', 'success');
          form.reset();
        } else {
          throw new Error('Fehler beim Senden');
        }
      } catch (error) {
        showMessage('Fehler beim Senden der Nachricht. Bitte versuchen Sie es später erneut.', 'error');
      } finally {
        button.disabled = false;
        button.textContent = 'Nachricht senden';
      }
    });
  }
}

function showMessage(message, type) {
  const messageDiv = document.createElement('div');
  messageDiv.className = `form-message form-message--${type}`;
  messageDiv.textContent = message;

  const form = document.getElementById('contactForm');
  form.insertAdjacentElement('beforebegin', messageDiv);

  setTimeout(() => {
    messageDiv.remove();
  }, 5000);
}
