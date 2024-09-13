import { Hono } from 'hono'
import { serveStatic } from 'hono/cloudflare-workers'

const app = new Hono()

// Serve static files from the 'public' directory
app.use('/*', serveStatic({ root: './' }))

// Replace this with your actual backend URL
const BACKEND_URL = 'https://alexanderthenotsobad.us/api/items'

// ... (keep the route handlers for '/', '/employee', '/patron' as they were)

app.get('/', (c) => {
  return c.html(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>VRS Prototype</title>
      <link rel="stylesheet" href="/styles.css">
    </head>
    <body>
      <div class="container">
        <h1>Welcome to VRS Prototype</h1>
        <a href="/employee" class="button">Employee Page</a>
        <a href="/menu" class="button">Menu Page</a>
      </div>
    </body>
    </html>
  `)
})

app.get('/employee', (c) => {
  return c.html(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Menu Items - VRS Prototype</title>
      <link rel="stylesheet" href="/styles.css">
      <style>
        #imagePreview {
          max-width: 200px;
          max-height: 200px;
          margin-top: 10px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>Menu Items</h1>
        <form id="menuItemForm">
          <input type="text" id="name" placeholder="Item Name" required>
          <input type="number" id="price" placeholder="Price" step="0.01" required>
          <input type="text" id="category" placeholder="Category" required>
          <input type="file" id="itemPic" accept="image/*">
          <img id="imagePreview" src="" alt="Image preview" style="display: none;">
          <button type="submit">Add Item</button>
        </form>
        <ul id="menuItemsList"></ul>
        <a href="/" class="button">Back to Home</a>
      </div>
      <script>
        const form = document.getElementById('menuItemForm');
        const list = document.getElementById('menuItemsList');
        const imageInput = document.getElementById('itemPic');
        const imagePreview = document.getElementById('imagePreview');

        imageInput.addEventListener('change', (e) => {
          const file = e.target.files[0];
          if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
              imagePreview.src = e.target.result;
              imagePreview.style.display = 'block';
            };
            reader.readAsDataURL(file);
          }
        });

        function fetchMenuItems() {
          fetch('${BACKEND_URL}/menu-items')
            .then(res => {
              if (!res.ok) {
                throw new Error('Network response was not ok');
              }
              return res.json();
            })
            .then(items => {
              list.innerHTML = items.map(item => 
                \`<li>
                  <img src="data:image/jpeg;base64,\${item.item_pic}" alt="\${item.name}" style="max-width: 100px; max-height: 100px;">
                  \${item.name} - $\${item.price} - \${item.category}
                </li>\`
              ).join('');
            })
            .catch(error => {
              console.error('Error fetching menu items:', error);
              list.innerHTML = '<li>Failed to load menu items. Please try again later.</li>';
            });
        }

        form.addEventListener('submit', (e) => {
          e.preventDefault();
          const name = document.getElementById('name').value;
          const price = document.getElementById('price').value;
          const category = document.getElementById('category').value;
          const itemPic = imageInput.files[0];

          const formData = new FormData();
          formData.append('name', name);
          formData.append('price', price);
          formData.append('category', category);
          if (itemPic) {
            formData.append('item_pic', itemPic);
          }

          fetch('${BACKEND_URL}/menu-items', {
            method: 'POST',
            body: formData
          })
            .then(res => {
              if (!res.ok) {
                throw new Error('Network response was not ok');
              }
              return res.json();
            })
            .then(() => {
              fetchMenuItems();
              form.reset();
              imagePreview.src = '';
              imagePreview.style.display = 'none';
            })
            .catch(error => {
              console.error('Error adding menu item:', error);
              alert('Failed to add menu item. Please try again.');
            });
        });

        fetchMenuItems();
      </script>
    </body>
    </html>
  `)
})

app.get('/menu', (c) => {
  return c.html(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Menu - VRS Prototype</title>
      <link rel="stylesheet" href="/styles.css">
      <style>
        .menu-container {
          display: flex;
          flex-wrap: wrap;
          justify-content: space-around;
        }
        .menu-category {
          width: 100%;
          margin-bottom: 20px;
        }
        .menu-item {
          background-color: #f9f9f9;
          border: 1px solid #ddd;
          border-radius: 4px;
          padding: 10px;
          margin-bottom: 10px;
          display: flex;
          align-items: center;
        }
        .menu-item img {
          max-width: 100px;
          max-height: 100px;
          margin-right: 10px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>Our Menu</h1>
        <div id="menuContainer" class="menu-container"></div>
        <a href="/" class="button">Back to Home</a>
      </div>
      <script>
        function fetchMenu() {
          fetch('${BACKEND_URL}/menu-items')
            .then(res => {
              if (!res.ok) {
                throw new Error('Network response was not ok');
              }
              return res.json();
            })
            .then(items => {
              const menuContainer = document.getElementById('menuContainer');
              const categories = {};
              
              items.forEach(item => {
                if (!categories[item.category]) {
                  categories[item.category] = [];
                }
                categories[item.category].push(item);
              });
              
              for (const [category, categoryItems] of Object.entries(categories)) {
                const categoryElement = document.createElement('div');
                categoryElement.className = 'menu-category';
                categoryElement.innerHTML = \`<h2>\${category}</h2>\`;
                
                categoryItems.forEach(item => {
                  const itemElement = document.createElement('div');
                  itemElement.className = 'menu-item';
                  itemElement.innerHTML = \`
                    <img src="data:image/jpeg;base64,\${item.item_pic}" alt="\${item.name}">
                    <div>
                      <h3>\${item.name}</h3>
                      <p>Price: $\${item.price}</p>
                    </div>
                  \`;
                  categoryElement.appendChild(itemElement);
                });
                
                menuContainer.appendChild(categoryElement);
              }
            })
            .catch(error => {
              console.error('Error fetching menu items:', error);
              menuContainer.innerHTML = '<p>Failed to load menu. Please try again later.</p>';
            });
        }

        fetchMenu();
      </script>
    </body>
    </html>
  `)
})

export default app