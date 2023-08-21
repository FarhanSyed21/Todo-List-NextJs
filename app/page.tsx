"use client"
import { useEffect } from "react";
import { useState } from "react"

type Todo = {
  _id: string,
  text: string | null,
  completed: boolean
}

export default function Home({ }) {
  const [isLoading, setIsLoading] = useState(true);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodoText, setNewTodoText] = useState<string>("");
  const [editTodo, setEditTodo] = useState<Todo | null>(null);

  useEffect(() => {
    fetch("http://localhost:3000/api/todo")
    .then((res) => res.json())
    .then((data) => {
      setTodos(data);
      setIsLoading(false);
    })
  }, [])

  const addTodo = async() => {
    if(!newTodoText) return;

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/todo`,
    {
      method: "POST",
      body: JSON.stringify({ text: newTodoText }),
      headers: {
        'Content-Type' : 'application/json'
      }
    })
    const data = await response.json();
    console.log("data", data);
    setTodos([...todos, data]);
    setNewTodoText("");
  }

  const handleEdit = (todo:Todo) => {
    setEditTodo(todo)
  }

  const handleSave = async() => {
    if(!editTodo) return;

    const response = await fetch("http://localhost:3000/api/todo", {
      method: "PUT",
      body:JSON.stringify({ id: editTodo._id, text: editTodo.text, completed: editTodo.completed}),
      headers: {
        'Content-Type' : 'application/json'
      }
    })

    if(response.status === 200){
      setTodos(
        todos.map((todo:Todo) => todo._id === editTodo._id ? {...todo, text: editTodo.text} : todo)
      )
      setEditTodo(null)
    }
  }

  const deleteTodo = async(id:string) => {
    const response = await fetch("http://localhost:3000/api/todo", {
      method: "DELETE",
      body: JSON.stringify({ id }),
      headers: {
        'Content-Type' : 'application/json',
      },
    });
    if(response.status === 200){
      setTodos(todos.filter((todo: Todo)=> todo._id !== id));
    }
  }

  const toggleTodo = async(id: string, completed:boolean) => {
    const response = await fetch("http://localhost:3000/api/todo", {
      method: "PUT",
      body: JSON.stringify({ id, completed: !completed }),
      headers: {
        'Content-Type' : 'application/json',
      },
    });
    if(response.status === 200){
      setTodos(todos.map((todo: Todo)=> todo._id === id ? {...todo, completed: !completed} : todo));
    }
  }

  return (
    <div className="font-mulish grid lg:place-items-start place-items-center w-full bg-black text-purple-500 min-h-screen">
      <div className="flex lg:flex-row flex-col gap-5 lg:justify-start justify-center lg:items-start items-center w-full mx-auto">
        <div className="sm:w-9/12 lg:w-6/12 w-full px-4 lg:my-10 flex flex-col justify-center items-center">
          <h1 className="lg:text-5xl text-3xl py-8 lg:pt-14 uppercase font-medium text-purple-600">Solve it out</h1>
          <h1 className="text-4xl py-8 lg:py-0 lg:pt-4 lg:pb-14 text-yellow-600">Todo List</h1>
          { editTodo ? (
              <>
                <input type="text" className="w-full lg:w-8/12 bg-black border border-yellow-400 py-4 text-xl rounded-lg text-purple-400 outline-none px-3" value={editTodo.text!} onChange={(e) => setEditTodo({...editTodo, text: e.target.value})} />
                <button className="bg-slate-800 px-6 py-2 rounded-lg my-7 text-green-400 text-lg uppercase font-semibold" onClick={handleSave}>Save</button>
              </>
          ):(
              <>
                <input type="text" placeholder="write here..." className="w-full lg:w-8/12 bg-black border border-purple-400 py-4 text-xl rounded-lg text-purple-400 outline-none px-3" value={newTodoText} onChange={(e) => setNewTodoText(e.target.value)} />
                <button className="bg-slate-800 px-6 py-2 rounded-lg my-7 text-green-400 text-lg uppercase font-semibold" onClick={addTodo}>Add</button>
              </>
          )}
        </div>
        <ul className="sm:w-9/12 lg:w-5/12 w-full px-4 flex flex-col justify-center items-center my-6 py-6">
          {isLoading && (<p className="text-pink-600 text-2xl italic my-10">Loading...</p>)}
          {!isLoading && todos && todos.length === 0 ? (<div className="text-pink-600 text-2xl italic my-10">
            (No todos present in the list)
          </div>
          ) : (
           <>
              {!isLoading && todos && todos.map((todo:Todo) => (
                <li key={todo._id} className="bg-slate-900 px-6 py-5 rounded-lg my-3 hover:text-green-400 text-lg w-full flex justify-between items-start">
                  <div className="flex justify-start items-start w-8/12">
                    <input type="checkbox" checked={todo.completed} onChange={() => toggleTodo(todo._id, todo.completed)} className="w-5 h-5 cursor-pointer mt-1" />
                    <span className={`${todo.completed ? "line-through" : "list-none"} px-4 w-full text-yellow-500`}>{todo.text}</span>
                  </div>
                  <div className="w-4/12 md:w-3/12 flex">
                    <button onClick={() => handleEdit(todo)} className="text-sky-400 upprcase md:text-base text-sm px-3 hover:text-sky-600">Edit</button>
                    <button className="text-pink-400 upprcase md:text-base text-sm px-3 hover:text-pink-600" onClick={() => deleteTodo(todo._id)}>Delete</button>
                  </div>
                </li>
              ))}
           </> 
          )}
        </ul>
      </div>
    </div>
  )
}
