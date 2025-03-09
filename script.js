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
    
    // 添加景点弹出框处理代码
    handleSpotInfoPopups();
});

// 处理景点信息弹出框
function handleSpotInfoPopups() {
    const spotNames = document.querySelectorAll('.spot-name');
    
    // 创建一个单独的模态框容器，而不是为每个spot创建一个
    const modalContainer = document.createElement('div');
    modalContainer.className = 'spot-modal-container';
    modalContainer.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.7);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
        opacity: 0;
        visibility: hidden;
        transition: opacity 0.3s ease;
    `;
    
    const modalContent = document.createElement('div');
    modalContent.className = 'spot-modal-content';
    modalContent.style.cssText = `
        background: white;
        width: 90%;
        max-width: 350px;
        max-height: 85vh;
        border-radius: 12px;
        overflow: hidden;
        box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
        transform: translateY(20px);
        transition: transform 0.3s ease;
        display: flex;
        flex-direction: column;
    `;
    
    const modalHeader = document.createElement('div');
    modalHeader.className = 'spot-modal-header';
    modalHeader.style.cssText = `
        padding: 15px 20px;
        border-bottom: 1px solid #eee;
        display: flex;
        justify-content: space-between;
        align-items: center;
        position: relative;
    `;
    
    const modalTitle = document.createElement('h3');
    modalTitle.className = 'spot-modal-title';
    modalTitle.style.cssText = `
        margin: 0;
        font-size: 18px;
        color: #333;
        font-weight: 600;
    `;
    
    const closeButton = document.createElement('button');
    closeButton.innerHTML = '×';
    closeButton.className = 'spot-modal-close';
    closeButton.style.cssText = `
        background: none;
        border: none;
        font-size: 28px;
        line-height: 1;
        color: #999;
        cursor: pointer;
        padding: 0 5px;
    `;
    
    const modalBody = document.createElement('div');
    modalBody.className = 'spot-modal-body';
    modalBody.style.cssText = `
        padding: 20px;
        overflow-y: auto;
        flex: 1;
    `;
    
    modalHeader.appendChild(modalTitle);
    modalHeader.appendChild(closeButton);
    modalContent.appendChild(modalHeader);
    modalContent.appendChild(modalBody);
    modalContainer.appendChild(modalContent);
    document.body.appendChild(modalContainer);
    
    // 关闭模态框的函数
    const closeModal = () => {
        modalContainer.style.opacity = '0';
        modalContainer.style.visibility = 'hidden';
        modalContent.style.transform = 'translateY(20px)';
        document.body.style.overflow = '';
    };
    
    // 点击关闭按钮关闭模态框
    closeButton.addEventListener('click', closeModal);
    
    // 点击模态框外部关闭模态框
    modalContainer.addEventListener('click', (e) => {
        if (e.target === modalContainer) {
            closeModal();
        }
    });
    
    // 为每个景点名称添加点击事件
    spotNames.forEach(spot => {
        const spotInfo = spot.querySelector('.spot-info');
        if (!spotInfo) return;
        
        // 阻止原始的hover效果在移动设备上触发
        spot.addEventListener('touchstart', (e) => {
            e.preventDefault();
        });
        
        // 点击显示模态框
        spot.addEventListener('click', function(e) {
            if (window.innerWidth <= 768) {
                e.preventDefault();
                e.stopPropagation();
                
                // 提取景点信息
                const title = spotInfo.querySelector('h4')?.textContent || '景点详情';
                const content = spotInfo.innerHTML;
                
                // 更新模态框内容
                modalTitle.textContent = title;
                modalBody.innerHTML = content;
                
                // 移除模态框内容中的标题，避免重复
                const contentTitle = modalBody.querySelector('h4');
                if (contentTitle) {
                    contentTitle.remove();
                }
                
                // 显示模态框
                modalContainer.style.visibility = 'visible';
                modalContainer.style.opacity = '1';
                modalContent.style.transform = 'translateY(0)';
                document.body.style.overflow = 'hidden'; // 防止背景滚动
            }
        });
    });
    
    // 添加键盘事件监听，按ESC键关闭模态框
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modalContainer.style.visibility === 'visible') {
            closeModal();
        }
    });
    
    // 在大屏幕上调整原有hover弹出框的样式
    spotNames.forEach(spot => {
        const spotInfo = spot.querySelector('.spot-info');
        if (!spotInfo) return;
        
        // 为大屏幕上的弹出框添加样式
        if (window.innerWidth > 768) {
            // 调整标题样式
            const title = spotInfo.querySelector('h4');
            if (title) {
                title.style.fontSize = '18px';
                title.style.marginTop = '0';
                title.style.marginBottom = '12px';
                title.style.color = '#000';
                title.style.fontWeight = '600';
                title.style.paddingBottom = '10px';
                title.style.borderBottom = '1px solid #eee'; // 添加标题下方分隔线
            }
            
            // 调整段落样式
            const paragraphs = spotInfo.querySelectorAll('p');
            paragraphs.forEach(p => {
                p.style.fontSize = '16px';
                p.style.lineHeight = '1.5';
                p.style.margin = '10px 0'; // 增加上下边距
                p.style.color = '#555';
                p.style.fontWeight = '400';
                p.style.transition = 'none';
            });
            
            // 调整详情样式
            const details = spotInfo.querySelector('.spot-details');
            if (details) {
                details.style.fontSize = '16px';
                details.style.marginTop = '12px';
                details.style.fontWeight = '400';
                details.style.color = '#555';
                details.style.transition = 'none';
            }
            
            // 调整整体宽度和内边距
            spotInfo.style.width = '320px';
            spotInfo.style.padding = '22px'; // 增加内边距
            spotInfo.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.15)'; // 增强阴影效果
            
            // 确保所有文本元素颜色一致
            const allTextElements = spotInfo.querySelectorAll('*');
            allTextElements.forEach(el => {
                el.style.transition = 'none';
                if (el === allTextElements[allTextElements.length - 1]) {
                    el.style.color = '#555';
                }
            });
        }
    });
    
    // 在大屏幕上保持原有的hover行为，但调整样式
    const mediaQuery = window.matchMedia('(min-width: 769px)');
    
    const handleMediaChange = (e) => {
        if (e.matches) {
            // 大屏幕：恢复原有的hover行为，但应用新样式
            spotNames.forEach(spot => {
                const spotInfo = spot.querySelector('.spot-info');
                if (spotInfo) {
                    // 保留位置和可见性相关的样式，但应用字体大小调整
                    spotInfo.style.position = '';
                    spotInfo.style.visibility = '';
                    spotInfo.style.opacity = '';
                    
                    // 调整标题样式
                    const title = spotInfo.querySelector('h4');
                    if (title) {
                        title.style.fontSize = '18px';
                        title.style.marginTop = '0';
                        title.style.marginBottom = '12px';
                        title.style.color = '#000';
                        title.style.fontWeight = '600';
                        title.style.paddingBottom = '10px';
                        title.style.borderBottom = '1px solid #eee'; // 添加标题下方分隔线
                    }
                    
                    // 调整段落样式
                    const paragraphs = spotInfo.querySelectorAll('p');
                    paragraphs.forEach(p => {
                        p.style.fontSize = '16px';
                        p.style.lineHeight = '1.5';
                        p.style.margin = '10px 0'; // 增加上下边距
                        p.style.color = '#555';
                        p.style.fontWeight = '400';
                        p.style.transition = 'none';
                    });
                    
                    // 调整详情样式
                    const details = spotInfo.querySelector('.spot-details');
                    if (details) {
                        details.style.fontSize = '16px';
                        details.style.marginTop = '12px';
                        details.style.fontWeight = '400';
                        details.style.color = '#555';
                        details.style.transition = 'none';
                    }
                    
                    // 调整整体宽度和内边距
                    spotInfo.style.width = '320px';
                    spotInfo.style.padding = '22px'; // 增加内边距
                    spotInfo.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.15)'; // 增强阴影效果
                    
                    // 确保所有文本元素颜色一致
                    const allTextElements = spotInfo.querySelectorAll('*');
                    allTextElements.forEach(el => {
                        el.style.transition = 'none';
                        if (el === allTextElements[allTextElements.length - 1]) {
                            el.style.color = '#555';
                        }
                    });
                    
                    // 移除可能导致颜色变化的类
                    spotInfo.querySelectorAll('.spot-highlight').forEach(el => {
                        el.classList.remove('spot-highlight');
                    });
                }
            });
        }
    };
    
    // 初始检查
    handleMediaChange(mediaQuery);
    
    // 监听屏幕尺寸变化
    mediaQuery.addEventListener('change', handleMediaChange);
}

