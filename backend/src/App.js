const express = require("express");
const cors = require("cors")
const multer = require("multer")
const fs = require("fs")

const app = express();
//Configurações
app.set("port", process.env.PORT || 3001);
app.use(express.json());

const bodyParser = require('body-parser')
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
)

app.use(bodyParser.json())
app.use(cors())

app.use(express.static('src/assets'))

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'src/assets')
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname)
    }
})

const upload = multer({ storage }).single('file')

//Rotas
//const limpezaroute = require("./routes/limpezaroute")
const associarroute = require("./routes/associarroute")
const receberroute = require("./routes/receberroute")
const indisponibilidadeSalaroute = require("./routes/indisponibilidadeSalaroute")
const indisponibilidadePoloroute = require("./routes/indisponibilidadePoloroute")
const indisponibilidaderoute = require("./routes/indisponibilidaderoute")
//const tipoNotificacaoroute = require("./routes/tipoNotificacaoroute")
const notificacaoroute = require("./routes/notificacaoroute")
const reservaroute = require("./routes/reservaroute")
const salaroute = require("./routes/salaroute")
const ativacaoroute = require("./routes/ativacaoroute")
const acessoroute = require("./routes/acessoroute")
const poloroute = require("./routes/poloroute")
const funcionarioroute = require("./routes/funcionarioroute")
const inputroute = require("./routes/inputroute")

//Middlewares
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
        "Access-Control-Allow-Headers",
        "Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method"
    );
    res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
    res.header("Allow", "GET, POST, OPTIONS, PUT, DELETE");
    next();
});

app.use("/funcionario", funcionarioroute);
app.use("/ativacao", ativacaoroute);
app.use("/acesso", acessoroute);
app.use("/polo", poloroute);
app.use("/sala", salaroute);
app.use("/reserva", reservaroute);
//app.use("/tipoNotificacao", tipoNotificacaoroute);
app.use("/notificacao", notificacaoroute);
app.use("/indisponibilidade", indisponibilidaderoute);
app.use("/indisponibilidadePolo", indisponibilidadePoloroute);
app.use("/indisponibilidadeSala", indisponibilidadeSalaroute);
app.use("/receber", receberroute);
app.use("/associar", associarroute);
app.use("/readExcel", inputroute);
//app.use("/limpeza", limpezaroute);

app.post('/upload', (req, res) => {
    upload(req, res, (error) => {
        if (error) {
            return res.status(500).json(error)
        }

        return res.status(200).send(req.file)
    })
})

app.post('/unlink/:name', (req, res) => {
    const { name } = req.params;

    fs.unlink("./src/assets/" + name, (err) => {
        err ? console.log('Não encontrei') : console.log('Encontrei')
    })
    res.status(200).json({ name: name });
})

/*app.use('/', (req, res) => {
    res.send("Esta rota não existe. Tente outra!");
});*/

app.listen(app.get("port"), () => {
    console.log("Server starts on port " + app.get("port"));
});