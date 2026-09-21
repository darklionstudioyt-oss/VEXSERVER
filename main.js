const authModal = document.querySelector('#auth-modal');
const authForm = document.querySelector('#auth-form');
const authTitle = document.querySelector('#auth-title');
const authNameField = document.querySelector('#auth-name-field');
const authSubmit = document.querySelector('#auth-submit');
const authStatus = document.querySelector('#auth-status');
const joinForm = document.querySelector('#join-form');
const formStatus = document.querySelector('#form-status');
let authMode = 'login';

function setAuthMode(mode) {
  authMode = mode;
  const signup = mode === 'signup';
  authTitle.innerHTML = signup ? 'Start your<br /><em>next chapter.</em>' : 'Your work,<br /><em>your way.</em>';
  authNameField.hidden = !signup;
  authNameField.querySelector('input').required = signup;
  authSubmit.innerHTML = `${signup ? 'Create account' : 'Log in'} <span aria-hidden="true">↗</span>`;
  document.querySelectorAll('[data-auth-tab]').forEach((tab) => tab.classList.toggle('active', tab.dataset.authTab === mode));
  authStatus.textContent = '';
}

function openAuth(mode = 'login') {
  setAuthMode(mode);
  authModal.hidden = false;
  document.body.style.overflow = 'hidden';
  const focusTarget = mode === 'signup' ? authNameField.querySelector('input') : authForm.querySelector('[name="email"]');
  focusTarget.focus();
}

function closeAuth() {
  authModal.hidden = true;
  document.body.style.overflow = '';
  authForm.reset();
  setAuthMode('login');
}

document.querySelectorAll('[data-open-auth]').forEach((button) => button.addEventListener('click', () => openAuth(button.dataset.openAuth)));
document.querySelectorAll('[data-auth-tab]').forEach((tab) => tab.addEventListener('click', () => setAuthMode(tab.dataset.authTab)));
document.querySelector('.modal-close').addEventListener('click', closeAuth);
authModal.addEventListener('click', (event) => { if (event.target === authModal) closeAuth(); });
document.addEventListener('keydown', (event) => { if (event.key === 'Escape' && !authModal.hidden) closeAuth(); });

authForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const data = new FormData(authForm);
  const accounts = JSON.parse(localStorage.getItem('vexAccounts') || '{}');
  const email = data.get('email').toLowerCase();
  if (authMode === 'signup') {
    if (accounts[email]) { authStatus.textContent = 'An account with this email already exists.'; return; }
    accounts[email] = { name: data.get('name'), password: data.get('password') };
    localStorage.setItem('vexAccounts', JSON.stringify(accounts));
    authStatus.textContent = 'Account created. Welcome to Vex.';
  } else {
    if (!accounts[email] || accounts[email].password !== data.get('password')) { authStatus.textContent = 'Email or password not recognised.'; return; }
    authStatus.textContent = `Welcome back, ${accounts[email].name}.`;
  }
  authForm.querySelector('button').disabled = true;
  setTimeout(closeAuth, 1200);
});

joinForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const data = Object.fromEntries(new FormData(joinForm));
  const applications = JSON.parse(localStorage.getItem('vexApplications') || '[]');
  applications.push({ ...data, submittedAt: new Date().toISOString() });
  localStorage.setItem('vexApplications', JSON.stringify(applications));
  formStatus.textContent = `Thanks, ${data.firstName}. Your application is on its way.`;
  joinForm.reset();
});
