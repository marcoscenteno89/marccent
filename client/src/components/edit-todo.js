import React, { Fragment, useState } from 'react';
const url = "http://localhost:5000/api/todo";

const EditTodo = ({ todo }) => {
    let [description, setDescription] = useState(todo.description);
    
    let updtate = async todo => {
        let desc = prompt("Description:", todo.description);
        console.log(desc);
        if (desc !== null) {
            const body = { desc }
            try {
                const res = await fetch(`${url}/${todo.id}`, {
                    method:'PUT',
                    headers: { 'content-Type': 'application/json' },
                    body: JSON.stringify(body)
                });
                window.location = '/';
            } catch (err) {
                console.log(err.message)
            }
        }
    }
    return (
        <button onClick={() => updtate(todo)}>Edit</button>
    )
}

export default EditTodo;