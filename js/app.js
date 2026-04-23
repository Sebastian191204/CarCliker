// ===== MODEL =====
class CarModel {
    constructor() {
        this.cars = [
            {
                id: 1,
                name: 'Maserati GranTurismo',
                image: 'img/black-convertible-coupe.jpg',
                votes: 0
            },
            {
                id: 2,
                name: 'Chevrolet Camaro SS',
                image: 'img/chevrolet-camaro.jpg',
                votes: 0
            },
            {
                id: 3,
                name: 'Dodge Charger',
                image: 'img/dodge-charger.jpg',
                votes: 0
            },
            {
                id: 4,
                name: 'Ford Mustang Clásico',
                image: 'img/ford-mustang.jpg',
                votes: 0
            },
            {
                id: 5,
                name: 'Mercedes 300 SL 1957',
                image: 'img/mercedes-benz.jpg',
                votes: 0
            }
        ];
        this.currentCarId = 1;
        this.loadVotes();
    }

    getCurrentCar() {
        return this.cars.find(car => car.id === this.currentCarId);
    }

    getCarById(id) {
        return this.cars.find(car => car.id === id);
    }

    addVote(carId) {
        const car = this.getCarById(carId);
        if (car) {
            car.votes++;
            this.saveVotes();
        }
    }

    setCurrentCar(carId) {
        this.currentCarId = carId;
    }

    getAllCars() {
        return this.cars;
    }

    getRanking() {
        return [...this.cars].sort((a, b) => b.votes - a.votes);
    }

    saveVotes() {
        localStorage.setItem('carVotes', JSON.stringify(this.cars));
    }

    loadVotes() {
        const saved = localStorage.getItem('carVotes');
        if (saved) {
            const savedCars = JSON.parse(saved);
            this.cars.forEach(car => {
                const savedCar = savedCars.find(c => c.id === car.id);
                if (savedCar) {
                    car.votes = savedCar.votes;
                }
            });
        }
    }
}

// ===== VIEW =====
class CarView {
    constructor() {
        this.carList = document.getElementById('carList');
        this.carImage = document.getElementById('carImage');
        this.carName = document.getElementById('carName');
        this.carVotes = document.getElementById('carVotes');
        this.voteBtn = document.getElementById('voteBtn');
        this.statsContainer = document.getElementById('statsContainer');
    }

    renderCarList(cars, activeCarId) {
        this.carList.innerHTML = '';
        cars.forEach(car => {
            const carItem = document.createElement('div');
            carItem.className = `car-item ${car.id === activeCarId ? 'active' : ''}`;
            carItem.textContent = car.name;
            carItem.dataset.carId = car.id;
            this.carList.appendChild(carItem);
        });
    }

    renderCarDisplay(car) {
        this.carImage.src = car.image;
        this.carImage.alt = car.name;
        this.carName.textContent = car.name;
        this.carVotes.textContent = `Votos: ${car.votes}`;
    }

    renderStats(ranking) {
        this.statsContainer.innerHTML = '';
        ranking.forEach((car, index) => {
            const statItem = document.createElement('div');
            statItem.className = 'stat-item';
            statItem.innerHTML = `
                <span class="stat-item-name">${index + 1}. ${car.name}</span>
                <span class="stat-item-count">${car.votes} votos</span>
            `;
            this.statsContainer.appendChild(statItem);
        });
    }

    getVoteButton() {
        return this.voteBtn;
    }

    showVoteAnimation() {
        this.voteBtn.style.transform = 'scale(0.95)';
        setTimeout(() => {
            this.voteBtn.style.transform = 'scale(1)';
        }, 100);
    }
}

// ===== CONTROLLER =====
class CarController {
    constructor(model, view) {
        this.model = model;
        this.view = view;
        this.init();
    }

    init() {
        // Render inicial
        this.updateUI();

        // Event listeners usando event delegation
        this.view.carList.addEventListener('click', (e) => {
            if (e.target.classList.contains('car-item')) {
                const carId = parseInt(e.target.dataset.carId);
                this.selectCar(carId);
            }
        });

        this.view.getVoteButton().addEventListener('click', () => {
            this.voteCar();
        });
    }

    selectCar(carId) {
        this.model.setCurrentCar(carId);
        this.updateUI();
    }

    voteCar() {
        const currentCar = this.model.getCurrentCar();
        this.model.addVote(currentCar.id);
        this.view.showVoteAnimation();
        this.updateUI();
    }

    updateUI() {
        const currentCar = this.model.getCurrentCar();
        const allCars = this.model.getAllCars();
        const ranking = this.model.getRanking();

        this.view.renderCarList(allCars, this.model.currentCarId);
        this.view.renderCarDisplay(currentCar);
        this.view.renderStats(ranking);
    }
}

// ===== INICIALIZAR LA APLICACIÓN =====
document.addEventListener('DOMContentLoaded', () => {
    const model = new CarModel();
    const view = new CarView();
    const controller = new CarController(model, view);
});
