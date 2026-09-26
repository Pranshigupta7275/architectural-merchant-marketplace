# Deep Project Discussion Q&A

This document prepares you for follow-up questions an interviewer will ask after your initial presentation. Each question includes **what they're really testing**, the **expected answer**, and **how to expand if they probe deeper**.

---

## Section 1: Architecture & Design Decisions

### Q1: "Why did you choose MongoDB over a relational database like PostgreSQL?"

**What they're testing**: Database design reasoning, understanding of trade-offs.

**Expected answer**:
"I chose MongoDB because this is a marketplace with **evolving schemas**. Products have deeply nested, optional structures (technical specs, shipping dimensions, inventory settings). MongoDB's flexible document model handles this naturally without migrations. I also needed fast reads for the storefront — embedding product images and using `.lean()` queries gives excellent performance. However, I acknowledge that for complex transactions (like multi-merchant payouts), a relational database would be better."

**Deep dive follow-up**:
- "How would you handle transactions across multiple orders?" → MongoDB multi-document ACID transactions with sessions
- "What about data consistency?" → Mongoose validation at schema level, application-level consistency checks
- "When would you add PostgreSQL?" → For financial ledgers, audit logs, and merchant payout calculations

---

### Q2: "Your backend is modular — can you explain why you structured it this way?"

**What they're testing**: Software design patterns, maintainability thinking.

**Expected answer**:
"I used a **feature-based modular structure** where each domain (auth, products, orders, payments) has its own folder containing model, controller, routes, and middleware. This follows the **separation of concerns principle**. Benefits:
1. **Scalability**: New features can be added without touching existing code
2. **Team collaboration**: Multiple developers can work on different modules without merge conflicts
3. **Maintainability**: Related files are grouped together, making debugging faster
4. **Testability**: Each module can be tested in isolation"

**Deep dive follow-up**:
- "How would you scale this to 50 modules?" → Consider a plugin architecture or microservices
- "What about shared code?" → `utils/` folder for shared helpers like `ApiError`, token generation
- "Why not use a framework like NestJS?" → I wanted to demonstrate deep Express understanding; NestJS would add structure but also abstraction

---

### Q3: "Walk me through what happens when a merchant creates a product."

**What they're testing**: End-to-end system understanding, HTTP flow, middleware ordering.

**Expected answer**:
"Let me trace the complete flow:

1. **Client**: Merchant fills multi-step form (basic info, media, logistics). Redux `productDraft` slice persists state across steps.

2. **Request**: On submit, `POST /api/v1/products` with `multipart/form-data` containing JSON fields + image files.

3. **Route middleware chain** (in `product.route.js`):
   - `protect` middleware: Extracts JWT from Authorization header, verifies it, attaches `req.user`
   - `authorizeRoles('admin', 'merchant')`: Checks if user has permission
   - `uploadProductImages.array('images', 5)`: Multer stores files in memory as buffers
   - Debug middleware (dev only): Logs files and body

4. **Controller** (`product.controller.js`):
   - Spreads `req.body` into `productData`
   - If files exist, uploads each buffer to Cloudinary via `uploadBufferToCloudinary()`
   - Parses nested JSON strings from FormData
   - Sets `merchantId` from `req.user._id`
   - Calls `Product.create(productData)` — Mongoose validates and saves

5. **Model** (`product.model.js`):
   - Mongoose schema validation runs (required fields, enums, min/max)
   - Pre-save hooks (none for products, but for users it hashes passwords)

6. **Response**: Returns 201 with the created product, RTK Query invalidates `Product LIST` cache"

**Deep dive follow-up**:
- "What if Cloudinary upload fails?" → Promise rejects, caught by try/catch, returns 500 via `ApiError`
- "Why memory storage instead of disk?" → Prevents hanging requests, enables concurrent Cloudinary uploads, no temp file cleanup needed
- "How do you handle the FormData JSON parsing?" → `parseIfString()` helper safely parses nested objects

---

### Q4: "How does your authentication system work? Is it stateless?"

**What they're testing**: Auth fundamentals, JWT vs session understanding.

**Expected answer**:
"Yes, it's completely **stateless**. No server-side sessions are stored. Here's the flow:

