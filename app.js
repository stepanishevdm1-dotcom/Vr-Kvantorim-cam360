import * as THREE from 'three';

/* ============================================================
   КОНФИГ — заменишь, когда скачаешь фото
   ============================================================

   Формат:
   const scenes = {
     'hall': {
       name: 'Холл',
       variants: [
         { label: 'Обычная', image: 'холл.jpg' },
         { label: 'ИИ',      image: 'холл_ии.jpg' }    // необязательно
       ],
       hotspots: [
         { yaw: 0.5, pitch: -0.1, label: 'Кабинет 1', target: 'room1',
           returnYaw: 3.64, returnPitch: -0.1 },
         { yaw: 2.3, pitch: 0.05, label: 'Лаборатория', target: 'lab',
           returnYaw: 5.44, returnPitch: 0.05 }
       ]
     },
     'room1': { ... }
   };

   returnYaw / returnPitch — куда смотреть при входе в целевую сцену
   (обычно yaw+PI от хотспота, который ведёт обратно).
*/

const scenes = {
  'main_entrance': {
    name: 'Главный вход',
    variants: [
      { label: 'Главный вход', image: 'Главный вход.jpg' }
    ],
    hotspots: [
      { yaw: 1.465, pitch: -0.005, label: 'Крыльцо', target: 'porch',
        returnYaw: 4.607, returnPitch: -0.005 }
    ]
  },
  'porch': {
    name: 'Крыльцо',
    variants: [
      { label: 'Крыльцо', image: 'Крыльцо.jpg' }
    ],
    hotspots: [
      { yaw: 4.451, pitch: -0.12, label: 'Главный вход', target: 'main_entrance' },
      { yaw: 1.059, pitch: -0.169, label: 'Охрана', target: 'security' }
    ]
  },
  'security': {
    name: 'Охрана',
    variants: [
      { label: 'Охрана', image: 'Охрана.jpg' }
    ],
    hotspots: [
      { yaw: 1.211, pitch: -0.11, label: 'Крыльцо', target: 'porch' },
      { yaw: 5.988, pitch: -0.0803, label: 'Около лестницы', target: 'near_stairs' }
    ]
  },
  'near_stairs': {
    name: 'Около лестницы',
    variants: [
      { label: 'Около лестницы', image: 'Около лестницы.jpg' }
    ],
    hotspots: [
      { yaw: 4.646, pitch: -0.0855, label: 'Охрана', target: 'security' },
      { yaw: 1.490, pitch: -0.168, label: 'Подъем', target: 'climb' }
    ]
  },
  'climb': {
    name: 'Подъем',
    variants: [
      { label: 'Подъем', image: 'Подъем.jpg' }
    ],
    hotspots: [
      { yaw: 4.442, pitch: -0.382, label: 'Около лестницы', target: 'near_stairs' },
      { yaw: 3.131, pitch: -0.264, label: 'Подъем 1 этаж', target: 'climb_1f' }
    ]
  },
  'climb_1f': {
    name: 'Подъем 1 этаж',
    variants: [
      { label: 'Подъем 1 этаж', image: 'Подъем(1 этаж).jpg' }
    ],
    hotspots: [
      { yaw: 5.398, pitch: -0.284, label: 'Подъем', target: 'climb' },
      { yaw: 0.765, pitch: 0.216, label: 'Подъем 2 этаж', target: 'climb_2f',
        stairs: true, climbText: 'Поднимаемся на 2 этаж' }
    ]
  },
  'climb_2f': {
    name: 'Подъем 2 этаж',
    variants: [
      { label: 'Подъем 2 этаж', image: '2 этаж подъем.jpg' }
    ],
    hotspots: [
      { yaw: 1.126, pitch: -0.546, label: 'Подъем 1 этаж', target: 'climb_1f',
        descend: true, climbText: 'Спускаемся на 1 этаж' },
      { yaw: 0.747, pitch: 0.185, label: 'Подъем Третий этаж', target: 'climb_3f',
        stairs: true, climbText: 'Поднимаемся на третий этаж' }
    ]
  },
  'climb_3f': {
    name: 'Подъем Третий этаж',
    variants: [
      { label: 'Подъем Третий этаж', image: '3 этаж подъем.jpg' }
    ],
    hotspots: [
      { yaw: 1.941, pitch: -0.511, label: 'Подъем 2 этаж', target: 'climb_2f',
        descend: true, climbText: 'Спускаемся на 2 этаж' },
      { yaw: 0.501, pitch: -0.251, label: 'Третий этаж', target: 'floor_3' }
    ]
  },
  'floor_3': {
    name: 'Третий этаж',
    variants: [
      { label: 'Третий этаж', image: '3 этаж.jpg' }
    ],
    hotspots: [
      { yaw: 5.203, pitch: -0.286, label: 'Подъем', target: 'climb_3f' },
      { yaw: 2.808, pitch: -0.112, label: 'Развилка Третий этаж', target: 'fork_3' }
    ]
  },
  'fork_3': {
    name: 'Развилка Третий этаж',
    variants: [
      { label: 'Развилка Третий этаж', image: 'Развилка 3 этаж.jpg' }
    ],
    hotspots: [
      { yaw: 3.335, pitch: -0.082, label: 'Третий этаж', target: 'floor_3' },
      { yaw: 0.176, pitch: -0.063, label: 'Третий этаж 1', target: 'floor_3_1' }
    ]
  },
  'floor_3_1': {
    name: 'Третий этаж 1',
    variants: [
      { label: 'Третий этаж 1', image: '3 этажо 1.jpg' }
    ],
    hotspots: [
      { yaw: 3.367, pitch: -0.0925, label: 'Развилка Третий этаж', target: 'fork_3' },
      { yaw: 6.361, pitch: -0.0925, label: 'Третий этаж 2', target: 'floor_3_2' }
    ]
  },
  'floor_3_2': {
    name: 'Третий этаж 2',
    variants: [
      { label: 'Третий этаж 2', image: '3 этаж 2.jpg' }
    ],
    hotspots: [
      { yaw: 4.070, pitch: -0.0628, label: 'Третий этаж 1', target: 'floor_3_1' },
      { yaw: 0.925, pitch: -0.0768, label: 'Третий этаж 3', target: 'floor_3_3' }
    ]
  },
  'floor_3_3': {
    name: 'Третий этаж 3',
    variants: [
      { label: 'Третий этаж 3', image: '3 этаж 3.jpg' }
    ],
    hotspots: [
      { yaw: 5.292, pitch: -0.1571, label: 'Третий этаж 2', target: 'floor_3_2' },
      { yaw: 2.082, pitch: -0.01222, label: 'Третий этаж 4', target: 'floor_3_4' }
    ]
  },
  'floor_3_4': {
    name: 'Третий этаж 4',
    variants: [
      { label: 'Третий этаж 4', image: '3 этаж 4.jpg' }
    ],
    hotspots: [
      { yaw: 6.074, pitch: -0.1030, label: 'Третий этаж 3', target: 'floor_3_3' },
      { yaw: 2.934, pitch: -0.06283, label: 'Третий этаж 5', target: 'floor_3_5' }
    ]
  },
  'floor_3_5': {
    name: 'Третий этаж 5',
    variants: [
      { label: 'Третий этаж 5', image: '3 этаж 5.jpg' }
    ],
    hotspots: [
      { yaw: 6.265, pitch: -0.08727, label: 'Третий этаж 4', target: 'floor_3_4' },
      { yaw: 7.800, pitch: -0.003491, label: 'Третий этаж 6', target: 'floor_3_6' }
    ]
  },
  'floor_3_6': {
    name: 'Третий этаж 6',
    variants: [
      { label: 'Третий этаж 6', image: '3 этаж 6.jpg' }
    ],
    hotspots: [
      { yaw: 6.624, pitch: -0.06807, label: 'Третий этаж 5', target: 'floor_3_5' },
      { yaw: 3.438, pitch: -0.008727, label: 'Третий этаж 7', target: 'floor_3_7' }
    ]
  },
  'floor_3_7': {
    name: 'Третий этаж 7',
    variants: [
      { label: 'Третий этаж 7', image: '3 этаж 7.jpg' }
    ],
    hotspots: [
      { yaw: 0.5114, pitch: -0.09425, label: 'Третий этаж 6', target: 'floor_3_6' },
      { yaw: -2.669, pitch: -0.08901, label: 'Третий этаж 8', target: 'floor_3_8' }
    ]
  },
  'floor_3_8': {
    name: 'Третий этаж 8',
    variants: [
      { label: 'Третий этаж 8', image: '3 этаж 8.jpg' }
    ],
    hotspots: [
      { yaw: 1.368, pitch: -0.09425, label: 'Третий этаж 7', target: 'floor_3_7' },
      { yaw: 4.488, pitch: -0.08901, label: 'Третий этаж 9', target: 'floor_3_9' }
    ]
  },
  'floor_3_9': {
    name: 'Третий этаж 9',
    variants: [
      { label: 'Третий этаж 9', image: '3 этаж 9.jpg' }
    ],
    hotspots: [
      { yaw: 1.217, pitch: -0.05411, label: 'Третий этаж 8', target: 'floor_3_8' },
      { yaw: 4.322, pitch: -0.1187, label: 'Третий этаж 10', target: 'floor_3_10' }
    ]
  },
  'floor_3_10': {
    name: 'Третий этаж 10',
    variants: [
      { label: 'Третий этаж 10', image: '3 этаж 10.jpg' }
    ],
    hotspots: [
      { yaw: -0.1955, pitch: -0.06458, label: 'Третий этаж 9', target: 'floor_3_9' },
      { yaw: 2.904, pitch: -0.04014, label: 'Третий этаж 11', target: 'floor_3_11' }
    ]
  },
  'floor_3_11': {
    name: 'Третий этаж 11',
    variants: [
      { label: 'Третий этаж 11', image: '3 этаж 11.jpg' }
    ],
    hotspots: [
      { yaw: 1.585, pitch: -0.08553, label: 'Третий этаж 10', target: 'floor_3_10' },
      { yaw: 4.679, pitch: -0.1344, label: 'Третий этаж 12', target: 'floor_3_12' }
    ]
  },
  'floor_3_12': {
    name: 'Третий этаж 12',
    variants: [
      { label: 'Третий этаж 12', image: '3 этаж 12.jpg' }
    ],
    hotspots: [
      { yaw: -0.3893, pitch: -0.1292, label: 'Третий этаж 13', target: 'floor_3_13' },
      { yaw: -3.510, pitch: -0.01047, label: 'Третий этаж 11', target: 'floor_3_11' }
    ]
  },
  'floor_3_13': {
    name: 'Третий этаж 13',
    variants: [
      { label: 'Третий этаж 13', image: '3 этаж 13.jpg' }
    ],
    hotspots: [
      { yaw: 0.6598, pitch: -0.1292, label: 'Третий этаж 14', target: 'floor_3_14' },
      { yaw: -2.531, pitch: -0.05585, label: 'Третий этаж 12', target: 'floor_3_12' }
    ]
  },
  'floor_3_14': {
    name: 'Третий этаж 14',
    variants: [
      { label: 'Третий этаж 14', image: '3 этаж 14.jpg' }
    ],
    hotspots: [
    ]
  }
};

