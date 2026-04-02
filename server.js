require('dotenv').config();
const app = require('./src/app');  
const connectDB = require('./src/config/db');



// Connect to the database before starting the server
connectDB();



const PORT = 30000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});