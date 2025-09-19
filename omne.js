// tlačítko nahoru
document.addEventListener('DOMContentLoaded', () => {
  const btn = document.querySelector('.btn-top-omne');
  if (!btn) return;

  const toggleBtn = () => {
    const docHeight = document.documentElement.scrollHeight;
    const winHeight = window.innerHeight;
    const scrollable = docHeight - winHeight;
    const threshold = scrollable < 800 ? 150 : scrollable * 0.35;

    if (window.scrollY > threshold) {
      btn.classList.add('show');
    } else {
      btn.classList.remove('show');
    }
  };

  window.addEventListener('scroll', toggleBtn);
  window.addEventListener('load', toggleBtn);
  toggleBtn(); // spustit hned po načtení
});




// falešné odeslání formuláře
(function(){
  const form = document.querySelector('.kontakt-formular');
  const status = document.getElementById('form-status');
  if (!form || !status) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = form.querySelector('input[type="email"]');
    const msg = form.querySelector('textarea');

    if (!email.checkValidity()) {
      status.textContent = 'Zkontrolujte prosím e-mail.';
      status.style.color = '#9b0000';
      email.focus();
      return;
    }
    if (!msg.value.trim()) {
      status.textContent = 'Napište prosím krátkou zprávu.';
      status.style.color = '#9b0000';
      msg.focus();
      return;
    }

    status.textContent = 'Zpráva byla odeslána. Děkuji!';
    status.style.color = '#1a7f37';
    form.reset();
  });
})();

