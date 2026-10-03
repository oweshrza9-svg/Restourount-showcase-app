# 🍽️ Apito's Restaurant

> A premium, responsive restaurant website built with vanilla HTML, CSS, and JavaScript.

Apito's Restaurant is a modern restaurant website focused on creating a warm, elegant, and interactive dining experience through thoughtful UI design and vanilla JavaScript.

The project was built from scratch to practice and strengthen frontend fundamentals while creating something that feels like a real-world product rather than a tutorial project.

---

## ✨ Features

- 🎨 Premium warm and elegant restaurant UI
- 📱 Fully responsive design
- 🖼️ Full-screen hero section with dynamic dish information
- 🍴 Dynamic menu cards generated from JavaScript data
- 🎠 Interactive horizontal menu carousel
- ⭐ Top-rated dishes section with bento-style layout
- 🧩 Reusable rendering functions
- 📊 Dynamic dish sorting based on ratings
- 🖱️ Hover animations and smooth transitions
- 📱 Mobile navigation menu
- 🦶 Responsive footer with newsletter section
- ⚡ Built without frameworks

---

## 🛠️ Tech Stack

### Frontend

- HTML5
- CSS3
- JavaScript (ES6+)

### JavaScript Concepts Used

- Arrays & Objects
- Destructuring
- `map()`
- `filter()`
- `sort()`
- `slice()`
- `forEach()`
- Template Literals
- `join()`
- DOM Manipulation
- Event Listeners
- `classList.toggle()`
- ES Modules
- Dynamic HTML Rendering
- Basic UI State Management

---

## 🧠 How It Works

The restaurant dishes are stored as JavaScript objects inside a data array.

```js
const heroDishes = [
  {
    id: 1,
    name: "Truffle Ribeye Steak",
    category: "Main Course",
    price: 899,
    rating: 4.9,
    description: "Char-grilled ribeye served with roasted vegetables.",
    image: "...",
    tags: ["meat", "premium", "chef-pick"],
    spicy: false
  }
]
