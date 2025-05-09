document.addEventListener("DOMContentLoaded", function () {
    fetchBreeds();
});

async function fetchBreeds() {
    const response = await fetch("https://dog.ceo/api/breeds/list/all");
    const data = await response.json();
    const breedList = Object.keys(data.message);
    
    const dataList = document.getElementById("breeds");
    breedList.forEach(breed => {
        let option = document.createElement("option");
        option.value = breed;
        dataList.appendChild(option);
    });
}

let interval; 

function showImages() {
    const breedInput = document.getElementById("breed-input").value.toLowerCase();
    const imageContainer = document.getElementById("image-container");
    imageContainer.innerHTML = "";

    if (!breedInput) {
        imageContainer.innerHTML = "<p>Please enter a breed</p>";
        return;
    }


    if (interval) clearInterval(interval);

    function fetchRandomImage() {
        fetch(`https://dog.ceo/api/breed/${breedInput}/images/random`)
            .then(response => response.json())
            .then(data => {
                if (data.status === "success") {
                    imageContainer.innerHTML = `<img src="${data.message}" alt="${breedInput}" width="100%">`;
                } else {
                    imageContainer.innerHTML = "<p>No such breed found</p>";
                    clearInterval(interval);
                }
            })
            .catch(() => {
                imageContainer.innerHTML = "<p>Error fetching breed</p>";
                clearInterval(interval);
            });
    }


    fetchRandomImage();


    interval = setInterval(fetchRandomImage, 5000);
}
