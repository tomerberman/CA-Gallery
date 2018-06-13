"use strict";

var gTodos;
var gTodosFilter = "All";
var gTodosSort = "By Text";
var TODOS_KEY = "todosApp";
var gId = Math.floor( Math.random()*100000000);
var gRenderedTodos;

function init() {
  console.log("Todo App");
  gTodos = createTodos();
  renderCounts();
  renderTodos();
}

function todoClicked(elTodo, id) {
  var todoIdx = getIndexbyId(id);
  gTodos[todoIdx].isDone = !gTodos[todoIdx].isDone;
  elTodo.classList.toggle("done");
  renderCounts();
  saveToStorage(TODOS_KEY, gTodos);
}

function deleteTodo(ev, id) {
  ev.stopPropagation();
  console.log("Deleting Todo", id);

  var todoIdx = getIndexbyId(id);
  gTodos.splice(todoIdx, 1);
  renderTodos();
  renderCounts();
  saveToStorage(TODOS_KEY, gTodos);
}

function getIndexbyId(id) {
  for (var i = 0; i < gTodos.length; i++) {
    if (gTodos[i].id === id) break;
  }
  return i;
}

function addTodo() {
  // console.log('Add Todo');
  var todoTxt = "";
  var importance = 0;
  while (!todoTxt) {
    todoTxt = prompt("What do you want todo?..");
  }
  while (importance < 1 || importance > 3 || isNaN(importance)) {
    importance = prompt(
      "Enter importance between 1 (most important) and 3 (less important)"
    );
  }

  var newTodo = createTodo(todoTxt, Date.now(), importance);
  gTodos.unshift(newTodo);
  renderCounts();
  document.querySelector(".status-filter").value = "All";
  gTodosFilter = "All";
  renderTodos();
  saveToStorage(TODOS_KEY, gTodos);
}

function slideTodos(id, upwards,ev) {
    ev.stopPropagation();
  console.log("slide id upwards:", id, upwards);
  var idx = getIndexbyId(id);
  var temp = gRenderedTodos[idx];
  if (upwards) {
    if (idx > 0) {
        console.log('temp=',temp);
        console.log(gRenderedTodos[idx]);
        console.log(gRenderedTodos[idx-1]);
      gRenderedTodos[idx] = gRenderedTodos[idx - 1];
      gRenderedTodos[idx - 1] = temp;
    }
  } else {
    if (idx < gRenderedTodos.length - 1) {
        console.log('temp=',temp);
        console.log(gRenderedTodos[idx]);
        console.log(gRenderedTodos[idx+1]);

      gRenderedTodos[idx] = gRenderedTodos[idx + 1];
      gRenderedTodos[idx + 1] = temp;
    }
  }
  renderTodos(gRenderedTodos);
}

function setSort(strSort) {
  gTodosSort = strSort;
  renderTodos();
  // console.log('strSort',strSort);
}

function setFilter(strFilter) {
  gTodosFilter = strFilter;
  var str = "";
  switch (gTodosFilter) {
    case "All":
      str = "No Todos";
      break;
    case "Active":
      str = "No Active Todos";
      break;
    case "Done":
      str = "No Done Todos";
      break;
  }
  document.querySelector(".empty-note").innerText = str;
  renderTodos();
}

/*
 <li class="todo" onclick="todoClicked(this)">
    Todo 1
    <div class="btns">
        <button class="btn btn-danger" onclick="deleteTodo(event, 0)">x</button>
    </div>
</li>

*/

function renderTodos(items) {
  var strHTML = "";
  if (items) var todos = gRenderedTodos;
  else var todos = getTodosForDisplay();

  todos.forEach(function(todo, idx) {
    var date = new Date(todo.createdAt);
    var minutes = date.getMinutes();
    if (minutes < 10) minutes = "0" + minutes;
    var str =
      todo.txt +
      ", Created At: " +
      date.toDateString() +
      " , " +
      date.getHours() +
      ":" +
      minutes +
      " , Importance: " +
      todo.importance;

    var className = todo.isDone ? "done" : "";
    strHTML += `
            <li class="todo ${className}" onclick="todoClicked(this, ${
      todo.id
    })">
                ${str}  
                <div class="btns">
                    <button class="btn btn-danger" onclick="deleteTodo(event, ${
                      todo.id
                    })">x</button>
                    <button class="btn btn-up" onclick="slideTodos(${
                      todo.id
                    },true,event)">&#8679</button>
                    <button class="btn btn-down" onclick="slideTodos(${
                      todo.id
                    },false,event)">&#8681</button>
                </div>  
            </li>
            `;
  });
  document.querySelector(".todos").innerHTML = strHTML;
  gRenderedTodos = todos.slice(0);

  if (todos.length < 1) {
    document.querySelector(".empty-note").classList.add("show");
  } else document.querySelector(".empty-note").classList.remove("show");
  console.log("todos.length ===== ", todos.length);
}

function createTodos() {
  var todos = loadFromStorage(TODOS_KEY);
  if (todos) return todos;
  todos = [];
  todos.push(createTodo("Play with HTML5", 1520000000000, 3));
  todos.push(createTodo("Learn Javascript", 1480000000000, 2));
  todos.push(createTodo("Master CSS", 1440000000000, 1));
  return todos;
}

function createTodo(txt, createdAt, importance) {
  return {
    txt: txt,
    isDone: false,
    createdAt: createdAt,
    importance: importance,
    id: gId++
  };
}

function renderCounts() {
  var activeCount = 0;
  gTodos.forEach(function(todo) {
    if (!todo.isDone) activeCount++;
  });
  document.querySelector(".total-count").innerText = gTodos.length;
  document.querySelector(".active-count").innerText = activeCount;
}

function getTodosForDisplay() {
  var todos = [];
  gTodos.forEach(function(todo) {
    if (
      gTodosFilter === "All" ||
      (gTodosFilter === "Active" && !todo.isDone) ||
      (gTodosFilter === "Done" && todo.isDone)
    ) {
      todos.push(todo);
    }
  });

  switch (gTodosSort) {
    case "By Text":
      todos = todos.sort(compareText);
      break;
    case "By Date":
      todos = todos.sort(compareDate);
      break;
    case "By Importance":
      todos = todos.sort(compareImportance);
      break;
  }
  return todos;
}

function compareText(a, b) {
  var aLower = a.txt.toLowerCase();
  var bLower = b.txt.toLowerCase();
  if (aLower > bLower) return 1;
  if (aLower < b.Lower) return -1;
  return 0;
}

function compareDate(a, b) {
  if (a.createdAt > b.createdAt) return 1;
  if (a.createdAt < b.createdAt) return -1;
  return 0;
}

function compareImportance(a, b) {
  if (a.importance > b.importance) return 1;
  if (a.importance < b.importance) return -1;
  return 0;
}
