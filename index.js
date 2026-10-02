import { heroDishes } from './data.js'

const heroDiv = document.getElementById('hero-div')

function createHerodiv(data) {

    const {
        id,
        name,
        category,
        price,
        rating,
        description,
        image,
        tags,
        spicy
    } = data

    return `
        <div id="herojs">

            <img 
                src="${image}" 
                alt="${name}" 
                class="hero-product-img"
            >

            <div class="hero-content">
                <p class="hero-category">${category}</p>
                
                <h1 class="hero-heading">
                    Delicious food for
                    <span class="span-hero">Every Mood</span>
                </h1>

                <h2 class="hero-name">${name}</h2>

                <p class="hero-des">${description}</p>

                <h4 class="hero-rating">★ ${rating}</h4>

                <div class="hero-buttons">
                    <button class="hero-menu-button">
                        Explore Menu
                    </button>

                    <button class="hero-book-button">
                        Book Table
                    </button>
                </div>

            </div>

        </div>
    `
}

heroDiv.innerHTML = createHerodiv(heroDishes[0])