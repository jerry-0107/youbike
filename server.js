const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');
const dayjs = require('dayjs')

app.use(bodyParser.json());
app.use(express.static('./build'));

// app.use(express.json());

app.get(/^\/api\/get/, (req, res) => {
    console.log(req.path + req.params)
    fetch(req.path.replace("/api/get/", ""), {
        method: "GET",

    }).then(r => r.json())
        .then(res.send(r))
})

app.get('*', (req, res) => {
    res.sendFile('index.html', { root: './build' });
})

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

