let users =[]
const file="db.json"

function initUsers() {
    let rawFile = new XMLHttpRequest();
    rawFile.open("GET", file , false);
    rawFile.onreadystatechange = function () {
    if(rawFile.readyState === 4)  {
        if(rawFile.status === 200 || rawFile.status == 0) {
            let allText = rawFile.responseText;
            let data = JSON.parse(allText)
            users = data.users
       }
    }
  }
  rawFile.send(null);
}

function find(nameOrMail){
    if(users.length==0)
        initUsers()
    return users.find(u=>u.username === nameOrMail || u.email === nameOrMail);
}
function updateData(){
    let data ='{ "users": '+JSON.stringify(users) + '}'
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.download = file; 
    a.href = url;
    a.click(); 
    URL.revokeObjectURL(url);
}

function add(username,email,password,dob,isAdmin){
    //init users
    initUsers()
    //create new user and add to array
    let user = {"username":username, "email":email,"password":password,"dob":dob,"isAdmin":isAdmin}
    users.push(user)
    //update json file
    updateData()
}

