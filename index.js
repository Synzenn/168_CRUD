const express = require('express');
const mysql = require('mysql2');

const app = express();
const PORT = 3000;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.send("Hello World!");
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

const db = mysql.createConnection({
    host:       'localhost',
    user:       'root',
    port:       '3309',
    password:   'Velascoggbanget1',
    database:   'mahasiswa'
});

db.connect((err) => {
    if (err){
        console.error('Error connection to the database:' + err.stack);
        return
    }
    console.log('Koneksi Berhasil!');
});

app.get('/api/mahasiswa', (req,res) =>{
    db.query('SELECT * from biodata', (err, results) =>{
        if(err){
            console.error('ERROR executing query:', +err.stack);
            res.status(500).send('Error fetching users');
            return;
        }
        res.json(results);
    });
});

app.post('/api/mahasiswa', (req,res) => {
    const {nama, alamat, agama} = req.body;
    if(!nama || !alamat || !agama){
        return res.status(400).json({ message : "Nama alamat, dan agama harus diisi."});
    }

    db.query(
        "INSERT INTO biodata (nama, alamat, agama) VALUES (?, ?, ?)",
        [nama, alamat, agama],
        (err, results) => {
            if(err) {
                console.error(err);
                return res.status(500).json({ message: "Database Error"});
            }
            res.status(201).json({ message: "User created successfully"});
        }  
    );
});