1. **Registration**: User submits name, email, password, role. Password is hashed with bcrypt (10 salt rounds) via Mongoose pre-save hook. JWT access token (30-day dev expiry) and refresh token are generated.

2. **Login**: User submits credentials. `matchPassword()` compares bcrypt hash. If valid, new tokens are generated.

3. **Token Structure**:
   - Access token: Contains `{ id, role }`, used for API auth
   - Refresh token: Contains `{ id }`, used to get new access tokens

4. **Protected Routes**: `protect` middleware extracts Bearer token from header, verifies JWT signature, fetches user from DB (excluding password), attaches to `req.user`.

5. **Refresh Flow**: When access token expires, client calls `POST /api/v1/auth/refresh` with refresh token. Server verifies it and issues new tokens.

6. **Logout**: Client clears Redux state and localStorage. Server doesn't maintain blacklist (acceptable for dev; production would need token blacklisting)."

**Deep dive follow-up**:
- "Is 30-day token expiry secure?" → For development yes; in production I'd use 15 minutes + refresh token rotation
- "What about token theft?" → Should use httpOnly cookies in production, not localStorage
- "How do you handle role changes?" → New tokens are issued on login, so role changes take effect on next auth cycle
- "Why not use sessions?" → Stateless auth scales better across multiple server instances

---

## Section 2: Frontend & State Management

### Q5: "You have TWO cart implementations — why?"

**What they're testing**: Attention to detail, context awareness.

**Expected answer**:
"Great observation. I have:
1. `src/features/cart/cartSlice.js` — Used by the **merchant dashboard**
2. `src/components/storefront/store/cartSlice.js` — Used by the **customer storefront**

The storefront cart has different requirements: it needs to persist across page refreshes (localStorage), handle currency formatting, and integrate with the checkout flow. The dashboard cart is simpler — just managing product selections for order creation. This was a design oversight during development. In a production app, I'd unify them with a single cart service that adapts based on user context."

**Deep dive follow-up**:
- "How would you refactor this?" → Single cart slice with context-aware behavior, or separate adapters
- "What about Zustand or Context API?" → Redux was chosen for its DevTools and RTK Query integration; Context would be simpler but lacks middleware

---

### Q6: "Why Redux Toolkit instead of Context API or Zustand?"

**What they're testing**: State management rationale, technology choices.

**Expected answer**:
"I chose Redux Toolkit because:
1. **RTK Query**: Built-in data fetching with caching, deduplication, and automatic invalidation — eliminates the need for useEffect + useState patterns
2. **DevTools**: Time-travel debugging is invaluable during development
3. **Middleware ecosystem**: Easy integration of logging, persistence, and API middleware
4. **Predictable state**: Strict unidirectional data flow makes debugging deterministic

Context API would work for small apps, but this project has complex state interactions between auth, cart, and server data. Zustand is lighter but lacks the built-in caching layer that RTK Query provides."

**Deep dive follow-up**:
- "How big is your Redux bundle?" → RTK is ~6KB gzipped, which is acceptable for the features gained
- "What about Recoil or Jotai?" → Those are atomic state managers; good for fine-grained reactivity but overkill here
- "Do you use Redux for everything?" → No — I use local useState for form inputs and component-specific state. Redux is for shared state.

---

### Q7: "Walk me through the checkout flow from cart to payment."

**What they're testing**: Payment integration, frontend-backend coordination.

**Expected answer**:
"Here's the complete Stripe checkout flow:

1. **Cart State**: Customer adds items → Redux cart slice updates → persists to localStorage

2. **Navigate to Checkout**: `Checkout.jsx` reads `totalAmount` and `items` from Redux

3. **Payment Method Selection**: Customer chooses Stripe or Razorpay via tab UI

4. **Stripe Flow**:
   - `useEffect` triggers `POST /api/v1/payments/stripe/create-intent`
   - Backend creates Stripe PaymentIntent, returns `clientSecret`
   - Frontend wraps form in `<Elements>` with `clientSecret` + `stripePromise`
   - Customer enters card details in `<PaymentElement>`
   - `stripe.confirmPayment()` processes payment, redirects to `return_url`

