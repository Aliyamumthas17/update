// DOM Elements
// Wait for DOM to be fully loaded before attaching event handlers
document.addEventListener('DOMContentLoaded', () => {
    // Get UI elements - using optional chaining to prevent errors when elements don't exist
    const loginBtn = document.getElementById('loginBtn');
    const loginModal = document.getElementById('loginModal');
    const signupModal = document.getElementById('signupModal');
    const showSignup = document.getElementById('showSignup');
    const showLogin = document.getElementById('showLogin');
    const closeButtons = document.querySelectorAll('.close');
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');
    const scrollTopBtn = document.getElementById('scrollTop');
    
    // Form Elements - using optional chaining to prevent errors
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    const donationForm = document.getElementById('donationForm');
    const contactForm = document.getElementById('contactForm');
    const receiverForm = document.getElementById('receiverForm');
    
    // Photo upload elements
    const fileInput = document.getElementById('photoUpload');
    const imagePreview = document.getElementById('imagePreview');
    
    // Debug logging
    console.log("Login button:", loginBtn);
    console.log("Login modal:", loginModal);
    console.log("Close buttons:", closeButtons);
    
    // Navigation and Modal Control
    if (loginBtn && loginModal) {
        loginBtn.addEventListener('click', () => {
            loginModal.style.display = 'block';
        });
    }
    
    if (showSignup && loginModal && signupModal) {
        showSignup.addEventListener('click', (e) => {
            e.preventDefault();
            loginModal.style.display = 'none';
            signupModal.style.display = 'block';
        });
    }
    
    if (showLogin && loginModal && signupModal) {
        showLogin.addEventListener('click', (e) => {
            e.preventDefault();
            signupModal.style.display = 'none';
            loginModal.style.display = 'block';
        });
    }
    
    closeButtons.forEach(button => {
        button.addEventListener('click', () => {
            console.log("Close button clicked");
            if (loginModal) loginModal.style.display = 'none';
            if (signupModal) signupModal.style.display = 'none';
        });
    });
    
    // Close modals when clicking outside
    window.addEventListener('click', (e) => {
        if (loginModal && e.target === loginModal) {
            loginModal.style.display = 'none';
        }
        if (signupModal && e.target === signupModal) {
            signupModal.style.display = 'none';
        }
    });
    
    // Mobile navigation toggle
    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            hamburger.classList.toggle('active');
        });
    }
    
    // Scroll to Top Button
    if (scrollTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                scrollTopBtn.classList.add('show');
            } else {
                scrollTopBtn.classList.remove('show');
            }
        });
        
        scrollTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
    
    // Form Validation Functions
    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
    
    function validatePassword(password) {
        // At least 8 characters, 1 uppercase, 1 number, 1 special character
        const re = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        return re.test(password);
    }
    
    function showError(element, message) {
        const formGroup = element.parentElement;
        const error = formGroup.querySelector('.error-message') || document.createElement('div');
        error.className = 'error-message';
        error.textContent = message;
        if (!formGroup.querySelector('.error-message')) {
            formGroup.appendChild(error);
        }
        element.classList.add('error');
    }
    
    function clearError(element) {
        const formGroup = element.parentElement;
        const error = formGroup.querySelector('.error-message');
        if (error) {
            formGroup.removeChild(error);
        }
        element.classList.remove('error');
    }
    
    // Photo upload functionality
    if (fileInput && imagePreview) {
        fileInput.addEventListener('change', function() {
            // Clear the preview area
            imagePreview.innerHTML = '';
            
            // Loop through each selected file
            for (let i = 0; i < this.files.length; i++) {
                const file = this.files[i];
                
                // Only process image files
                if (!file.type.match('image.*')) {
                    continue;
                }
                
                // Create a file reader
                const reader = new FileReader();
                
                // Set up the reader to display the image when loaded
                reader.onload = (function(file) {
                    return function(e) {
                        // Create preview container
                        const previewItem = document.createElement('div');
                        previewItem.className = 'preview-item';
                        
                        // Create image element
                        const img = document.createElement('img');
                        img.src = e.target.result;
                        img.title = file.name;
                        
                        // Create remove button
                        const removeBtn = document.createElement('div');
                        removeBtn.className = 'remove-preview';
                        removeBtn.innerHTML = '✕';
                        removeBtn.addEventListener('click', function() {
                            previewItem.remove();
                            // Note: This doesn't actually remove the file from the input
                            // For that functionality, you'd need to implement a FileList manipulation
                        });
                        
                        // Add elements to the preview
                        previewItem.appendChild(img);
                        previewItem.appendChild(removeBtn);
                        imagePreview.appendChild(previewItem);
                    };
                })(file);
                
                // Read the image file as a data URL
                reader.readAsDataURL(file);
            }
        });
    }
    
    // Form Submissions
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('loginEmail');
            const password = document.getElementById('loginPassword');
            let isValid = true;
    
            if (!validateEmail(email.value)) {
                showError(email, 'Please enter a valid email address');
                isValid = false;
            } else {
                clearError(email);
            }
    
            if (password.value.length < 8) {
                showError(password, 'Password must be at least 8 characters');
                isValid = false;
            } else {
                clearError(password);
            }
    
            if (isValid) {
                // Mock authentication - replace with actual authentication
                const user = JSON.parse(localStorage.getItem('users') || '[]')
                    .find(u => u.email === email.value && u.password === password.value);
    
                if (user) {
                    localStorage.setItem('currentUser', JSON.stringify(user));
                    showNotification('Login successful!', 'success');
                    loginModal.style.display = 'none';
                    updateUIForLoggedInUser(user);
                } else {
                    showNotification('Invalid credentials', 'error');
                }
            }
        });
    }
    
    if (signupForm) {
        signupForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('signupName');
            const email = document.getElementById('signupEmail');
            const password = document.getElementById('signupPassword');
            const confirmPassword = document.getElementById('confirmPassword');
            const terms = document.getElementById('terms');
            let isValid = true;
    
            if (name.value.length < 2) {
                showError(name, 'Name must be at least 2 characters');
                isValid = false;
            } else {
                clearError(name);
            }
    
            if (!validateEmail(email.value)) {
                showError(email, 'Please enter a valid email address');
                isValid = false;
            } else {
                clearError(email);
            }
    
            if (!validatePassword(password.value)) {
                showError(password, 'Password must contain at least 8 characters, 1 uppercase, 1 number, and 1 special character');
                isValid = false;
            } else {
                clearError(password);
            }
    
            if (password.value !== confirmPassword.value) {
                showError(confirmPassword, 'Passwords do not match');
                isValid = false;
            } else {
                clearError(confirmPassword);
            }
    
            if (!terms.checked) {
                showError(terms, 'You must agree to the terms and conditions');
                isValid = false;
            } else {
                clearError(terms);
            }
    
            if (isValid) {
                // Mock registration - replace with actual registration
                const users = JSON.parse(localStorage.getItem('users') || '[]');
                const newUser = {
                    id: Date.now(),
                    name: name.value,
                    email: email.value,
                    password: password.value
                };
                users.push(newUser);
                localStorage.setItem('users', JSON.stringify(users));
                showNotification('Registration successful! Please log in.', 'success');
                signupModal.style.display = 'none';
                loginModal.style.display = 'block';
            }
        });
    }
    
    if (donationForm) {
        donationForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const fullName = document.getElementById('fullName');
            const email = document.getElementById('email');
            const clothesTypes = document.querySelectorAll('input[type="checkbox"]:checked');
            const condition = document.getElementById('condition');
            let isValid = true;
    
            if (fullName.value.length < 2) {
                showError(fullName, 'Please enter your full name');
                isValid = false;
            } else {
                clearError(fullName);
            }
    
            if (!validateEmail(email.value)) {
                showError(email, 'Please enter a valid email address');
                isValid = false;
            } else {
                clearError(email);
            }
    
            if (clothesTypes.length === 0) {
                showError(document.querySelector('.checkbox-group'), 'Please select at least one type of clothing');
                isValid = false;
            } else {
                clearError(document.querySelector('.checkbox-group'));
            }
    
            if (!condition.value) {
                showError(condition, 'Please select the condition of clothes');
                isValid = false;
            } else {
                clearError(condition);
            }
    
            if (isValid) {
                // Get photo files if they exist
                let photos = [];
                if (fileInput && fileInput.files.length > 0) {
                    // In a real implementation, you would upload these files to your server
                    // For now, we'll just store file names for demonstration
                    photos = Array.from(fileInput.files).map(file => file.name);
                }
                
                // Mock donation submission - replace with actual submission
                const donations = JSON.parse(localStorage.getItem('donations') || '[]');
                const newDonation = {
                    id: Date.now(),
                    fullName: fullName.value,
                    email: email.value,
                    clothesTypes: Array.from(clothesTypes).map(cb => cb.value),
                    condition: condition.value,
                    comments: document.getElementById('comments') ? document.getElementById('comments').value : '',
                    photos: photos,
                    date: new Date().toISOString()
                };
                donations.push(newDonation);
                localStorage.setItem('donations', JSON.stringify(donations));
                showNotification('Thank you for your donation!', 'success');
                donationForm.reset();
                
                // Clear image previews
                if (imagePreview) {
                    imagePreview.innerHTML = '';
                }
            }
        });
    }
    
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('contactName');
            const email = document.getElementById('contactEmail');
            const message = document.getElementById('message');
            let isValid = true;
    
            if (name.value.length < 2) {
                showError(name, 'Please enter your name');
                isValid = false;
            } else {
                clearError(name);
            }
    
            if (!validateEmail(email.value)) {
                showError(email, 'Please enter a valid email address');
                isValid = false;
            } else {
                clearError(email);
            }
    
            if (message.value.length < 10) {
                showError(message, 'Please enter a message (at least 10 characters)');
                isValid = false;
            } else {
                clearError(message);
            }
    
            if (isValid) {
                // Mock contact form submission - replace with actual submission
                showNotification('Thank you for your message! We\'ll respond soon.', 'success');
                contactForm.reset();
            }
        });
    }
    
    // Utility Functions
    function showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
    
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
    
    function updateUIForLoggedInUser(user) {
        if (!loginBtn) return;
        
        loginBtn.textContent = 'Logout';
        loginBtn.addEventListener('click', () => {
            localStorage.removeItem('currentUser');
            location.reload();
        });
        
        // Add user-specific UI elements here
        const welcomeMessage = document.createElement('span');
        welcomeMessage.className = 'welcome-message';
        welcomeMessage.textContent = `Welcome, ${user.name}!`;
        navLinks.insertBefore(welcomeMessage, loginBtn);
    }
    
    // Check for logged-in user on page load
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser) {
        updateUIForLoggedInUser(currentUser);
    }
    
    // Add smooth scrolling for all anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
});

