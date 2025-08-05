document.addEventListener('DOMContentLoaded', () => {
    // --- Elementos del DOM ---
    const gameBoard = document.getElementById('game-board');
    const timerDisplay = document.getElementById('timer');
    const modal = document.getElementById('modal');
    const finalImage = document.getElementById('final-image');
    const restartButton = document.getElementById('restart-button');

    // --- Configuración y Estado del Juego ---
    const cardImages = [
        '1.gif', '2.webp', '3.webp', '4.jpeg', 
        '5.jpeg', '6.jpeg', '7.jpeg', '8.jpeg'
    ];
    let cards = [];
    let flippedCards = [];
    let matchedPairs = 0;
    let lockBoard = false; // Bloquea el tablero para evitar más de 2 clics
    let timer;
    let timeLeft = 60;

    // --- Funciones del Juego ---

    // 1. Barajar el array de cartas
    function shuffle(array) {
        let currentIndex = array.length, randomIndex;
        while (currentIndex !== 0) {
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;
            [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
        }
        return array;
    }

    // 2. Crear y renderizar el tablero
    function createBoard() {
        // Reiniciar variables de estado
        gameBoard.innerHTML = '';
        matchedPairs = 0;
        lockBoard = false;
        flippedCards = [];
        
        const gameImages = shuffle([...cardImages, ...cardImages]);

        gameImages.forEach(imageName => {
            const card = document.createElement('div');
            card.classList.add('card');
            card.dataset.image = imageName;

            card.innerHTML = `
                <div class="card-face card-back">
                    <img src="img/back.png" alt="Reverso de la carta">
                </div>
                <div class="card-face card-front">
                    <img src="img/${imageName}" alt="Frente de la carta">
                </div>
            `;
            gameBoard.appendChild(card);
            card.addEventListener('click', flipCard);
        });
    }

    // 3. Lógica para voltear una carta
    function flipCard() {
        if (lockBoard) return;
        if (this === flippedCards[0]) return; // Evita doble clic en la misma carta

        this.classList.add('is-flipped');
        flippedCards.push(this);

        if (flippedCards.length === 2) {
            lockBoard = true;
            checkForMatch();
        }
    }

    // 4. Verificar si las dos cartas volteadas coinciden
    function checkForMatch() {
        const [card1, card2] = flippedCards;
        const isMatch = card1.dataset.image === card2.dataset.image;

        isMatch ? disableCards() : unflipCards();
    }

    // 5. Si coinciden, desactivarlas
    function disableCards() {
        flippedCards[0].removeEventListener('click', flipCard);
        flippedCards[1].removeEventListener('click', flipCard);

        flippedCards[0].classList.add('is-matched');
        flippedCards[1].classList.add('is-matched');
        
        matchedPairs++;
        resetBoard();

        if (matchedPairs === cardImages.length) {
            winGame();
        }
    }

    // 6. Si no coinciden, voltearlas de nuevo
    function unflipCards() {
        setTimeout(() => {
            flippedCards[0].classList.remove('is-flipped');
            flippedCards[1].classList.remove('is-flipped');
            resetBoard();
        }, 1200); // Pausa para que el jugador vea la segunda carta
    }

    // 7. Reiniciar el estado de las cartas volteadas
    function resetBoard() {
        [flippedCards, lockBoard] = [[], false];
    }

    // 8. Iniciar y controlar el temporizador
    function startTimer() {
        timeLeft = 60;
        timerDisplay.textContent = timeLeft;
        clearInterval(timer); // Limpiar cualquier temporizador anterior

        timer = setInterval(() => {
            timeLeft--;
            timerDisplay.textContent = timeLeft;
            if (timeLeft <= 0) {
                loseGame();
            }
        }, 1000);
    }

    // 9. Acciones al ganar el juego
    function winGame() {
        clearInterval(timer);
        finalImage.src = 'img/ganaste.gif';
        setTimeout(() => modal.classList.add('visible'), 500);
    }

    // 10. Acciones al perder el juego
    function loseGame() {
        clearInterval(timer);
        lockBoard = true; // Bloquear todo el tablero
        finalImage.src = 'img/perdiste.gif';
        setTimeout(() => modal.classList.add('visible'), 500);
    }

    // 11. Función para iniciar o reiniciar el juego
    function startGame() {
        modal.classList.remove('visible');
        createBoard();
        startTimer();
    }
    
    // --- Event Listeners ---
    restartButton.addEventListener('click', startGame);

    // --- Inicio del Juego ---
    startGame();
});