5. **Razorpay Flow**:
   - `POST /api/v1/payments/razorpay/create-order` → backend creates Razorpay order
   - Razorpay checkout modal opens via `new window.Razorpay(options)`
   - Customer pays via UPI/card/netbanking
   - `handler` callback sends payment details to `POST /api/v1/payments/razorpay/verify-payment`
   - Backend verifies HMAC-SHA256 signature
   - Success redirects to payment-success page

6. **Order Creation**: After successful payment, order is created via `POST /api/v1/orders` (in a real app, this would be triggered by webhook)"

**Deep dive follow-up**:
- "Why create the PaymentIntent server-side?" → Secret key must never be exposed to client; prevents price tampering
- "How do you handle failed payments?" → Stripe shows error in PaymentElement, customer can retry
- "What about webhooks?" → Not currently implemented; would use Stripe webhooks for async payment confirmation

---

## Section 3: Backend & API Design

### Q8: "How do you prevent price tampering in orders?"

**What they're testing**: Security awareness, backend validation.

**Expected answer**:
"This is a critical ecommerce security concern. I prevent it with **server-side price recalculation**:

```javascript
// In addOrderItems controller
for (const item of orderItems) {
  const dbProduct = await Product.findById(item.product);
  backendCalculatedTotal += (dbProduct.price * item.quantity);
  validatedItems.push({
    price: dbProduct.price, // Snapshot historical price
    // ... other fields
  });
}
```

The client sends `orderItems` with product references and quantities, but the **actual prices come from the database**. Even if a malicious user modifies `price: 0.01` in the request body, the server ignores it and uses `dbProduct.price`.

I also snapshot the price in the order document, so even if the product price changes later, the order reflects what the customer actually paid."

**Deep dive follow-up**:
- "What if the product doesn't exist?" → `findById` returns null, we return 404 before processing
- "What about concurrent stock updates?" → I use MongoDB's atomic `$inc` operator for inventory deduction
- "Would you add a discount system?" → Yes, but discounts would be calculated server-side with their own validation rules

---

### Q9: "Explain your middleware architecture."

**What they're testing**: Express understanding, middleware ordering, security layering.

**Expected answer**:
"The middleware stack is ordered by specificity:

**Global middleware** (applied to all routes):
1. `helmet()` — Security headers (CSP, HSTS, etc.)
2. `cors()` — Origin whitelist, credentials support
3. `express.json()` — Body parsing with 10kb limit
4. `cookie-parser()` — Cookie parsing
5. `express.static('/uploads')` — Serve uploaded images

**Route-specific middleware** (per module):
1. `protect` — JWT verification, attaches `req.user`
2. `authorizeRoles(...)` — Role-based access control
3. `uploadProductImages` — Multer file handling
4. Custom debug middleware (dev only)

**Error handling** (last middleware):
- `errorHandler` — Centralized error dispatcher that transforms errors into consistent JSON responses

The key insight is that **middleware executes in order** — auth must come before file upload, which must come before the controller. If auth fails, the request stops there."

**Deep dive follow-up**:
- "Why is express.json limited to 10kb?" → Prevent DoS attacks with huge payloads
- "What does your security middleware do?" → I have a separate `security.middleware.js` that applies mongo-sanitize, xss-clean, and hpp — but I commented them out in `app.js` because they were causing issues
- "How do you handle async errors?" → Using try/catch in controllers + `next(error)` pattern

---

### Q10: "Why do you have both Cloudinary and local file upload?"

**What they're testing**: Understanding of file storage trade-offs.

**Expected answer**:
"I have two upload implementations:
1. **`upload.util.js`** — Local multer/diskStorage for the `/uploads` endpoint
2. **`upload.middleware.js`** — Cloudinary/memoryStorage for product images

The local upload was an early implementation for simple image hosting. The Cloudinary upload is the production approach because:
- **CDN delivery**: Images load faster globally
- **Automatic optimization**: Cloudinary resizes and compresses images
- **No server storage costs**: Images don't accumulate on the server
- **Transformations**: I can request specific dimensions (`width: 1000, height: 1000`)

In production, I'd remove the local upload entirely and use Cloudinary for everything."

**Deep dive follow-up**:
- "How do you handle upload failures?" → Promise rejects, caught by try/catch, returns ApiError
- "What's the 5MB limit?" → Prevent memory exhaustion from huge files
- "How does the buffer streaming work?" → `upload_stream` writes the buffer to Cloudinary's API