const sidebarGroups = [
  { label: null, scenes: ['main_entrance', 'porch', 'security', 'near_stairs', 'climb', 'climb_1f', 'climb_2f', 'climb_3f', 'floor_3', 'fork_3', 'floor_3_1', 'floor_3_2', 'floor_3_3', 'floor_3_4', 'floor_3_5', 'floor_3_6', 'floor_3_7', 'floor_3_8', 'floor_3_9', 'floor_3_10', 'floor_3_11', 'floor_3_12', 'floor_3_13', 'floor_3_14'] }
];

const DEFAULT_SCENE = 'main_entrance';
const SMOOTH = 0.18;
const MIN_FOV = 20;
const MAX_FOV = 120;
const SPHERE_RADIUS = 500;
const HOTSPOT_DISTANCE = 480;

/* ============================================================
   STATE
   ============================================================ */
let currentSceneId = '';
let currentVariantIdx = 0;
let aiMode = false;
let isTransitioning = false;
let yaw = 0;
let pitch = 0;
let targetYaw = 0;
let targetPitch = 0;
let fov = 75;
let targetFov = 75;
let isDragging = false;
let prevPointer = { x: 0, y: 0 };
let sidebarOpen = false;
let debugVisible = false;
let draggedDistance = 0;
let imageCache = {};
let loadingRotate = true;

/* ============================================================
   SETTINGS
   ============================================================ */
const SETTINGS_DEFAULTS = {
  hotspotStyle: 0,
  textSize: 44,
  textColor: '#ffffff',
  markerColor: '#ffffff',
  mouseSensitivity: 1,
  animations: true,
  transitionSpeed: 2500,
  language: 'ru',
  brightness: 0,
  darkness: 0,
  saturation: 1,
  contrast: 1,
  sharpness: 0,
  clarity: 0,
  fpsLimit: 60,
  glassBlur: 16,
  glassBorder: 4,
  glassOpacity: 100
};

const translations = {
  ru: {
    loading: 'Загрузка… ',
    loading_initial: 'Загрузка панорам…',
    error: 'Ошибка',
    vpn_hint: 'Если скорость скачивания медленная — выключите VPN и проверьте сигнал сети',
    bg_load: 'Загружать в фоне',
    settings_title: 'Настройки',
    rooms_title: 'Комнаты',
    back: '\u2190 Назад',
    hotspot_style: 'Внешность меток',
    text_size: 'Размер текста',
    text_color: 'Цвет текста',
    marker_color: 'Цвет меток',
    mouse_sensitivity: 'Чувствительность мыши',
    animations: 'Анимации между точками',
    transition_speed: 'Скорость перехода',
    on: 'Вкл',
    off: 'Выкл',
    debug_on: 'Отладка включена',
    copied: 'Скопировано: ',
    language: 'Язык / Language',
    px: 'px',
    s: 'с',
    glass_blur: 'Стекло',
    glass_border: 'Толщина обводки',
    glass_opacity: 'Прозрачность обводки',
    darkness: 'Темность',
  },
  en: {
    loading: 'Loading\u2026 ',
    loading_initial: 'Loading panoramas\u2026',
    error: 'Error',
    vpn_hint: 'If download speed is slow \u2014 disable VPN and check your network signal',
    bg_load: 'Load in Background',
    settings_title: 'Settings',
    rooms_title: 'Rooms',
    back: '\u2190 Back',
    hotspot_style: 'Hotspot Style',
    text_size: 'Text Size',
    text_color: 'Text Color',
    marker_color: 'Marker Color',
    mouse_sensitivity: 'Mouse Sensitivity',
    animations: 'Transition Animations',
    transition_speed: 'Transition Speed',
    on: 'On',
    off: 'Off',
    debug_on: 'Debug enabled',
    copied: 'Copied: ',
    language: 'Language / Язык',
    glass_blur: 'Glass Blur',
    glass_border: 'Border Thickness',
    glass_opacity: 'Border Opacity',
    darkness: 'Darkness',
    px: 'px',
    s: 's',
  }
};

const sceneNamesEn = {
  'main_entrance': 'Main Entrance',
  'porch': 'Porch',
  'security': 'Security',
  'near_stairs': 'Near Stairs',
  'climb': 'Climb',
  'climb_1f': 'Climb Floor 1',
  'climb_2f': 'Climb Floor 2',
  'climb_3f': 'Climb 3rd Floor',
  'floor_3': '3rd Floor',
  'fork_3': 'Fork 3rd Floor',
  'floor_3_1': '3rd Floor Room 1',
  'floor_3_2': '3rd Floor Room 2',
  'floor_3_3': '3rd Floor Room 3',
  'floor_3_4': '3rd Floor Room 4',
  'floor_3_5': '3rd Floor Room 5',
  'floor_3_6': '3rd Floor Room 6',
  'floor_3_7': '3rd Floor Room 7',
  'floor_3_8': '3rd Floor Room 8',
  'floor_3_9': '3rd Floor Room 9',
  'floor_3_10': '3rd Floor Room 10',
  'floor_3_11': '3rd Floor Room 11',
  'floor_3_12': '3rd Floor Room 12',
  'floor_3_13': '3rd Floor Room 13',
  'floor_3_14': '3rd Floor Room 14',
};

const hotspotLabelEn = {
  '\u041a\u0440\u044b\u043b\u044c\u0446\u043e': 'Porch',
  '\u0413\u043b\u0430\u0432\u043d\u044b\u0439 \u0432\u0445\u043e\u0434': 'Main Entrance',
  '\u041e\u0445\u0440\u0430\u043d\u0430': 'Security',
  '\u041e\u043a\u043e\u043b\u043e \u043b\u0435\u0441\u0442\u043d\u0438\u0446\u044b': 'Near Stairs',
  '\u041f\u043e\u0434\u044a\u0435\u043c': 'Climb',
  '\u041f\u043e\u0434\u044a\u0435\u043c 1 \u044d\u0442\u0430\u0436': 'Climb Floor 1',
  '\u041f\u043e\u0434\u044a\u0435\u043c 2 \u044d\u0442\u0430\u0436': 'Climb Floor 2',
  '\u041f\u043e\u0434\u044a\u0435\u043c \u0422\u0440\u0435\u0442\u0438\u0439 \u044d\u0442\u0430\u0436': 'Climb 3rd Floor',
  '\u0422\u0440\u0435\u0442\u0438\u0439 \u044d\u0442\u0430\u0436': 'Floor 3',
  '\u0422\u0440\u0435\u0442\u0438\u0439 \u044d\u0442\u0430\u0436 1': 'Floor 3 Room 1',
  '\u0422\u0440\u0435\u0442\u0438\u0439 \u044d\u0442\u0430\u0436 2': 'Floor 3 Room 2',
  '\u0422\u0440\u0435\u0442\u0438\u0439 \u044d\u0442\u0430\u0436 3': 'Floor 3 Room 3',
  '\u0422\u0440\u0435\u0442\u0438\u0439 \u044d\u0442\u0430\u0436 4': 'Floor 3 Room 4',
  '\u0422\u0440\u0435\u0442\u0438\u0439 \u044d\u0442\u0430\u0436 5': 'Floor 3 Room 5',
  '\u0422\u0440\u0435\u0442\u0438\u0439 \u044d\u0442\u0430\u0436 6': 'Floor 3 Room 6',
  '\u0422\u0440\u0435\u0442\u0438\u0439 \u044d\u0442\u0430\u0436 7': 'Floor 3 Room 7',
  '\u0422\u0440\u0435\u0442\u0438\u0439 \u044d\u0442\u0430\u0436 8': 'Floor 3 Room 8',
  '\u0422\u0440\u0435\u0442\u0438\u0439 \u044d\u0442\u0430\u0436 9': 'Floor 3 Room 9',
  '\u0422\u0440\u0435\u0442\u0438\u0439 \u044d\u0442\u0430\u0436 10': 'Floor 3 Room 10',
  '\u0422\u0440\u0435\u0442\u0438\u0439 \u044d\u0442\u0430\u0436 11': 'Floor 3 Room 11',
  '\u0422\u0440\u0435\u0442\u0438\u0439 \u044d\u0442\u0430\u0436 12': 'Floor 3 Room 12',
  '\u0422\u0440\u0435\u0442\u0438\u0439 \u044d\u0442\u0430\u0436 13': 'Floor 3 Room 13',
  '\u0422\u0440\u0435\u0442\u0438\u0439 \u044d\u0442\u0430\u0436 14': 'Floor 3 Room 14',
  '\u0420\u0430\u0437\u0432\u0438\u043b\u043a\u0430 \u0422\u0440\u0435\u0442\u0438\u0439 \u044d\u0442\u0430\u0436': 'Fork Floor 3',
  '\u041f\u043e\u0434\u043d\u0438\u043c\u0430\u0435\u043c\u0441\u044f \u043d\u0430 2 \u044d\u0442\u0430\u0436': 'Going up to Floor 2',
  '\u041f\u043e\u0434\u043d\u0438\u043c\u0430\u0435\u043c\u0441\u044f \u043d\u0430 \u0442\u0440\u0435\u0442\u0438\u0439 \u044d\u0442\u0430\u0436': 'Going up to Floor 3',
  '\u0421\u043f\u0443\u0441\u043a\u0430\u0435\u043c\u0441\u044f \u043d\u0430 1 \u044d\u0442\u0430\u0436': 'Going down to Floor 1',
  '\u0421\u043f\u0443\u0441\u043a\u0430\u0435\u043c\u0441\u044f \u043d\u0430 2 \u044d\u0442\u0430\u0436': 'Going down to Floor 2',
};

