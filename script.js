const form = document.getElementById('reservation-form');
const message = document.getElementById('form-message');

if (form) {
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const name = form.name.value.trim() || 'guest';
    message.textContent = `Thank you, ${name}. We will confirm your table within 12 hours.`;
    form.reset();
  });
}