---

## Section 4: Database & Data Modeling

### Q11: "Why is `merchantId` stored on both Order and Product?"

**What they're testing**: Data modeling reasoning, query optimization.

**Expected answer**:
"This is a deliberate **denormalization** choice:

1. **Product.merchantId**: Identifies who owns the product — used for authorization (merchants can only edit their products), filtering (merchant dashboard shows only their products), and analytics.

2. **Order.merchantId**: Identifies who fulfilled the order — used for:
   - Merchant-specific order queries (`GET /api/v1/orders`)
   - Analytics aggregation (revenue per merchant)
   - Access control (merchants see only their orders)

Storing it on Order is more efficient than joining through Product. For a marketplace with millions of orders, querying `Order.find({ merchantId })` with an index is much faster than joining through Product."

**Deep dive follow-up**:
- "What if a product is transferred between merchants?" → Would need to update both Product.merchantId and all related Orders
- "Why not use a reference?" → I am using a reference (`ObjectId`), but I denormalize by storing the ID directly on Order for query performance

---

### Q12: "How does your analytics aggregation work?"

**What they're testing**: MongoDB aggregation pipeline knowledge, performance thinking.

**Expected answer**:
"I use MongoDB's aggregation framework in `analytics.controller.js`:

**Total Revenue**:
```javascript
Order.aggregate([
  { $match: { merchantId: req.user._id, status: 'Delivered' } },
  { $group: { _id: null, total: { $sum: '$totalPrice' } } }
])
```
This filters only delivered orders and sums their prices — all done in the database.

**Revenue Trend** (last 30 days):
```javascript
Order.aggregate([
  { $match: { merchantId: req.user._id, createdAt: { $gte: thirtyDaysAgo } } },
  { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, revenue: { $sum: "$totalPrice" } } },
  { $sort: { "_id": 1 } },
  { $project: { _id: 0, date: "$_id", revenue: 1 } }
])
```
This groups orders by date, sums revenue per day, and returns a format ready for ApexCharts.

All three queries run in **parallel** with `Promise.all` for maximum speed."

**Deep dive follow-up**:
- "What if there are millions of orders?" → Would add pagination, date-range filtering, or pre-computed daily aggregates
- "Why only count 'Delivered' orders?" → Revenue should only count completed transactions, not pending/processing
- "How would you cache this?" → Redis with TTL, or pre-computed snapshots in a separate collection

---

## Section 5: Security & Production Readiness

### Q13: "What security measures have you implemented?"

**What they're testing**: Security awareness, OWASP knowledge.

**Expected answer**:
"I implemented multiple layers of security:

**Authentication & Authorization**:
- JWT with bcrypt password hashing (10 salt rounds)
- Role-based access control (`authorizeRoles` middleware)
- Merchant-scoped queries (merchants can only access their own data)

**HTTP Security**:
- Helmet.js for security headers (CSP, HSTS, NoSniff, Frameguard)
- CORS whitelist — only allows my frontend origin
- Rate limiting: 100 requests/15min globally, 10 auth requests/hour, 50 admin actions/15min

**Input Protection**:
- `express-mongo-sanitize`: Removes `$` and `.` from request params to prevent NoSQL injection
- `xss-clean`: Sanitizes inputs against XSS attacks
- `hpp`: Prevents HTTP Parameter Pollution
- Body size limits: 10kb JSON, 5MB file uploads

**Data Protection**:
- Passwords excluded from query responses (`select('-password')`)
- `.lean()` used to strip Mongoose overhead (also reduces data exposure)
- ApiError class ensures no sensitive stack traces leak in production

**Payment Security**:
- Stripe secret key never exposed to client (server creates PaymentIntent)
- Razorpay signature verification with HMAC-SHA256"

**Deep dive follow-up**:
- "Why did you comment out mongo-sanitize and hpp?" → They caused issues with certain query patterns during development; I'd fix and re-enable for production
- "How do you handle secrets?" → Environment variables via dotenv; never committed to git
- "What about CSRF?" → Not implemented yet; would add CSRF tokens for state-changing operations

---

### Q14: "How would you deploy this application?"

**What they're testing**: Production knowledge, DevOps awareness.

