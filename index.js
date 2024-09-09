import { Hono } from 'hono'
import { serveStatic } from '@hono/node-server/serve-static'

const app = new Hono()

// Serve static files from the 'public' directory
app.use('/public/*', serveStatic({ root: './' }))

// Landing page route
app.get('/', (c) => {
  return c.html(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome</title>
      <link rel="stylesheet" href="/public/styles.css">
    </head>
    <body>
      <div class="container">
        <h1>Welcome to Our Service</h1>
        <div class="button-container">
          <a href="/employee" class="button">Employee</a>
          <a href="/patron" class="button">Patron</a>
        </div>
      </div>
    </body>
    </html>
  `)
})

// Employee page route
app.get('/employee', (c) => {
  return c.html('<h1>Employee Page</h1><a href="/">Back to Home</a>')
})

// Patron page route
app.get('/patron', (c) => {
  return c.html('<h1>Patron Page</h1><a href="/">Back to Home</a>')
})

export default app