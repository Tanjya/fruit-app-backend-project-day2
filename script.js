const fruitsForm = document.querySelector('#inputSection form');
const fruitList = document.querySelector('#fruitSection ul');
const fruitNutrition = document.querySelector('#nutritionSection p');
const createFruitForm = document.querySelector('#createFruitForm');

let cal = 0;

fruitsForm.addEventListener('submit', extractFruit);
createFruitForm.addEventListener('submit', handleCreateFruit);

function extractFruit(event) {
  event.preventDefault();
  const fruitName = event.target.fruitInput.value.trim();
  fetchFruit(fruitName);
  event.target.fruitInput.value = '';
}

async function handleCreateFruit(event) {
  event.preventDefault();

  const genus = document.querySelector('#fruitGenus').value.trim();
  const name = document.querySelector('#fruitName').value.trim();
  const family = document.querySelector('#fruitFamily').value.trim();
  const order = document.querySelector('#fruitOrder').value.trim();

  const newFruit = { genus, name, family, order };
  console.log(newFruit);

  try {
    const resp = await fetch(
      "https://fruit-app-backend-project-day2.onrender.com/fruits",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(newFruit)
      }
    );

    const data = await resp.json();
    console.log(data);

  } catch (error) {
    console.log(error);
  }
}

async function fetchFruit(fruit) {
  try {
    const resp = await fetch(`https://fruit-app-backend-project-day2.onrender.com/fruits/${fruit}`);
    if (resp.ok) {
      const data = await resp.json();

      if (Array.isArray(data)) {
        data.forEach(fruit => addFruit(fruit));
      } else {
        addFruit(data);
      }
    } else {
      console.log(`Error: http status code ${resp.status}`);
    }
  } catch (error) {
    console.log(error);
  }
}

async function getFruitImage(fruitName) {
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
    return data.hits?.[0]?.webformatURL || "https://via.placeholder.com/150";
  } catch (error) {
    console.log(error);
    return "https://via.placeholder.com/150";
  }
}

async function addFruit(fruit) {
  if (fruit.name.includes(' ')) {
    console.log('Please enter a fruit name without spaces.');
    return;
  }

  const li = document.createElement('li');
  li.textContent = fruit.name;
  li.addEventListener('click', removeFruit);

  fruitList.appendChild(li);

  cal += fruit.nutritions.calories;
  fruitNutrition.textContent = `Total Calories: ${cal}`;
  li.dataset.calories = fruit.nutritions.calories;

  const imageUrl = await getFruitImage(fruit.name);
  const img = document.createElement('img');
  img.src = imageUrl;
  li.appendChild(img);
}

async function removeFruit(event) {
  const li = event.currentTarget;
  const caloriesToRemove = Number(li.dataset.calories);
  cal -= caloriesToRemove;
  fruitNutrition.textContent = `Total Calories: ${cal}`;
  li.remove();

//delete section
}