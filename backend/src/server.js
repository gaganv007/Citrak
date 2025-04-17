const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const apiRoutes = require('./routes/api');
const authRoutes = require('./routes/auth');
const config = require('./config');

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api', apiRoutes);
app.use('/auth', authRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});