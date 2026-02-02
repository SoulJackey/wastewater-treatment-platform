// 模拟数据

// ==================== 废水类型定义 ====================
const WASTEWATER_TYPES = {
    DOMESTIC: {
        id: 'domestic',
        name: '生活污水',
        nameEn: 'Domestic Sewage',
        icon: 'fa-home',
        color: '#1890ff',
        gradient: 'linear-gradient(135deg, #1890ff 0%, #40a9ff 100%)',
        description: '生活污水处理系统'
    },
    TUNNEL: {
        id: 'tunnel',
        name: '隧道废水',
        nameEn: 'Tunnel Wastewater',
        icon: 'fa-road',
        color: '#52c41a',
        gradient: 'linear-gradient(135deg, #52c41a 0%, #73d13d 100%)',
        description: '隧道施工废水处理系统'
    },
    MIXING: {
        id: 'mixing',
        name: '拌合站废水',
        nameEn: 'Mixing Station Wastewater',
        icon: 'fa-industry',
        color: '#faad14',
        gradient: 'linear-gradient(135deg, #faad14 0%, #ffc53d 100%)',
        description: '拌合站生产废水处理系统'
    },
    SANDSTONE: {
        id: 'sandstone',
        name: '砂石废水',
        nameEn: 'Sandstone Wastewater',
        icon: 'fa-mountain',
        color: '#13c2c2',
        gradient: 'linear-gradient(135deg, #13c2c2 0%, #36cfc9 100%)',
        description: '砂石加工废水处理系统'
    }
};

// 根据名称获取类型配置
function getWastewaterTypeConfig(typeName) {
    const typeMap = {
        '生活污水': WASTEWATER_TYPES.DOMESTIC,
        '隧道废水': WASTEWATER_TYPES.TUNNEL,
        '拌合站废水': WASTEWATER_TYPES.MIXING,
        '砂石废水': WASTEWATER_TYPES.SANDSTONE
    };
    return typeMap[typeName] || WASTEWATER_TYPES.DOMESTIC;
}

// ==================== 项目列表数据 ====================
const projects = [
    {
        id: 1,
        name: 'XX隧道工程',
        location: { lat: 30.5728, lng: 104.0668 },
        address: '四川省成都市',
        type: '隧道废水',
        status: 'normal',
        deviceCount: 8,
        runningDevices: 7,
        alarmCount: 2,
        energyConsumption: 12580,
        startDate: '2023-01-15',
        progress: 75
    },
    {
        id: 2,
        name: 'YY高速公路项目',
        location: { lat: 31.2304, lng: 121.4737 },
        address: '上海市',
        type: '生活污水',
        status: 'normal',
        deviceCount: 5,
        runningDevices: 5,
        alarmCount: 0,
        energyConsumption: 8920,
        startDate: '2023-03-20',
        progress: 60
    },
    {
        id: 3,
        name: 'ZZ水利枢纽工程',
        location: { lat: 29.5630, lng: 106.5516 },
        address: '重庆市',
        type: '砂石废水',
        status: 'warning',
        deviceCount: 12,
        runningDevices: 10,
        alarmCount: 5,
        energyConsumption: 18760,
        startDate: '2022-11-08',
        progress: 85
    },
    {
        id: 4,
        name: 'AA大桥施工项目',
        location: { lat: 22.5431, lng: 114.0579 },
        address: '广东省深圳市',
        type: '拌合站废水',
        status: 'normal',
        deviceCount: 6,
        runningDevices: 6,
        alarmCount: 0,
        energyConsumption: 9340,
        startDate: '2023-05-10',
        progress: 45
    },
    {
        id: 5,
        name: 'BB地铁工程',
        location: { lat: 39.9042, lng: 116.4074 },
        address: '北京市',
        type: '隧道废水',
        status: 'danger',
        deviceCount: 10,
        runningDevices: 6,
        alarmCount: 8,
        energyConsumption: 15230,
        startDate: '2022-09-01',
        progress: 90
    },
    {
        id: 6,
        name: 'CC水库除险加固',
        location: { lat: 34.3416, lng: 108.9398 },
        address: '陕西省西安市',
        type: '生活污水',
        status: 'normal',
        deviceCount: 4,
        runningDevices: 4,
        alarmCount: 0,
        energyConsumption: 6540,
        startDate: '2023-02-28',
        progress: 55
    },
    {
        id: 7,
        name: 'DD隧道群工程',
        location: { lat: 26.0789, lng: 119.2965 },
        address: '福建省福州市',
        type: '隧道废水',
        status: 'normal',
        deviceCount: 15,
        runningDevices: 14,
        alarmCount: 1,
        energyConsumption: 21340,
        startDate: '2022-12-15',
        progress: 70
    },
    {
        id: 8,
        name: 'EE港口建设项目',
        location: { lat: 21.6426, lng: 110.9322 },
        address: '广西壮族自治区北海市',
        type: '砂石废水',
        status: 'warning',
        deviceCount: 9,
        runningDevices: 8,
        alarmCount: 3,
        energyConsumption: 14320,
        startDate: '2023-04-05',
        progress: 50
    }
];

