// Variáveis globais
let simulationInterval = null;
let simulationRunning = false;
let simulationData = {
    temperature: [],
    humidity: [],
    airQuality: []
};

// Inicialização quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    setupNavigation();
    setupCharts();
    setupSimulation();
    updateTime();
    setupScrollAnimations();
    setupMobileMenu();
}

// Navegação suave
function setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            scrollToSection(targetId);
        });
    });
}

function scrollToSection(sectionId) {
    const section = document.querySelector(sectionId);
    if (section) {
        const headerHeight = document.querySelector('.header').offsetHeight;
        const targetPosition = section.offsetTop - headerHeight - 20;
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }
}

// Menu mobile
function setupMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    hamburger.addEventListener('click', function() {
        this.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
    
    // Fechar menu ao clicar em um link
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });
}

// Atualizar hora atual
function updateTime() {
    const timeElement = document.getElementById('currentTime');
    if (timeElement) {
        const now = new Date();
        const timeString = now.toLocaleTimeString('pt-BR', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
        timeElement.textContent = timeString;
    }
}

// Atualizar hora a cada segundo
setInterval(updateTime, 1000);

// Configurar gráficos
function setupCharts() {
    setupTemperatureChart();
    setupAirQualityChart();
    setupEnergyChart();
}

function setupTemperatureChart() {
    const ctx = document.getElementById('temperatureChart');
    if (!ctx) return;
    
    const chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: generateTimeLabels(24),
            datasets: [{
                label: 'Temperatura (°C)',
                data: generateTemperatureData(24),
                borderColor: '#2ECC71',
                backgroundColor: 'rgba(46, 204, 113, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: false,
                    min: 15,
                    max: 35,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.1)'
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            },
            elements: {
                point: {
                    radius: 4,
                    hoverRadius: 6
                }
            }
        }
    });
}

function setupAirQualityChart() {
    const ctx = document.getElementById('airQualityChart');
    if (!ctx) return;
    
    const chart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Bom', 'Moderado', 'Insalubre', 'Perigoso'],
            datasets: [{
                data: [45, 30, 20, 5],
                backgroundColor: [
                    '#2ECC71',
                    '#F39C12',
                    '#E74C3C',
                    '#8E44AD'
                ],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 20,
                        usePointStyle: true
                    }
                }
            }
        }
    });
}

function setupEnergyChart() {
    const ctx = document.getElementById('energyChart');
    if (!ctx) return;
    
    const chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Solar', 'Eólica', 'Hidrelétrica', 'Biomassa', 'Nuclear'],
            datasets: [{
                label: 'Energia (kWh)',
                data: [1200, 800, 1500, 400, 600],
                backgroundColor: [
                    '#F39C12',
                    '#3498DB',
                    '#2ECC71',
                    '#8E44AD',
                    '#E74C3C'
                ],
                borderRadius: 8,
                borderSkipped: false
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.1)'
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            }
        }
    });
}

// Gerar dados para os gráficos
function generateTimeLabels(hours) {
    const labels = [];
    const now = new Date();
    
    for (let i = hours - 1; i >= 0; i--) {
        const time = new Date(now.getTime() - i * 60 * 60 * 1000);
        labels.push(time.toLocaleTimeString('pt-BR', {
            hour: '2-digit',
            minute: '2-digit'
        }));
    }
    
    return labels;
}

function generateTemperatureData(hours) {
    const data = [];
    const baseTemp = 24;
    
    for (let i = 0; i < hours; i++) {
        const variation = Math.sin(i * 0.5) * 5 + Math.random() * 2 - 1;
        data.push(Math.round((baseTemp + variation) * 10) / 10);
    }
    
    return data;
}

// Configurar simulação
function setupSimulation() {
    const startBtn = document.getElementById('startSimulation');
    const stopBtn = document.getElementById('stopSimulation');
    const resetBtn = document.getElementById('resetSimulation');
    
    if (startBtn) {
        startBtn.addEventListener('click', startSimulation);
    }
    
    if (stopBtn) {
        stopBtn.addEventListener('click', stopSimulation);
    }
    
    if (resetBtn) {
        resetBtn.addEventListener('click', resetSimulation);
    }
}

