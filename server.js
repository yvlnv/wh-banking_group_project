const express = require('express')
const app = express()
const {auth} = require('express-openid-connect')
const Handlebars = require('handlebars')
const expressHandlebars = require('express-handlebars')
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access')
const {User, sequelize} = require('./models')
const handlebars = expressHandlebars({
    handlebars: allowInsecurePrototypeAccess(Handlebars)
})
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.engine('handlebars', handlebars)
app.set('view engine', 'handlebars')

const authSettings = {
    routes: {
        login: false,
    },
    authRequired: false,
    auth0Logout: true,
    secret: 'this is my very secret secret',
    baseURL: 'http://localhost:3000',
    clientID: 'PjveWea1twmtpaaCwNhp48ueNFM04rkC',
    issuerBaseURL: 'https://yvlnv.eu.auth0.com'
}

app.use(auth(authSettings))

app.get('/', (req, res) => {
    if (req.oidc.user) {
        res.redirect('user_page')
    } else {
        res.render('home')
    }
})

app.get('/login', (req, res) => {
    res.oidc.login({ returnTo: '/user_page' })
});

app.get('/user_page', async (req, res) => {
    console.log(req.oidc.user)
    res.render('user_page')
})

app.listen(3000, () => {
    sequelize.sync().then(() => console.log("Running..."))
})
