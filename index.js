import { heroDishes } from './data.js'

const heroDiv = document.getElementById('hero-div')
const menumain = document.getElementById('menu-main')

const moveAmount = 270 ;
const menuTrack = document.getElementById('menu-main')
let currentIndex = 0;
const leftButton = document.getElementById('left-menuu');
const rightButton = document.getElementById('right-menuu');


leftButton.addEventListener('click', () => {

    if (currentIndex > 0) {
        currentIndex -= 1;

        menuTrack.style.transform =
            `translateX(-${currentIndex * moveAmount}px)`;
    }

})
rightButton.addEventListener('click', () => {

    if (currentIndex < heroDishes.length - 4) {
        currentIndex += 1;

        menuTrack.style.transform =
            `translateX(-${currentIndex * moveAmount}px)`;
    }

})


const  createHerodiv = (data) => {

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

heroDiv.innerHTML = createHerodiv(heroDishes[7])

const menuRender = (menu) =>{
   
       
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
    } = menu

    return `
              <div class = "menujs">
                
                 <img src="${image}"
                       alt="menu img"
                       class="menu-imgjs"
                 >

                 <div class = "menujs-text">
                           <h2 class="menu-name">${name}</h2>
                           <p class = "menu-des">${description}</p>
                           <h5 class="menu-rating">⭐${rating}</h5>
                 </div>
                  
                 <div class ="menu-buttons">
                           <h4 class="menu-price">$${price}
                            <button class = "menu-button"> Add </button>
                   
                 
                 </div>
              
              
              
              </div>
        
    `

}
menumain.innerHTML = heroDishes.map(menuRender).join('')