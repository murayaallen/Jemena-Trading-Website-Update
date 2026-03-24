require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const Fuse = require('fuse.js');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { OpenAI } = require('openai');
const winston = require('winston');
const DailyRotateFile = require('winston-daily-rotate-file');
const swaggerUI = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');
const morgan = require('morgan');
const productDb = require('./db/products');

// =====================
// Constants & Configuration
// =====================
const CONFIG = {
  PUBCHEM_API: "https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound",
  OPENAI_API_URL: "https://api.openai.com/v1",
  RATE_LIMIT: { window: 15 * 60 * 1000, max: 10 },
    AI: { model: "gpt-4o", temperature: 0.33, maxTokens: 2048 },
  SAFETY: {
    maxInputLength: 500,
    allowedOrigins: [
      'https://jemenatrading.co.ke',
      'https://jemenaai.jemenatrading.co.ke',
      'http://localhost:5000',
      'http://localhost:3000',
      'http://127.0.0.1:5000'
    ]
  }
};
// =====================
// Logging System
// =====================
const logger = winston.createLogger({
    level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.json()
    ),
    transports: [
      new DailyRotateFile({
        filename: 'logs/application-%DATE%.log',
        datePattern: 'YYYY-MM-DD',
        zippedArchive: true,
        maxSize: '20m',
        maxFiles: '30d'
      }),
      new winston.transports.Console({
        format: winston.format.combine(
          winston.format.colorize(),
          winston.format.simple()
        )
      })
    ]
  });
  
  // =====================
  // API Documentation
  // =====================
  const swaggerOptions = {
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'JT Chemical AI API',
        version: '1.0.0',
        description: 'API for Jemena Trading Chemical AI Assistant',
      },
      servers: [{ url: process.env.API_BASE_URL || 'http://jemenaai.jemenatrading.co.ke' }]
    },
    apis: ['server.js']
  };
  
// =====================
// Service Initialization
// =====================
const app = express();
const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || '0.0.0.0';

// =====================
// CORS Configuration (FIRST middleware)
// =====================
app.use(cors({
    origin: (origin, callback) => {
        // Allow same-origin requests (no origin header)
        if (!origin) return callback(null, true);

        // Normalization process
        const normalize = url => url
            .replace(/\/$/, '')    // Remove trailing slash
            .toLowerCase();        // Convert to lowercase

        // Prepare allowed list
        const allowed = CONFIG.SAFETY.allowedOrigins
            .map(normalize)
            .concat([ // Auto-include backend domain for health checks
                'https://jemenaai.jemenatrading.co.ke'
            ]);

        // Compare normalized values
        const normalizedOrigin = normalize(origin);

        if (allowed.includes(normalizedOrigin)) {
            callback(null, true);
        } else {
            logger.warn(`CORS Rejected: ${origin} → Normalized: ${normalizedOrigin}`);
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
    credentials: true,
    optionsSuccessStatus: 204
}));

// =====================
// Security Headers (server.js)
// =====================
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      connectSrc: [
        "'self'",
        "https://jemena.jemenatrading.co.ke",
        "https://api.openai.com",
        "https://pubchem.ncbi.nlm.nih.gov"
      ],
      imgSrc: ["'self'", "data:", "https://*.jemenatrading.co.ke"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"]
    }
  },
  hsts: { 
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
}));

// =====================
// Other Essential Middleware
// =====================
app.use(express.json({}));
app.use(express.urlencoded({ extended: true }));

