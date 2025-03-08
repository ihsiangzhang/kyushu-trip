document.addEventListener('DOMContentLoaded', () => {
    // 天气信息更新
    function updateWeather() {
        const cities = ['福冈', '鹿儿岛', '指宿', '熊本', '阿苏'];
        const weatherTypes = ['☀️', '🌤️', '🌧️', '⛈️'];
        const weatherDesc = ['晴天', '多云', '小雨', '雷雨'];
        const temperatures = Array.from({length: 5}, () => Math.floor(Math.random() * 15) + 15);
        
        const weatherWidget = document.getElementById('weather-info');
        let weatherHtml = '<div class="weather-grid">';
        
        cities.forEach((city, index) => {
            const weatherIndex = Math.floor(Math.random() * weatherTypes.length);
            weatherHtml += `
                <div class="weather-item">
                    <h4>${city}</h4>
                    <p>${weatherTypes[weatherIndex]}</p>
                    <p>${temperatures[index]}°C</p>
                    <p>${weatherDesc[weatherIndex]}</p>
                </div>
            `;
        });
        
        weatherHtml += '</div>';
    }

    // 初始化天气信息
    updateWeather();
    // 每小时更新一次天气信息
    setInterval(updateWeather, 3600000);

    // 行程日期标签切换
    const tabButtons = document.querySelectorAll('.tab-button');
    const dayContents = document.querySelectorAll('.day-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const day = button.getAttribute('data-day');
            console.log('Clicked day:', day); // 调试用
            
            // 移除所有活动状态
            tabButtons.forEach(t => t.classList.remove('active'));
            dayContents.forEach(c => c.classList.remove('active'));
            
            // 添加当前选中的活动状态
            button.classList.add('active');
            const targetDay = document.getElementById(`day${day}`);
            if (targetDay) {
                targetDay.classList.add('active');
            }

            e.preventDefault();
            e.stopPropagation();
        });
    });

    // 活动选项按钮交互
    const activityButtons = document.querySelectorAll('.option-button');
    activityButtons.forEach(button => {
        button.addEventListener('click', () => {
            const parent = button.closest('.event');
            const activity = button.getAttribute('data-activity');
            
            // 移除同级按钮的活动状态
            parent.querySelectorAll('.option-button').forEach(b => b.classList.remove('active'));
            parent.querySelectorAll('.activity-content').forEach(c => c.classList.remove('active'));
            
            // 添加当前选中的活动状态
            button.classList.add('active');
            parent.querySelector(`#${activity}-content`).classList.add('active');
        });
    });

    // 交通选项切换
    const transportTabs = document.querySelectorAll('.transport-tab');
    const transportContents = document.querySelectorAll('.transport-content');
    
    transportTabs.forEach(tab => {
        tab.addEventListener('click', (e) => {
            const type = tab.getAttribute('data-type');
            console.log('Clicked tab:', type); // 调试用
            
            // 移除所有活动状态
            transportTabs.forEach(t => t.classList.remove('active'));
            transportContents.forEach(c => c.classList.remove('active'));
            
            // 添加当前选中的活动状态
            tab.classList.add('active');
            const targetContent = document.getElementById(`${type}-info`);
            console.log('Target content:', targetContent); // 调试用
            
            if (targetContent) {
                targetContent.classList.add('active');
            }

            e.preventDefault();
            e.stopPropagation();
        });
    });
});