function startSimulation() {
    if (simulationRunning) return;
    
    simulationRunning = true;
    document.body.classList.add('simulation-running');
    
    // Inicializar dados
    simulationData = {
        temperature: [],
        humidity: [],
        airQuality: []
    };
    
    // Iniciar intervalo de atualização
    simulationInterval = setInterval(updateSimulation, 1000);
    
    // Atualizar imediatamente
    updateSimulation();
    
    console.log('Simulação iniciada');
}

function stopSimulation() {
    if (!simulationRunning) return;
    
    simulationRunning = false;
    document.body.classList.remove('simulation-running');
    
    if (simulationInterval) {
        clearInterval(simulationInterval);
        simulationInterval = null;
    }
    
    console.log('Simulação parada');
}

function resetSimulation() {
    stopSimulation();
    
    // Resetar valores
    document.getElementById('simTempValue').textContent = '--°C';
    document.getElementById('simHumidityValue').textContent = '--%';
    document.getElementById('simAirValue').textContent = '-- AQI';
    
    // Limpar gráficos
    clearSimulationGraphs();
    
    console.log('Simulação resetada');
}

function updateSimulation() {
    if (!simulationRunning) return;
    
    // Gerar novos valores
    const temp = generateRandomValue(20, 30, 0.1);
    const humidity = generateRandomValue(40, 80, 1);
    const airQuality = generateRandomValue(50, 150, 1);
    
    // Atualizar displays
    document.getElementById('simTempValue').textContent = `${temp}°C`;
    document.getElementById('simHumidityValue').textContent = `${humidity}%`;
    document.getElementById('simAirValue').textContent = `${airQuality} AQI`;
    
    // Adicionar aos dados
    simulationData.temperature.push(temp);
    simulationData.humidity.push(humidity);
    simulationData.airQuality.push(airQuality);
    
    // Manter apenas os últimos 20 valores
    if (simulationData.temperature.length > 20) {
        simulationData.temperature.shift();
        simulationData.humidity.shift();
        simulationData.airQuality.shift();
    }
    
    // Atualizar gráficos
    updateSimulationGraphs();
}

function generateRandomValue(min, max, precision = 1) {
    const value = Math.random() * (max - min) + min;
    return Math.round(value * precision) / precision;
}

function updateSimulationGraphs() {
    updateSimulationGraph('simTempGraph', simulationData.temperature, '#2ECC71');
    updateSimulationGraph('simHumidityGraph', simulationData.humidity, '#3498DB');
    updateSimulationGraph('simAirGraph', simulationData.airQuality, '#E74C3C');
}

function updateSimulationGraph(elementId, data, color) {
    const element = document.getElementById(elementId);
    if (!element || data.length === 0) return;
    
    // Criar SVG simples para o gráfico
    const maxValue = Math.max(...data);
    const minValue = Math.min(...data);
    const range = maxValue - minValue || 1;
    
    let svg = `<svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">`;
    
    if (data.length > 1) {
        const points = data.map((value, index) => {
            const x = (index / (data.length - 1)) * 100;
            const y = 100 - ((value - minValue) / range) * 100;
            return `${x},${y}`;
        }).join(' ');
        
        svg += `<polyline points="${points}" fill="none" stroke="${color}" stroke-width="2"/>`;
    }
    
    svg += `</svg>`;
    
    element.innerHTML = svg;
}

function clearSimulationGraphs() {
    ['simTempGraph', 'simHumidityGraph', 'simAirGraph'].forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.innerHTML = '';
        }
    });
}

// Animações de scroll
function setupScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
            }
        });
    }, observerOptions);
    
    // Observar elementos para animação
    const animatedElements = document.querySelectorAll('.about-card, .sensor-card, .chart-card, .sim-sensor');
    animatedElements.forEach(el => observer.observe(el));
}