const variantLabelEn = {
  '\u0413\u043b\u0430\u0432\u043d\u044b\u0439 \u0432\u0445\u043e\u0434': 'Main Entrance',
  '\u041a\u0440\u044b\u043b\u044c\u0446\u043e': 'Porch',
  '\u041e\u0445\u0440\u0430\u043d\u0430': 'Security',
  '\u041e\u043a\u043e\u043b\u043e \u043b\u0435\u0441\u0442\u043d\u0438\u0446\u044b': 'Near Stairs',
  '\u041f\u043e\u0434\u044a\u0435\u043c': 'Climb',
  '\u041f\u043e\u0434\u044a\u0435\u043c 1 \u044d\u0442\u0430\u0436': 'Climb Floor 1',
  '\u041f\u043e\u0434\u044a\u0435\u043c 2 \u044d\u0442\u0430\u0436': 'Climb Floor 2',
  '\u041f\u043e\u0434\u044a\u0435\u043c \u0422\u0440\u0435\u0442\u0438\u0439 \u044d\u0442\u0430\u0436': 'Climb 3rd Floor',
  '\u0422\u0440\u0435\u0442\u0438\u0439 \u044d\u0442\u0430\u0436': '3rd Floor',
  '\u0420\u0430\u0437\u0432\u0438\u043b\u043a\u0430 \u0422\u0440\u0435\u0442\u0438\u0439 \u044d\u0442\u0430\u0436': 'Fork 3rd Floor',
  '\u0422\u0440\u0435\u0442\u0438\u0439 \u044d\u0442\u0430\u0436 1': '3rd Floor Room 1',
  '\u0422\u0440\u0435\u0442\u0438\u0439 \u044d\u0442\u0430\u0436 2': '3rd Floor Room 2',
  '\u0422\u0440\u0435\u0442\u0438\u0439 \u044d\u0442\u0430\u0436 3': '3rd Floor Room 3',
  '\u0422\u0440\u0435\u0442\u0438\u0439 \u044d\u0442\u0430\u0436 4': '3rd Floor Room 4',
  '\u0422\u0440\u0435\u0442\u0438\u0439 \u044d\u0442\u0430\u0436 5': '3rd Floor Room 5',
  '\u0422\u0440\u0435\u0442\u0438\u0439 \u044d\u0442\u0430\u0436 6': '3rd Floor Room 6',
  '\u0422\u0440\u0435\u0442\u0438\u0439 \u044d\u0442\u0430\u0436 7': '3rd Floor Room 7',
  '\u0422\u0440\u0435\u0442\u0438\u0439 \u044d\u0442\u0430\u0436 8': '3rd Floor Room 8',
  '\u0422\u0440\u0435\u0442\u0438\u0439 \u044d\u0442\u0430\u0436 9': '3rd Floor Room 9',
  '\u0422\u0440\u0435\u0442\u0438\u0439 \u044d\u0442\u0430\u0436 10': '3rd Floor Room 10',
  '\u0422\u0440\u0435\u0442\u0438\u0439 \u044d\u0442\u0430\u0436 11': '3rd Floor Room 11',
  '\u0422\u0440\u0435\u0442\u0438\u0439 \u044d\u0442\u0430\u0436 12': '3rd Floor Room 12',
  '\u0422\u0440\u0435\u0442\u0438\u0439 \u044d\u0442\u0430\u0436 13': '3rd Floor Room 13',
  '\u0422\u0440\u0435\u0442\u0438\u0439 \u044d\u0442\u0430\u0436 14': '3rd Floor Room 14',
};

const sidebarGroupLabelEn = {
  '\u0422\u0440\u0435\u0442\u0438\u0439 \u044d\u0442\u0430\u0436': 'Floor 3',
  '\u041a\u0430\u0431\u0438\u043d\u0435\u0442\u044b': 'Rooms',
};

function t(key) {
  const lang = settings.language || 'ru';
  return (translations[lang] && translations[lang][key]) || (translations.ru && translations.ru[key]) || key;
}

function getSceneName(id) {
  const s = scenes[id];
  if (!s) return '';
  if (settings.language === 'en' && sceneNamesEn[id]) return sceneNamesEn[id];
  return s.name;
}

function getHSLabel(rus) {
  if (settings.language === 'en' && hotspotLabelEn[rus]) return hotspotLabelEn[rus];
  return rus;
}

function getVariantLabel(rus) {
  if (settings.language === 'en' && variantLabelEn[rus]) return variantLabelEn[rus];
  return rus;
}

function getSidebarGroupLabel(rus) {
  if (settings.language === 'en' && sidebarGroupLabelEn[rus]) return sidebarGroupLabelEn[rus];
  return rus;
}

let settings = {};

function loadSettings() {
  try {
    const raw = localStorage.getItem('kvantorium_settings');
    if (raw) {
      settings = JSON.parse(raw);
      for (const k in SETTINGS_DEFAULTS) {
        if (settings[k] === undefined) settings[k] = SETTINGS_DEFAULTS[k];
      }
    } else {
      settings = { ...SETTINGS_DEFAULTS };
    }
  } catch {
    settings = { ...SETTINGS_DEFAULTS };
  }
}

function saveSettings() {
  try { localStorage.setItem('kvantorium_settings', JSON.stringify(settings)); } catch {}
}

loadSettings();
applyGlassStyle();