**Expected answer**:
"Currently the app is deployed on Render. Here's my deployment strategy:

**Backend**:
- Environment variables in Render dashboard
- MongoDB Atlas for hosted database
- Winston logs to files (would add a service like Logtail or Papertrail in production)

**Frontend**:
- Built with Vite (`npm run build`)
- Deployed as static files on Render
- Environment variables for Stripe/Razorpay public keys

**Database**:
- MongoDB Atlas with connection pooling
- Custom DNS servers in `db.js` to fix Node.js DNS resolution issues

**Improvements for production**:
1. **CI/CD**: GitHub Actions for automated testing and deployment
2. **Health checks**: `/health` endpoint for load balancer
3. **Monitoring**: APM tool like New Relic or Datadog
4. **Redis**: For caching analytics and session data
5. **Docker**: Containerization for consistent environments
6. **Reverse proxy**: Nginx for SSL termination and static file serving"

**Deep dive follow-up**:
- "How do you handle zero-downtime deployments?" → Blue-green or rolling deployments
- "What's your backup strategy?" → MongoDB Atlas automated backups, daily snapshots
- "How do you monitor errors?" → Winston logs + error tracking service

---

## Section 6: Trade-offs & Alternatives

### Q15: "Why did you build your own auth instead of using Firebase or Auth0?"

**What they're testing**: Understanding of when to build vs buy.

**Expected answer**:
"I built custom auth to demonstrate **deep understanding of authentication internals**. For a production app, I'd evaluate:

**Build (current approach)**:
- Full control over user schema and auth flow
- No vendor lock-in
- Educational value

**Buy (Firebase/Auth0)**:
- Social login (Google, GitHub) out of the box
- Password reset, email verification, MFA
- Security updates handled by vendor
- Less code to maintain

For this project, building it myself was the right call because the goal was learning and demonstration. In a real startup, I'd likely use Auth0 or Clerk to move faster."

---

### Q16: "Why Mongoose instead of native MongoDB driver?"

**What they're testing**: ODM vs driver understanding.

**Expected answer**:
"Mongoose provides:
1. **Schema validation** — Ensures data integrity before it reaches the database
2. **Middleware/hooks** — Pre-save hooks for password hashing
3. **Population** — Easy reference resolution (`populate('merchantId', 'name email')`)
4. **Lean queries** — Performance optimization for read-heavy operations
5. **Familiar API** — Similar to ORMs in other languages

The native driver would be faster and more flexible, but Mongoose's developer experience and built-in features significantly reduce boilerplate. For a project this size, Mongoose is the right choice."

---

### Q17: "Your frontend uses both RTK Query and fetch — why?"

**What they're testing**: Consistency in API consumption.

**Expected answer**:
"This was an inconsistency during development. `orderSlice.js` uses raw `fetch()`, while `productsApiSlice.js` and `customerApi.js` use RTK Query.

**Why it happened**: The order slice was created early in development before I adopted RTK Query everywhere.

**What I'd do now**: Migrate `orderSlice.js` to RTK Query for:
- Automatic caching and invalidation
- Consistent error handling
- DevTools integration
- Less boilerplate code

The raw fetch in `orderSlice.js` also has a bug — it sends to `/api/orders` instead of `/api/v1/orders`, which would fail in production."

---

## Section 7: Scale & Real-World Scenarios

### Q18: "How would you handle 10,000 concurrent users?"

**What they're testing**: Scalability thinking.

**Expected answer**:
"Current architecture is single-server Node.js. For 10K concurrent users:

**Backend scaling**:
1. **Horizontal scaling**: Deploy multiple Express instances behind a load balancer (NGINX/AWS ALB)
2. **Database**: MongoDB Atlas with read replicas; connection pooling
3. **Caching**: Redis for frequent queries (product listings, user sessions)
4. **CDN**: Cloudinary already handles image delivery; add CDN for API responses
5. **Rate limiting**: Already implemented, would tune thresholds per endpoint
6. **Queue**: BullMQ for async operations (email notifications, order processing)

**Frontend scaling**:
1. **Code splitting**: React.lazy + Suspense for route-based splitting
2. **Image optimization**: Next-gen formats (WebP/AVIF), lazy loading
3. **CDN**: Deploy static assets to Vercel/Netlify CDN
4. **Service Worker**: Offline support for storefront