// 设备数据
const devices = [
    {
        id: 'DEV001',
        name: '1号一体化污水处理设备',
        type: '生活污水处理',
        projectId: 1,
        projectName: 'XX隧道工程',
        model: 'YQ-WS-100',
        manufacturer: 'XX环保科技有限公司',
        productionDate: '2022-08-15',
        installDate: '2023-01-20',
        status: 'running',
        warrantyDate: '2025-08-15',
        originalValue: 580000,
        depreciationRate: 0.1,
        currentValue: 464000,
        qrCode: 'DEV001',
        specifications: {
            capacity: '100m³/d',
            power: '15kW',
            dimension: '6m×3m×2.5m',
            weight: '5.2吨'
        }
    },
    {
        id: 'DEV002',
        name: '2号隧道废水处理设备',
        type: '隧道废水处理',
        projectId: 1,
        projectName: 'XX隧道工程',
        model: 'SD-WS-200',
        manufacturer: 'YY环保设备有限公司',
        productionDate: '2022-09-20',
        installDate: '2023-01-25',
        status: 'running',
        warrantyDate: '2025-09-20',
        originalValue: 860000,
        depreciationRate: 0.1,
        currentValue: 688000,
        qrCode: 'DEV002',
        specifications: {
            capacity: '200m³/d',
            power: '30kW',
            dimension: '8m×4m×3m',
            weight: '8.5吨'
        }
    },
    {
        id: 'DEV003',
        name: '3号沉淀过滤设备',
        type: '砂石废水处理',
        projectId: 3,
        projectName: 'ZZ水利枢纽工程',
        model: 'SS-CF-300',
        manufacturer: 'ZZ水处理设备厂',
        productionDate: '2022-07-10',
        installDate: '2022-11-15',
        status: 'warning',
        warrantyDate: '2025-07-10',
        originalValue: 680000,
        depreciationRate: 0.1,
        currentValue: 544000,
        qrCode: 'DEV003',
        specifications: {
            capacity: '300m³/d',
            power: '22kW',
            dimension: '10m×5m×3.5m',
            weight: '12吨'
        }
    },
    {
        id: 'DEV004',
        name: '4号拌合站废水回收设备',
        type: '拌合站废水处理',
        projectId: 4,
        projectName: 'AA大桥施工项目',
        model: 'BH-WS-150',
        manufacturer: 'AA环保科技有限公司',
        productionDate: '2022-11-25',
        installDate: '2023-05-15',
        status: 'running',
        warrantyDate: '2025-11-25',
        originalValue: 520000,
        depreciationRate: 0.1,
        currentValue: 416000,
        qrCode: 'DEV004',
        specifications: {
            capacity: '150m³/d',
            power: '18kW',
            dimension: '7m×3.5m×2.8m',
            weight: '6.8吨'
        }
    },
    {
        id: 'DEV005',
        name: '5号一体化污水处理设备',
        type: '生活污水处理',
        projectId: 2,
        projectName: 'YY高速公路项目',
        model: 'YQ-WS-80',
        manufacturer: 'XX环保科技有限公司',
        productionDate: '2022-12-08',
        installDate: '2023-03-25',
        status: 'running',
        warrantyDate: '2025-12-08',
        originalValue: 480000,
        depreciationRate: 0.1,
        currentValue: 384000,
        qrCode: 'DEV005',
        specifications: {
            capacity: '80m³/d',
            power: '12kW',
            dimension: '5m×2.5m×2.2m',
            weight: '4.2吨'
        }
    },
    {
        id: 'DEV006',
        name: '6号隧道废水处理设备',
        type: '隧道废水处理',
        projectId: 5,
        projectName: 'BB地铁工程',
        model: 'SD-WS-250',
        manufacturer: 'YY环保设备有限公司',
        productionDate: '2022-06-15',
        installDate: '2022-09-05',
        status: 'error',
        warrantyDate: '2025-06-15',
        originalValue: 920000,
        depreciationRate: 0.1,
        currentValue: 736000,
        qrCode: 'DEV006',
        specifications: {
            capacity: '250m³/d',
            power: '35kW',
            dimension: '9m×4.5m×3.2m',
            weight: '10吨'
        }
    },
    {
        id: 'DEV007',
        name: '7号加药设备',
        type: '加药装置',
        projectId: 3,
        projectName: 'ZZ水利枢纽工程',
        model: 'JY-50',
        manufacturer: 'BB水处理设备厂',
        productionDate: '2022-10-20',
        installDate: '2022-11-20',
        status: 'running',
        warrantyDate: '2025-10-20',
        originalValue: 180000,
        depreciationRate: 0.1,
        currentValue: 144000,
        qrCode: 'DEV007',
        specifications: {
            capacity: '50L/h',
            power: '2kW',
            dimension: '2m×1.5m×1.8m',
            weight: '0.8吨'
        }
    },
    {
        id: 'DEV008',
        name: '8号压滤机',
        type: '污泥脱水',
        projectId: 3,
        projectName: 'ZZ水利枢纽工程',
        model: 'XYL-100',
        manufacturer: 'CC环保设备有限公司',
        productionDate: '2022-08-05',
        installDate: '2022-11-18',
        status: 'running',
        warrantyDate: '2025-08-05',
        originalValue: 380000,
        depreciationRate: 0.1,
        currentValue: 304000,
        qrCode: 'DEV008',
        specifications: {
            capacity: '100m³/h',
            power: '8kW',
            dimension: '5m×2m×2.5m',
            weight: '4.5吨'
        }
    }
];

