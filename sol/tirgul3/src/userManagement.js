const html = document.documentElement;
const userName = document.getElementById('userName');
let editable = {
    ccell : null,
    cval : null,
    edit: cell=>{
        editable.ccell = cell;
        editable.cval = cell.innerHTML;
        console.log(editable.cval)
        cell.classList.add("edit");
        cell.contentEditable = true;
        cell.focus();
        cell.onblur = editable.done;
        cell.onkeydown = e =>{
            if(e.key == "Enter"){ editable.done(); }
            if(e.key == "Escape"){ editable.done(1); }
        }
    },
    done: discard =>{
        editable.ccell.onblur = "";
        editable.ccell.onkeydown = "";
        editable.ccell.classList.remove("edit");
        editable.ccell.contentEditable = false;
        if(discard === 1){ //if escape
            editable.ccell.innerHTML = editable.cval;
        }
        if(editable.ccell.innerHTML != editable.cval){
            console.log("change done");
            //save changes in file
        }
    }
}
// Initial load for staticTableJS
window.onload = function() {
    let user = JSON.parse(localStorage.getItem('currentUser'))
    userName.innerHTML = "Welcome " + user.username
    fetch('db.json')
        .then(response =>  response.json())
        .then(jsonData => {
            populateTable('usersData', jsonData);
    });
    
};

function populateTable(tableId, jsonData) {
    const table = document.getElementById(tableId);
    const thead = table.querySelector('thead tr');
    const tbody = table.querySelector('tbody');

    thead.innerHTML = '';
    tbody.innerHTML = '';
    console.log(jsonData)
    if (jsonData.users.length > 0) {
        const headers = Object.keys(jsonData.users[0]);
        headers.forEach(header => {
            if(header != "password"){
                const th = document.createElement('th');
                th.textContent = header;
                th.classList.add('px-4', 'py-2', 'text-left');
                thead.appendChild(th);
            }
        });
        
        jsonData.users.forEach(item => {
            const tr = document.createElement('tr');
            headers.forEach(header => {
                if(header != "password"){
                    const td = document.createElement('td');
                    td.textContent = item[header];
                    td.classList.add('border', 'px-4', 'py-2');
                    td.addEventListener("dblclick", ()=>editable.edit(td))
                    tr.appendChild(td);
                }
            });
            tbody.appendChild(tr);
        }); 
    } else {
        const tr = document.createElement('tr');
        const td = document.createElement('td');
        td.textContent = "No data found in JSON.";
        tbody.appendChild(tr);
    }
}