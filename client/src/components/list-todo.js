import React, { Fragment, useEffect, useState } from "react";
import EditTodo from './edit-todo';
const url = "http://localhost:5000/api/todo";

const ListTodo = () => {
    const [todo, setTodo] = useState([]);

    //DELETE TODO FUNCTION

    const deleteTodo = async id => {
        try {
            let res = await fetch(`${url}/${id}`, {
                method: 'DELETE'
            });
            setTodo(todo.filter(todo => todo.id !== id));
        } catch (err) {
            console.log(err.message);
        }
    }

    const getTodo = async () => {
        try {
            const res = await fetch(url);
            const jsonData = await res.json();
            setTodo(jsonData);
        } catch (err) {
            console.log(err.message)
        }
    }

    useEffect(() => {
        getTodo();
    }, []);

    console.log(todo);

    return <Fragment>
        <h2>To-do List</h2>
        <table>
            <tbody>
                {todo.map(todo => (
                    <tr key={todo.id}><td>{todo.description}</td><td><EditTodo todo={todo} /></td><td><button onClick={() => deleteTodo(todo.id)}>Delete</button></td></tr>
                ))}
            </tbody>
        </table>
    </Fragment>;
}

export default ListTodo;