import { Hono } from 'hono'
import { ItemList } from '../components/ItemList'
import { ItemForm } from '../components/ItemForm'

const itemsRouter = new Hono()

itemsRouter.get('/', async (c) => {
  const res = await fetch('http://localhost:5000/api/items')
  const items = await res.json()
  return c.html(<ItemList items={items} />)
})

itemsRouter.get('/new', (c) => {
  return c.html(<ItemForm />)
})

itemsRouter.post('/', async (c) => {
  const body = await c.req.parseBody()
  const res = await fetch('http://localhost:3000/api/items', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })
  if (res.ok) {
    return c.redirect('/api/items')
  } else {
    return c.text('Error creating item', 500)
  }
})

export default itemsRouter

