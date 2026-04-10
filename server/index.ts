import express from 'express';
import cors from 'cors';
import path from 'path';
import cardsRouter from './routes/cards';
import scanRouter from './routes/scan';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// API routes
app.use('/api/cards', cardsRouter);
app.use('/api/scan', scanRouter);

// Serve static files in production
const distPath = path.resolve(__dirname, '../dist');
app.use(express.static(distPath));
app.get('*', (_req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
