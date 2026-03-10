const fruitsForm = document.querySelector('#inputSection form')
const fruitList = document.querySelector('#fruitSection ul')
const fruitNutrition = document.querySelector('#nutritionSection p')
let cal = 0;

fruitsForm.addEventListener('submit', extractFruit)
function extractFruit(event) {
  event.preventDefault();
  const fruitName = event.target.fruitInput.value;
  fetchFruit(fruitName);
  event.target.fruitInput.value = '';
}


async function fetchFruit(fruit){
    try {
    const resp = await fetch(`https://fruit-app-backend-project-day2.onrender.com/fruits${fruit}`)
    if(resp.ok){
        const data = await resp.json();
        addFruit(data);

    } else {
        console.log(`Error: http status code ${resp.status}`);
    }
    } catch (error) {
        console.log(error);
    }
}

async function getFruitImage(fruitName){
  try {
    const PIXABAY_KEY = "54809905-c4085dd7e68bf445ba31b4319";
    const q = encodeURIComponent(fruitName);

    const resp = await fetch(
      `https://pixabay.com/api/?key=${PIXABAY_KEY}&q=${q}&image_type=photo&per_page=3&safesearch=true`
    );

    if (!resp.ok) {
      console.log(`Pixabay error: ${resp.status}`);
      return "https://via.placeholder.com/150";
    }

    const data = await resp.json();
    return data.hits?.[0]?.webformatURL;
  } catch (error) {
    console.log(error);
    return "https://via.placeholder.com/150";
  }
}

async function addFruit(fruit){
  const li = document.createElement('li');
  li.textContent = fruit.name;
  li.addEventListener('click', removeFruit);

    if (fruit.name.includes(' ')) {
        console.log('Please enter a fruit name without spaces.');
        return;
    }
  fruitList.appendChild(li);

  cal += fruit.nutritions.calories;
  fruitNutrition.textContent = `Total Calories: ${cal}`;
  li.dataset.calories = fruit.nutritions.calories;


    const imageUrl = await getFruitImage(fruit.name);
    const img = document.createElement('img');
    img.src = imageUrl;
    // img.alt = fruit.name;
    // img.style.width = '150px';
    li.appendChild(img);

}

function removeFruit(event){
    const li = event.target;
    const caloriesToRemove = Number(li.dataset.calories);
    cal -= caloriesToRemove;
    fruitNutrition.textContent = `Total Calories: ${cal}`;
    li.remove();
    
}


