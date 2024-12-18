function togglePassword(inputId, icon) {
    const passwordInput = document.getElementById(inputId);
  
    // Toggle password visibility
    if (passwordInput.type === 'password') {
      passwordInput.type = 'text';
      icon.textContent = '🙈';  // Change the icon when password is visible
    } else {
      passwordInput.type = 'password';
      icon.textContent = '👁️';  // Change the icon when password is hidden
    }
  }
  