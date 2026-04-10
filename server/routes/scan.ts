import { Router, Request, Response } from 'express';
import { GoogleGenAI, Type } from '@google/genai';

const router = Router();

// POST /api/scan - 名刺画像をGemini AIで解析
router.post('/', async (req: Request, res: Response) => {
  try {
    const { image, mimeType } = req.body;
    if (!image || !mimeType) {
      return res.status(400).json({ error: 'image and mimeType are required' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: 'GEMINI_API_KEY is not configured' });
    }

    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        {
          inlineData: {
            data: image,
            mimeType,
          },
        },
        'Extract the business card information from this image. If a field is not found, leave it empty. Return JSON.',
      ],
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING, description: 'Full name of the person' },
            company: { type: Type.STRING, description: 'Company name' },
            title: { type: Type.STRING, description: 'Job title or position' },
            phone: { type: Type.STRING, description: 'Phone number (mobile or work)' },
            email: { type: Type.STRING, description: 'Email address' },
            memo: { type: Type.STRING, description: 'Any other notable information like address or website' },
          },
        },
      },
    });

    const text = response.text;
    if (!text) throw new Error('No text returned from Gemini');

    const data = JSON.parse(text);
    res.json(data);
  } catch (error) {
    console.error('Scan error:', error);
    res.status(500).json({ error: 'Failed to process business card image' });
  }
});

export default router;
