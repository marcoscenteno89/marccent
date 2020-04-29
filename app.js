const express = require('express');
const app = express()

app.get('/', (req, res) => res.send('helolo lalala'));

app.listen(3000, () => {
    console.log('Marccent running on port 3000');
})