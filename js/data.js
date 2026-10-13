const STUDIO_NAME = "Контур";
const STUDIO_TAGLINE = "студия пилатеса";

const DIRECTIONS = [
  {
    id: "mat",
    name: "Пилатес на матах",
    forWhom: "Базовая практика для любого уровня",
    duration: "55 минут",
    description:
      "Упражнения на коврике: дыхание, контроль корпуса, плавный темп. Подходит для первого занятия.",
    photo: "assets/images/direction-mat.webp",
  },
  {
    id: "reformer",
    name: "Реформер",
    forWhom: "Групповая работа на тренажёре",
    duration: "55 минут",
    description:
      "Занятия на реформере в небольшой группе — под контролем тренера, с постепенным усложнением.",
    photo: "assets/images/direction-reformer.webp",
  },
  {
    id: "stretching",
    name: "Стретчинг",
    forWhom: "Мягкость, гибкость, свобода движения",
    duration: "55 минут",
    description:
      "Растяжка и работа с подвижностью суставов в спокойном темпе, без силовой нагрузки.",
    photo: "assets/images/direction-stretching.webp",
  },
  {
    id: "back-health",
    name: "Здоровая спина",
    forWhom: "Мягкая работа с осанкой и опорой корпуса",
    duration: "55 минут",
    description:
      "Упражнения на укрепление мышц кора и бережную работу со спиной. Не заменяет консультацию врача.",
    photo: "assets/images/direction-back.webp",
  },
  {
    id: "individual",
    name: "Индивидуальные занятия",
    forWhom: "Личный план и полное внимание тренера",
    duration: "55 минут",
    description:
      "Формат один на один с тренером. Время и программа согласовываются отдельно с администратором.",
    photo: "assets/images/direction-individual.webp",
  },
];

const COACHES = [
  {
    id: "anna",
    name: "Анна",
    specialization: "Пилатес на матах, «Здоровая спина»",
    experience: "Уточняется у студии",
    photo: "assets/images/coach-anna.webp",
  },
  {
    id: "igor",
    name: "Игорь",
    specialization: "Реформер, индивидуальные занятия",
    experience: "Уточняется у студии",
    photo: "assets/images/coach-igor.webp",
  },
  {
    id: "maria",
    name: "Мария",
    specialization: "Стретчинг, пилатес на матах",
    experience: "Уточняется у студии",
    photo: "assets/images/coach-maria.webp",
  },
];

const SCHEDULE = [
  { id: "mat-mon-0900", day: "Пн", time: "09:00", durationMinutes: 55, typeId: "mat", coachId: "anna", level: "Подходит для первого занятия" },
  { id: "back-mon-1830", day: "Пн", time: "18:30", durationMinutes: 55, typeId: "back-health", coachId: "anna", level: "Любой уровень" },
  { id: "ind-tue-1000", day: "Вт", time: "10:00", durationMinutes: 55, typeId: "individual", coachId: "igor", level: "По записи" },
  { id: "reformer-tue-1100", day: "Вт", time: "11:00", durationMinutes: 55, typeId: "reformer", coachId: "igor", level: "Любой уровень" },
  { id: "mat-tue-1800", day: "Вт", time: "18:00", durationMinutes: 55, typeId: "mat", coachId: "anna", level: "Подходит для первого занятия" },
  { id: "stretch-tue-1930", day: "Вт", time: "19:30", durationMinutes: 55, typeId: "stretching", coachId: "maria", level: "Любой уровень" },
  { id: "mat-wed-0900", day: "Ср", time: "09:00", durationMinutes: 55, typeId: "mat", coachId: "maria", level: "Подходит для первого занятия" },
  { id: "reformer-wed-1800", day: "Ср", time: "18:00", durationMinutes: 55, typeId: "reformer", coachId: "igor", level: "Любой уровень" },
  { id: "back-wed-1930", day: "Ср", time: "19:30", durationMinutes: 55, typeId: "back-health", coachId: "anna", level: "Любой уровень" },
  { id: "ind-thu-1100", day: "Чт", time: "11:00", durationMinutes: 55, typeId: "individual", coachId: "igor", level: "По записи" },
  { id: "stretch-thu-1830", day: "Чт", time: "18:30", durationMinutes: 55, typeId: "stretching", coachId: "maria", level: "Любой уровень" },
  { id: "mat-fri-0900", day: "Пт", time: "09:00", durationMinutes: 55, typeId: "mat", coachId: "anna", level: "Подходит для первого занятия" },
  { id: "reformer-fri-1700", day: "Пт", time: "17:00", durationMinutes: 55, typeId: "reformer", coachId: "igor", level: "Любой уровень" },
  { id: "beg-sat-1100", day: "Сб", time: "11:00", durationMinutes: 55, typeId: "mat", coachId: "maria", level: "Подходит для первого занятия" },
  { id: "stretch-sat-1230", day: "Сб", time: "12:30", durationMinutes: 55, typeId: "stretching", coachId: "maria", level: "Любой уровень" },
];

const DAY_ORDER = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];
const DAY_LABELS = {
  "Пн": "Понедельник",
  "Вт": "Вторник",
  "Ср": "Среда",
  "Чт": "Четверг",
  "Пт": "Пятница",
  "Сб": "Суббота",
  "Вс": "Воскресенье",
};

const MAP_CONFIG = { center: [55.751574, 37.573856], zoom: 10 };