// Efeitos de hover nos cards dos sensores
document.addEventListener('DOMContentLoaded', function() {
    const sensorCards = document.querySelectorAll('.sensor-card');
    
    sensorCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
});

// Atualizar valores dos sensores em tempo real
function updateSensorValues() {
    const sensors = [
        { id: 'temperature', min: 20, max: 30, unit: '°C' },
        { id: 'humidity', min: 40, max: 80, unit: '%' },
        { id: 'air-quality', min: 50, max: 150, unit: ' AQI' }
    ];
    
    sensors.forEach(sensor => {
        const card = document.querySelector(`[data-sensor="${sensor.id}"]`);
        if (card) {
            const valueElement = card.querySelector('.value');
            const statusElement = card.querySelector('.status');
            
            if (valueElement && statusElement) {
                const value = generateRandomValue(sensor.min, sensor.max, 0.1);
                valueElement.textContent = `${value}${sensor.unit}`;
                
                // Atualizar status baseado no valor
                if (sensor.id === 'temperature') {
                    if (value < 22) statusElement.textContent = 'Frio';
                    else if (value > 28) statusElement.textContent = 'Quente';
                    else statusElement.textContent = 'Normal';
                } else if (sensor.id === 'humidity') {
                    if (value < 50) statusElement.textContent = 'Seco';
                    else if (value > 70) statusElement.textContent = 'Úmido';
                    else statusElement.textContent = 'Ideal';
                } else if (sensor.id === 'air-quality') {
                    if (value < 50) statusElement.textContent = 'Bom';
                    else if (value < 100) statusElement.textContent = 'Moderado';
                    else statusElement.textContent = 'Insalubre';
                }
            }
        }
    });
}

// Atualizar valores dos sensores a cada 5 segundos
setInterval(updateSensorValues, 5000);

// Efeito de parallax suave no hero
window.addEventListener('scroll', function() {
    const scrolled = window.pageYOffset;
    const parallax = document.querySelector('.hero-visual');
    
    if (parallax) {
        const speed = scrolled * 0.5;
        parallax.style.transform = `translateY(${speed}px)`;
    }
});

// Efeito de animação no título (removido para evitar conflitos com HTML)

// Adicionar efeitos sonoros (opcional)
function playSound(type) {
    // Implementar sons se desejado
    console.log(`Som: ${type}`);
}

// Adicionar notificações toast
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    
    // Estilos do toast
    Object.assign(toast.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        background: type === 'success' ? '#2ECC71' : type === 'error' ? '#E74C3C' : '#3498DB',
        color: 'white',
        padding: '1rem 2rem',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        zIndex: '10000',
        transform: 'translateX(100%)',
        transition: 'transform 0.3s ease'
    });
    
    document.body.appendChild(toast);
    
    // Animar entrada
    setTimeout(() => {
        toast.style.transform = 'translateX(0)';
    }, 100);
    
    // Remover após 3 segundos
    setTimeout(() => {
        toast.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(toast);
        }, 300);
    }, 3000);
}

// Adicionar funcionalidade de modo escuro
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    const isDarkMode = document.body.classList.contains('dark-mode');
    localStorage.setItem('darkMode', isDarkMode);
    
    // Atualizar ícone do botão
    const darkModeBtn = document.querySelector('.dark-mode-btn');
    if (darkModeBtn) {
        const icon = darkModeBtn.querySelector('i');
        if (isDarkMode) {
            icon.className = 'fas fa-sun';
            showToast('Modo noturno ativado!', 'success');
        } else {
            icon.className = 'fas fa-moon';
            showToast('Modo claro ativado!', 'success');
        }
    }
}

// Carregar preferência de modo escuro
if (localStorage.getItem('darkMode') === 'true') {
    document.body.classList.add('dark-mode');
}

