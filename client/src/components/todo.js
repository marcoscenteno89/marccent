import React, { Fragment, useState, useEffect} from 'react';
const url = "http://localhost:5000/api/todo";
const Create = () => {
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

const Read = () => {
    const [todo, setTodo] = useState([]);
    //DELETE TODO FUNCTION
    const Delete = async id => {
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
    return <Fragment>
        <h2>To-do List</h2>
        <table>
            <tbody>
                {todo.map(todo => (
                    <tr key={todo.id}><td>{todo.description}</td><td><Update todo={todo} /></td><td><button onClick={() => Delete(todo.id)}>Delete</button></td></tr>
                ))}
            </tbody>
        </table>
    </Fragment>;
}

const Update = ({ todo }) => {
    let [description, setDescription] = useState(todo.description);  
    let updtate = async todo => {
        let desc = prompt("Description:", todo.description);
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

function Todo() {
    return (
      <Fragment>
        <Create />
        <Read />
      </Fragment>
    );
}
  
export default Todo;