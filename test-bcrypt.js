const bcrypt = require('bcrypt');

const hashedPassword = '$2b$10$7oLIlTxPt.xOZcGpgTRn6OAO.LQbGcZ3XVKzKgDN7h0SYu.V6bKvC';
const passwordToCheck = 'newpassword123'; // Password yang ingin diperiksa

bcrypt.compare(passwordToCheck, hashedPassword, (err, result) => {
  if (err) {
    console.error('Error comparing password:', err);
  } else if (result) {
    console.log('Password matches');
  } else {
    console.log('Password does not match');
  }
});