// 设备实时数据
const deviceRealtimeData = {
    'DEV001': {
        ph: 7.2,
        liquidLevel: 65.5,
        flow: 12.8,
        temperature: 25.3,
        power: 12.5,
        status: 'running',
        updateTime: new Date().toISOString()
    },
    'DEV002': {
        ph: 7.5,
        liquidLevel: 72.8,
        flow: 18.5,
        temperature: 26.1,
        power: 28.3,
        status: 'running',
        updateTime: new Date().toISOString()
    },
    'DEV003': {
        ph: 6.8,
        liquidLevel: 85.2,
        flow: 25.6,
        temperature: 24.8,
        power: 20.1,
        status: 'warning',
        updateTime: new Date().toISOString()
    },
    'DEV004': {
        ph: 7.4,
        liquidLevel: 58.3,
        flow: 15.2,
        temperature: 25.9,
        power: 16.8,
        status: 'running',
        updateTime: new Date().toISOString()
    },
    'DEV005': {
        ph: 7.1,
        liquidLevel: 62.7,
        flow: 10.5,
        temperature: 24.5,
        power: 10.2,
        status: 'running',
        updateTime: new Date().toISOString()
    },
    'DEV006': {
        ph: 8.2,
        liquidLevel: 45.0,
        flow: 0,
        temperature: 22.1,
        power: 0,
        status: 'error',
        updateTime: new Date().toISOString()
    },
    'DEV007': {
        ph: 7.0,
        liquidLevel: 78.5,
        flow: 5.2,
        temperature: 23.7,
        power: 1.8,
        status: 'running',
        updateTime: new Date().toISOString()
    },
    'DEV008': {
        ph: 7.3,
        liquidLevel: 68.9,
        flow: 8.7,
        temperature: 24.2,
        power: 7.5,
        status: 'running',
        updateTime: new Date().toISOString()
    }
};

