const firstNames = ["James", "Mary", "John", "Patricia", "Robert", "Jennifer", "Michael", "Linda", "William", "Elizabeth", "David", "Barbara", "Richard", "Susan", "Joseph", "Jessica", "Thomas", "Sarah", "Charles", "Karen"];
const lastNames = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez", "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson", "Thomas", "Taylor", "Moore", "Jackson", "Martin"];
const streets = ["Main St", "Oak Ave", "Pine St", "Maple Ave", "Cedar Ln", "Elm St", "Washington St", "Lakeview Dr", "Park Ave", "2nd St"];
const cities = ["Springfield", "Riverside", "Franklin", "Greenville", "Clinton", "Fairview", "Madison", "Georgetown", "Arlington", "Ashland"];
const states = ["CA", "TX", "FL", "NY", "PA", "IL", "OH", "GA", "NC", "MI", "NJ", "VA", "WA", "AZ", "MA"];

const getRandomItem = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];

export const generateFakeId = () => {
    const firstName = getRandomItem(firstNames);
    const lastName = getRandomItem(lastNames);
    const street = `${Math.floor(Math.random() * 900) + 100} ${getRandomItem(streets)}`;
    const city = getRandomItem(cities);
    const state = getRandomItem(states);
    const zip = Math.floor(Math.random() * 90000) + 10000;
    const phone = `(${Math.floor(Math.random() * 800) + 200}) 555-${String(Math.floor(Math.random() * 9000) + 1000).padStart(4, '0')}`;
    const birthDate = new Date(
        Date.now() - Math.floor(Math.random() * 50 * 365 + 18 * 365) * 24 * 60 * 60 * 1000
    ).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

    return {
        name: `${firstName} ${lastName}`,
        address: `${street}, ${city}, ${state} ${zip}`,
        phone,
        birthDate,
        email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}${Math.floor(Math.random() * 100)}@example.com`,
    };
};