/* ============================================================
   THREE.JS
   ============================================================ */
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(fov, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.outputColorSpace = THREE.SRGBColorSpace;
document.body.prepend(renderer.domElement);

const sphereGeo = new THREE.SphereGeometry(SPHERE_RADIUS, 64, 64);

let adjustmentUniforms = null;
const whiteTex = new THREE.DataTexture(new Uint8Array([255, 255, 255]), 1, 1, THREE.RedFormat);
whiteTex.needsUpdate = true;

function createFilterMaterial(texture) {
  const tex = texture || whiteTex;
  const uniforms = {
    tDiffuse: { value: tex },
    brightness: { value: settings.brightness },
    darkness: { value: settings.darkness },
    saturation: { value: settings.saturation },
    contrast: { value: settings.contrast },
    sharpness: { value: settings.sharpness },
    clarity: { value: settings.clarity },
    texWidth: { value: tex.image ? tex.image.width : 2048 },
    texHeight: { value: tex.image ? tex.image.height : 1024 }
  };
  adjustmentUniforms = uniforms;
  return new THREE.ShaderMaterial({
    uniforms,
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = vec2(1.0 - uv.x, uv.y);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform sampler2D tDiffuse;
      uniform float brightness;
      uniform float darkness;
      uniform float saturation;
      uniform float contrast;
      uniform float sharpness;
      uniform float clarity;
      uniform float texWidth;
      uniform float texHeight;
      varying vec2 vUv;
      void main() {
        vec4 texel = texture2D(tDiffuse, vUv);
        vec3 col = texel.rgb;
        col += brightness;
        col = (col - 0.5) * contrast + 0.5;
        float gray = dot(col, vec3(0.299, 0.587, 0.114));
        col = mix(vec3(gray), col, saturation);
        if (sharpness > 0.0) {
          vec2 ts = vec2(1.0 / texWidth, 1.0 / texHeight);
          vec3 s = col * 9.0;
          s -= texture2D(tDiffuse, vUv + vec2(-ts.x, -ts.y)).rgb;
          s -= texture2D(tDiffuse, vUv + vec2(0.0, -ts.y)).rgb;
          s -= texture2D(tDiffuse, vUv + vec2(ts.x, -ts.y)).rgb;
          s -= texture2D(tDiffuse, vUv + vec2(-ts.x, 0.0)).rgb;
          s -= texture2D(tDiffuse, vUv + vec2(ts.x, 0.0)).rgb;
          s -= texture2D(tDiffuse, vUv + vec2(-ts.x, ts.y)).rgb;
          s -= texture2D(tDiffuse, vUv + vec2(0.0, ts.y)).rgb;
          s -= texture2D(tDiffuse, vUv + vec2(ts.x, ts.y)).rgb;
          col = mix(col, clamp(s, 0.0, 1.0), sharpness);
        }
        if (clarity > 0.0) {
          vec2 ts = vec2(2.0 / texWidth, 2.0 / texHeight);
          vec3 blur = texture2D(tDiffuse, vUv + vec2(-ts.x, -ts.y)).rgb;
          blur += texture2D(tDiffuse, vUv + vec2(ts.x, -ts.y)).rgb;
          blur += texture2D(tDiffuse, vUv + vec2(-ts.x, ts.y)).rgb;
          blur += texture2D(tDiffuse, vUv + vec2(ts.x, ts.y)).rgb;
          blur *= 0.25;
          col += (col - blur) * clarity;
          col = clamp(col, 0.0, 1.0);
        }
        col = mix(col, vec3(0.0), darkness);
        gl_FragColor = vec4(col, 1.0);
      }
    `,
    side: THREE.BackSide
  });
}

function setTexUniforms(mat, tex) {
  if (mat.uniforms) {
    mat.uniforms.tDiffuse.value = tex;
    mat.uniforms.texWidth.value = tex.image ? tex.image.width : 2048;
    mat.uniforms.texHeight.value = tex.image ? tex.image.height : 1024;
  } else {
    mat.map = tex;
    mat.needsUpdate = true;
  }
}

const sphereMat = createFilterMaterial(null);
let sphere = new THREE.Mesh(sphereGeo, sphereMat);
scene.add(sphere);

const euler = new THREE.Euler(0, 0, 0, 'YXZ');
const hotspotVec = new THREE.Vector3(0, 0, -1);

// Главный вход грузится сразу
const mainFileUrl = scenes.main_entrance.variants[0].image;
const mainFileReady = new Promise(resolve => {
  const loader = new THREE.TextureLoader();
  loader.load(encodeURI(mainFileUrl), tex => {
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.wrapS = THREE.RepeatWrapping;
    tex.needsUpdate = true;
    imageCache[mainFileUrl] = tex;
    sphere.material.transparent = true;
    sphere.material.opacity = 0;
    setTexUniforms(sphere.material, tex);
    resolve();
  });
});

/* ============================================================
   LOADING / PRELOAD
   ============================================================ */
const preloadList = document.getElementById('preload-list');
const bgProgress = document.getElementById('bg-progress');
const loadingStatus = document.getElementById('loading-status');
const loadingSpeed = document.getElementById('loading-speed');
const loadingEl = document.getElementById('loading');
const loadingHint = document.getElementById('loading-hint');
const bgLoadBtn = document.getElementById('bg-load-btn');
loadingStatus.textContent = t('loading_initial');
loadingHint.textContent = t('vpn_hint');
bgLoadBtn.textContent = t('bg_load');

function getAllImages() {
  const imgs = [];
  for (const id in scenes) {
    const s = scenes[id];
    for (const v of s.variants) {
      if (v.image) imgs.push({ id, label: getSceneName(id), file: v.image, variant: getVariantLabel(v.label || '') });
    }
  }
  return imgs;
}

function humanSize(bytes) {
  const mb = bytes / (1024 * 1024);
  if (mb < 0.01) return '0MB';
  return mb.toFixed(1) + 'MB';
}

function updateSpeed(loaded, elapsed) {
  const speed = elapsed > 0 ? (loaded / elapsed) : 0;
  loadingSpeed.textContent = (speed / (1024 * 1024)).toFixed(1) + ' MB/s';
}

async function preloadAll() {
  const images = getAllImages();
  const total = images.length;

  if (total === 0) {
    loadingEl.classList.add('hidden');
    setTimeout(startViewer, 100);
    return;
  }

  preloadList.innerHTML = '';
  let loadedBytes = 0;
  let loadedCount = 0;
  const startTime = performance.now();

  function onItemProgress(itemEl, loaded, total) {
    const pct = total > 0 ? Math.round(loaded / total * 100) : 0;
    itemEl.querySelector('.progress').textContent = humanSize(loaded) + ' / ' + humanSize(total);
    if (pct === 100) itemEl.querySelector('.progress').textContent = '\u2713 ' + humanSize(total);
  }

  function onAllProgress() {
    const elapsed = (performance.now() - startTime) / 1000;
    updateSpeed(loadedBytes, elapsed);
    loadingStatus.textContent = t('loading') + loadedCount + '/' + total;
  }

  function checkDone() {
    if (loadedCount === total) {
      loadingEl.classList.add('hidden');
      if (!viewerStarted) startViewer();
      return true;
    }
    return false;
  }

  for (const img of images) {
    const itemEl = document.createElement('div');
    itemEl.className = 'preload-item';
    itemEl.innerHTML = '<span class="name">' + img.label + '</span><span class="progress">...</span>';
    if (img.variant) { itemEl.classList.add('variant'); itemEl.querySelector('.name').textContent = '  \u21B3 ' + img.variant; }
    preloadList.appendChild(itemEl);

    if (imageCache[img.file]) {
      onItemProgress(itemEl, 1, 1);
      loadedCount++;
      onAllProgress();
      checkDone();
      continue;
    }

    const url = encodeURI(img.file);

    if (img.file === mainFileUrl) {
      await mainFileReady;
      onItemProgress(itemEl, 1, 1);
      loadedCount++;
      onAllProgress();
      checkDone();
      continue;
    }

    (function doLoad(itemEl, url) {
      fetch(url).then(r => {
        const total = parseInt(r.headers.get('Content-Length') || '0');
        const reader = r.body.getReader();
        const chunks = [];
        let itemLoaded = 0;

        function pump() {
          return reader.read().then(({ done, value }) => {
            if (done) {
              const blob = new Blob(chunks);
              const blobUrl = URL.createObjectURL(blob);
              const loader = new THREE.TextureLoader();
              loader.load(blobUrl, tex => {
                URL.revokeObjectURL(blobUrl);
                tex.colorSpace = THREE.SRGBColorSpace;
                tex.wrapS = THREE.RepeatWrapping;
                tex.needsUpdate = true;
                imageCache[img.file] = tex;
                onItemProgress(itemEl, total, total);
                loadedCount++;
                onAllProgress();
                checkDone();
              });
              return;
            }
            chunks.push(value);
            loadedBytes += value.length;
            itemLoaded += value.length;
            onItemProgress(itemEl, itemLoaded, total);
            onAllProgress();
            return pump();
          });
        }
        return pump();
      }).catch(() => {
        const loader = new THREE.TextureLoader();
        loader.load(url, tex => {
          tex.colorSpace = THREE.SRGBColorSpace;
          tex.wrapS = THREE.RepeatWrapping;
          tex.needsUpdate = true;
          imageCache[img.file] = tex;
          onItemProgress(itemEl, 1, 1);
          loadedCount++;
          onAllProgress();
          checkDone();
        });
      });
    })(itemEl, url);
  }
}

let viewerStarted = false;

bgLoadBtn.addEventListener('click', () => {
  bgLoadBtn.remove();
  loadingEl.classList.add('hidden');
  bgProgress.appendChild(preloadList);
  bgProgress.classList.remove('hidden');
  startViewer();
});

/* ============================================================
   TEXTURE LOADING
   ============================================================ */
function loadTexture(url) {
  if (imageCache[url]) return Promise.resolve(imageCache[url]);
  return new Promise((resolve, reject) => {
    const loader = new THREE.TextureLoader();
    loader.load(encodeURI(url), tex => {
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.wrapS = THREE.RepeatWrapping;
      tex.repeat.x = -1;
      tex.needsUpdate = true;
      imageCache[url] = tex;
      resolve(tex);
    }, undefined, reject);
  });
}

async function setScene(id, variantIdx, preserveRotation = false) {
  if (isTransitioning) return;
  const s = scenes[id];
  if (!s) return;

  const imgUrl = s.variants[variantIdx].image;
  if (!imgUrl) return;

  if (!preserveRotation) {
    const firstHotspot = s.hotspots[0];
    yaw = firstHotspot ? firstHotspot.yaw : 0;
    pitch = firstHotspot ? firstHotspot.pitch : 0;
    targetYaw = yaw;
    targetPitch = pitch;
  }

  try {
    const tex = await loadTexture(imgUrl);
    if (sphere.material.uniforms) {
      sphere.material.uniforms.tDiffuse.value = tex;
    } else {
      sphere.material.map = tex;
      sphere.material.needsUpdate = true;
    }
    currentSceneId = id;
    currentVariantIdx = variantIdx;
    updateUI();
    buildHotspots();
    buildSidebar();
  } catch (e) {
    console.error('Failed to load texture:', imgUrl, e);
  }
}

function startViewer() {
  loadingRotate = false;
  viewerStarted = true;
  setScene(DEFAULT_SCENE, 0);
}

/* ============================================================
   HOTSPOTS
   ============================================================ */
let hotspotMeshes = [];

function createHotspotSprite(label) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = 1024;
  canvas.height = 256;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const cx = 512, cy = 180;
  const style = settings.hotspotStyle;
  const tColor = settings.textColor;
  const tSize = settings.textSize;
  const mColor = settings.markerColor;

  if (style === 0) {
    ctx.beginPath();
    ctx.arc(cx, cy, 60, 0, Math.PI * 2);
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 30;
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(cx, cy, 46, 0, Math.PI * 2);
    ctx.strokeStyle = mColor;
    ctx.lineWidth = 12;
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(cx, cy, 24, 0, Math.PI * 2);
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 24;
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(cx, cy, 10, 0, Math.PI * 2);
    ctx.strokeStyle = mColor;
    ctx.lineWidth = 6;
    ctx.stroke();
  } else if (style === 1) {
    ctx.beginPath();
    ctx.arc(cx, cy, 28, 0, Math.PI * 2);
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 18;
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(cx, cy, 16, 0, Math.PI * 2);
    ctx.strokeStyle = mColor;
    ctx.lineWidth = 8;
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(cx, cy, 6, 0, Math.PI * 2);
    ctx.fillStyle = mColor;
    ctx.fill();
  } else if (style === 2) {
    const r = 28;
    ctx.beginPath();
    ctx.roundRect(cx - r, cy - r, r * 2, r * 2, 10);
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 18;
    ctx.stroke();
    ctx.beginPath();
    ctx.roundRect(cx - r + 4, cy - r + 4, (r - 4) * 2, (r - 4) * 2, 8);
    ctx.strokeStyle = mColor;
    ctx.lineWidth = 8;
    ctx.stroke();
    ctx.beginPath();
    ctx.roundRect(cx - 8, cy - 8, 16, 16, 4);
    ctx.fillStyle = mColor;
    ctx.fill();
  } else {
    ctx.beginPath();
    ctx.moveTo(cx, cy - 35);
    ctx.lineTo(cx + 30, cy);
    ctx.lineTo(cx, cy + 35);
    ctx.lineTo(cx - 30, cy);
    ctx.closePath();
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 18;
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(cx, cy - 27);
    ctx.lineTo(cx + 24, cy);
    ctx.lineTo(cx, cy + 27);
    ctx.lineTo(cx - 24, cy);
    ctx.closePath();
    ctx.strokeStyle = mColor;
    ctx.lineWidth = 8;
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(cx, cy, 8, 0, Math.PI * 2);
    ctx.fillStyle = mColor;
    ctx.fill();
  }

  ctx.fillStyle = tColor;
  ctx.font = 'bold ' + tSize + 'px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
  ctx.textBaseline = 'middle';
  ctx.textAlign = 'center';
  ctx.shadowColor = '#000';
  ctx.shadowBlur = 12;
  ctx.fillText(label, cx, 60);
  ctx.shadowBlur = 0;

  const tex = new THREE.CanvasTexture(canvas);
  tex.needsUpdate = true;
  const mat = new THREE.SpriteMaterial({ map: tex, transparent: true, depthTest: false });
  const sprite = new THREE.Sprite(mat);
  sprite.scale.set(300, 75, 1);
  return sprite;
}

function buildHotspots() {
  for (const m of hotspotMeshes) scene.remove(m);
  hotspotMeshes = [];

  const s = scenes[currentSceneId];
  if (!s) return;

  for (const hs of s.hotspots) {
    const q = new THREE.Quaternion().setFromEuler(new THREE.Euler(hs.pitch, hs.yaw, 0, 'YXZ'));
    const pos = hotspotVec.clone().applyQuaternion(q).multiplyScalar(HOTSPOT_DISTANCE);
    const sprite = createHotspotSprite(getHSLabel(hs.label));
    sprite.position.copy(pos);
    sprite.userData = hs;
    scene.add(sprite);
    hotspotMeshes.push(sprite);
  }
}

/* ============================================================
   RAYCASTER
   ============================================================ */
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();

function pickHotspot(clientX, clientY) {
  const rect = renderer.domElement.getBoundingClientRect();
  pointer.x = ((clientX - rect.left) / rect.width) * 2 - 1;
  pointer.y = -((clientY - rect.top) / rect.height) * 2 + 1;
  raycaster.setFromCamera(pointer, camera);
  const intersects = raycaster.intersectObjects(hotspotMeshes);
  if (intersects.length > 0) {
    const obj = intersects[0].object;
    if (obj.userData && obj.userData.target) return obj.userData;
  }
  return null;
}

/* ============================================================
   POINTER EVENTS
   ============================================================ */
function getClientXY(e) {
  if ('touches' in e && e.touches.length > 0) {
    return { x: e.touches[0].clientX, y: e.touches[0].clientY };
  }
  if ('changedTouches' in e && e.changedTouches.length > 0) {
    return { x: e.changedTouches[0].clientX, y: e.changedTouches[0].clientY };
  }
  return { x: e.clientX, y: e.clientY };
}

function onPointerDown(e) {
  if (isTransitioning) return;
  const { x, y } = getClientXY(e);
  draggedDistance = 0;
  prevPointer.x = x;
  prevPointer.y = y;
  isDragging = true;
}

function onPointerUp(e) {
  if (isTransitioning) return;
  const { x, y } = getClientXY(e);
  if (draggedDistance < 5) {
    const hs = pickHotspot(x, y);
    if (hs) {
      isDragging = false;
      const targetScene = scenes[hs.target];
      let retYaw = (hs.yaw + Math.PI) % (2 * Math.PI);
      let retPitch = hs.pitch || 0;
      if (targetScene) {
        const returnHS = targetScene.hotspots.find(h => h.target === currentSceneId);
        if (returnHS) {
          retYaw = (returnHS.yaw + Math.PI) % (2 * Math.PI);
          retPitch = returnHS.pitch || 0;
        }
      }
      if (settings.animations && settings.transitionSpeed > 0) {
        animateHotspotTransition(hs, retYaw, retPitch);
      } else {
        isTransitioning = true;
        doCrossfadeTransition(hs.target, retYaw, retPitch).then(() => {
          isTransitioning = false;
        });
      }
      return;
    }
  }
  isDragging = false;
}

function onPointerMove(e) {
  const { x, y } = getClientXY(e);
  const dx = x - prevPointer.x;
  const dy = y - prevPointer.y;
  draggedDistance += Math.abs(dx) + Math.abs(dy);
  if (!isDragging) return;
  draggedDistance += Math.abs(dx) + Math.abs(dy);

  if (!isDragging) return;

  const sens = 0.005 * (fov / 75) * settings.mouseSensitivity;
  targetYaw += dx * sens;
  targetPitch += dy * sens;
  targetPitch = Math.max(-Math.PI / 2.2, Math.min(Math.PI / 2.2, targetPitch));

  prevPointer.x = x;
  prevPointer.y = y;
}

/* ============================================================
   HOTSPOT TRANSITION
   ============================================================ */
let transitionAnimId = null;
let crossfadeStarted = false;

function animateHotspotTransition(hs, retYaw, retPitch) {
  if (isTransitioning) return;
  isTransitioning = true;
  crossfadeStarted = false;

  const startFov = fov;
  const startYaw = yaw;
  const startPitch = pitch;
  const targetHsYaw = hs.yaw;
  const targetHsPitch = hs.pitch;

  let deltaYaw = targetHsYaw - startYaw;
  while (deltaYaw > Math.PI) deltaYaw -= 2 * Math.PI;
  while (deltaYaw < -Math.PI) deltaYaw += 2 * Math.PI;

  const duration = settings.transitionSpeed || 2500;
  const climb = hs.stairs;
  const descend = hs.descend;
  let climbTextEl = null;
  if (hs.climbText) {
    climbTextEl = document.createElement('div');
    climbTextEl.textContent = getHSLabel(hs.climbText);
    climbTextEl.style.cssText = 'position:fixed;bottom:80px;left:50%;transform:translateX(-50%);z-index:200;color:#fff;font:bold 32px -apple-system,sans-serif;text-shadow:0 0 20px rgba(0,0,0,0.8);pointer-events:none;opacity:0;transition:opacity 0.5s';
    document.body.appendChild(climbTextEl);
    requestAnimationFrame(() => { climbTextEl.style.opacity = '1'; });
  }

  const startTime = performance.now();

  function step(now) {
    const t = Math.min((now - startTime) / duration, 1);

    const stepPitch = (climb ? 1 : descend ? -1 : 0) * 0.025 * Math.sin(t * Math.PI * 10 + 1.2) * Math.min(t * 4, 1);
    const lean = climb ? t * 0.08 : descend ? -t * 0.08 : 0;
    const bob = climb || descend ? 0 : Math.sin(t * Math.PI * 7) * 0.012 * Math.min(t * 4, 1);

    if (crossfadeStarted) {
      yaw = retYaw;
      pitch = retPitch + lean + stepPitch + bob;
      const postT = Math.min((t - 0.65) / 0.35, 1);
      fov = 120 + (75 - 120) * Math.pow(postT, 1.5);
    } else {
      yaw = startYaw + deltaYaw * (1 - Math.pow(1 - t, 2));
      pitch = startPitch + (targetHsPitch - startPitch) * t + lean + stepPitch + bob;
      fov = startFov + (55 - startFov) * Math.pow(t / 0.65, 1.5);
      if (t >= 0.55) {
        renderer.domElement.style.transition = 'filter 0.25s ease';
        renderer.domElement.style.filter = 'blur(5px)';
      }
      if (t >= 0.65) {
        crossfadeStarted = true;
        doCrossfadeTransition(hs.target, retYaw, retPitch);
      }
    }
    targetYaw = yaw;
    targetPitch = pitch;
    targetFov = fov;

    if (t < 1) {
      requestAnimationFrame(step);
    } else {
      if (climbTextEl) {
        climbTextEl.style.opacity = '0';
        setTimeout(() => climbTextEl.remove(), 500);
      }
      renderer.domElement.style.filter = '';
      isTransitioning = false;
    }
  }
  requestAnimationFrame(step);
}

async function doCrossfadeTransition(targetId, returnYaw, returnPitch) {
  const s = scenes[targetId];
  if (!s) { isTransitioning = false; return; }

  const imgUrl = aiMode && s.variants[1] ? s.variants[1].image : s.variants[0].image;

  try {
    const tex = await loadTexture(imgUrl);

    const mat2 = createFilterMaterial(tex);
    mat2.transparent = true;
    mat2.opacity = 0;
    mat2.uniforms.brightness.value = settings.brightness;
    mat2.uniforms.saturation.value = settings.saturation;
    mat2.uniforms.contrast.value = settings.contrast;
    mat2.uniforms.sharpness.value = settings.sharpness;
    mat2.uniforms.clarity.value = settings.clarity;
    const sphere2 = new THREE.Mesh(sphereGeo, mat2);
    scene.add(sphere2);

    if (returnYaw !== undefined) {
      yaw = returnYaw;
      pitch = returnPitch || 0;
      targetYaw = yaw;
      targetPitch = pitch;
    }

    currentSceneId = targetId;
    currentVariantIdx = aiMode && s.variants[1] ? 1 : 0;
    updateUI();
    buildHotspots();
    buildSidebar();

    sphere.material.transparent = true;
    renderer.domElement.style.transition = 'filter 0.25s ease';
    renderer.domElement.style.filter = 'blur(5px)';
    const cfStart = performance.now();
    const cfDur = 500;
    await new Promise(resolve => {
      function cfStep(now) {
        const t = Math.min((now - cfStart) / cfDur, 1);
        sphere.material.opacity = 1 - t;
        sphere2.material.opacity = t;
        if (t < 1) { requestAnimationFrame(cfStep); return; }
        renderer.domElement.style.filter = '';
        setTimeout(() => { renderer.domElement.style.transition = ''; }, 300);
        scene.remove(sphere);
        sphere.material.dispose();
        sphere2.material.transparent = false;
        sphere2.material.opacity = 1;
        sphere = sphere2;
        resolve();
      }
      requestAnimationFrame(cfStep);
    });
  } catch (e) {
    renderer.domElement.style.filter = '';
    renderer.domElement.style.transition = '';
    isTransitioning = false;
    console.error(e);
  }
}

/* ============================================================
   SIDEBAR NAVIGATION
   ============================================================ */
async function navigateTo(id, variantIdx) {
  if (id === currentSceneId && variantIdx === currentVariantIdx) return;
  if (isTransitioning) return;
  isTransitioning = true;

  const s = scenes[id];
  if (!s) { isTransitioning = false; return; }

  const imgUrl = s.variants[variantIdx].image;

  try {
    const tex = await loadTexture(imgUrl);

    const mat2 = createFilterMaterial(tex);
    mat2.transparent = true;
    mat2.opacity = 0;
    mat2.uniforms.brightness.value = settings.brightness;
    mat2.uniforms.saturation.value = settings.saturation;
    mat2.uniforms.contrast.value = settings.contrast;
    mat2.uniforms.sharpness.value = settings.sharpness;
    mat2.uniforms.clarity.value = settings.clarity;
    const sphere2 = new THREE.Mesh(sphereGeo, mat2);
    scene.add(sphere2);

    const h = s.hotspots[0];
    if (h) {
      yaw = h.yaw + Math.PI;
      pitch = h.pitch || 0;
      if (yaw > Math.PI * 2) yaw -= Math.PI * 2;
      targetYaw = yaw;
      targetPitch = pitch;
    }

    currentSceneId = id;
    currentVariantIdx = variantIdx;
    updateUI();
    buildHotspots();
    buildSidebar();

    sphere.material.transparent = true;
    renderer.domElement.style.transition = 'filter 0.25s ease';
    renderer.domElement.style.filter = 'blur(5px)';
    const cfStart = performance.now();
    const cfDur = 500;
    function step(now) {
      const t = Math.min((now - cfStart) / cfDur, 1);
      sphere.material.opacity = 1 - t;
      sphere2.material.opacity = t;
      if (t < 1) { requestAnimationFrame(step); return; }
      renderer.domElement.style.filter = '';
      setTimeout(() => { renderer.domElement.style.transition = ''; }, 300);
      scene.remove(sphere);
      sphere.material.dispose();
      sphere2.material.transparent = false;
      sphere2.material.opacity = 1;
      sphere = sphere2;
      fov = 120;
      targetFov = 120;
      const zStart = performance.now();
      function zoomStep(now2) {
        const zt = Math.min((now2 - zStart) / 500, 1);
        fov = 120 + (75 - 120) * (1 - Math.pow(1 - zt, 3));
        targetFov = fov;
        if (zt < 1) { requestAnimationFrame(zoomStep); return; }
        isTransitioning = false;
      }
      requestAnimationFrame(zoomStep);
    }
    requestAnimationFrame(step);
  } catch (e) {
    renderer.domElement.style.filter = '';
    renderer.domElement.style.transition = '';
    console.error(e);
    isTransitioning = false;
  }
}

/* ============================================================
   UI
   ============================================================ */
const sceneNameEl = document.getElementById('scene-name');
const variantsEl = document.getElementById('variants');

function updateUI() {
  const s = scenes[currentSceneId];
  if (!s) return;
  sceneNameEl.textContent = getSceneName(currentSceneId);

  variantsEl.innerHTML = '';
  if (s.variants.length > 1) {
    for (let i = 0; i < s.variants.length; i++) {
      const btn = document.createElement('button');
      btn.textContent = getVariantLabel(s.variants[i].label);
      if (i === currentVariantIdx) btn.classList.add('active');
      btn.addEventListener('click', () => switchVariant(i));
      variantsEl.appendChild(btn);
    }
  }
}

function switchVariant(idx) {
  const s = scenes[currentSceneId];
  if (!s || idx === currentVariantIdx) return;
  currentVariantIdx = idx;
  const imgUrl = s.variants[idx].image;
  loadTexture(imgUrl).then(tex => {
    if (sphere.material.uniforms) {
      sphere.material.uniforms.tDiffuse.value = tex;
    } else {
      sphere.material.map = tex;
      sphere.material.needsUpdate = true;
    }
    updateUI();
  });
}

/* ============================================================
   SIDEBAR
   ============================================================ */
const sidebarBtn = document.getElementById('sidebar-btn');
const sidebar = document.getElementById('sidebar');
const sidebarList = document.getElementById('sidebar-list');
const overlay = document.getElementById('overlay');

function buildSidebar() {
  sidebarList.innerHTML = '';
  for (const group of sidebarGroups) {
    if (group.label) {
      const header = document.createElement('div');
      header.style.cssText = 'padding:8px 16px 4px;font-size:0.72rem;color:#888;text-transform:uppercase;letter-spacing:0.5px;';
      header.textContent = getSidebarGroupLabel(group.label);
      sidebarList.appendChild(header);
    }
    for (const id of group.scenes) {
      const s = scenes[id];
      if (!s) continue;
      const item = document.createElement('div');
      item.className = 'sidebar-item' + (id === currentSceneId ? ' active' : '');
      if (group.label) item.style.paddingLeft = '28px';
      const dot = document.createElement('span');
      dot.className = 'dot';
      item.appendChild(dot);
      const label = document.createTextNode(getSceneName(id));
      item.appendChild(label);
      item.addEventListener('click', () => {
        closeSidebar();
        const vi = aiMode && s.variants[1] ? 1 : 0;
        navigateTo(id, vi);
      });
      sidebarList.appendChild(item);
    }
  }
}

function openSidebar() {
  sidebarOpen = true;
  sidebar.classList.add('open');
  overlay.classList.add('show');
}

function closeSidebar() {
  sidebarOpen = false;
  sidebar.classList.remove('open');
  overlay.classList.remove('show');
}

sidebarBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  if (sidebarOpen) closeSidebar(); else openSidebar();
});

overlay.addEventListener('click', closeSidebar);

/* ============================================================
   SETTINGS PANEL
   ============================================================ */
const settingsBtn = document.getElementById('settings-btn');
const settingsPanel = document.getElementById('settings-panel');
const sidebarTitle = document.getElementById('sidebar-title');
settingsBtn.title = t('settings_title');
let settingsPanelBuilt = false;

function rebuildHotspots() {
  buildHotspots();
}

function applySettings() {
  rebuildHotspots();
}

function applyGlassStyle() {
  let blur = settings.glassBlur;
  if (blur === undefined || blur === null) blur = 16;
  document.documentElement.classList.toggle('no-glass-blur', blur === 0);
  document.documentElement.style.setProperty('--glass-blur', (blur || 0) + 'px');

  let border = settings.glassBorder;
  if (border === undefined || border === null) border = 4;
  document.documentElement.style.setProperty('--glass-border', border + 'px');

  let opac = settings.glassOpacity;
  if (opac === undefined || opac === null) opac = 100;
  document.documentElement.style.setProperty('--glass-opacity', (opac / 100));
}

function applyImageAdjustments() {
  if (!adjustmentUniforms) return;
  adjustmentUniforms.brightness.value = settings.brightness;
  adjustmentUniforms.darkness.value = settings.darkness;
  adjustmentUniforms.saturation.value = settings.saturation;
  adjustmentUniforms.contrast.value = settings.contrast;
  adjustmentUniforms.sharpness.value = settings.sharpness;
  adjustmentUniforms.clarity.value = settings.clarity;
}

function rebuildLanguageUI() {
  settingsPanelBuilt = false;
  settingsPanel.innerHTML = '';
  buildSettingsPanel();
  buildSidebar();
  if (sidebarList.classList.contains('hidden')) {
    sidebarTitle.textContent = t('settings_title');
  }
  settingsBtn.title = t('settings_title');
  updateUI();
  buildHotspots();
}

const STYLE_NAMES = ['Круги', 'Точка', 'Квадрат', 'Ромб'];
const STYLE_NAMES_EN = ['Circles', 'Dot', 'Square', 'Diamond'];

function buildSettingsPanel() {
  if (settingsPanelBuilt) return;
  settingsPanelBuilt = true;

  const back = document.createElement('div');
  back.id = 'settings-back';
  back.textContent = t('back');
  back.addEventListener('click', showSceneList);
  settingsPanel.appendChild(back);

  function addGroup(label, content) {
    const g = document.createElement('div');
    g.className = 'setting-group';
    const l = document.createElement('label');
    l.className = 'setting-label';
    l.textContent = label;
    g.appendChild(l);
    if (typeof content === 'function') content(g);
    else g.appendChild(content);
    settingsPanel.appendChild(g);
  }

  // 1. Hotspot style
  addGroup(t('hotspot_style'), (g) => {
    const div = document.createElement('div');
    div.className = 'setting-style-options';
    STYLE_NAMES.forEach((name, i) => {
      const btn = document.createElement('div');
      btn.className = 'setting-style-btn' + (i === settings.hotspotStyle ? ' active' : '');
      btn.textContent = settings.language === 'en' ? STYLE_NAMES_EN[i] : name;
      btn.addEventListener('click', () => {
        settings.hotspotStyle = i;
        saveSettings();
        div.querySelectorAll('.setting-style-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        applySettings();
      });
      div.appendChild(btn);
    });
    g.appendChild(div);
  });

  // 2. Text size
  addGroup(t('text_size'), (g) => {
    const input = document.createElement('input');
    input.type = 'range';
    input.min = 24;
    input.max = 60;
    input.value = settings.textSize;
    const val = document.createElement('span');
    val.style.cssText = 'color:#aaa;font-size:0.72rem;margin-left:6px';
    val.textContent = settings.textSize + t('px');
    const wrap = document.createElement('div');
    wrap.style.cssText = 'display:flex;align-items:center';
    wrap.appendChild(input);
    wrap.appendChild(val);
    g.appendChild(wrap);
    input.addEventListener('input', () => {
      settings.textSize = parseInt(input.value);
      val.textContent = settings.textSize + t('px');
      saveSettings();
      applySettings();
    });
  });

  // 3. Text color
  addGroup(t('text_color'), (g) => {
    const input = document.createElement('input');
    input.type = 'color';
    input.value = settings.textColor;
    g.appendChild(input);
    input.addEventListener('input', () => {
      settings.textColor = input.value;
      saveSettings();
      applySettings();
    });
  });

  // 4. Marker color
  addGroup(t('marker_color'), (g) => {
    const input = document.createElement('input');
    input.type = 'color';
    input.value = settings.markerColor;
    g.appendChild(input);
    input.addEventListener('input', () => {
      settings.markerColor = input.value;
      saveSettings();
      applySettings();
    });
  });

  // 5. Mouse sensitivity
  addGroup(t('mouse_sensitivity'), (g) => {
    const input = document.createElement('input');
    input.type = 'range';
    input.min = 0.25;
    input.max = 3;
    input.step = 0.25;
    input.value = settings.mouseSensitivity;
    const val = document.createElement('span');
    val.style.cssText = 'color:#aaa;font-size:0.72rem;margin-left:6px';
    val.textContent = settings.mouseSensitivity.toFixed(2) + 'x';
    const wrap = document.createElement('div');
    wrap.style.cssText = 'display:flex;align-items:center';
    wrap.appendChild(input);
    wrap.appendChild(val);
    g.appendChild(wrap);
    input.addEventListener('input', () => {
      settings.mouseSensitivity = parseFloat(input.value);
      val.textContent = settings.mouseSensitivity.toFixed(2) + 'x';
      saveSettings();
    });
  });

  // 7. Animations toggle
  addGroup(t('animations'), (g) => {
    const wrap = document.createElement('div');
    wrap.className = 'setting-toggle';
    const l = document.createElement('span');
    l.className = 'setting-toggle-label';
    l.textContent = settings.animations ? t('on') : t('off');
    const input = document.createElement('input');
    input.type = 'checkbox';
    input.checked = settings.animations;
    wrap.appendChild(l);
    wrap.appendChild(input);
    g.appendChild(wrap);
    input.addEventListener('change', () => {
      settings.animations = input.checked;
      l.textContent = settings.animations ? t('on') : t('off');
      saveSettings();
    });
  });

  // 8. Transition speed (slider)
  addGroup(t('transition_speed'), (g) => {
    const input = document.createElement('input');
    input.type = 'range';
    input.min = 500;
    input.max = 3000;
    input.step = 100;
    input.value = settings.transitionSpeed;
    const val = document.createElement('span');
    val.style.cssText = 'color:#aaa;font-size:0.72rem;margin-left:6px';
    val.textContent = (settings.transitionSpeed / 1000).toFixed(1) + t('s');
    const wrap = document.createElement('div');
    wrap.style.cssText = 'display:flex;align-items:center';
    wrap.appendChild(input);
    wrap.appendChild(val);
    g.appendChild(wrap);
    input.addEventListener('input', () => {
      settings.transitionSpeed = parseInt(input.value);
      val.textContent = (settings.transitionSpeed / 1000).toFixed(1) + t('s');
      saveSettings();
    });
  });

  // 9. Brightness
  addGroup('Яркость', (g) => {
    const input = document.createElement('input');
    input.type = 'range';
    input.min = -50;
    input.max = 50;
    input.value = Math.round(settings.brightness * 100);
    const val = document.createElement('span');
    val.style.cssText = 'color:#aaa;font-size:0.72rem;margin-left:6px;min-width:28px';
    val.textContent = Math.round(settings.brightness * 100) + '%';
    const wrap = document.createElement('div');
    wrap.style.cssText = 'display:flex;align-items:center';
    wrap.appendChild(input);
    wrap.appendChild(val);
    g.appendChild(wrap);
    input.addEventListener('input', () => {
      settings.brightness = parseInt(input.value) / 100;
      val.textContent = input.value + '%';
      saveSettings();
      applyImageAdjustments();
    });
  });

  // 10. Contrast
  addGroup('Контраст', (g) => {
    const input = document.createElement('input');
    input.type = 'range';
    input.min = 0;
    input.max = 200;
    input.value = Math.round(settings.contrast * 100);
    const val = document.createElement('span');
    val.style.cssText = 'color:#aaa;font-size:0.72rem;margin-left:6px;min-width:28px';
    val.textContent = Math.round(settings.contrast * 100) + '%';
    const wrap = document.createElement('div');
    wrap.style.cssText = 'display:flex;align-items:center';
    wrap.appendChild(input);
    wrap.appendChild(val);
    g.appendChild(wrap);
    input.addEventListener('input', () => {
      settings.contrast = parseInt(input.value) / 100;
      val.textContent = input.value + '%';
      saveSettings();
      applyImageAdjustments();
    });
  });

  // 11. Saturation
  addGroup('Насыщенность', (g) => {
    const input = document.createElement('input');
    input.type = 'range';
    input.min = 0;
    input.max = 200;
    input.value = Math.round(settings.saturation * 100);
    const val = document.createElement('span');
    val.style.cssText = 'color:#aaa;font-size:0.72rem;margin-left:6px;min-width:28px';
    val.textContent = Math.round(settings.saturation * 100) + '%';
    const wrap = document.createElement('div');
    wrap.style.cssText = 'display:flex;align-items:center';
    wrap.appendChild(input);
    wrap.appendChild(val);
    g.appendChild(wrap);
    input.addEventListener('input', () => {
      settings.saturation = parseInt(input.value) / 100;
      val.textContent = input.value + '%';
      saveSettings();
      applyImageAdjustments();
    });
  });

  // 12. Sharpness
  addGroup('Резкость', (g) => {
    const input = document.createElement('input');
    input.type = 'range';
    input.min = 0;
    input.max = 200;
    input.value = Math.round(settings.sharpness * 100);
    const val = document.createElement('span');
    val.style.cssText = 'color:#aaa;font-size:0.72rem;margin-left:6px;min-width:28px';
    val.textContent = Math.round(settings.sharpness * 100) + '%';
    const wrap = document.createElement('div');
    wrap.style.cssText = 'display:flex;align-items:center';
    wrap.appendChild(input);
    wrap.appendChild(val);
    g.appendChild(wrap);
    input.addEventListener('input', () => {
      settings.sharpness = parseInt(input.value) / 100;
      val.textContent = input.value + '%';
      saveSettings();
      applyImageAdjustments();
    });
  });

  // 13. Clarity
  addGroup('Четкость', (g) => {
    const input = document.createElement('input');
    input.type = 'range';
    input.min = 0;
    input.max = 200;
    input.value = Math.round(settings.clarity * 100);
    const val = document.createElement('span');
    val.style.cssText = 'color:#aaa;font-size:0.72rem;margin-left:6px;min-width:28px';
    val.textContent = Math.round(settings.clarity * 100) + '%';
    const wrap = document.createElement('div');
    wrap.style.cssText = 'display:flex;align-items:center';
    wrap.appendChild(input);
    wrap.appendChild(val);
    g.appendChild(wrap);
    input.addEventListener('input', () => {
      settings.clarity = parseInt(input.value) / 100;
      val.textContent = input.value + '%';
      saveSettings();
      applyImageAdjustments();
    });
  });

  // 14. Darkness
  addGroup('Темность', (g) => {
    const input = document.createElement('input');
    input.type = 'range';
    input.min = 0;
    input.max = 100;
    input.value = Math.round(settings.darkness * 100);
    const val = document.createElement('span');
    val.style.cssText = 'color:#aaa;font-size:0.72rem;margin-left:6px;min-width:28px';
    val.textContent = Math.round(settings.darkness * 100) + '%';
    const wrap = document.createElement('div');
    wrap.style.cssText = 'display:flex;align-items:center';
    wrap.appendChild(input);
    wrap.appendChild(val);
    g.appendChild(wrap);
    input.addEventListener('input', () => {
      settings.darkness = parseInt(input.value) / 100;
      val.textContent = input.value + '%';
      saveSettings();
      applyImageAdjustments();
    });
  });

  // 15. Reset image adjustments
  const resetBtn = document.createElement('div');
  resetBtn.className = 'setting-style-btn';
  resetBtn.textContent = 'Сбросить настройки изображения';
  resetBtn.style.cssText = 'text-align:center;padding:8px 0;margin-top:4px;font-size:0.78rem;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.06);border-radius:8px;cursor:pointer;color:#aaa;transition:all 0.2s';
  resetBtn.addEventListener('click', () => {
    settings.brightness = SETTINGS_DEFAULTS.brightness;
    settings.darkness = SETTINGS_DEFAULTS.darkness;
    settings.saturation = SETTINGS_DEFAULTS.saturation;
    settings.contrast = SETTINGS_DEFAULTS.contrast;
    settings.sharpness = SETTINGS_DEFAULTS.sharpness;
    settings.clarity = SETTINGS_DEFAULTS.clarity;
    saveSettings();
    settingsPanelBuilt = false;
    const wasSettings = !sidebarList.classList.contains('hidden');
    settingsPanel.innerHTML = '';
    buildSettingsPanel();
    if (wasSettings) showSettings(); else showSceneList();
    applyImageAdjustments();
  });
  settingsPanel.appendChild(resetBtn);

  // 15. FPS limiter
  addGroup('FPS', (g) => {
    const div = document.createElement('div');
    div.className = 'setting-style-options';
    [0, 15, 30, 60, 120].forEach(val => {
      const btn = document.createElement('div');
      btn.className = 'setting-style-btn' + (settings.fpsLimit === val ? ' active' : '');
      btn.textContent = val === 0 ? 'Max' : String(val);
      btn.addEventListener('click', () => {
        settings.fpsLimit = val;
        saveSettings();
        div.querySelectorAll('.setting-style-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      });
      div.appendChild(btn);
    });
    g.appendChild(div);
  });

  // 16. Glass blur
  addGroup(t('glass_blur'), (g) => {
    const input = document.createElement('input');
    input.type = 'range';
    input.min = 0;
    input.max = 40;
    input.value = settings.glassBlur;
    const val = document.createElement('span');
    val.style.cssText = 'color:#aaa;font-size:0.72rem;margin-left:6px;min-width:28px';
    val.textContent = settings.glassBlur + 'px';
    const wrap = document.createElement('div');
    wrap.style.cssText = 'display:flex;align-items:center';
    wrap.appendChild(input);
    wrap.appendChild(val);
    g.appendChild(wrap);
    input.addEventListener('input', () => {
      settings.glassBlur = parseInt(input.value);
      val.textContent = settings.glassBlur + 'px';
      saveSettings();
      applyGlassStyle();
    });
  });

  // 17. Glass border thickness
  addGroup(t('glass_border'), (g) => {
    const input = document.createElement('input');
    input.type = 'range';
    input.min = 0;
    input.max = 15;
    input.value = settings.glassBorder;
    const val = document.createElement('span');
    val.style.cssText = 'color:#aaa;font-size:0.72rem;margin-left:6px;min-width:28px';
    val.textContent = settings.glassBorder + 'px';
    const wrap = document.createElement('div');
    wrap.style.cssText = 'display:flex;align-items:center';
    wrap.appendChild(input);
    wrap.appendChild(val);
    g.appendChild(wrap);
    input.addEventListener('input', () => {
      settings.glassBorder = parseInt(input.value);
      val.textContent = settings.glassBorder + 'px';
      saveSettings();
      applyGlassStyle();
    });
  });

  // 18. Glass border opacity
  addGroup(t('glass_opacity'), (g) => {
    const input = document.createElement('input');
    input.type = 'range';
    input.min = 0;
    input.max = 100;
    input.value = settings.glassOpacity;
    const val = document.createElement('span');
    val.style.cssText = 'color:#aaa;font-size:0.72rem;margin-left:6px;min-width:28px';
    val.textContent = settings.glassOpacity + '%';
    const wrap = document.createElement('div');
    wrap.style.cssText = 'display:flex;align-items:center';
    wrap.appendChild(input);
    wrap.appendChild(val);
    g.appendChild(wrap);
    input.addEventListener('input', () => {
      settings.glassOpacity = parseInt(input.value);
      val.textContent = settings.glassOpacity + '%';
      saveSettings();
      applyGlassStyle();
    });
  });

  // 19. Language selector
  addGroup(t('language'), (g) => {
    const div = document.createElement('div');
    div.className = 'setting-style-options';
    ['RU', 'EN'].forEach((code, i) => {
      const btn = document.createElement('div');
      const lang = i === 0 ? 'ru' : 'en';
      btn.className = 'setting-style-btn' + (settings.language === lang ? ' active' : '');
      btn.textContent = code;
      btn.addEventListener('click', () => {
        if (settings.language === lang) return;
        settings.language = lang;
        saveSettings();
        div.querySelectorAll('.setting-style-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        rebuildLanguageUI();
      });
      div.appendChild(btn);
    });
    g.appendChild(div);
  });
}

function showSettings() {
  buildSettingsPanel();
  sidebarList.classList.add('hidden');
  settingsPanel.classList.remove('hidden');
  sidebarTitle.textContent = t('settings_title');
}

function showSceneList() {
  sidebarList.classList.remove('hidden');
  settingsPanel.classList.add('hidden');
  sidebarTitle.textContent = t('rooms_title');
}

settingsBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  if (sidebarList.classList.contains('hidden')) {
    showSceneList();
  } else {
    showSettings();
  }
});

/* ============================================================
   WHEEL ZOOM
   ============================================================ */
/* ============================================================
   FPS COUNTER
   ============================================================ */
const fpsEl = document.createElement('div');
fpsEl.style.cssText = 'position:fixed;top:12px;right:12px;z-index:500;background:rgba(0,0,0,0.5);padding:4px 10px;border-radius:8px;font-family:"Courier New",monospace;font-size:0.75rem;color:#0f0;pointer-events:none;line-height:1.5;';
document.body.appendChild(fpsEl);
let fpsFrames = 0;
let fpsTime = 0;

renderer.domElement.addEventListener('wheel', e => {
  e.preventDefault();
  targetFov += e.deltaY * 0.08;
  targetFov = Math.max(MIN_FOV, Math.min(MAX_FOV, targetFov));
}, { passive: false });

/* ============================================================
   MOUSE
   ============================================================ */
renderer.domElement.addEventListener('mousedown', onPointerDown);
window.addEventListener('mouseup', onPointerUp);
window.addEventListener('mousemove', onPointerMove);

/* ============================================================
   TOUCH
   ============================================================ */
let touchDist = 0;
renderer.domElement.addEventListener('touchstart', e => {
  if (e.touches.length === 2) {
    e.preventDefault();
    const dx = e.touches[0].clientX - e.touches[1].clientX;
    const dy = e.touches[0].clientY - e.touches[1].clientY;
    touchDist = Math.sqrt(dx * dx + dy * dy);
  } else if (e.touches.length === 1) {
    onPointerDown(e);
  }
}, { passive: false });

renderer.domElement.addEventListener('touchmove', e => {
  if (e.touches.length === 2) {
    e.preventDefault();
    const dx = e.touches[0].clientX - e.touches[1].clientX;
    const dy = e.touches[0].clientY - e.touches[1].clientY;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const delta = touchDist - dist;
    targetFov += delta * 0.15;
    targetFov = Math.max(MIN_FOV, Math.min(MAX_FOV, targetFov));
    touchDist = dist;
  } else if (e.touches.length === 1 && isDragging) {
    onPointerMove(e);
  }
}, { passive: false });

renderer.domElement.addEventListener('touchend', e => {
  if (e.touches.length < 2) touchDist = 0;
  if (e.touches.length === 0) onPointerUp(e);
});

/* ============================================================
   KEYBOARD
   ============================================================ */
window.addEventListener('keydown', e => {
  const code = e.code;

  // D — показать/скрыть отладку
  if (code === 'KeyD') {
    debugVisible = !debugVisible;
    updateDebugHUD();
    if (debugVisible) showDebug(t('debug_on'));
    return;
  }

  // V (англ.) / В (рус.) — скопировать yaw,pitch в буфер
  if (code === 'KeyV' || code === 'KeyB') {
    const yawDeg = yaw * 180 / Math.PI;
    const pitchDeg = pitch * 180 / Math.PI;
    const str = yawDeg.toFixed(1) + ',' + pitchDeg.toFixed(1);
    navigator.clipboard.writeText(str).catch(() => {});
    showDebug(t('copied') + str);
    return;
  }

  // Стрелки
  const step = 0.04;
  if (code === 'ArrowLeft') targetYaw -= step;
  if (code === 'ArrowRight') targetYaw += step;
  if (code === 'ArrowUp') targetPitch -= step;
  if (code === 'ArrowDown') targetPitch += step;

  // Zoom
  if (code === 'Equal' || code === 'NumpadAdd') {
    targetFov = Math.max(MIN_FOV, fov - 5);
  }
  if (code === 'Minus' || code === 'NumpadSubtract') {
    targetFov = Math.min(MAX_FOV, fov + 5);
  }

  targetPitch = Math.max(-Math.PI / 2.2, Math.min(Math.PI / 2.2, targetPitch));
});

/* ============================================================
   DEBUG HUD
   ============================================================ */
let debugHUD = null;

function updateDebugHUD() {
  if (!debugHUD) {
    debugHUD = document.createElement('div');
    debugHUD.id = 'debug-hud';
    debugHUD.style.cssText = 'position:fixed;top:12px;right:12px;z-index:500;background:rgba(0,0,0,0.7);padding:8px 12px;border-radius:6px;font-family:"Courier New",monospace;font-size:0.75rem;color:#8f8;pointer-events:none;opacity:0;transition:opacity 0.3s;line-height:1.6;';
    document.body.appendChild(debugHUD);
  }
  debugHUD.style.opacity = debugVisible ? '1' : '0';
}

function refreshDebugHUD() {
  if (!debugHUD || !debugVisible) return;
  const yawDeg = (yaw * 180 / Math.PI).toFixed(1);
  const pitchDeg = (pitch * 180 / Math.PI).toFixed(1);
  debugHUD.innerHTML = 'yaw: ' + yawDeg + '°<br>pitch: ' + pitchDeg + '°<br>fov: ' + fov.toFixed(0) + '°';
}

/* ============================================================
   DEBUG TOAST
   ============================================================ */
let debugToast = null;
function showDebug(msg) {
  if (!debugToast) {
    debugToast = document.createElement('div');
    debugToast.id = 'debug-toast';
    document.body.appendChild(debugToast);
  }
  debugToast.textContent = msg;
  debugToast.classList.add('show');
  clearTimeout(debugToast._timeout);
  debugToast._timeout = setTimeout(() => debugToast.classList.remove('show'), 2000);
}

/* ============================================================
   RESIZE
   ============================================================ */
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

/* ============================================================
   RENDER LOOP
   ============================================================ */
let lastFrameTime = 0;

function animate(time) {
  requestAnimationFrame(animate);
  if (loadingRotate) targetYaw += 0.002;

  yaw += (targetYaw - yaw) * SMOOTH;
  pitch += (targetPitch - pitch) * SMOOTH;
  fov += (targetFov - fov) * SMOOTH;

  euler.set(pitch, yaw, 0);
  camera.quaternion.setFromEuler(euler);
  camera.fov = fov;
  camera.updateProjectionMatrix();

  const fpsLimit = settings.fpsLimit || 0;
  if (fpsLimit > 0) {
    const minInterval = 1000 / fpsLimit - 1;
    if (time - lastFrameTime < minInterval) {
      if (debugVisible) refreshDebugHUD();
      return;
    }
    lastFrameTime = time;
  }

  renderer.render(scene, camera);

  fpsFrames++;
  if (time - fpsTime >= 1000) {
    fpsEl.textContent = fpsFrames + ' FPS';
    fpsFrames = 0;
    fpsTime = time;
  }

  if (debugVisible) refreshDebugHUD();
}

/* ============================================================
   INIT
   ============================================================ */
animate();
buildSidebar();
updateDebugHUD();

// После intro-анимации плавно показываем фон и запускаем загрузку
setTimeout(() => {
  loadingSpeed.textContent = '';
  const fadeStart = performance.now();
  const fadeDur = 600;
  let loaded = false;
  function fadeStep(now) {
    const t = Math.min((now - fadeStart) / fadeDur, 1);
    sphere.material.opacity = t;
    sphere.material.needsUpdate = true;
    if (t >= 1 && !loaded) {
      loaded = true;
      sphere.material.transparent = false;
      preloadAll();
    }
    if (t < 1) requestAnimationFrame(fadeStep);
  }
  requestAnimationFrame(fadeStep);
}, 4200);

setInterval(() => { if (isTransitioning) isTransitioning = false; }, 10000);

/* ============================================================
   INTRO ANIMATION
   ============================================================ */
const introEl = document.getElementById('intro');
const introLetters = document.querySelectorAll('#intro-letters span');
const introSub = document.getElementById('intro-sub');
const introShapes = document.querySelectorAll('.shape');

introEl.classList.add('show');

introLetters.forEach((span, i) => {
  setTimeout(() => span.classList.add('in'), i * 120);
});
setTimeout(() => introSub.classList.add('in'), 2000);
introShapes.forEach((s, i) => {
  setTimeout(() => s.classList.add('show'), 1400 + i * 100);
});

setTimeout(() => {
  introEl.classList.add('fade-out');
  setTimeout(() => {
    introEl.classList.remove('show', 'fade-out');
    introEl.style.display = 'none';
  }, 800);
}, 4200);

window.__debug = { scenes, yaw, pitch, fov };