**Database scaling**:
1. **Sharding**: Partition by merchantId for multi-tenant scale
2. **Indexing**: Ensure all query fields are indexed
3. **Read replicas**: Offload analytics queries from primary"

---

### Q19: "How would you implement a real-time inventory system?"

**What they're testing**: Real-time systems, WebSocket knowledge.

**Expected answer**:
"Currently, inventory is updated when orders are placed, but there's no real-time visibility. I'd implement:

**Option 1: Polling** (simplest)
- Frontend polls `GET /api/v1/products/:id` every 30 seconds
- Pros: Simple, no infrastructure changes
- Cons: Delayed updates, unnecessary requests

**Option 2: WebSockets** (preferred)
- Socket.IO server attached to Express
- Merchants join rooms based on their `merchantId`
- When inventory changes (order placed, stock adjusted), emit `inventory_update` event
- Frontend updates cart/stock display instantly

**Option 3: Server-Sent Events**
- One-way push from server to client
- Lighter than WebSockets for read-only updates
- Good for notifications and stock alerts

**Implementation**:
```javascript
// When order is created
io.to(`merchant_${merchantId}`).emit('inventory_update', {
  productId: productId,
  newStock: updatedStock,
  lowStock: updatedStock < lowStockAlert
});
```

**Database**: For high-scale, I'd use Redis for current stock counts and async write to MongoDB."

---

### Q20: "How would you add a review/rating system?"

**What they're testing**: Feature expansion thinking, database design.

**Expected answer**:
"I'd add a Review model:

```javascript
const reviewSchema = new mongoose.Schema({
  product: { type: ObjectId, ref: 'Product', required: true },
  user: { type: ObjectId, ref: 'User', required: true },
  rating: { type: Number, min: 1, max: 5, required: true },
  comment: { type: String },
}, { timestamps: true });

// Compound index to prevent duplicate reviews
reviewSchema.index({ product: 1, user: 1 }, { unique: true });
```

**Routes**:
- `POST /api/v1/products/:id/reviews` — Create review (authenticated, must have purchased)
- `GET /api/v1/products/:id/reviews` — List reviews
- `PUT /api/v1/reviews/:id` — Update own review
- `DELETE /api/v1/reviews/:id` — Delete own review

**Denormalization on Product**:
- `averageRating` and `numOfReviews` on Product schema (already present!)
- Updated via Mongoose post-save hook or aggregation

**Verification**: Only users who have a `Delivered` order for that product can review (query Order collection).

**Frontend**: Star rating component, review form with React Hook Form, review list with pagination."

---

## Section 8: Behavioral & Meta Questions

### Q21: "What's the most complex bug you fixed?"

**Example answer**:
"When implementing Cloudinary uploads, requests would hang indefinitely under concurrent uploads. The root cause was using diskStorage with Multer — the file system I/O was blocking the event loop when multiple uploads happened simultaneously.

**Fix**: I switched to memoryStorage, which keeps files in RAM. Then I wrapped Cloudinary's callback-based `upload_stream` in a Promise, allowing me to use `Promise.all()` for concurrent uploads. This made uploads non-blocking and actually faster since multiple images upload in parallel."

---

### Q22: "How do you stay up to date with new technologies?"

**Example answer**:
"I follow a structured approach:
1. **Newsletters**: Morning Brew for tech, React Status for frontend
2. **GitHub Trending**: I browse trending repos weekly to see what's gaining traction
3. **Building projects**: The best way to learn is by building — this marketplace taught me more than any tutorial
4. **Open source**: I contribute to documentation and small bug fixes
5. **Podcasts**: Syntax FM and The Changelog for deep-dive discussions"

---

### Q23: "What part of this project are you most proud of?"

**Example answer**:
"The multi-payment gateway integration. Most developers implement one payment provider, but I integrated both Stripe and Razorpay with:
- Server-side intent/order creation
- Client-side payment confirmation
- Cryptographic signature verification
- Currency conversion (USD to INR)

This shows I understand payment flows at a deeper level — not just following a tutorial, but understanding why each step is necessary and how to handle edge cases."

---

### Q24: "If you had to rebuild this from scratch, what would you do differently?"

