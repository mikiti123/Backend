const express = require('express');
const cookieParser = require("cookie-parser");
const mongoose = require('mongoose');
const session = require('express-session');
const klient = require('./models/Klient');
const ciasteczko = require('./models/Cookie');
const artykuly = require('./models/Artykuly');
const zamowienia = require('./models/Zamowienia');
const koszt = require('./models/koszt');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const server = express();
server.use(express.json());
server.set('view engine', 'ejs');
server.use(cookieParser());
const uri = "mongodb+srv://Milosz:haslo123@cluster0.xgxivbv.mongodb.net/database_first?retryWrites=true&w=majority&appName=Cluster0";
mongoose.connect(uri);
run();
async function run() {
    try {
        async function sprawdzanie(el, o) {
            if (Object.keys(el).length == 0) {
                return false;
            }
            else {
                for (var elem in el) {
                    const temp = await ciasteczko.findOne({ name: elem.toString(), value: el[elem] });
                    if (temp != null) {
                        if (o == 1) {
                            return temp.login;
                        }
                        else if (o == 0) {
                            return true;
                        }
                        else {
                            return temp.name;
                        }
                    }
                }
                return false;
            }
        }
        server.listen(3000);
        server.use(express.static('public'));
        server.delete('/wyloguj', async (req, res) => {
            var val = await sprawdzanie(req.cookies, 2);
            if (val == false) {
                res.status(400).json({ message: "Failed" });
            }
            else {
                await ciasteczko.deleteOne({ login: req.body.login });
                res.clearCookie(val);
                res.status(200).json({ message: "Success" });
            }
        });
        server.get('/wiecej', async (req, res) => {
            var val = await sprawdzanie(req.cookies, 1);
            if (val == false) {
                res.status(405).redirect('log');
            }
            else {
                const kl = await klient.findOne({login: val});
                res.render('wiecej', { login: val, data:kl.register_date });
            }
        });
        server.post('/autoryzacja', async (req, res) => {
            if (req.body.login.replace(/\s/g, '') == "" || req.body.haslo.replace(/\s/g, "") == "") {
                res.status(511).json({ message: "brak hasla lub loginu" });
            }
            else {
                const user = await klient.findOne({ login: req.body.login });
                if (user == null) {
                    res.status(401).json({ message: 'nieprawidlowe haslo lub login' });
                }
                else {
                    bcrypt.compare(req.body.haslo, user.haslo, async function (err, result) {
                        if (err) {
                            return;
                        }
                        if (result == true) {
                            const generator = `cookie-${uuidv4()}`;
                            res.cookie(generator, 'value');
                            await ciasteczko.create({ name: generator, value: 'value', login: req.body.login });
                            res.status(200).json({ message: "Success" });
                        }
                        else {
                            res.status(401).json({ message: 'nieprawidlowe haslo' });
                        }
                    });
                }

            }
        });
        server.post('/zarejestruj', async (req, res) => {
            const user = await klient.findOne({ login: req.body.login });
            if (user == null) {
                bcrypt.hash(req.body.haslo, 10, async (err, hash) => {
                    if (err) {
                        return;
                    }
                    const some = await klient.create({ login: req.body.login, haslo: hash });
                })
                res.status(200).json({ message: 'Success' });
            }
            else {
                res.status(409).json({ massage: 'Conflict: resource already exists' });
            }
        });
        server.get('/', (req, res) => {
            res.render('index');
        });
        server.get('/rej', async (req, res) => {
            var val = await sprawdzanie(req.cookies, 0);
            if (val == true) {
                res.status(302).redirect('wiecej');
            }
            else {
                res.status(200).render('rej');
            }
        });
        server.get('/log', async (req, res) => {
            var val = await sprawdzanie(req.cookies, 0);
            if (val == true) {
                res.status(302).redirect('wiecej');
            }
            else {
                res.status(200).render('log');
            }
        });
        server.get('/zamowienia', async (req, res) => {
            var val = await sprawdzanie(req.cookies, 1);
            if (val == false) {
                res.status(405).redirect('log');
            }
            else {
                check = await zamowienia.findOne({ login_klienta: val });
                if (check == null) {
                    res.status(200).render('zamowienia_bez', { login: val });
                } else {
                    const zamow = await zamowienia.find({ login_klienta: val });
                    const total = [];
                    var odmierz = 0;
                    zamow.forEach(async function (element) {
                        const ile = await koszt.findOne({ id_zam: element.id });
                        total.push(ile);
                        odmierz += 1;
                        if (odmierz == zamow.length) {
                            res.status(200).render('zamowienia', { zamowienie: zamow, koszty: total });
                        }
                    });
                }
            }
        });
        server.post('/zam', async (req, res) => {
            var val = await sprawdzanie(req.cookies, 1);
            if (val == false) {
                res.status(401).json({ message: "FAILED" });
            }
            else {
                if (req.body.length == 0) {
                    res.status(204).json({ message: "Nothing to add / empty content" });
                }
                else {
                    if (req.body.length > 0) {
                        const wygeneruj = `Zamowienie-${uuidv4()}`;
                        await zamowienia.create({ id: wygeneruj, login_klienta: val, kupione: req.body });
                        res.status(200).json({ message: "Success :)" });
                    }
                    else {
                        res.status(204).json({ message: "FAILED" });
                    }
                }
            }
        });
        server.get('/zam/szczegolowe', async (req, res) => {
            var val = await sprawdzanie(req.cookies, 1);
            if (val == false) {
                res.status(405).redirect('/log');
            }
            else {
                const zam = await zamowienia.findOne({ login_klienta: val }, {}, { sort: { data: -1 } });
                const artykl = await artykuly.find();
                res.status(200).render('zamowienie', { zamowienie: zam, artykul: artykl });
            }
        });
        server.post('/koszt', async (req, res) => {
            var val = await sprawdzanie(req.cookies, 1);
            if (val == false) {
                res.status(401).json({ message: "FAILED" });
            }
            else {
                await koszt.create(req.body);
                res.status(200).json({ message: "Success" });
            }
        });
        server.get('/zam/wybrane', async (req, res) => {
            var val = await sprawdzanie(req.cookies, 1);
            if (val == false) {
                res.status(401).json({ message: "FAILED" });
            }
            else {
                const som = await zamowienia.findOne({ id: req.query.id });
                const kos = await koszt.findOne({ id_zam: req.query.id }, 'cena');
                const article = await artykuly.find();
                res.status(200).render('szczegolne', { zamowienie: som, koszty: kos, artykul: article });
            }
        });
        server.delete('/usun', async (req, res) => {
            const zam = await zamowienia.find({ login_klienta: req.body.login });
            var timer = 0;
            if (zam.length == 0) {
                await ciasteczko.deleteMany({ login: req.body.login });
                await klient.deleteOne({ login: req.body.login });
                res.clearCookie(Object.keys(req.cookies).toString());
                res.status(200).json({ message: "Success" });
            }
            else {
                zam.forEach(async function (element) {
                    await koszt.deleteOne({ id_zam: element.id });
                    await element.deleteOne();
                    timer += 1;
                    if (timer == zam.length) {
                        await ciasteczko.deleteOne({ login: req.body.login });
                        await klient.deleteOne({ login: req.body.login });
                        res.clearCookie(Object.keys(req.cookies)[0].toString());
                        res.status(200).json({ message: "Success" });
                    }
                });
            }

        });
        server.use((req, res) => {
            res.status(404).render('404');
        });

    } catch (e) {
        console.log(e);
    }
}