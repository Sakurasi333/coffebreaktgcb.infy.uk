document.addEventListener('DOMContentLoaded', function() {
    // --- Переменные ---
    let coffee = parseInt(localStorage.getItem('coffee')) || 0;
    let upgradeLevel = parseInt(localStorage.getItem('upgradeLevel')) || 0;
    let mulator = parseFloat(localStorage.getItem('mulator')) || 1;
    const maxUpgrades = 30;

    const initialUpgradeCost = 5;
    const finalUpgradeCost = 100000;
    let upgradeCost = parseFloat(localStorage.getItem('upgradeCost')) || initialUpgradeCost;
    let mulatorText = localStorage.getItem('mulatorText') || 'Маленькая Чашка';

    const upgradeTiers = [
        { level: 0, text: 'Маленькая Чашка' },
        { level: 5, text: 'Средняя Чашка' },
        { level: 10, text: 'Большая Чашка' },
        { level: 15, text: 'Гигантская Кружка' },
        { level: 20, text: 'Турбо-Кофеварка' },
        { level: 25, text: 'Кофейный Завод' }
    ];

    // --- Получение элементов DOM ---
    const exitButton = document.querySelector('.exit');
    const buyUpgradeButton = document.querySelector('.btn');
    const upgradeNameDisplay = document.querySelector('.xbils');
    const coffeeCountDisplay = document.querySelector('.counter');

    // --- Проверка наличия элементов ---
    if (!exitButton) console.error('Ошибка: Кнопка .exit не найдена!');
    if (!buyUpgradeButton) console.error('Ошибка: Кнопка покупки улучшения (.btn) не найдена!');
    if (!upgradeNameDisplay) console.error('Ошибка: Элемент названия улучшения (.xbils) не найден!');
    if (!coffeeCountDisplay) console.error('Ошибка: Элемент счетчика кофе (.counter) не найден!');

    // --- Установка начальных значений на странице при загрузке ---
    updateUpgradeButtonText();
    updateUpgradeNameDisplay();
    updateCoffeeDisplay();

    // --- Сохранение текущего состояния в localStorage ---
    function saveState() {
        localStorage.setItem('coffee', coffee);
        localStorage.setItem('upgradeLevel', upgradeLevel);
        localStorage.setItem('upgradeCost', upgradeCost);
        localStorage.setItem('mulatorText', mulatorText);
        localStorage.setItem('mulator', mulator);
    }

    // --- Обновление текста кнопки покупки ---
    function updateUpgradeButtonText() {
        if (buyUpgradeButton) {
            const formattedCost = Math.ceil(upgradeCost);
            buyUpgradeButton.textContent = `Улучшить | ${formattedCost} Чашек`;
        }
    }

    // --- Обновление текста названия кружки/аппарата ---
    function updateUpgradeNameDisplay() {
        if (upgradeNameDisplay) {
            upgradeNameDisplay.textContent = `${mulatorText} (x${mulator})`;
        }
    }

    // --- Обновление отображения количества кофе ---
    function updateCoffeeDisplay() {
        if (coffeeCountDisplay) {
            coffeeCountDisplay.textContent = `${coffee} чашек`;
        }
    }

    // --- Логика покупки улучшения ---
    function buyUpgrade() {
        const cost = Math.ceil(upgradeCost);

        if (coffee >= cost && upgradeLevel < maxUpgrades) {
            coffee -= cost;
            upgradeLevel++;
            upgradeCost = initialUpgradeCost * Math.pow(finalUpgradeCost/initialUpgradeCost, upgradeLevel/maxUpgrades);
            mulator = 1 + (upgradeLevel * (upgradeLevel + 1) / 2);

            let newMulatorText = mulatorText;
            for (let i = upgradeTiers.length - 1; i >= 0; i--) {
                if (upgradeLevel >= upgradeTiers[i].level) {
                    newMulatorText = upgradeTiers[i].text;
                    break;
                }
            }
            if (upgradeLevel >= 5) {
                newMulatorText = `x${upgradeLevel} Кофемашина`;
            }
            mulatorText = newMulatorText;

            saveState();
            updateUpgradeButtonText();
            updateUpgradeNameDisplay();
            updateCoffeeDisplay();

        } else if (coffee < cost) {
            alert('Недостаточно кофе для улучшения!');
        } else if (upgradeLevel >= maxUpgrades) {
            alert('Достигнут максимальный уровень улучшений!');
            if(buyUpgradeButton) {
                buyUpgradeButton.disabled = true;
                buyUpgradeButton.textContent = 'Макс. уровень';
            }
        }
    }

    // --- Проверка максимального уровня при загрузке ---
    if (upgradeLevel >= maxUpgrades) {
        if(buyUpgradeButton) {
            buyUpgradeButton.disabled = true;
            buyUpgradeButton.textContent = 'Макс. уровень';
        }
    }

    // --- Обработчик события для кнопки "Выход" ---
    if (exitButton) {
        exitButton.addEventListener('click', function() {
            saveState();
            window.location.href = 'index.html';
        });
    }

    // --- Обработчик события для кнопки покупки улучшения ---
    if (buyUpgradeButton) {
        buyUpgradeButton.addEventListener('click', buyUpgrade);
    }

    console.log('Скрипт магазина успешно инициализирован.');
});