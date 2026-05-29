const express = require('express');
const cors = require('cors');
const path = require('path');
const env = require('./server/config/env');
const database = require('./server/config/database');
const authRoutes = require('./server/routes/authRoutes');
const errorMiddleware = require('./server/middleware/errorMiddleware');
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.get('/api/health', async (req, res, next) => {
	try {
		const databaseConnected = await database.testConnection();
		res.json({
			success: true,
			server: 'ok',
			database: databaseConnected ? 'connected' : 'not connected'
		});
	} catch (error) {
		next(error);
	}
});
app.use('/api/auth', authRoutes);
app.use((req, res) => {
	res.status(404)
	   .json({
		   success: false,
		   error: 'Nie znaleziono zasobu.'
	   });
});
app.use(errorMiddleware);
app.listen(env.port, () => {
	console.log(`Serwer działa: http://localhost:${env.port}`);
});