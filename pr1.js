
const grList = document.querySelector(".grocery_form");
const grocery = document.getElementById("grocery_input");
const groc_list = document.querySelector(".grocery_list");
const submitBtn = document.querySelector(".submit_btn");
const clearBtn = document.querySelector(".delete_all_btn");


let editElement;
let editFlag = false;
let editID = "";

window.addEventListener("DOMContentLoaded", setupItems);

grList.addEventListener('submit', addItem);
function addItem(e) {
    e.preventDefault();
    console.log(grocery.value);
    const value = grocery.value;
    const id = new Date().getTime().toString();
    if (value && !editFlag) {
        console.log("add");
        const element = document.createElement('article');
        element.classList.add('grocery_item');

        const attr = document.createAttribute('data_id');
        attr.value = id;
        element.setAttributeNode(attr);
        element.innerHTML = `
        <p className="title">${value}</p>
        <button type="button" class="delete_btn">delete</button>
        <button type="button" class="edit_btn">edit</button>
        `;
        const deleteBtn = element.querySelector('.delete_btn');
        const editBtn = element.querySelector('.edit_btn');
        deleteBtn.addEventListener('click', deleteItem);
        editBtn.addEventListener('click', editItem);

        groc_list.appendChild(element);
        //displayAlert("added","success");
        addToLocalStorage(id, value);
        setBackToDefault();
    }
    else if (value && editFlag) {
        console.log("edit");
        editElement.innerHTML = value;
    
        editLocalStorage(editID, value);
        setBackToDefault();
    }
    else {
        console.log("no input");
        //alert.textContent = "검색어가 없습니다.";
        //alert.classList.add("alert_danger");

    }
}

// //알람설정
// function displayAlert(text,action){
//     alert.textContent = text;
//     alert.classList.add(`alert-${action}`);
// }

// //알람 지워지기
// setTimeout(function(){
//     alert.textContent = text;
//     alert.classList.add(`alert-${action}`);
// },1000)

function setBackToDefault() {
    grocery.value = '';
    editFlag = false;
    editID = "";
    submitBtn.textContent = "submit";
}


function addToLocalStorage(id, value) {
    console.log("add local");
    const grocery = { id, value };
    let items = getLocalStorage();
    items.push(grocery);
    localStorage.setItem("groc_list", JSON.stringify(items));
}

function getLocalStorage() {
    return localStorage.getItem("groc_list")
        ? JSON.parse(localStorage.getItem("groc_list"))
        : [];
}

function removeFromLocalStorage(id) {
    let items = getLocalStorage();

    items = items.filter(function (item) {
        if (item.id !== id) {
            return item;
        }
    });
    localStorage.setItem("groc_list", JSON.stringify(items));
}

function editLocalStorage(id, value) {

    console.log("in edit local st");
    let items = getLocalStorage();

    items = items.map(function (item) {
        if (item.id === id) {
            item.value = value;
        }
        return item;
    });
    localStorage.setItem("groc_list", JSON.stringify(items));
}

clearBtn.addEventListener("click", clearItems);
function clearItems() {
    const items = document.querySelectorAll('.grocery_item');
    if (items.length > 0) {
        items.forEach(function (item) {
            groc_list.removeChild(item);
        });
    }
    setBackToDefault();
    localStorage.removeItem("groc_list");
}

function deleteItem(e) {
    const element = e.currentTarget.parentElement;
    const id = element.dataset.id;
    groc_list.removeChild(element);
    if (groc_list.children.length === 0) {

    }

    setBackToDefault();
    removeFromLocalStorage(id);
}

function editItem(e) {
    const element = e.currentTarget.parentElement;
    editElement = e.currentTarget.previousElementSibling.previousElementSibling;
    grocery.value = editElement.innerHTML;
    editFlag = true;
    editID = element.dataset.id;
    submitBtn.textContent = "edit";
}


function setupItems() {
    let items = getLocalStorage();

    if (items.length > 0) {
        items.forEach(function (item) {
            createListItem(item.id, item.value);
        });
    }
}

function createListItem(id, value) {
    const element = document.createElement("article");
    let attr = document.createAttribute("data_id");
    attr.value = id;
    element.setAttributeNode(attr);
    element.classList.add("grocery_item");
    element.innerHTML = `
  <p class="title">${value}</p>
  <button type="button" class="delete_btn">delete</button>
  <button type="button" class="edit_btn">edit</button>
  `;
    // add event listeners to both buttons;
    const deleteBtn = element.querySelector(".delete_btn");
    deleteBtn.addEventListener("click", deleteItem);
    const editBtn = element.querySelector(".edit_btn");
    editBtn.addEventListener("click", editItem);

    // append child
    groc_list.appendChild(element);
}