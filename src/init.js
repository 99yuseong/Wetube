import 'regenerator-runtime';
import 'dotenv/config';
import './db';
import app from './server';

const PORT = process.env.PORT || 3000;

app.listen(PORT, () =>
    console.log('✅ server is Ready! http://localhost:3000')
);
