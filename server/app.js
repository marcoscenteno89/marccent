const path = require('path');
const express = require('express');
const app = express();
const cors = require('cors');

//MIDDLEWARE
app.use(cors());
app.use(express.json());

const db = require("./models/models.js");

//TO-DO
// app.get('/api/todo', async (req, res) => {
//     try {
//         db.all('SELECT * FROM todo', (err, all) => { 
//             if (err) console.log(err.message);
//             res.json(all);
//         });
//     } catch (err) {
//         console.log(err.message);
//     }
// });
// app.post('/api/todo', async (req, res) => {
//     try {
//         let { name, description } = req.body;
//         let cmd = db.run('INSERT INTO todo (description, name) VALUES($1, $2)', [description, name]);
//         res.json(cmd);
//     } catch (err) {
//         console.log(err.message);
//     }
// });
// app.get('/api/todo/:id', async (req, res) => {
//     try {
//         let { id } = req.params;
//         let cmd = db.get('SELECT * FROM todo WHERE id = $1', [id], (err, row) => {
//             if (err) return console.error(err.message);
//             res.json(row);
//         });
//     } catch (err) {
//         console.log(err.message);
//     }
// });
// app.put('/api/todo/:id', async (req, res) => {
//     try {
//         let { id } = req.params;
//         let { name, description } = req.body;
//         let cmd = db.get('UPDATE todo SET name = $1, description = $2 WHERE id = $3', [name, description, id], (err, row) => {
//             if (err) return console.error(err.message);
//             res.json(`Row(s) updated ${this}`);
//         });
//     } catch (err) {
//         console.log(err.message);
//     }
// });
// app.delete('/api/todo/:id', async (req, res) => {
//     try {
//         let { id } = req.params;
//         let cmd = db.run('DELETE FROM todo WHERE id = $1', id, (err) => {
//             res.json(`Row(s) deleted ${this}`);
//         });
//     } catch (err) {
//         console.log(er.message);
//     }
// });

//THEMES
// app.get('/api/theme', async (req, res) => {
//     try {
//         db.all('SELECT * FROM theme', (err, all) => { 
//             if (err) console.log(err.message);
//             console.log(all);
//             res.json(all);
//         });
//     } catch (err) {
//         console.log(err.message);
//     }
// });

app.use(express.static(path.join(__dirname, 'static')));

app.listen(5000);