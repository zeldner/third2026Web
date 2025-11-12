// Ilya Zeldner
// this is a simple CAPTCHA implementation using JavaScript
// It includes two types of CAPTCHAs: arithmetic and image-based.
// The arithmetic CAPTCHA generates a simple math problem, 
// while the image CAPTCHA asks the user to select specific images from a set.
// The user can switch between the two types of CAPTCHAs using a dropdown menu.
// The code handles user interactions, checks the answers, and provides feedback on incorrect attempts.
// It also includes a refresh button to regenerate the CAPTCHA challenge.


// The addEventListener() method attaches an event handler to the specified element.
// The event handler is executed when the specified event occurs on the element.
// This allows you to respond to user actions, such as clicks, key presses, and other events.
// The method takes two arguments: the event type (e.g., 'click', 'change') and the function to execute when the event occurs.
// You can also pass an optional third argument to specify options like event capturing or passive behavior.
// This method is commonly used in JavaScript to create interactive web applications by responding to user input and events.

// the DOMContentLoaded event is fired when the initial HTML document has been completely loaded and parsed,
// without waiting for stylesheets, images, and subframes to finish loading.
document.addEventListener('DOMContentLoaded', () => {
    const captchaTypeSelect = document.getElementById('captcha-type');
    const arithmeticCaptchaContainer = document.getElementById('arithmetic-captcha-container');
    const imageCaptchaContainer = document.getElementById('image-captcha-container');

    // Arithmetic CAPTCHA elements
    const arithmeticChallengeSpan = document.getElementById('arithmetic-challenge');
    const arithmeticAnswerInput = document.getElementById('arithmetic-answer');
    const refreshArithmeticCaptchaButton = document.getElementById('refresh-arithmetic-captcha');
    const arithmeticError = document.getElementById('arithmetic-error');

    // Image CAPTCHA elements
    const imageChallengeText = document.getElementById('image-challenge-text');
    const imageOptionsContainer = document.getElementById('image-options');
    const imageError = document.getElementById('image-error');
    const refreshImageButton = document.getElementById('refresh-image-captcha'); // Get the refresh button

    const registrationFormCaptcha = document.getElementById('registration-form-captcha');
    const captchaAttemptsError = document.getElementById('captcha-attempts-error');

    let currentCaptchaType = 'arithmetic';
    let arithmeticNum1, arithmeticNum2, arithmeticExpectedAnswer;
    let imageChallengeData;
    let incorrectAttempts = 0;
    const maxIncorrectAttempts = 3;

    const imageCaptchaDataOptions = [
        {
            question: "Select all images containing cats",
            images: [
                { url: "https://placecats.com/80/80?id=1", isCat: true },
                { url: "https://dummyimage.com/80x80/cccccc/000000&text=Dog", isCat: false },
                { url: "https://placecats.com/80/80?id=2", isCat: true },
                { url: "https://dummyimage.com/80x80/cccccc/000000&text=Bird", isCat: false },
                { url: "https://placecats.com/80/80?id=3", isCat: true },
                { url: "https://dummyimage.com/80x80/cccccc/000000&text=Fish", isCat: false },
            ],
            correctIndices: [0, 2, 4], // Indices of the cat images
        },
        {
            question: "Select all images containing trees",
            images: [
                { url: "https://dummyimage.com/80x80/808080/FFFFFF&text=Tree", isTree: true },
                { url: "https://dummyimage.com/80x80/cccccc/000000&text=House", isTree: false },
                { url: "https://dummyimage.com/80x80/808080/FFFFFF&text=Tree", isTree: true },
                { url: "https://dummyimage.com/80x80/cccccc/000000&text=Car", isTree: false },
                { url: "https://dummyimage.com/80x80/808080/FFFFFF&text=Tree", isTree: true },
                { url: "https://dummyimage.com/80x80/cccccc/000000&text=Water", isTree: false },
            ],
            correctIndices: [0, 2, 4],
        },
    ];

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

    function generateImageCaptcha() {
        const randomIndex = Math.floor(Math.random() * imageCaptchaDataOptions.length);
        imageChallengeData = imageCaptchaDataOptions[randomIndex];
        imageChallengeText.textContent = imageChallengeData.question;
        imageOptionsContainer.innerHTML = ''; // Clear previous options

        imageChallengeData.images.forEach((image, index) => {
            const img = document.createElement('img');
            img.src = image.url;
            img.alt = `Captcha Image ${index + 1}`;
            img.classList.add('captcha-image-option');
            img.dataset.index = index;
            img.addEventListener('click', toggleImageSelection);
            imageOptionsContainer.appendChild(img);
        });
        imageError.classList.add('hidden');
    }

    // the toggleImageSelection function is used to toggle the selection state of an image in the CAPTCHA.
    // When an image is clicked, it adds or removes the 'selected' class to visually indicate selection.
    // This function is called when an image in the image CAPTCHA is clicked.
    // The function uses the event object to access the clicked image and toggle its class.
    function toggleImageSelection(event) {
        event.target.classList.toggle('selected');
    }

    // the checkImageCaptcha function checks if the selected images match the correct indices.
    // It retrieves the selected indices from the image options container and compares them to the correct indices.
    // If they match, it returns true; otherwise, it returns false.
    // The function uses the Array.from() method to create an array from the selected image elements.
    // It then maps the selected images to their indices and sorts them for comparison.
    // The function uses JSON.stringify() to compare the selected indices with the correct indices.
    function checkImageCaptcha() {
        const selectedIndices = Array.from(imageOptionsContainer.querySelectorAll('.captcha-image-option.selected'))
            .map(img => parseInt(img.dataset.index));
        selectedIndices.sort((a, b) => a - b);
        // the sort function sorts the array in ascending order
        // the sort algorithm is O(n log n) in the average case and O(n^2) in the worst case
        // the sort function is stable, meaning that it preserves the relative order of 
        // equal elements
        // the sort function is not guaranteed to be stable in all implementations
        // the sort function is not guaranteed to be in-place, meaning that 
        // it may use additional memory
        const correctIndicesSorted = [...imageChallengeData.correctIndices].sort((a, b) => a - b);
        return JSON.stringify(selectedIndices) === JSON.stringify(correctIndicesSorted);
    }

    // the refreshCaptcha function refreshes the CAPTCHA challenge based on the current type.
    // It checks the currentCaptchaType variable and calls the appropriate function to generate a new CAPTCHA.
    // If the current type is 'arithmetic', it generates a new arithmetic CAPTCHA.
    // If the current type is 'image', it clears the selected images and generates a new image CAPTCHA.
    // The function is called when the refresh button is clicked or when the CAPTCHA type changes.
    // The function uses the querySelectorAll() method to select all selected image options and remove the 'selected' class.
    // It then calls the generateImageCaptcha() function to create a new image CAPTCHA.
    // The function is used to refresh the CAPTCHA challenge when the user clicks the refresh button or changes the CAPTCHA type.
    function refreshCaptcha() {
        if (currentCaptchaType === 'arithmetic') {
            generateArithmeticCaptcha();
        } else if (currentCaptchaType === 'image') {
            imageOptionsContainer.querySelectorAll('.captcha-image-option.selected').forEach(img => {
                img.classList.remove('selected');
            });
            generateImageCaptcha();
        }
    }

    // the addEventListener() method is used to attach an event handler to the refresh button.
    // When the button is clicked, it calls the refreshCaptcha() function to regenerate the CAPTCHA.
    // This allows the user to refresh the CAPTCHA challenge without reloading the page.
    refreshArithmeticCaptchaButton.addEventListener('click', refreshCaptcha);
    refreshImageButton.addEventListener('click', refreshCaptcha); // Add listener for the image refresh button

    // the addEventListener() method is used to attach an event handler to the CAPTCHA type select element.
    // When the selected option changes, it updates the currentCaptchaType variable 
    // and shows/hides the appropriate CAPTCHA container.  
    captchaTypeSelect.addEventListener('change', () => {
        currentCaptchaType = captchaTypeSelect.value;
        if (currentCaptchaType === 'arithmetic') {
            arithmeticCaptchaContainer.classList.remove('hidden');
            imageCaptchaContainer.classList.add('hidden');
        } else if (currentCaptchaType === 'image') {
            arithmeticCaptchaContainer.classList.add('hidden');
            imageCaptchaContainer.classList.remove('hidden');
        }
        refreshCaptcha(); // Refresh when the type changes
        arithmeticError.classList.add('hidden');
        imageError.classList.add('hidden');
        captchaAttemptsError.classList.add('hidden');
        incorrectAttempts = 0;
    });

    // the generateArithmeticCaptcha() function is called to generate the initial arithmetic CAPTCHA.
    // The generateImageCaptcha() function is called to generate the initial image CAPTCHA.
    generateArithmeticCaptcha(); // Generate initial arithmetic captcha
    generateImageCaptcha(); // Generate initial image captcha

    // the preventDefault() method cancels the event if it is cancelable,
    // meaning that the default action that belongs to the event will not occur.
    // For example, this can be useful when you want to prevent a form from being submitted,
    // or to prevent a link from being followed.
    // The preventDefault() method can be called on any event object,
    // and it is commonly used in event handlers to control the behavior of the event.
    // The preventDefault() method does not stop the event from propagating (bubbling) 
    // up or down the DOM tree.
    // To stop the event from propagating, you can use the stopPropagation() method.
    registrationFormCaptcha.addEventListener('submit', function(event) {
        event.preventDefault();

        if (incorrectAttempts >= maxIncorrectAttempts) {
            captchaAttemptsError.classList.remove('hidden');
            return;
        }

        let captchaCorrect = false;
        if (currentCaptchaType === 'arithmetic') {
            const userAnswer = parseInt(arithmeticAnswerInput.value);
            if (!isNaN(userAnswer) && userAnswer === arithmeticExpectedAnswer) {
                captchaCorrect = true;
            } else {
                arithmeticError.classList.remove('hidden');
            }
        } else if (currentCaptchaType === 'image') {
            if (checkImageCaptcha()) {
                captchaCorrect = true;
            } else {
                imageError.classList.remove('hidden');
            }
        }

        if (captchaCorrect) {
            alert('Registration successful (CAPTCHA passed)! - In a real application, data would be sent to the server.');
            incorrectAttempts = 0;
            refreshCaptcha();
        } else {
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