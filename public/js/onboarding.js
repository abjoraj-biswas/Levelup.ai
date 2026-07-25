document.addEventListener('DOMContentLoaded', () => {
    // ---- DOM Elements ----
    
    // Steps (Right Panel Forms)
    const step1 = document.getElementById('step1');
    const step2 = document.getElementById('step2');
    const step3 = document.getElementById('step3');

    // Left Panel Contents
    const leftStep1 = document.getElementById('left-step1');
    const leftStep2 = document.getElementById('left-step2');
    const leftStep3 = document.getElementById('left-step3');

    // Indicators
    const ind1 = document.getElementById('indicator1');
    const ind2 = document.getElementById('indicator2');
    const ind3 = document.getElementById('indicator3');

    // Forms
    const signupForm = document.getElementById('signupForm');
    const detailsForm = document.getElementById('detailsForm');

    // Step 1 Inputs
    const email = document.getElementById('email');
    const phone = document.getElementById('phone');
    const password = document.getElementById('password');
    const confirmPassword = document.getElementById('confirmPassword');

    // Step 2 Elements
    const displayEmail = document.getElementById('displayEmail');
    const displayPhone = document.getElementById('displayPhone');
    
    const emailVerifiedBtn = document.getElementById('emailVerifiedBtn');
    const phoneVerifiedBtn = document.getElementById('phoneVerifiedBtn');
    const emailTimerArea = document.getElementById('emailTimerArea');
    const phoneTimerArea = document.getElementById('phoneTimerArea');
    const emailTimer = document.getElementById('emailTimer');
    const phoneTimer = document.getElementById('phoneTimer');
    const btnGetStarted = document.getElementById('btnGetStarted');

    // State Variables
    let isEmailVerified = false;
    let isPhoneVerified = false;

    // ---- Utility Functions ----
    const switchStep = (hideForm, showForm, hideLeft, showLeft, activeIndId) => {
        // Hide current
        hideForm.style.display = 'none';
        hideForm.classList.remove('active');
        hideLeft.style.display = 'none';
        hideLeft.classList.remove('active');

        // Show next
        showForm.style.display = 'block';
        showLeft.style.display = 'block';

        // Trigger animations
        setTimeout(() => {
            showForm.classList.add('active');
            showLeft.classList.add('active');
        }, 10);

        // Update indicators
        document.querySelectorAll('.step-indicator').forEach(ind => ind.classList.remove('active'));
        document.getElementById(activeIndId).classList.add('active');
    };

    // ---- Step 1: Sign Up Logic ----

    // Password Toggle
    document.querySelectorAll('.password-toggle').forEach(btn => {
        btn.addEventListener('click', () => {
            const targetId = btn.getAttribute('data-target');
            const input = document.getElementById(targetId);
            const icon = btn.querySelector('i');
            if (input.type === 'password') {
                input.type = 'text';
                icon.classList.remove('ph-eye-slash');
                icon.classList.add('ph-eye');
            } else {
                input.type = 'password';
                icon.classList.remove('ph-eye');
                icon.classList.add('ph-eye-slash');
            }
        });
    });

    // Password Strength Evaluator
    const segments = [
        document.getElementById('seg1'),
        document.getElementById('seg2'),
        document.getElementById('seg3'),
        document.getElementById('seg4')
    ];
    const strengthText = document.getElementById('strengthText');

    password.addEventListener('input', () => {
        const val = password.value;
        let score = 0;
        if (val.length >= 8) score++;
        if (val.match(/[A-Z]/)) score++;
        if (val.match(/[0-9]/)) score++;
        if (val.match(/[^A-Za-z0-9]/)) score++;

        segments.forEach((seg, i) => {
            if (i < score) {
                if (score <= 2) seg.style.backgroundColor = '#EF4444'; // Red
                else if (score === 3) seg.style.backgroundColor = '#F59E0B'; // Orange
                else seg.style.backgroundColor = '#10B981'; // Green
            } else {
                seg.style.backgroundColor = 'var(--border-color)';
            }
        });

        if (score === 0) strengthText.textContent = '';
        else if (score <= 2) { strengthText.textContent = 'Weak'; strengthText.style.color = '#EF4444'; }
        else if (score === 3) { strengthText.textContent = 'Medium'; strengthText.style.color = '#F59E0B'; }
        else { strengthText.textContent = 'Strong'; strengthText.style.color = '#10B981'; }
    });

    // Step 1 Submission
    signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        if (password.value !== confirmPassword.value) {
            confirmPassword.setCustomValidity("Passwords do not match");
            confirmPassword.reportValidity();
            confirmPassword.addEventListener('input', () => {
                confirmPassword.setCustomValidity('');
            }, { once: true });
            return;
        }

        const name = document.getElementById('name') ? document.getElementById('name').value : 'New User';

        // Call real backend sign-up
        try {
            const btnSubmit = signupForm.querySelector('.btn-primary');
            const origText = btnSubmit.innerHTML;
            btnSubmit.innerHTML = 'Signing up...';
            btnSubmit.disabled = true;

            const baseUrl = window.location.port === '5501' || window.location.protocol === 'file:' ? 'http://localhost:5500' : '';
            const res = await fetch(baseUrl + '/api/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: email.value, password: password.value, name: name })
            });
            const data = await res.json();
            
            btnSubmit.innerHTML = origText;
            btnSubmit.disabled = false;

            if (!res.ok) {
                alert("Sign up failed: " + (data.error || "Unknown error"));
                return;
            }

            // Setup Step 2 UI
            displayEmail.textContent = email.value;
            const countryCode = document.getElementById('countryCode').value;
            displayPhone.textContent = `${countryCode} ${phone.value}`;

            // Switch to Step 2
            switchStep(step1, step2, leftStep1, leftStep2, 'indicator2');
            
            // Start timers
            startOtpTimer('emailTimerArea', 'email');
            startOtpTimer('phoneTimerArea', 'phone');
            
        } catch (err) {
            console.error(err);
            alert("Network error. Please try again.");
        }
    });

    // ---- Step 2: Verification Logic ----

    // Auto-advance OTP Inputs
    document.querySelectorAll('.otp-container').forEach(container => {
        const inputs = container.querySelectorAll('input');
        inputs.forEach((input, index) => {
            input.addEventListener('input', (e) => {
                if (e.target.value.length === 1 && index < inputs.length - 1) {
                    inputs[index + 1].focus();
                }
                
                // Check if all filled
                const allFilled = Array.from(inputs).every(inp => inp.value.length === 1);
                if (allFilled) {
                    if (container.classList.contains('email-otp-inputs')) {
                        verifyEmail();
                    } else if (container.classList.contains('phone-otp-inputs')) {
                        verifyPhone();
                    }
                }
            });
            input.addEventListener('keydown', (e) => {
                if (e.key === 'Backspace' && e.target.value === '' && index > 0) {
                    inputs[index - 1].focus();
                }
            });
        });
    });

    const startOtpTimer = (areaId, type) => {
        const area = document.getElementById(areaId);
        let timeLeft = 30;
        area.innerHTML = `Resend OTP in <span style="color:white;">00:${timeLeft}</span>`;
        const newTimerSpan = area.querySelector('span');

        const timerId = setInterval(() => {
            timeLeft--;
            const paddedTime = timeLeft < 10 ? `0${timeLeft}` : timeLeft;
            newTimerSpan.textContent = `00:${paddedTime}`;
            
            if (timeLeft <= 0) {
                clearInterval(timerId);
                area.innerHTML = `<button type="button" onclick="resendOtp('${type}')" style="background:none; border:none; color:var(--primary-color); cursor:pointer; font-weight:500;">Resend OTP</button>`;
            }
        }, 1000);
    };

    window.resendOtp = (type) => {
        if (type === 'email') startOtpTimer('emailTimerArea', 'email');
        if (type === 'phone') startOtpTimer('phoneTimerArea', 'phone');
    };

    const verifyEmail = async () => {
        const inputs = document.querySelector('.email-otp-inputs').querySelectorAll('input');
        const otp = Array.from(inputs).map(i => i.value).join('');
        
        try {
            const baseUrl = window.location.port === '5501' || window.location.protocol === 'file:' ? 'http://localhost:5500' : '';
            const res = await fetch(baseUrl + '/api/auth/verify-signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: email.value, otp })
            });
            const data = await res.json();
            
            if (!res.ok) {
                alert("Email verification failed: " + (data.error || "Unknown error"));
                inputs.forEach(i => i.value = ''); // clear inputs
                inputs[0].focus();
                return;
            }

            // Success
            document.querySelector('.email-otp-inputs').style.display = 'none';
            emailTimerArea.style.display = 'none';
            emailVerifiedBtn.style.display = 'flex';
            isEmailVerified = true;
            
            // Store token in localStorage
            if (data.data && data.data.accessToken) {
                localStorage.setItem('insforge_token', data.data.accessToken);
            }
            
            checkAllVerified();
        } catch (err) {
            console.error(err);
            alert("Network error.");
        }
    };

    const verifyPhone = () => {
        setTimeout(() => {
            document.querySelector('.phone-otp-inputs').style.display = 'none';
            phoneTimerArea.style.display = 'none';
            phoneVerifiedBtn.style.display = 'flex';
            isPhoneVerified = true;
            checkAllVerified();
        }, 500);
    };

    const checkAllVerified = () => {
        if (isEmailVerified && isPhoneVerified) {
            btnGetStarted.disabled = false;
        }
    };

    btnGetStarted.addEventListener('click', () => {
        switchStep(step2, step3, leftStep2, leftStep3, 'indicator3');
    });

    // ---- Step 3: Personal Details Logic ----
    detailsForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const btnSave = document.getElementById('btnSaveDetails');
        btnSave.innerHTML = '<i class="ph ph-spinner ph-spin"></i> Saving Profile...';
        btnSave.disabled = true;

        try {
            const inputs = detailsForm.querySelectorAll('input:not([type="file"]), select');
            const profileData = {
                name: inputs[0] ? inputs[0].value : 'User',
                dob: inputs[1] ? inputs[1].value : null,
                gender: inputs[2] ? inputs[2].value : null,
                domain: inputs[3] ? inputs[3].value : null,
                career_goal: inputs[4] ? inputs[4].value : null,
                skills: inputs[5] ? inputs[5].value : null,
                dream_company: inputs[6] ? inputs[6].value : null,
                college: inputs[7] ? inputs[7].value : null
            };

            const token = localStorage.getItem('insforge_token');
            if (token) {
                const baseUrl = window.location.port === '5501' || window.location.protocol === 'file:' ? 'http://localhost:5500' : '';
                await fetch(baseUrl + '/api/profile', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(profileData)
                });
            }

            window.location.href = 'index.html';
        } catch (err) {
            console.error(err);
            alert("Failed to save details. Moving to dashboard anyway.");
            window.location.href = 'index.html';
        }
    });
});