// Adicionar botão de modo escuro
document.addEventListener('DOMContentLoaded', function() {
    const darkModeBtn = document.createElement('button');
    const isDarkMode = document.body.classList.contains('dark-mode');
    darkModeBtn.innerHTML = isDarkMode ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
    darkModeBtn.className = 'dark-mode-btn';
    darkModeBtn.title = isDarkMode ? 'Ativar modo claro' : 'Ativar modo noturno';
    darkModeBtn.onclick = toggleDarkMode;
    
    // Estilos do botão
    Object.assign(darkModeBtn.style, {
        position: 'fixed',
        bottom: '20px',
        left: '20px',
        width: '50px',
        height: '50px',
        borderRadius: '50%',
        border: 'none',
        background: 'var(--primary-color)',
        color: 'white',
        fontSize: '1.2rem',
        cursor: 'pointer',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        zIndex: '1000',
        transition: 'all 0.3s ease'
    });
    
    document.body.appendChild(darkModeBtn);
});

// Adicionar funcionalidade de compartilhamento
function sharePage() {
    if (navigator.share) {
        navigator.share({
            title: 'IoT na Sustentabilidade Ambiental',
            text: 'Descubra como a Internet das Coisas está revolucionando a sustentabilidade ambiental',
            url: window.location.href
        });
    } else {
        // Fallback para navegadores que não suportam Web Share API
        navigator.clipboard.writeText(window.location.href).then(() => {
            showToast('Link copiado para a área de transferência!', 'success');
        });
    }
}

// Adicionar botão de compartilhamento
document.addEventListener('DOMContentLoaded', function() {
    const shareBtn = document.createElement('button');
    shareBtn.innerHTML = '<i class="fas fa-share-alt"></i>';
    shareBtn.className = 'share-btn';
    shareBtn.title = 'Compartilhar página';
    shareBtn.onclick = sharePage;
    
    // Estilos do botão
    Object.assign(shareBtn.style, {
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        width: '50px',
        height: '50px',
        borderRadius: '50%',
        border: 'none',
        background: 'var(--secondary-color)',
        color: 'white',
        fontSize: '1.2rem',
        cursor: 'pointer',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        zIndex: '1000',
        transition: 'all 0.3s ease'
    });
    
    document.body.appendChild(shareBtn);
});

// Adicionar funcionalidade de impressão
function printPage() {
    window.print();
}

// Adicionar botão de impressão
document.addEventListener('DOMContentLoaded', function() {
    const printBtn = document.createElement('button');
    printBtn.innerHTML = '<i class="fas fa-print"></i>';
    printBtn.className = 'print-btn';
    printBtn.title = 'Imprimir página';
    printBtn.onclick = printPage;
    
    // Estilos do botão
    Object.assign(printBtn.style, {
        position: 'fixed',
        bottom: '80px',
        right: '20px',
        width: '50px',
        height: '50px',
        borderRadius: '50%',
        border: 'none',
        background: 'var(--accent-color)',
        color: 'white',
        fontSize: '1.2rem',
        cursor: 'pointer',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        zIndex: '1000',
        transition: 'all 0.3s ease'
    });
    
    document.body.appendChild(printBtn);
});

// Adicionar funcionalidade de busca
function setupSearch() {
    const searchInput = document.createElement('input');
    searchInput.type = 'text';
    searchInput.placeholder = 'Buscar...';
    searchInput.className = 'search-input';
    
    // Estilos do input
    Object.assign(searchInput.style, {
        position: 'fixed',
        top: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '300px',
        padding: '0.5rem 1rem',
        borderRadius: '25px',
        border: '2px solid var(--primary-color)',
        outline: 'none',
        fontSize: '1rem',
        zIndex: '1000',
        transition: 'all 0.3s ease'
    });
    
    document.body.appendChild(searchInput);
    
    // Funcionalidade de busca
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        const sections = document.querySelectorAll('section');
        
        sections.forEach(section => {
            const text = section.textContent.toLowerCase();
            if (text.includes(searchTerm)) {
                section.style.display = 'block';
            } else if (searchTerm.length > 0) {
                section.style.display = 'none';
            } else {
                section.style.display = 'block';
            }
        });
    });
}

// Inicializar busca
setupSearch();

console.log('Site IoT Sustentável carregado com sucesso!');
