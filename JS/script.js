document.addEventListener('DOMContentLoaded', function () {
    // --- Переменные ---
    let coffee = parseInt(localStorage.getItem('coffee')) || 0;
    let mulator = parseFloat(localStorage.getItem('mulator')) || 1;
    let upgradeLevel = parseInt(localStorage.getItem('upgradeLevel')) || 0;
    const maxUpgrades = 30;

    const initialUpgradeCost = 5;
    let upgradeCost = parseFloat(localStorage.getItem('upgradeCost')) || initialUpgradeCost;

    const timerDuration = 30; // Устанавливаем длительность таймера в 30 секунд
    let currentTimer = parseInt(localStorage.getItem('currentTimer')) || 0;
    let isTimerRunning = localStorage.getItem('isTimerRunning') === 'true' || false;
    let timerStartTime = parseInt(localStorage.getItem('timerStartTime')) || 0;
    let timerInterval = null;

    // --- Элементы на основной странице ---
    const coffeeButton = document.querySelector('.btn');
    const coffeeCountDisplay = document.querySelector('.counter');
    const timerDisplay = document.querySelector('.timer');
    const shopButton = document.querySelector('.shop');
    const exitButton = document.querySelector('.exit');

    // --- Проверка наличия элементов ---
    if (!coffeeButton) console.error('Кнопка с классом .btn не найдена на основной странице!');
    if (!coffeeCountDisplay) console.error('Элемент с классом .counter не найден на основной странице!');
    if (!timerDisplay) console.error('Элемент с классом .timer не найден на основной странице!');
    if (exitButton) {
        exitButton.addEventListener('click', function () {
            clearInterval(timerInterval);
            window.location.href = 'index.html';
        });
    } else {
        console.error('Кнопка .exit не найдена на основной странице!');
    }

    // --- Установка начальных значений и восстановление таймера ---
    if (coffeeCountDisplay) {
        coffeeCountDisplay.textContent = `${coffee} чашек`;
    }

    // --- Восстановление таймера при загрузке страницы ---
    if (isTimerRunning && timerStartTime > 0) {
        const currentTime = Math.floor(Date.now() / 1000);
        const elapsedTime = currentTime - timerStartTime;
        currentTimer = Math.max(0, timerDuration - elapsedTime);
        
        if (currentTimer > 0) {
            startTimer();
            timerDisplay.textContent = `${currentTimer} сек`;
        } else {
            isTimerRunning = false;
            currentTimer = 0;
            timerDisplay.textContent = `Готов`;
        }
    } else {
        isTimerRunning = false;
        currentTimer = 0;
        timerDisplay.textContent = `Готов`;
    }

    // --- Сохранение состояния ---
    function saveState() {
        localStorage.setItem('coffee', coffee);
        localStorage.setItem('mulator', mulator);
        localStorage.setItem('upgradeLevel', upgradeLevel);
        localStorage.setItem('upgradeCost', upgradeCost);
        localStorage.setItem('timerDuration', timerDuration);
        localStorage.setItem('currentTimer', currentTimer);
        localStorage.setItem('isTimerRunning', isTimerRunning);
        localStorage.setItem('timerStartTime', timerStartTime);
    }

    // --- Добавление кофе ---
    function addCoffee() {
        if (!isTimerRunning && coffeeButton && coffeeCountDisplay) {
            const coffeeToAdd = Math.floor(mulator);
            coffee += coffeeToAdd;
            coffeeCountDisplay.textContent = `${coffee} чашек`;
            console.log(`Добавлено кофе: ${coffeeToAdd} (множитель: ${mulator})`);
            startTimer();
            saveState();
        } else {
            console.log('Таймер еще идет, подождите!');
        }
    }

    // --- Запуск таймера ---
    function startTimer() {
        isTimerRunning = true;
        currentTimer = timerDuration;
        timerStartTime = Math.floor(Date.now() / 1000);
        
        if (timerDisplay) {
            timerDisplay.textContent = `${currentTimer} сек`;
        }
        saveState();

        clearInterval(timerInterval);
        timerInterval = setInterval(() => {
            const currentTime = Math.floor(Date.now() / 1000);
            const elapsedTime = currentTime - timerStartTime;
            currentTimer = Math.max(0, timerDuration - elapsedTime);
            
            if (timerDisplay) {
                timerDisplay.textContent = `${currentTimer} сек`;
            }
            saveState();

            if (currentTimer <= 0) {
                clearInterval(timerInterval);
                isTimerRunning = false;
                currentTimer = 0;
                timerStartTime = 0;
                if (timerDisplay) {
                    timerDisplay.textContent = `Готов`;
                }
                saveState();
            }
        }, 1000);
    }

    // --- Переход в магазин ---
    if (shopButton) {
        shopButton.addEventListener('click', function () {
            clearInterval(timerInterval);
            saveState();
            window.location.href = 'shop.html';
        });
    } else {
        console.log('Кнопка магазина (.shop) не найдена на основной странице.');
    }

    // --- Кнопка "Выпить" ---
    if (coffeeButton) {
        coffeeButton.addEventListener('click', addCoffee);
    }

    console.log('Скрипт кофе на основной странице успешно инициализирован.');
    console.log(`Текущий множитель: ${mulator}`);
});
