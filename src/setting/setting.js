require('./setting.scss');
require('../layout/header.js');
require('../layout/footer.js');

$('#profileForm').on('submit', (e) => {
  e.preventDefault();
  fetch(`/user/setting/info`, {
    method: 'POST',
    credentials: 'include',
    body: new URLSearchParams(new FormData(e.target))
  }).then(r => r.json())
    .then(console.log)
    .catch(console.error);
});
