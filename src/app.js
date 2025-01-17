const express = require('express');
const hbs = require('hbs');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;
const geocode = require('./utils/geocode');
const forecast = require('./utils/prediksiCuaca');
const getNews = require('./utils/getnews');  // Mengimpor fungsi getNews

// Set view engine
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, '../templates/views'));

// Menyajikan file statis
app.use(express.static(path.join(__dirname, '../templates')));
app.use(express.static(path.join(__dirname, '../public')));

// Set partials
hbs.registerPartials(path.join(__dirname, '../templates/partials'));

// Rute
app.get('/', (req, res) => {
    res.render('index', {
        judul: 'Aplikasi Cuaca',
        nama: 'Yollanda Febrida'
    });
});

// Rute untuk info cuaca
app.get('/infocuaca', (req, res) => {
    if (!req.query.address) {
        return res.send({
            error: 'Kamu harus memasukan lokasi yang ingin dicari'
        });
    }
    geocode(req.query.address, (error, { latitude, longitude, location } = {}) => {
        if (error) {
            return res.send({ error });
        }
        forecast(latitude, longitude, (error, dataPrediksi) => {
            if (error) {
                return res.send({ error });
            }
            res.send({
                prediksiCuaca: dataPrediksi,
                lokasi: location,
                address: req.query.address
            });
        });
    });
});

// Rute untuk halaman tentang
app.get('/tentang', (req, res) => {
    res.render('tentang', {
        judul: 'Tentang Saya',
        nama: 'Yollanda febrida',
        tempatLahir: 'Tapan',
        tanggalLahir: '26 Februari 2002 ',
        jenisKelamin: 'Wanita',
        Orang: 'Indonesia',
        pendidikan: 'Informatika',
        email: 'Yollandafebrida121@gmail.com',
        nomorHP: '083844634534'
    });
});


// Rute untuk info berita
app.get('/berita', (req, res) => {
    getNews('general', (error, articles) => {  // Misalnya kategori 'general'
        if (error) {
            return res.send({ error });
        }
        res.render('berita', {
            judul: 'Daftar Berita',
            nama: 'Yollanda Febrida',
            articles: articles
        });
    });
});

// Rute untuk halaman bantuan
app.get('/bantuan', (req, res) => {
    res.render('bantuan', {
        judul: 'Bantuan',
        nama: 'Yollanda Febrida'
    });
});

// Rute untuk halaman penjelasan
app.get('/penjelasan', (req, res) => {
    res.render('penjelasan', {
        judul: 'Penjelasan Aplikasi Cek Cuaca',
        nama: 'Yollanda Febrida'
    });
});

// Wildcard route untuk halaman tidak ditemukan
app.get('*', (req, res) => {
    res.render('404', {
        pesanKesalahan: 'Halaman tidak ditemukan.'
    });
});


// Jalankan server
app.listen(port, () => {
    console.log('Server berjalan pada port '+ port);
});
