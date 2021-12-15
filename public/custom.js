const container = document.querySelector(".container");

//Get Root Data
const getRoot = async() => {
    let response = await fetch("http://localhost:3000/getData");
    let data = await response.json();
    return data;
}

//Get Childs Data
const getChilds = async(id) => {
    let response = await fetch(`http://localhost:3000/getData/childs/${id}`);
    let data = await response.json();
    return data;
}

//Create Child
const createChild = async(no) =>{
    const val = prompt("Enter child Name");
    let response = await fetch("http://localhost:3000/postData/child",{
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({
          parentId:no,
          name:val
        }),       
    });
    window.location.reload(); 
}

//Display Data
const displayData = async() => {
    let root = await getRoot();
    let childs = await getChilds(root[0]._id); 

    let content =`
    <li><span id='caretRoot'>${root[0].name}</span> <button  type="button" class="btn btn-success btn-sm" onclick='createChild("${root[0]._id}")'>Add</button>
        <ul id='caretRootUl'>`
            for(i of childs){
                content+=`
                    <li  id='${i._id}_li' ><span onclick='printChild("${i._id}")'>${i.name}</span>
                        <span id="allButtons">
                            <button type="button" class="btn btn-success btn-sm" onclick='createChild("${i._id}")'>Add</button>
                            <button type="button" class="btn btn-primary btn-sm" onclick='updateChild("${i._id}")'>Update</button>
                            <button type="button" class="btn btn-danger btn-sm" onclick='deleteChild("${i._id}")'>Delete</button>
                            <button type="button" class="btn btn-dark btn-sm" onclick='moveChild("${i._id}")'>Move</button>
                        </span>
                    </li>`
            }
        `</ul>
    </li>`;
    
    document.querySelector(".container").innerHTML = `<ul> ${content} </ul>`; 
}
displayData();

//Print Nested Child Data
const printChild = async(no) =>{
    let content='<ul class="nested" >';
    let child = await getChilds(no);
    for(let i=0;i<child.length;i++){
        content += `<li  id='${child[i]._id}_li'><span onclick='printChild("${child[i]._id}")'>${child[i].name} </span>
            <button type="button" class="btn btn-success btn-sm" onclick='createChild("${child[i]._id}")'>Add</button>
            <button type="button" class="btn btn-primary btn-sm" onclick='updateChild("${child[i]._id}")'>Update</button>
            <button type="button" class="btn btn-danger btn-sm" onclick='deleteChild("${child[i]._id}")'>Delete</button>
            <button type="button" class="btn btn-dark btn-sm" onclick='moveChild("${child[i]._id}")'>Move</button>
        </li>`
    }
    content+=`</ul>`
    document.getElementById(`${no}_li`).innerHTML+=content;    
}


const updateChild = async(no) =>{
    const val = prompt("Enter new value");
    let response = await fetch(`http://localhost:3000/putData/child/${no}`,{
        method: 'PUT',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({
          name:val
        }),       
    });
    window.location.reload();
}

const deleteChild = async(no) =>{
    let response = await fetch(`http://localhost:3000/deleteData/child/${no}`,{
        method: 'DELETE',
        headers: {'Content-Type':'application/json'},       
    });
    window.location.reload();
}
const moveChild = async(no) => {
    const val = document.getElementById('moveChild').value;
    if(val===no) return false;
    let response = await fetch(`http://localhost:3000/putData/moveChild/${no}`,{
        method: 'PUT',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({
            parentId:val
        }),       
    });
    window.location.reload();
}
const displayAllNodes = async() =>{
    let response = await fetch("http://localhost:3000/allData");
    let data = await response.json();
    let content = '<option disabled>select</option>';
    data.forEach(element => {
        content+=`<option id='${element._id}' value='${element._id}'>${element.name}</option>`
    });
    document.querySelector(".moveChild").innerHTML = content;
}
displayAllNodes();

