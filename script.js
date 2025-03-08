// 删除这两行，避免变量重复声明
// let map;
// let markers = [];

// 全局变量，用于存储地图数据
const mapLocations = {
    day1: [
        { lat: 33.5902, lng: 130.4419, name: '福冈机场' },
        { lat: 31.5969, lng: 130.5571, name: '鹿儿岛中央站' },
        { lat: 31.5947, lng: 130.5533, name: '城山展望台' },
        { lat: 31.5963, lng: 130.5569, name: '鹿儿岛金生町里士满酒店', isHotel: true }
    ],
    day2: [
        { lat: 31.5947, lng: 130.5533, name: '仙岩园' },
        { lat: 31.5833, lng: 130.6667, name: '樱岛火山' },
        { lat: 31.2333, lng: 130.6500, name: '指宿温泉' },
        { lat: 31.2290, lng: 130.6505, name: '指宿皇家酒店', isHotel: true }
    ],
    day3: [
        { lat: 31.2333, lng: 130.6500, name: '指宿砂浴' },
        { lat: 32.8031, lng: 130.7079, name: '熊本城' },
        { lat: 32.7895, lng: 130.7413, name: '熊本MYSTAYS酒店', isHotel: true }
    ],
    day4: [
        { lat: 32.8842, lng: 131.0872, name: '阿苏火山' },
        { lat: 32.8744, lng: 131.0897, name: '草千里展望台' },
        { lat: 32.7895, lng: 130.7413, name: '熊本MYSTAYS酒店', isHotel: true }
    ],
    day5: [
        { lat: 33.5902, lng: 130.4419, name: '天神地区' },
        { lat: 33.5196, lng: 130.5339, name: '太宰府天满宫' },
        { lat: 33.6247, lng: 130.1875, name: '糸岛海滩' },
        { lat: 33.5893, lng: 130.3953, name: '福冈蒙特埃马纳酒店', isHotel: true }
    ],
    day6: [
        { lat: 33.5902, lng: 130.4419, name: '福冈机场' }
    ]
};

// 存储地图实例的对象
const maps = {};

function initMap() {
    if (typeof google === 'undefined') {
        console.error('Google Maps API 尚未加载');
        return;
    }
    
    console.log('初始化地图...');
    
    // 为每天创建地图
    Object.keys(mapLocations).forEach(dayId => {
        const mapContainer = document.getElementById(`map-${dayId}`);
        if (!mapContainer) {
            console.log(`找不到地图容器: map-${dayId}`);
            return;
        }

        try {
            maps[dayId] = new google.maps.Map(mapContainer, {
                zoom: 12,
                center: mapLocations[dayId][0],
                mapTypeControl: true,
                streetViewControl: true,
                fullscreenControl: true
            });

            // 使用普通的 Marker API
            mapLocations[dayId].forEach((location, index) => {
                // 为酒店使用不同的图标
                const markerOptions = {
                    position: location,
                    map: maps[dayId],
                    title: location.name
                };
                
                // 如果是酒店，使用特殊图标
                if (location.isHotel) {
                    markerOptions.icon = {
                        url: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png',
                        scaledSize: new google.maps.Size(32, 32)
                    };
                    markerOptions.label = '🏨';
                } else {
                    markerOptions.label = `${index + 1}`;
                }
                
                new google.maps.Marker(markerOptions);
            });
            
            console.log(`地图 ${dayId} 初始化成功`);
        } catch (error) {
            console.error(`地图 ${dayId} 初始化失败:`, error);
        }
    });
}

// 处理标签切换
document.addEventListener('DOMContentLoaded', () => {
    const tabButtons = document.querySelectorAll('.tab-button');
    const dayContents = document.querySelectorAll('.day-content');
    
    // 活动选项按钮
    const activityButtons = document.querySelectorAll('.option-button');
    const activityContents = document.querySelectorAll('.activity-content');
    
    // 交通选项卡
    const transportTabs = document.querySelectorAll('.transport-tab');
    const transportContents = document.querySelectorAll('.transport-content');

    // 日期标签切换
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const day = button.getAttribute('data-day');
            
            // 移除所有按钮和内容的活动类
            tabButtons.forEach(btn => btn.classList.remove('active'));
            dayContents.forEach(content => content.classList.remove('active'));
            
            // 添加活动类到点击的按钮和对应的内容
            button.classList.add('active');
            document.getElementById(`day${day}`).classList.add('active');
        });
    });
    
    // 活动选项切换
    activityButtons.forEach(button => {
        button.addEventListener('click', () => {
            const activity = button.getAttribute('data-activity');
            const parent = button.closest('.event');
            
            if (!parent) return;
            
            // 移除所有按钮和内容的活动类
            parent.querySelectorAll('.option-button').forEach(btn => btn.classList.remove('active'));
            parent.querySelectorAll('.activity-content').forEach(content => content.classList.remove('active'));
            
            // 添加活动类到点击的按钮和对应的内容
            button.classList.add('active');
            document.getElementById(`${activity}-content`).classList.add('active');
        });
    });
    
    // 交通选项卡切换
    transportTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const type = tab.getAttribute('data-type');
            
            // 移除所有标签和内容的活动类
            transportTabs.forEach(t => t.classList.remove('active'));
            transportContents.forEach(content => content.classList.remove('active'));
            
            // 添加活动类到点击的标签和对应的内容
            tab.classList.add('active');
            document.getElementById(`${type}-info`).classList.add('active');
        });
    });
});