// 报警记录
const alarms = [
    {
        id: 'ALM001',
        deviceId: 'DEV006',
        deviceName: '6号隧道废水处理设备',
        projectName: 'BB地铁工程',
        type: '设备故障',
        level: 'high',
        message: '设备停止运行，电源故障',
        status: 'pending',
        createTime: '2025-02-02 10:30:00',
        handleTime: null,
        handler: null
    },
    {
        id: 'ALM002',
        deviceId: 'DEV003',
        deviceName: '3号沉淀过滤设备',
        projectName: 'ZZ水利枢纽工程',
        type: '参数超限',
        level: 'medium',
        message: '液位超过上限值',
        status: 'processing',
        createTime: '2025-02-02 09:15:00',
        handleTime: null,
        handler: '张工'
    },
    {
        id: 'ALM003',
        deviceId: 'DEV003',
        deviceName: '3号沉淀过滤设备',
        projectName: 'ZZ水利枢纽工程',
        type: '参数异常',
        level: 'low',
        message: 'PH值偏低',
        status: 'processed',
        createTime: '2025-02-02 08:45:00',
        handleTime: '2025-02-02 09:20:00',
        handler: '李工'
    },
    {
        id: 'ALM004',
        deviceId: 'DEV001',
        deviceName: '1号一体化污水处理设备',
        projectName: 'XX隧道工程',
        type: '维护提醒',
        level: 'low',
        message: '设备运行时间超过5000小时，建议保养',
        status: 'pending',
        createTime: '2025-02-01 16:20:00',
        handleTime: null,
        handler: null
    },
    {
        id: 'ALM005',
        deviceId: 'DEV008',
        deviceName: '8号压滤机',
        projectName: 'ZZ水利枢纽工程',
        type: '参数超限',
        level: 'medium',
        message: '进料压力超过正常范围',
        status: 'processed',
        createTime: '2025-02-01 14:30:00',
        handleTime: '2025-02-01 15:10:00',
        handler: '王工'
    },
    {
        id: 'ALM006',
        deviceId: 'DEV006',
        deviceName: '6号隧道废水处理设备',
        projectName: 'BB地铁工程',
        type: '设备故障',
        level: 'high',
        message: '控制系统通信异常',
        status: 'processing',
        createTime: '2025-02-01 11:00:00',
        handleTime: null,
        handler: '赵工'
    },
    {
        id: 'ALM007',
        deviceId: 'DEV002',
        deviceName: '2号隧道废水处理设备',
        projectName: 'XX隧道工程',
        type: '维护提醒',
        level: 'low',
        message: '滤芯需要更换',
        status: 'pending',
        createTime: '2025-02-01 09:30:00',
        handleTime: null,
        handler: null
    },
    {
        id: 'ALM008',
        deviceId: 'DEV008',
        deviceName: '8号压滤机',
        projectName: 'ZZ水利枢纽工程',
        type: '参数异常',
        level: 'medium',
        message: '出水量低于正常值',
        status: 'processed',
        createTime: '2025-01-31 16:45:00',
        handleTime: '2025-01-31 17:30:00',
        handler: '刘工'
    }
];

// 用户数据
const users = [
    {
        id: 1,
        username: 'admin',
        password: '123456',
        name: '系统管理员',
        role: 'admin',
        department: '管理部',
        phone: '13800138000',
        email: 'admin@example.com',
        avatar: 'A',
        status: 'active',
        createTime: '2022-01-01 00:00:00',
        lastLoginTime: '2025-02-02 08:30:00'
    },
    {
        id: 2,
        username: 'zhangsan',
        password: '123456',
        name: '张工',
        role: 'engineer',
        department: '技术部',
        phone: '13800138001',
        email: 'zhangsan@example.com',
        avatar: '张',
        status: 'active',
        createTime: '2022-03-15 09:00:00',
        lastLoginTime: '2025-02-02 08:15:00'
    },
    {
        id: 3,
        username: 'lisi',
        password: '123456',
        name: '李工',
        role: 'engineer',
        department: '技术部',
        phone: '13800138002',
        email: 'lisi@example.com',
        avatar: '李',
        status: 'active',
        createTime: '2022-05-20 14:30:00',
        lastLoginTime: '2025-02-01 17:45:00'
    },
    {
        id: 4,
        username: 'wangwu',
        password: '123456',
        name: '王工',
        role: 'operator',
        department: '运维部',
        phone: '13800138003',
        email: 'wangwu@example.com',
        avatar: '王',
        status: 'active',
        createTime: '2022-07-10 10:00:00',
        lastLoginTime: '2025-02-02 07:50:00'
    },
    {
        id: 5,
        username: 'zhaoliu',
        password: '123456',
        name: '赵工',
        role: 'operator',
        department: '运维部',
        phone: '13800138004',
        email: 'zhaoliu@example.com',
        avatar: '赵',
        status: 'active',
        createTime: '2022-09-05 15:20:00',
        lastLoginTime: '2025-02-01 23:30:00'
    },
    {
        id: 6,
        username: 'guest',
        password: '123456',
        name: '访客用户',
        role: 'guest',
        department: '外部单位',
        phone: '13800138005',
        email: 'guest@example.com',
        avatar: '访',
        status: 'inactive',
        createTime: '2023-01-10 11:00:00',
        lastLoginTime: '2025-01-28 10:20:00'
    }
];