**Example answer**:
"1. **TypeScript from day one**: Would catch so many runtime errors at compile time
2. **Test-driven development**: Writing tests first would have caught the `/api/orders` vs `/api/v1/orders` bug
3. **Monorepo**: Use Turborepo or Nx to share types and utilities between frontend and backend
4. **GraphQL**: For the storefront, GraphQL would reduce over-fetching compared to REST
5. **Containerization**: Docker from the start for consistent environments
6. **Feature flags**: For gradual rollout of payment gateways and new features"

---

## Section 9: Rapid-Fire Technical Questions

These are quick-fire questions you should be able to answer in 1-2 sentences:

| Question | Answer |
|----------|--------|
| What's the difference between `==` and `===`? | `==` does type coercion; `===` checks type and value. Always use `===`. |
| What is a closure? | A function that retains access to its outer scope even after the outer function returns. |
| What's the event loop? | JavaScript's mechanism for handling async operations via call stack, task queue, and microtask queue. |
| Explain `this` in JavaScript. | `this` refers to the execution context. Arrow functions inherit `this` from enclosing scope. |
| What are React hooks? | Functions that let you use state and lifecycle features in functional components. |
| Difference between `useEffect` dependencies? | Empty array = run once on mount; values = run when values change; no array = run every render. |
| What is Redux Thunk? | Middleware that lets you write action creators returning functions instead of objects (for async logic). |
| What is a MongoDB index? | A data structure that improves query performance by allowing fast document lookups. |
| What's the difference between `findById` and `findOne`? | `findById` uses `_id` field specifically; `findOne` can use any field. |
| What is CORS? | Cross-Origin Resource Sharing — browser security feature that restricts cross-origin requests. |
| What is a JWT? | JSON Web Token — a compact, URL-safe token containing claims, signed with a secret. |
| What's the difference between SQL and NoSQL? | SQL is relational, schema-based, ACID-compliant. NoSQL is document/wide-column/key-value, flexible schema. |
| What is REST? | Representational State Transfer — architectural style using HTTP methods (GET, POST, PUT, DELETE). |
| What is a Promise? | An object representing eventual completion/failure of an async operation. |
| What's the difference between `var`, `let`, and `const`? | `var` is function-scoped, `let` and `const` are block-scoped. `const` can't be reassigned. |
| What is memoization? | Caching expensive function results to avoid redundant computation. |
| What's the Virtual DOM? | React's in-memory representation of the real DOM, used for efficient diffing and updates. |
| What is debouncing? | Delaying function execution until after a wait period — useful for search inputs. |
| What's the difference between `sessionStorage` and `localStorage`? | `sessionStorage` clears on tab close; `localStorage` persists until explicitly cleared. |
| What is an IIFE? | Immediately Invoked Function Expression — a function that runs as soon as it's defined. |

---

## Section 10: System Design (If They Ask You to Design Something)

### Q25: "How would you design a notification system for this marketplace?"

**Expected approach**:
1. **Requirements**: Notify customers of order status changes, merchants of new orders, low stock alerts
2. **Architecture**: Event-driven with message queue
3. **Components**:
   - Event emitter in backend (when order status changes)
   - Message queue (BullMQ with Redis)
   - Notification workers (email via SendGrid, SMS via Twilio, in-app via WebSocket)
   - Notification preferences per user
   - Notification history table

---

### Q26: "How would you add multi-currency support?"

**Expected approach**:
1. **Currency rates table**: Store exchange rates with timestamps
2. **Conversion at checkout**: Convert USD base price to selected currency
3. **Historical rates**: Store the rate used at time of purchase in order
4. **Display**: Show prices in customer's locale currency using Intl.NumberFormat
5. **Payment**: Process in merchant's base currency; show conversion estimate

---

## Preparation Checklist

Before your interview, ensure you can:
- [ ] Explain every file in your project without looking at it
- [ ] Draw the architecture diagram from memory
- [ ] Explain the database schema and relationships
- [ ] Trace any user action (login, add to cart, checkout) from frontend to database
- [ ] Explain 3-4 technical trade-offs you made
- [ ] Discuss what you'd improve with more time
- [ ] Answer rapid-fire JS/React/Mongo questions fluently
