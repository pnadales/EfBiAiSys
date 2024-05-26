const express = require('express')
const agentes = require('./data/agentes.js')
const app = express()
const jwt = require('jsonwebtoken')

app.use(express.json())

app.listen(3000, () => console.log('Your app listening on port 3000'))

const secretKey = "AgentsKey"

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html')

})

// Paso 1
app.get("/SignIn", (req, res) => {
    // Paso 2
    const { email, password } = req.query
    const agente = agentes.results.find((agente) => agente.email == email && agente.password == password);
    // Paso 4
    if (agente) {

        // Paso 5
        const token = jwt.sign({
            exp: Math.floor(Date.now() / 1000) + 10,
            data: agente
        }, secretKey);
        // Paso 6
        res.send(`
            <a href="/token?token=${token}&email=${email}"> <p> Ir a Misiones secretas </p></a>
            Bienvenido, ${email}.

            <script>
                sessionStorage.setItem('token', '${token}')
            </script>`
        );
    } else {
        // Paso 7
        res.send("Usuario o contraseña incorrecta");
    }

});

app.get("/token", (req, res) => {
    // Paso 2 Tomar token del queryStrings
    const { token, email } = req.query
    // Paso 3 Verificar el token
    const respuesta = `<h2> Bienvenido </h2>
Bienvenido, ${email}.`

    jwt.verify(token, secretKey, (err) => {
        res.send(err ? "Token inválido" : respuesta)
    });
});
