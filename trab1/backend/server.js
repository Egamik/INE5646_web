'use strict'

const app = require('./config/express')();
const port = app.get('port');

// Starts running API on port.
app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`)
});
