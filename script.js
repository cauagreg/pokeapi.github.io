let correctPokemon;
let options = [];

// Função para buscar um Pokémon aleatório pela API
async function getRandomPokemon() {
    const randomId = Math.floor(Math.random() * 150) + 1; // Pega um Pokémon aleatório entre 1 e 150 (Geração 1)
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${randomId}`);
    const data = await response.json();
    return data;
}

// Função para buscar quatro Pokémon aleatórios e embaralhar as opções
async function generateQuestion() {
    correctPokemon = await getRandomPokemon(); // Pokémon correto
    options = [correctPokemon]; // Adiciona o Pokémon correto nas opções
    
    // Adiciona mais 3 Pokémon aleatórios nas opções
    while (options.length < 4) {
        const randomPokemon = await getRandomPokemon();
        if (!options.some(pokemon => pokemon.name === randomPokemon.name)) {
            options.push(randomPokemon);
        }
    }
    
    // Embaralha as opções
    options.sort(() => Math.random() - 0.5);
    
    displayQuestion(); // Exibe a imagem e as opções de resposta
}

// Função para exibir a imagem do Pokémon e as opções de resposta
function displayQuestion() {
    const pokemonImage = document.getElementById('pokemonImage');
    pokemonImage.src = correctPokemon.sprites.front_default; // Exibe a imagem do Pokémon
    pokemonImage.style.display = 'block';
    
    const optionButtons = document.querySelectorAll('.option-button');
    
    // Define o texto de cada botão com o nome dos Pokémon nas opções
    options.forEach((option, index) => {
        optionButtons[index].innerText = capitalizeFirstLetter(option.name);
        optionButtons[index].style.display = 'inline-block';
        optionButtons[index].onclick = () => checkAnswer(option);
    });
    
    // Esconde o botão "Próximo" inicialmente
    document.getElementById('nextButton').style.display = 'none';
}

// Função para verificar se a resposta está correta
function checkAnswer(selected) {
    const resultDiv = document.getElementById('result');
    if (selected.name === correctPokemon.name) {
        resultDiv.innerHTML = '<p>Correto!</p>';
    } else {
        resultDiv.innerHTML = `<p>Incorreto! O Pokémon correto era: ${capitalizeFirstLetter(correctPokemon.name)}</p>`;
    }
    
    // Exibe o botão "Próximo" como uma das opções
    const nextButton = document.getElementById('nextButton');
    nextButton.style.display = 'inline-block';
    nextButton.onclick = () => {
        resultDiv.innerHTML = ''; // Limpa o resultado anterior
        nextButton.style.display = 'none'; // Esconde o botão "Próximo"
        generateQuestion(); // Gera uma nova pergunta
    };
}

// Função para capitalizar a primeira letra do nome do Pokémon
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// Inicializa o jogo ao carregar a página
generateQuestion();
