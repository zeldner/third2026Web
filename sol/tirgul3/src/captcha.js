document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('registerForm');
    const registerMessage = document.getElementById('registerMessage');
    let isAdmin = true;
    
    const arithmeticChallengeSpan = document.getElementById('captcha-challenge');
    const arithmeticAnswerInput = document.getElementById('captcha-answer');
    const refreshArithmeticCaptchaButton = document.getElementById('refresh-captcha');
    const arithmeticError = document.getElementById('arithmetic-error');
    const captchaAttemptsError = document.getElementById('captcha-attempts-error');
    let arithmeticNum1, arithmeticNum2, arithmeticExpectedAnswer;
    let incorrectAttempts = 0;
    const maxIncorrectAttempts = 3;

    function generateArithmeticCaptcha() {
        arithmeticNum1 = Math.floor(Math.random() * 10) + 1;
        arithmeticNum2 = Math.floor(Math.random() * 10) + 1;
        const operation = Math.random() < 0.5 ? '+' : '-';

        if (operation === '+') {
            arithmeticExpectedAnswer = arithmeticNum1 + arithmeticNum2;
            arithmeticChallengeSpan.textContent = `${arithmeticNum1} + ${arithmeticNum2} = ?`;
        } else {
            arithmeticExpectedAnswer = arithmeticNum1 - arithmeticNum2;
            arithmeticChallengeSpan.textContent = `${arithmeticNum1} - ${arithmeticNum2} = ?`;
        }
        arithmeticAnswerInput.value = '';
        arithmeticError.classList.add('hidden');
    }
    generateArithmeticCaptcha();

    function refreshCaptcha() {
        generateArithmeticCaptcha();
    }
    refreshArithmeticCaptchaButton.addEventListener('click', refreshCaptcha);

    
    registerForm.addEventListener('submit', async(event)=> {
        event.preventDefault();

        if (incorrectAttempts >= maxIncorrectAttempts) {
            captchaAttemptsError.classList.remove('hidden');
            return;
        }

        const username = document.getElementById('userInput').value;
        const email = document.getElementById('mailInput').value;
        const password = document.getElementById('passInput').value;
        const confirmPassword = document.getElementById('confirmInput').value;
        const dob = document.getElementById('dateInput').value;
        registerMessage.textContent = "";
        if (password !== confirmPassword) {
            registerMessage.textContent = "Passwords do not match.";
            registerMessage.classList.remove("text-green-500");
            registerMessage.classList.add("text-red-500");
            return;
        }

        let captchaCorrect = false;
        const userAnswer = parseInt(arithmeticAnswerInput.value);
        if (!isNaN(userAnswer) && userAnswer === arithmeticExpectedAnswer) {
            try {
                if(find(username)){
                    messageDiv.textContent = "Username or email already exists.";
                    messageDiv.classList.remove("text-green-500");
                    messageDiv.classList.add("text-red-500");
                    return;
                }
                if (users.length < 1 || users == undefined)
                    isAdmin = true;
                else
                    isAdmin = false;
                
                add(username, email, password, dob, isAdmin);
                
                registerMessage.textContent = "Registration successful!";
                registerMessage.classList.remove("text-red-500");
                registerMessage.classList.add("text-green-500");

                document.getElementById('userInput').value="";
                document.getElementById('mailInput').value="";
                document.getElementById('passInput').value="";
                document.getElementById('confirmInput').value="";
                document.getElementById('dateInput').value="";        
            }catch(error){
                registerMessage.textContent = "An error occurred during registration.";
                registerMessage.classList.remove("text-green-500");
                registerMessage.classList.add("text-red-500");
            }
            incorrectAttempts = 0;
            refreshCaptcha();
        } else {
            arithmeticError.classList.remove('hidden');
            incorrectAttempts++;
            if (incorrectAttempts >= maxIncorrectAttempts) {
                captchaAttemptsError.classList.remove('hidden');
                if (currentCaptchaType === 'arithmetic') arithmeticError.classList.add('hidden');
                if (currentCaptchaType === 'image') imageError.classList.add('hidden');
            } else {
                refreshCaptcha();
            }
        }
   });
});