// Handle Receiver Form Submission - this function is called from the HTML via onsubmit
function handleReceiverSubmit(event) {
    event.preventDefault(); // Prevent the default form submission
    
    // Basic validation - check required fields
    const requiredFields = document.querySelectorAll('#receiverForm [required]');
    let isValid = true;
    
    for (let field of requiredFields) {
        if (!field.value) {
            // Create or display error message
            const formGroup = field.parentElement;
            const errorMsg = formGroup.querySelector('.error-message') || document.createElement('div');
            errorMsg.className = 'error-message';
            errorMsg.textContent = 'This field is required';
            
            if (!formGroup.querySelector('.error-message')) {
                formGroup.appendChild(errorMsg);
            }
            
            field.classList.add('error');
            isValid = false;
        } else {
            // Clear any error
            const formGroup = field.parentElement;
            const errorMsg = formGroup.querySelector('.error-message');
            if (errorMsg) {
                formGroup.removeChild(errorMsg);
            }
            field.classList.remove('error');
        }
    }
    
    if (isValid) {
        // Show success message and redirect
        const notification = document.createElement('div');
        notification.className = 'notification success';
        notification.textContent = 'Request submitted successfully!';
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        // Redirect after a short delay to show the notification
        setTimeout(() => {
            window.location.href = "available-items.html";
        }, 1500);
    }
}