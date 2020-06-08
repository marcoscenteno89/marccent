import React, { Fragment, useState } from 'react';
const url = "http://localhost:5000/api/todo";
const InputTodo = () => {
    console.log(url)
    const [description, setDescription] = useState('');

    const onSubmitForm = async e => {
        e.preventDefault();
        try {
            const body = { description };
            const res = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body)
            });
            window.location = "/";
        } catch(err) {
            console.log(err);
        }
    }

    return (
        <Fragment>
            <h2>New To-do</h2>
            <form onSubmit={onSubmitForm}>
                <input type="text" value={description} onChange={e => setDescription(e.target.value)} />
                <button>+ Add</button>
            </form>
        </Fragment>
    );
}

export default InputTodo;