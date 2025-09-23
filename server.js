require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const { logger } = require('./middleware/logger');
const errorHandler = require('./middleware/errorHandler');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const corsOptions = require('./config/corsOptions');
const PORT = process.env.PORT || 3500;

console.log(process.env.NODE_ENV);

app.use(logger); // middleware

app.use(cors(corsOptions));

app.use(express.json()); //middleware

app.use(cookieParser()); // third party middleware

app.use('/', express.static(path.join(__dirname, '/public')));

app.use('/', require('./routes/root'));

app.all('/*splat', (req, res) => {
    res.status(404);
    if (req.accepts('html')) {
        res.sendFile(path.join(__dirname, 'views', '404.html'))
    }else if (req.accepts('json')) {
        res.json({message: `404 Not found ${splat}`});
    }else {
        res.type('txt').send('404 Not Found');
    }
});

app.use(errorHandler);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));