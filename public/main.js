const myForm = document.getElementById("my-form")
let inputId = document.getElementById("input-id")
const myList = document.getElementById("item-list")

const itemTemplate = (item) => {
return `<li><span class="my-list">${item.task} </span><div class="btn-div">
  <button class="updateBtn btn" data-id=${item._id}>Edit</button>
  <button class="deleteBtn btn"  data-id=${item._id}>Delete</button> 
  </div></li>`
}
let ourHtml = items.map((e) => itemTemplate(e)).join('')
// client side rendering
myList.insertAdjacentHTML('beforeend', ourHtml)
// Insert feature
myForm.addEventListener("submit", (e) => {
  e.preventDefault()
  axios.post("myAction", {text:inputId.value}).then((response) => {
  myList.insertAdjacentHTML("beforeend", itemTemplate(response.data))
  inputId.value= ''
  inputId.focus()
  }).catch( ()=> console.log("error"))
})
// implementing delete and update feature for client side
document.addEventListener("click", (e) => {
  // Delete feature
  if (e.target.classList.contains("deleteBtn")) {
    if (confirm("do you want to really want to delete this task")) {
      axios.post('/deleteItem', {id: e.target.getAttribute("data-id")}).then(() => e.target.parentElement.parentElement.remove()).catch(()=> console.log('error'))
    }
  }
  //update feature
  if (e.target.classList.contains("updateBtn")) {
   let inputItem = prompt('enter new task',e.target.parentElement.parentElement.querySelector(".my-list").innerHTML)
    if (inputItem) {
      axios.post("/updateItem", {text: inputItem, id: e.target.getAttribute('data-id') }).then(() => {
        e.target.parentElement.parentElement.querySelector(".my-list").innerHTML = inputItem
      }).catch(() => console.log('error 000'))
    }
  }
})
