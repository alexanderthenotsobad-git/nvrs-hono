import { Hono } from 'hono'
import { serveStatic } from 'hono/cloudflare-workers'

const app = new Hono()

// Serve static files from the 'public' directory
app.use('/*', serveStatic({ root: './' }))

//app.fire({ port:8787 });

// Replace this with your actual backend URL
//const BACKEND_URL = 'https://alexanderthenotsobad.us/api/items'

// Add root route
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
        <a href="/employee" class="button">Employee</a>
        <a href="/patron" class="button">Patron</a>
        <a href="/add-menu-items" class="button">Add menu items</a>
        <a href="/menu" class="button">Menu</a>
      </div>
    </body>
    </html>
  `)
})

// Rename '/employee' route to '/add-menu-items'
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
      // Dechare backend url
        const BACKEND_URL = 'https://alexanderthenotsobad.us/api/items/create/'; // Ensure this is properly defined

const fetchData = async () => {
  try {
    const response = await fetch(BACKEND_URL, { // No need for template literals unless you're adding variables to the URL
      method: 'POST', // Specify the request method
      headers: {
        'Content-Type': 'application/json', // Ensure the backend knows the data format
      },
      body: JSON.stringify(formData), // Convert formData object to JSON
    });



    const data = await response.json();
    console.log('Success:', data);
  } catch (error) {
    console.error('Error:', error);
  }
};

// Call the function to post data
fetchData();

      </script>
    </body>
    </html>
  `)
})

// Add a new '/employee' route
app.get('/employee', (c) => {
  return c.html(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Employee Page - VRS Prototype</title>
      <link rel="stylesheet" href="/styles.css">
    </head>
    <body>
      <div class="container">
        <h1>Employee Page</h1>
        <p>This is the employee page. Add employee-specific content here.</p>
        <a href="/" class="button">Back to Home</a>
      </div>
    </body>
    </html>
  `)
})

// Add a new '/patron' route
app.get('/patron', (c) => {
  return c.html(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Patron Page - VRS Prototype</title>
      <link rel="stylesheet" href="/styles.css">
    </head>
    <body>
      <div class="container">
        <h1>Patron Page</h1>
        <p>This is the patron page. Add patron-specific content here.</p>
        <a href="/" class="button">Back to Home</a>
      </div>
    </body>
    </html>
  `)
})

// Keep the existing '/menu' route
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
        document.addEventListener('DOMContentLoaded', () => {
          fetchMenu();
        });

        function fetchMenu() {
          const menuContainer = document.getElementById('menuContainer');

          fetch("https://alexanderthenotsobad.us/api/items/items")
            .then(response => {
              if (!response.ok) {
                throw new Error('Network response was not ok');
              }
              return response.json();
            })
            .then(data => {
              const items = data.item.flat(); // Flatten array if necessary

              // Clear the container before appending new content
              menuContainer.innerHTML = '';

              // Organize items by category
              const categories = groupItemsByCategory(items);

              // Display each category with its items
              displayCategories(categories, menuContainer);
            })
            .catch(error => {
              console.error('Error fetching menu:', error);
            });
        }

        function groupItemsByCategory(items) {
          return items.reduce((acc, item) => {
            acc[item.category] = acc[item.category] || [];
            acc[item.category].push(item);
            return acc;
          }, {});
        }

        function displayCategories(categories, container) {
          Object.entries(categories).forEach(([category, categoryItems]) => {
            const categoryElement = document.createElement('div');
            categoryElement.className = 'menu-category';
            categoryElement.innerHTML = '<h2>' + category + '</h2>';

            // Append each item to the category
            categoryItems.forEach((item) => {
              const itemElement = createMenuItemElement(item);
              categoryElement.appendChild(itemElement);
            });

            container.appendChild(categoryElement);
          });
        }

        function createMenuItemElement(item) {
          const itemElement = document.createElement('div');
          itemElement.className = 'menu-item';

          // Use concatenation instead of back ticks
          itemElement.innerHTML = '<img src="data:image/jpeg;base64,' + item.item_pic + '" alt="' + item.item_name + '">' +
            '<div>' +
            '<h3>' + item.item_name + '</h3>' +
            '<p>' + item.item_desc + '</p>' +
            '<p>Price: $' + item.price + '</p>' +
            '</div>';
          
          return itemElement;
        }
      </script>
    </body>
    </html>
  `);
});

export default app