const API_KEY = '3986f7f7e3fe6d81b93a8cb38f795c43'; // Chave da API do OpenWeatherMap

// Atualiza a data e a hora no formato desejado
function updateDateTime() {
    const now = new Date();
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit', weekday: 'long' };
    document.getElementById('datetime').innerText = now.toLocaleDateString('pt-BR', options);
}

// Exibe a previsão do tempo para a cidade escrita
function showWeather() {
    const city = 'São Paulo, curitiba'; // Cidade fixa para exibir a previsão
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&lang=pt_br&units=metric`)
        .then(response => response.json())
        .then(data => {
            if (data.cod === 200) {
                document.getElementById('weather').innerHTML = `
                    <h2>Previsão do Tempo em ${city}</h2>
                    <p>Temperatura: ${data.main.temp}°C</p>
                    <p>Condição: ${data.weather[0].description}</p>
                    <p>Umidade: ${data.main.humidity}%</p>
                    <p>Vento: ${data.wind.speed} m/s</p>
                `;
            } else {
                document.getElementById('weather').innerHTML = `<p>${data.message || 'Cidade não encontrada.'}</p>`;
            }
        })
        .catch(error => {
            document.getElementById('weather').innerHTML = `<p>Erro ao buscar a previsão do tempo: ${error.message}</p>`;
        });
}

// Busca e exibe a previsão do tempo para a cidade inserida pelo usuário
function searchWeather() {
    const city = document.getElementById('city').value.trim();
    if (!city) {
        alert('Por favor, insira o nome da cidade.');
        return;
    }
    document.getElementById('city-name').innerText = `Previsão do Tempo para ${city}`;
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&lang=pt_br&units=metric`)
        .then(response => response.json())
        .then(data => {
            if (data.cod === 200) {
                document.getElementById('weather').innerHTML = `
                    <h2>Previsão do Tempo em ${city}</h2>
                    <p>Temperatura: ${data.main.temp}°C</p>
                    <p>Condição: ${data.weather[0].description}</p>
                    <p>Umidade: ${data.main.humidity}%</p>
                    <p>Vento: ${data.wind.speed} m/s</p>
                `;
            } else {
                document.getElementById('weather').innerHTML = `<p>${data.message || 'Cidade não encontrada.'}</p>`;
            }
        })
        .catch(error => {
            document.getElementById('weather').innerHTML = `<p>Erro ao buscar a previsão do tempo: ${error.message}</p>`;
        });
}

// Função para exibir sugestões de cidades enquanto o usuário digita
function autocomplete() {
    const input = document.getElementById('city');
    const value = input.value.trim();
    if (!value) {
        closeAllLists();
        return;
    }

    fetch(`https://api.openweathermap.org/data/2.5/find?q=${value}&appid=${API_KEY}&lang=pt_br`)
        .then(response => response.json())
        .then(data => {
            closeAllLists();
            if (!data.list.length) {
                return;
            }
            const list = document.createElement('DIV');
            list.setAttribute('id', 'autocomplete-list');
            list.setAttribute('class', 'autocomplete-items');
            input.parentNode.appendChild(list);

            data.list.forEach(item => {
                const div = document.createElement('DIV');
                div.innerHTML = `${item.name}, ${item.sys.country}`;
                div.addEventListener('click', () => {
                    input.value = `${item.name}, ${item.sys.country}`;
                    closeAllLists();
                });
                list.appendChild(div);
            });
        })
        .catch(error => console.error('Erro ao buscar sugestões de cidades:', error));
}

// Fecha todas as listas de sugestões
function closeAllLists() {
    const items = document.getElementsByClassName('autocomplete-items');
    while (items.length) {
        items[0].parentNode.removeChild(items[0]);
    }
}

// Fecha as listas de sugestões ao clicar fora do campo de entrada
document.addEventListener('click', (e) => {
    if (e.target !== document.getElementById('city')) {
        closeAllLists();
    }
});

// Função para rolar a página até o topo
function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Atualiza a data e a hora a cada segundo
setInterval(updateDateTime, 1000);
// Atualiza a data e a hora imediatamente ao carregar a página
updateDateTime();
