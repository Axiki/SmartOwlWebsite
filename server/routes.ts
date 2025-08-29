import { Router } from 'express';
import { z } from 'zod';

const router = Router();

// Contact form schema
const contactSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Valid email is required'),
  phone: z.string().optional(),
  message: z.string().min(1, 'Message is required'),
});

// Order schema
const orderSchema = z.object({
  items: z.array(z.object({
    id: z.string(),
    name: z.string(),
    price: z.number(),
    quantity: z.number(),
  })),
  total: z.number(),
  customerInfo: z.object({
    name: z.string(),
    email: z.string().email(),
    phone: z.string(),
    address: z.string(),
  }),
  includeInstallation: z.boolean().optional(),
});

// Health check
router.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Contact form submission
router.post('/contacts', async (req, res) => {
  try {
    const data = contactSchema.parse(req.body);
    
    // TODO: Save to database or send email
    console.log('Contact form submission:', data);
    
    res.json({ success: true, message: 'Contact form submitted successfully' });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Validation error', details: error.errors });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
});

// Order submission
router.post('/orders', async (req, res) => {
  try {
    const data = orderSchema.parse(req.body);
    
    // TODO: Process order, save to database, send confirmation email
    console.log('Order submission:', data);
    
    res.json({ 
      success: true, 
      message: 'Order submitted successfully',
      orderId: `ORD-${Date.now()}` // Mock order ID
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ error: 'Validation error', details: error.errors });
    } else {
      res.status(500).json({ error: 'Internal server error' });
    }
  }
});

export default router;