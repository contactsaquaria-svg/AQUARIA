# AQUARIA – Premium Fashion Bags & Handmade Footwear E-Commerce + Backend CMS

> **"Style in Every Step. Elegance in Every Carry."**  
> *Affordable Luxury Fashion Accessories Brand*

AQUARIA is a complete e-commerce platform and content management system featuring **two core product departments**:
1. **Fashion Bags** (Handbags, Tote Bags, Shoulder Bags, Crossbody Bags, Office Bags, Travel Bags)
2. **Handmade Fancy Footwear** (Fancy Sandals, Embellished Footwear, Handmade Flats, Party Wear, Ethnic Juttis, Occasion Wear)

---

## 🔗 Live Local Links

- **Storefront Website**: [http://localhost:3000](http://localhost:3000)
- **Admin CMS Portal**: [http://localhost:3000/admin](http://localhost:3000/admin) (or `/admin.html`)
- **Backend REST API**: [http://localhost:3000/api/data](http://localhost:3000/api/data)

---

## 🛠️ Complete Backend CMS Capabilities

The built-in Admin Portal allows you to edit anything on the website without touching code:

### 1. Hero Banner, Announcement & Policies
- Edit the top Announcement Bar text and shipping threshold (₹).
- Edit the Hero Headline (*"Style in Every Step. Elegance in Every Carry."*), sub-copy, and CTA button text.
- Upload new high-resolution hero campaign photos or paste photo URLs.

### 2. Department Posters & Banners
- **Bags Department**: Update poster title, sub-heading, description text, and department cover photography.
- **Footwear Atelier**: Update poster title, sub-heading, description text, and atelier cover photography.

### 3. Product Catalog & Price Management
- **Full CRUD Support**: Add new bags or footwear, edit existing items, or delete products.
- **Change Prices & Discounts**: Update selling prices in Indian Rupees (₹) and original prices.
- **Photos & Gallery**: Upload image files directly to the server or input photo URLs.
- **Footwear Sizes**: Manage available shoe sizes (e.g., `36, 37, 38, 39, 40, 41`).
- **Colors & Badges**: Add color swatches (`Royal Burgundy`, `Blush Pink`, `Champagne Gold`) and badges (`Bestseller`, `New Arrival`, `Handcrafted`).
- **Dimensions & Heel Profile**: Edit handbag measurements or footwear heel heights.

### 4. Brand Story & Manifesto
- Edit *"Fashion That Carries Your Story"* title, philosophy paragraphs, and collage images.

### 5. Why AQUARIA (4 Brand Pillars)
- Edit the titles and descriptions for all 4 highlights (*Affordable Luxury*, *Handmade Footwear*, *Versatile Fashion*, *Style for Every Occasion*).

### 6. Visual Style Diary & Instagram
- Update all 6 lookbook image tiles, tags, and captions with live photo previews.

### 7. Customer Reviews
- Edit or add customer feedback, review titles, star ratings, author names, and cities.

### 8. Contact & Atelier Information
- Edit phone support number, WhatsApp concierge number, official email, physical showroom address, operating hours, and customer service note in real-time.

### 9. Store Policies & Fitting Guides
- **Size Guide**: Footwear size conversion table (IND/UK, EU, Foot length in cm), fitting recommendation tips, and handbag proportions / laptop capacity guide.
- **Shipping Policy**: Complimentary delivery threshold (₹1,999), 24-48h dispatch timelines, express air delivery partners across India, transit insurance, and luxury rigid packaging.
- **Returns & Exchanges**: 7-day doorstep size exchange policy, reverse pickup details, unworn condition requirements, and instant UPI/bank refunds.
- **Privacy Policy**: 256-bit SSL transaction encryption, strict zero-third-party sharing rules, customer data rights, and payment security.

### 10. Customer Orders Inbox
- Real-time orders placed on the storefront automatically synchronize to the Admin Portal, displaying customer contact details, delivery addresses, line items with shoe sizes and colors, and order totals in INR.

---

## 📡 REST API Reference

| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/api/data` | `GET` | Retrieve full website data (brand, hero, departments, products, story, reviews) |
| `/api/data` | `POST` | Update website text, banners, hero settings, and sections |
| `/api/products` | `GET` | List all bags and footwear |
| `/api/products` | `POST` | Add a new product to the catalog |
| `/api/products/:id` | `PUT` | Update product details, prices, photos, and sizes |
| `/api/products/:id` | `DELETE` | Remove a product from the catalog |
| `/api/orders` | `GET` | Retrieve customer orders placed on the storefront |
| `/api/orders` | `POST` | Record a new storefront order |
| `/api/upload` | `POST` | Upload image file (saves to `/uploads/` and returns public URL) |

---

## 📁 Project Structure

```
AQUARIA/
├── index.html          # Responsive luxury storefront
├── admin.html          # Full-featured Admin CMS dashboard
├── server.js           # Node.js backend server with REST API & file uploader
├── css/
│   ├── style.css       # Storefront luxury styling
│   └── admin.css       # Admin dashboard styling
├── js/
│   ├── app.js          # Dynamic storefront app connected to backend API
│   ├── products.js     # Default fallback catalog data
│   └── admin.js        # Admin CMS logic & REST API integration
├── data/
│   └── site-data.json  # Persistent JSON database
├── uploads/            # Uploaded photos and banners directory
└── README.md           # Documentation
```
