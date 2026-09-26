import helmet from 'helmet';
import cors from 'cors';
import mongoSanitize from 'express-mongo-sanitize';
import hpp from 'hpp';
import xss from 'xss-clean';

/**
 * Applies comprehensive OWASP security layers to the Express application.
 * @param {Object} app - The Express application instance
 */
export const applySecurityMiddleware = (app) => {
  // 1. Set Security HTTP Headers (Helmet configures CSP, HSTS, NoSniff, Frameguard, etc.)
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'", "'unsafe-inline'"],
          styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
          fontSrc: ["'self'", 'https://fonts.gstatic.com'],
          imgSrc: ["'self'", 'data:', 'https://res.cloudinary.com'],
          connectSrc: ["'self'"],
        },
      },
      crossOriginEmbedderPolicy: false,
    })
  );

  // 2. Cross-Origin Resource Sharing (CORS)
  const whitelist = process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : ['http://localhost:3000'];
  
  app.use(
    cors({
      origin: function (origin, callback) {
        if (whitelist.indexOf(origin) !== -1 || !origin) {
          callback(null, true);
        } else {
          callback(new Error('Not allowed by CORS'));
        }
      },
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    })
  );

  // 3. Data Sanitization against NoSQL Query Injection
  // Removes keys containing prohibited characters like $ and .
  app.use(mongoSanitize());

  // 4. Data Sanitization against Cross-Site Scripting (XSS)
  app.use(xss());

  // 5. Prevent HTTP Parameter Pollution (HPP)
  // Clears up query string parameters (keeps the last one), whitelisting safe ones
  app.use(
    hpp({
      whitelist: [
        'sort',
        'page',
        'limit',
        'fields',
        // Add domain-specific parameters here (e.g., 'price', 'category')
      ],
    })
  );
};