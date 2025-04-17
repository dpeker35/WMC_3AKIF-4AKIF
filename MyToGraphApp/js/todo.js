// js/todo.js

document.addEventListener("DOMContentLoaded", () => { //wichtig für js, DOM: document object model,
    // API URL (Deno sunucusu port 8000'de çalışıyorsa)
    const API_URL = "http://localhost:8000/todos"; //hier arbeitet unser server, unser API läuft hier! const --> fixiert
  
    // DOM elemanlarını yakala
    const todoForm = document.getElementById("todo-form"); //damit wir etwas 'add' können
    const todoInput = document.getElementById("todo-input"); //hier schreiben wir den input rein
    const todoList = document.getElementById("todo-list"); 
  
    fetchTodos(); //fetch heisst bringen, bring die existierende todos
  
    // Form submit olduğunda yeni todo ekle
    todoForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const text = todoInput.value.trim();
      if (text) {
        addTodo(text);
        todoInput.value = "";
      }
    });
  
    function fetchTodos() { 
      fetch(API_URL) //schickt ein request an den API URL
        .then((response) => response.json()) //danach kommt antwort, die in json formatiert ist
        .then((todos) => { 
          todoList.innerHTML = "";
          todos.forEach((todo) => renderTodo(todo)); 
        })
        .catch((error) => console.error("Error fetching todos:", error)); //wenn etwas schief geht scheint in der console dieser Text auf!
    }
  
    function addTodo(text) {
      const newTodo = { //hier wird ein neues todo erstellt
        text: text,
        completed: false, //solange es nicht completed ist, wird es nicht markiert also false noch
        createdAt: new Date().toISOString(),
      };
  
      fetch(API_URL, {
        method: "POST", //mit post wirds in den server rein geschickt also man sieht es nur im background dann sehen das es eingegagnen ist!
        headers: { "Content-Type": "application/json" }, //sagt dass es mit json formatiert
        body: JSON.stringify(newTodo), 
      })
        .then((response) => response.json())
        .then((todo) => {
          renderTodo(todo); //hier wirds gelistet im server
          document.getElementById("todo-section").scrollIntoView({ behavior: "smooth" });
        })
        .catch((error) => console.error("Error adding todo:", error)); //wenn eine Fehlermeldung kommt, kommt dieser Text
    }
  
    function renderTodo(todo) { //rendertodo bringt die daten
      const li = document.createElement("li"); //die datei wird hier gelistet nachdem es zum server geschickt wurde, dann sieht man es im Bildschirm
      li.className = "list-group-item";
      li.dataset.id = todo.id;
  
      const span = document.createElement("span"); //schriftformat wird spezilaisiert
      span.textContent = todo.text;
      if (todo.completed) span.style.textDecoration = "line-through";
      li.appendChild(span); //span wird dem li hinzugefügt
  
      const btnContainer = document.createElement("div"); //für unsere Buttons!!
  
      

      // Complete / Undo button
      const completeBtn = document.createElement("button");
      completeBtn.className = "btn btn-sm btn-success me-2"; // bootstrap style geändert
      completeBtn.innerHTML = `
        <img src="assets/images/complete.png" alt="Complete Icon" class="btn-icon">
        ${todo.completed ? "Undo" : "Complete"}   
      `;//hier werden die kleinen images zu den buttons
      completeBtn.addEventListener("click", () => toggleComplete(todo, span, completeBtn));
      btnContainer.appendChild(completeBtn);
  
      // Edit butonu
      const editBtn = document.createElement("button");
      editBtn.className = "btn btn-sm btn-warning me-2"; //style farbe von bootstrap
      editBtn.innerHTML = `
        <img src="assets/images/edit.png" alt="Edit Icon" class="btn-icon">
        Edit
      `;
      editBtn.addEventListener("click", () => editTodo(todo, span, editBtn));
      btnContainer.appendChild(editBtn);
  
      // Delete butonu
      const deleteBtn = document.createElement("button");
      deleteBtn.className = "btn btn-sm btn-danger"; //sytle vom bootstrap
      deleteBtn.innerHTML = `
        <img src="assets/images/delete.png" alt="Delete Icon" class="btn-icon"> 
        Delete
      `;
      deleteBtn.addEventListener("click", () => deleteTodo(todo, li)); //hier wird der button delete löschen
      btnContainer.appendChild(deleteBtn);
  
      li.appendChild(btnContainer);
      todoList.appendChild(li);
    }
  
    function toggleComplete(todo, spanElement, buttonElement) { //wie es von complete zu undo ändert
      const updatedTodo = { completed: !todo.completed }; 
      fetch(`${API_URL}/${todo.id}`, { //hier wird die id übernommen
        method: "PATCH", //mit patch wirds geupdatet
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedTodo),
      })
        .then((response) => response.json()) //von false wird es zu true
        .then((data) => {
          todo.completed = data.completed;
          spanElement.style.textDecoration = todo.completed ? "line-through" : "none";
          buttonElement.innerHTML = `
            <img src="assets/images/complete.png" alt="Complete Icon" class="btn-icon">
            ${todo.completed ? "Undo" : "Complete"}
          `;
        })
        .catch((error) => console.error("Error updating todo:", error));
    }
  
    function deleteTodo(todo, listItem) {
      fetch(`${API_URL}/${todo.id}`, { method: "DELETE" })
        .then(() => listItem.remove()) //lösche aus von der liste
        .catch((error) => console.error("Error deleting todo:", error)); //hier gebe wieder die fehlermeldung falls ein error
    }
  
    function editTodo(todo, spanElement, editButton) {
      if (editButton.dataset.editing === "true") {
        const inputField = editButton.inputField;
        const newText = inputField.value.trim();
        if (newText === "") {
          alert("Field must be filled");
          return;
        }
        const updatedTodo = { text: newText };
        fetch(`${API_URL}/${todo.id}`, {
          method: "PATCH", //wirds geupdatet
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedTodo), //schickt das upgedatete zu json
        })
          .then((response) => response.json())
          .then((data) => {
            todo.text = data.text;
            const newSpan = document.createElement("span");
            newSpan.textContent = data.text;
            if (todo.completed) newSpan.style.textDecoration = "line-through";
            inputField.parentElement.replaceChild(newSpan, inputField);
            editButton.innerHTML = `
              <img src="assets/images/edit.png" alt="Edit Icon" class="btn-icon">
              Edit
            `;
            editButton.dataset.editing = "false";
          })
          .catch((error) => console.error("Error updating todo:", error));
      } else { //falls kein fehler, nehme die daten und speichere!
        const inputField = document.createElement("input");
        inputField.type = "text";
        inputField.className = "form-control";
        inputField.value = todo.text;
        spanElement.parentElement.replaceChild(inputField, spanElement);
        editButton.inputField = inputField;
        editButton.innerHTML = `
          <img src="assets/images/edit.png" alt="Edit Icon" class="btn-icon">
          Save
        `;
        editButton.dataset.editing = "true";
   }
}
});