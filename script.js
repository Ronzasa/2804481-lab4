const searchBtn = document.getElementById('search-btn');
const countryInput = document.getElementById('country-input');
const loadingSpinner = document.getElementById('loading-spinner');
const countryInfo = document.getElementById('country-info');
const borderingCountries = document.getElementById('bordering-countries');
const errorMessage = document.getElementById('error-message');

// Main search function
async function searchCountry(countryName) {
    if (!countryName) {
        showError("Please enter a country name.");
        return;
    }

    try {
        // Clear previous results
        countryInfo.innerHTML = "";
        borderingCountries.innerHTML = "";
        errorMessage.textContent = "";

        // Show loading spinner
        loadingSpinner.style.display = "block";

        // Fetch country data
        const response = await fetch(`https://restcountries.com/v3.1/name/${countryName}`);

        if (!response.ok) {
            throw new Error("Country not found.");
        }

        const data = await response.json();
        const country = data[0];

        // Display main country info
        countryInfo.innerHTML = `
            <h2>${country.name.common}</h2>
            <p><strong>Capital:</strong> ${country.capital ? country.capital[0] : "N/A"}</p>
            <p><strong>Population:</strong> ${country.population.toLocaleString()}</p>
            <p><strong>Region:</strong> ${country.region}</p>
            <img src="${country.flags.svg}" alt="${country.name.common} flag" width="150">
        `;

        // Fetch bordering countries if they exist
        if (country.borders && country.borders.length > 0) {
            for (let code of country.borders) {
                const borderResponse = await fetch(`https://restcountries.com/v3.1/alpha/${code}`);
                const borderData = await borderResponse.json();
                const borderCountry = borderData[0];

                borderingCountries.innerHTML += `
                    <div class="border-card">
                        <img src="${borderCountry.flags.svg}" 
                             alt="${borderCountry.name.common} flag" 
                             width="100">
                        <p>${borderCountry.name.common}</p>
                    </div>
                `;
            }
        } else {
            borderingCountries.innerHTML = "<p>No bordering countries.</p>";
        }

    } catch (error) {
        showError(error.message);
    } finally {
        // Hide loading spinner
        loadingSpinner.style.display = "none";
    }
}

// Error display function
function showError(message) {
    errorMessage.textContent = message;
}

// Button click event
searchBtn.addEventListener('click', () => {
    const country = countryInput.value.trim();
    searchCountry(country);
});

// Enter key event
countryInput.addEventListener('keypress', (event) => {
    if (event.key === "Enter") {
        const country = countryInput.value.trim();
        searchCountry(country);
    }
});