// Attach unique request ID to every request
app.use((req, res, next) => {
  req.requestId = `req-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  next();
});

// Remove trailing slashes
app.use((req, res, next) => {
  if (req.path.endsWith('/') && req.path.length > 1) {
    const query = req.url.slice(req.path.length);
    res.redirect(301, req.path.slice(0, -1) + query);
  } else {
    next();
  }
});

app.use(morgan('combined', {
    stream: { write: msg => logger.info(msg.trim()) }
}));

// Rate limiting (AFTER request ID middleware)
app.use(rateLimit(CONFIG.RATE_LIMIT));

// =====================
// Service Initialization (continued)
// =====================
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    timeout: 10000
});

// Fuse instance is now backed by the SQLite DB (rebuilt on each search in productDb.search)
// Kept for legacy getProductInfo compatibility
const fuse = new Fuse(productDb.getAll().map(p => ({ name: p.name })),
    { keys: ['name'], threshold: 0.45, ignoreLocation: true });

// =====================
// API Documentation Route
// =====================
if (process.argv.includes('--docs')) {
    const swaggerSpec = swaggerJSDoc(swaggerOptions);
    app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec));
    logger.info('Swagger docs available at /api-docs');
}

// =====================
// Enhanced Core Functions
// =====================
const apiFunctions = {
  getProductInfo: (productName) => {
    if (!productName || productName.length > CONFIG.SAFETY.maxInputLength) {
      return { error: "Invalid product name" };
    }
    const results = productDb.search(productName, 1);
    return results.length > 0
      ? { ...results[0], originalQuery: productName }
      : { error: "Product not found" };
  },

  getPubChemData: async (chemicalName) => {
    try {
      const sanitizedInput = chemicalName.replace(/[^a-zA-Z0-9 ]/g, '');
      const cidRes = await axios.get(`${CONFIG.PUBCHEM_API}/name/${encodeURIComponent(sanitizedInput)}/JSON`);
      
      // Add error handling for missing CID
      if(!cidRes.data?.PC_Compounds?.[0]?.id?.id?.cid) {
        return { error: "Chemical not found in PubChem" };
      }
      
      const cid = cidRes.data.PC_Compounds[0].id.id.cid;
      const propsRes = await axios.get(`${CONFIG.PUBCHEM_API}/cid/${cid}/property/MolecularFormula,MolecularWeight,IUPACName/JSON`);
      
      return {
        name: sanitizedInput,
        properties: propsRes.data?.PropertyTable?.Properties?.[0] || {},
        cid: cid
      };
    } catch (error) {
      logger.error(`PubChem Error: ${error.message}`);
      return { error: "PubChem data unavailable" };
    }
  }
};
// =====================
// Health Check Endpoint
// =====================
// Enhanced API Endpoints
// =====================

const router = express.Router();
app.use('/', router); // 👈 Critical: Mount router at root


// =====================
// Health Check Endpoint
// =====================
router.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString()
  });
});

// =====================
// Root Endpoint
// =====================
router.get('/', (req, res) => {
  res.json({
    service: "JT Chemical AI API",
    version: "1.0.1",
    endpoints: {
      chat: "POST /api/chat",
      health: "GET /health",
      docs: "GET /api-docs"
    }
  });
});

// =====================
// Products Endpoints
// =====================

// GET /api/products — all available products
router.get('/api/products', (req, res) => {
    try {
        const products = productDb.getAll();
        res.json({ products, total: products.length });
    } catch (err) {
        logger.error(`Products fetch error: ${err.message}`);
        res.status(500).json({ error: 'Failed to fetch products' });
    }
});

// GET /api/products/search?q=term — fuzzy search
router.get('/api/products/search', (req, res) => {
    try {
        const query = String(req.query.q || '').slice(0, CONFIG.SAFETY.maxInputLength);
        if (!query.trim()) {
            return res.json({ products: [], total: 0 });
        }
        const products = productDb.search(query, 15);
        res.json({ products, total: products.length });
    } catch (err) {
        logger.error(`Products search error: ${err.message}`);
        res.status(500).json({ error: 'Search failed' });
    }
});

// GET /api/products/categories — distinct category list
router.get('/api/products/categories', (req, res) => {
    try {
        const categories = productDb.getCategories();
        res.json({ categories });
    } catch (err) {
        logger.error(`Categories fetch error: ${err.message}`);
        res.status(500).json({ error: 'Failed to fetch categories' });
    }
});

// =====================
// Enhanced Chat Endpoint (Fixed)
// =====================
router.post('/api/chat', async (req, res) => {
  try {
    const userInput = req.body.message?.slice(0, CONFIG.SAFETY.maxInputLength);
    req.body.pageContext = String(req.body.pageContext || '').slice(0, 100).replace(/[<>]/g, '');

    // Basic input validation
    if (!userInput || userInput.trim().length === 0) {
      logger.warn(`Empty input - Request ID: ${req.requestId}`);
      return res.status(400).json({
        error: "Message content required",
        requestId: req.requestId
      });
    }

    // Build product catalog summary for system prompt
    const allProducts = productDb.getAll();
    const byCategory = {};
    allProducts.forEach(p => {
      if (!byCategory[p.category]) byCategory[p.category] = [];
      byCategory[p.category].push(`${p.name} (${p.packaging.join(', ')})`);
    });
    const catalogText = Object.entries(byCategory)
      .map(([cat, items]) => `**${cat}:**\n${items.map(i => `- ${i}`).join('\n')}`)
      .join('\n\n');

    const pageContext = req.body.pageContext ? `\nThe customer is currently viewing the "${req.body.pageContext}" page.` : '';

    // AI Processing
    const systemPrompt =
      `You are JT, a knowledgeable and friendly chemical expert assistant for Jemena Trading Limited — an industrial and specialty chemicals supplier based in Nairobi, Kenya.` +
      (pageContext ? `\n${pageContext}` : '') +
      `\n\n**Your role:**
- Answer questions about Jemena's products, pricing enquiries (direct to sales team), availability, and uses
- Provide accurate chemical information including safety, GHS classifications, and handling procedures
- Help customers identify the right product for their industry or application
- Suggest relevant products from the catalog based on the customer's needs
- Keep responses concise, helpful, and professional

**Company contact:**
- Address: Rangwe Road, Off Lunga Lunga Rd, Nairobi
- Phone: +254 795 792 234
- Email: info@jemenatrading.co.ke
- Hours: Mon–Fri 8am–5pm, Sat 8am–2pm

**Full product catalog:**
${catalogText}

**Formatting rules:**
- Use **bold** for product names and key terms
- Use bullet points (- item) for lists
- Keep responses under 250 words unless technical detail is needed
- Always use exact product names as listed above
- If asked for pricing, explain that prices vary by quantity and to contact the sales team`;

    const completion = await openai.chat.completions.create({
      model: CONFIG.AI.model,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user',   content: userInput }
      ],
      temperature: CONFIG.AI.temperature,
      max_tokens: CONFIG.AI.maxTokens
    });

    // Return response (preserve markdown, strip only script/html injection)
    const aiResponse = completion.choices[0].message.content
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
      .replace(/<[^>]*on\w+\s*=/gi, '') // Remove event handler attributes

    logger.info(`Successful request - ID: ${req.requestId}`);
    
    res.json({
      response: aiResponse,
      metadata: {
        requestId: req.requestId,
        model: CONFIG.AI.model,
        tokensUsed: completion.usage?.total_tokens || 0,
        processedAt: new Date().toISOString()
      }
    });

  } catch (error) {
    logger.error(`API Failure - ID: ${req.requestId} - ${error.stack}`);
    
    const errorResponse = {
      error: "AI processing failed",
      requestId: req.requestId,
      code: error.code || 'NO_ERROR_CODE'
    };

    if (process.env.NODE_ENV !== 'production') {
      errorResponse.details = error.message;
      errorResponse.stack = error.stack;
    }

    res.status(error.statusCode || 500).json(errorResponse);
  }
});

// =====================
// Enhanced Error Handling
// =====================
app.use((req, res) => {
  res.status(404).json({
    error: "Endpoint not found",
    availableEndpoints: {
      root: "GET /",
      chat: "POST /api/chat",
      health: "GET /health",
      docs: "GET /api-docs"
    }
  });
});

app.use((err, req, res, next) => {
  logger.error(`Server Error: ${err.stack}`);
  res.status(500).json({
    error: "Internal server error",
    requestId: req.requestId,
    incidentId: `INC-${Date.now()}`
  });
});

// =====================
// Production-Ready Server Initialization
// =====================
process.on('uncaughtException', (err) => {
  logger.error(`CRITICAL - Uncaught Exception: ${err.stack}`);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error(`UNHANDLED REJECTION at: ${promise} - Reason: ${reason}`);
});

const server = app.listen(PORT, HOST, () => {
  logger.info(`Server operational on ${HOST}:${PORT}`);
  logger.info(`Environment: ${process.env.NODE_ENV || 'development'}`);
  logger.info(`CORS Allowed Origins: ${CONFIG.SAFETY.allowedOrigins.join(', ') || 'none'}`);
  logger.info(`Product catalog: ${productDb.getAll().length} items (SQLite)`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  logger.info('SIGINT received - Shutting down gracefully');
  server.close(() => {
    logger.info('Server closed');
    process.exit(0);
  });
});

process.on('SIGTERM', () => {
  logger.info('SIGTERM received - Shutting down gracefully');
  server.close(() => {
    logger.info('Server closed');
    process.exit(0);
  });
});