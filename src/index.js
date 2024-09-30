import { Hono } from 'hono'
import { serveStatic } from 'hono/cloudflare-workers'

const app = new Hono()

// Serve static files from the 'public' directory
app.use('/*', serveStatic({ root: './' }))

// Update this to your actual backend URL
const BACKEND_URL = 'https://alexanderthenotsobad.us/api/items'

// Keep the existing routes (/, /employee, /patron, /menu)
// ...

// Update the /add-menu-items route
app.get('/add-menu-items', (c) => {
  return c.html(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Add Menu Items - VRS Prototype</title>
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
        <h1>Add Menu Items</h1>
        <form id="menuItemForm">
          <input type="text" id="item_name" placeholder="Item Name" required>
          <textarea id="item_desc" placeholder="Item Description" required></textarea>
          <input type="number" id="price" placeholder="Price" step="0.01" required>
          <input type="file" id="item_pic" accept="image/*">
          <img id="imagePreview" src="" alt="Image preview" style="display: none;">
          <button type="submit">Add Item</button>
        </form>
        <ul id="menuItemsList"></ul>
        <a href="/" class="button">Back to Home</a>
      </div>
      <script>
        const form = document.getElementById('menuItemForm');
        const itemName = document.getElementById('item_name').value;

        //const itemPicInput = document.getElementById('item_pic');
        const imagePreview = document.getElementById('imagePreview');
        const itemDesc = document.getElementById('item_desc').value;
        const price = document.getElementById('price').value;
        const itemPic = document.getElementById('item_pic').files[0];

        const items = {
        item_name: itemName,
        item_desc: itemDesc,
        price: parseFloat(price)
        };

        // itemPicInput.addEventListener('change', (e) => {
        //   const file = e.target.files[0];
        //   if (file) {
        //     const reader = new FileReader();
        //     reader.onload = (e) => {
        //       imagePreview.src = e.target.result;
        //       imagePreview.style.display = 'block';
        //     };
        //     reader.readAsDataURL(file);
        //   }
        // });

        // If there's an image, convert it to base64
        if (itemPic) {
          const reader = new FileReader();
          reader.onload = async (e) => {
            jsonData.item_pic = e.target.result;
            await sendData(jsonData);
          };
          reader.readAsDataURL(itemPic);
        } else {
          await sendData(jsonData);
        }
      });

        form.addEventListener('submit', async (e) => {
          e.preventDefault();
          const formData = new FormData(form);
          
          try {
            const response = await fetch('https://alexanderthenotsobad.us/api/items/create', {
              method: 'POST',
              headers: {
                'Content-Type':'application/json'
              },
              body: JSON.stringify(jsonData)
            });
            
            if (response.ok) {
              alert('Menu item added successfully!');
              form.reset();
              imagePreview.style.display = 'none';
            } else {
              throw new Error('Failed to add menu item');
            }
          } catch (error) {
            console.error('Error:', error);
            alert('Failed to add menu item. Please try again.');
          }
        });
      </script>
    </body>
    </html>
  `)
})

// Update the /menu route
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
        .menu-item {
          background-color: #f9f9f9;
          border: 1px solid #ddd;
          border-radius: 4px;
          padding: 10px;
          margin-bottom: 10px;
          width: 300px;
        }
        .menu-item img {
          max-width: 100%;
          height: auto;
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
          fetch('${BACKEND_URL}/items')
            .then(res => res.json())
            .then(items => {
              const menuContainer = document.getElementById('menuContainer');
              items.forEach(item => {
                const itemElement = document.createElement('div');
                itemElement.className = 'menu-item';
                itemElement.innerHTML = "
                  <h3>+item.item_name+</h3>
                  <p>+item.item_desc+</p>
                  <p>Price: +{item.price.toFixed(2)+</p>
                  +{item.item_pic ? , <img src="data:image/jpeg;base64, {item.item_pic}" alt="+{item.item_name}">\` : ''}
                ";
                menuContainer.appendChild(itemElement);
              });
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