// 能耗历史数据（最近30天）
function generateEnergyData() {
    const data = [];
    const today = new Date();

    for (let i = 29; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);

        data.push({
            date: date.toISOString().split('T')[0],
            totalEnergy: Math.round(15000 + Math.random() * 5000),
            dev001: Math.round(2000 + Math.random() * 1000),
            dev002: Math.round(3000 + Math.random() * 1500),
            dev003: Math.round(3500 + Math.random() * 1500),
            dev004: Math.round(1800 + Math.random() * 800),
            dev005: Math.round(1500 + Math.random() * 700),
            dev006: Math.round(2500 + Math.random() * 1200),
            dev007: Math.round(500 + Math.random() * 300),
            dev008: Math.round(1200 + Math.random() * 600)
        });
    }

    return data;
}

const energyHistory = generateEnergyData();

// 保养记录
const maintenanceRecords = [
    {
        id: 'MNT001',
        deviceId: 'DEV001',
        deviceName: '1号一体化污水处理设备',
        type: '定期保养',
        content: '更换滤芯，检查管路，清洁设备',
        maintainer: '张工',
        maintenanceDate: '2025-01-15',
        nextDate: '2025-04-15',
        cost: 5000,
        status: 'completed'
    },
    {
        id: 'MNT002',
        deviceId: 'DEV002',
        deviceName: '2号隧道废水处理设备',
        type: '故障维修',
        content: '更换水泵，修复电路故障',
        maintainer: '李工',
        maintenanceDate: '2025-01-20',
        nextDate: null,
        cost: 12000,
        status: 'completed'
    },
    {
        id: 'MNT003',
        deviceId: 'DEV003',
        deviceName: '3号沉淀过滤设备',
        type: '定期保养',
        content: '清洁沉淀池，检查阀门',
        maintainer: '王工',
        maintenanceDate: '2025-01-25',
        nextDate: '2025-04-25',
        cost: 3000,
        status: 'completed'
    }
];

// 维修记录
const repairRecords = [
    {
        id: 'REP001',
        deviceId: 'DEV006',
        deviceName: '6号隧道废水处理设备',
        faultDescription: '设备无法启动，电源指示灯不亮',
        faultTime: '2025-02-02 10:30:00',
        repairPerson: '赵工',
        repairTime: '2025-02-02 11:00:00',
        repairContent: '检查发现电源模块损坏，已更换',
        repairCost: 8000,
        parts: ['电源模块', '保险丝'],
        status: 'repairing'
    },
    {
        id: 'REP002',
        deviceId: 'DEV008',
        deviceName: '8号压滤机',
        faultDescription: '出水量不足，压力异常',
        faultTime: '2025-01-31 16:45:00',
        repairPerson: '刘工',
        repairTime: '2025-01-31 17:30:00',
        repairContent: '清洗滤布，调整压力阀',
        repairCost: 1500,
        parts: ['密封圈'],
        status: 'completed'
    }
];

// 视频监控摄像头数据
const cameras = [
    {
        id: 'CAM001',
        name: '1号设备区摄像头',
        location: 'XX隧道工程-1号设备区',
        ipAddress: '192.168.1.101',
        status: 'online'
    },
    {
        id: 'CAM002',
        name: '2号设备区摄像头',
        location: 'XX隧道工程-2号设备区',
        ipAddress: '192.168.1.102',
        status: 'online'
    },
    {
        id: 'CAM003',
        name: '入口摄像头',
        location: 'XX隧道工程-入口',
        ipAddress: '192.168.1.103',
        status: 'online'
    },
    {
        id: 'CAM004',
        name: '出口摄像头',
        location: 'XX隧道工程-出口',
        ipAddress: '192.168.1.104',
        status: 'offline'
    }
];

// 设备类型统计
const deviceTypeStats = {
    '生活污水处理': 12,
    '隧道废水处理': 18,
    '砂石废水处理': 15,
    '拌合站废水处理': 10,
    '加药装置': 8,
    '污泥脱水': 12
};

// 报警统计
const alarmStats = {
    total: 156,
    pending: 23,
    processing: 15,
    processed: 118,
    today: 8,
    week: 45,
    month: 156
};

// 统计数据
const statistics = {
    totalProjects: 8,
    totalDevices: 75,
    runningDevices: 65,
    stoppedDevices: 5,
    faultDevices: 5,
    todayEnergy: 18250,
    weekEnergy: 125680,
    monthEnergy: 523450,
    totalAlarms: 23,
    highAlarms: 5,
    mediumAlarms: 12,
    lowAlarms: 6
};

// 导出数据对象
const mockData = {
    projects,
    devices,
    deviceRealtimeData,
    alarms,
    users,
    energyHistory,
    maintenanceRecords,
    repairRecords,
    cameras,
    deviceTypeStats,
    alarmStats,
    statistics
};

// 如果在浏览器环境中，将数据挂载到window对象
if (typeof window !== 'undefined') {
    window.mockData = mockData;
}
