const html = document.documentElement;
const loginForm = document.getElementById('loginForm');
const loginMessage = document.getElementById('loginMessage');

loginForm.addEventListener('submit', function(event) {
    event.preventDefault(); 

    const usernameOrEmail = document.getElementById('userInput').value;
    const password = document.getElementById('passInput').value;

    let nameOrEmail = 'test';
    let pass = 'password';
    
    let user = find(usernameOrEmail)

    if(user != undefined){
        nameOrEmail = user.username;
        pass = user.password;
    }

    if (usernameOrEmail === nameOrEmail && password === pass) {
        loginMessage.textContent = 'Login successful!';
        loginMessage.classList.remove('text-red-500');
        loginMessage.classList.add('text-green-500');
        localStorage.setItem('currentUser', JSON.stringify(user));
 	    if(user.isAdmin == true)
            window.open("/src/userManagement.html", "_self");
    } else {
        loginMessage.textContent = 'Invalid username/email or password.';
        loginMessage.classList.remove('text-green-500');
        loginMessage.classList.add('text-red-500');
    }
});