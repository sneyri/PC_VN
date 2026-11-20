const get = id => document.getElementById(id);
const budget = 80000;
const money = new Intl.NumberFormat('ru-RU', {
  style: 'currency', currency: 'RUB', maximumFractionDigits: 0
});
const parts = {
  cpu: {name:'Процессор', options:[
    {name:'4 ядра · AM4', price:8000, socket:'AM4', watts:65, cores:4},
    {name:'6 ядер · AM4', price:11500, socket:'AM4', watts:65, cores:6},
    {name:'8 ядер · AM5', price:23500, socket:'AM5', watts:105, cores:8}
  ]},
  board: {name:'Материнская плата', options:[
    {name:'Плата AM4 · DDR4', price:8000, socket:'AM4'},
    {name:'Плата AM5 · DDR5', price:14000, socket:'AM5'}
  ]},
  gpu: {name:'Видеокарта', options:[
    {name:'6 ГБ · 120 Вт', price:18000, watts:120, vram:6},
    {name:'8 ГБ · 160 Вт', price:28500, watts:160, vram:8},
    {name:'12 ГБ · 280 Вт', price:45000, watts:280, vram:12}
  ]},
  ram: {name:'Оперативная память', options:[
    {name:'16 ГБ · DDR4', price:4000, socket:'AM4', gb:16},
    {name:'32 ГБ · DDR4', price:6500, socket:'AM4', gb:32},
    {name:'32 ГБ · DDR5', price:10000, socket:'AM5', gb:32}
  ]},
  power: {name:'Блок питания', options:[
    {name:'400 Вт', price:3500, watts:400},
    {name:'550 Вт', price:5500, watts:550},
    {name:'650 Вт', price:7300, watts:650}
  ]}
};
const lines = [
  ['Мира', 'Клиент написал, что будет через час. Ему нужен компьютер для монтажа и игр, а на всё есть 80 тысяч.'],
  ['Ты', 'Если взять самую дорогую видеокарту, на остальное почти ничего не останется.'],
  ['Мира', 'Вот и проверь, где нужен запас. Для этого заказа я бы взяла хотя бы шесть ядер, 32 ГБ памяти и видеокарту с 8 ГБ.'],
  ['Мира', 'Сверь сокеты и тип памяти. Блок питания бери с запасом: примерно на четверть больше, чем потребляют процессор, видеокарта и ещё 80 Вт на остальное. На корпус и SSD уже отложено 12 тысяч.']
];
let lineIndex = 0;

function drawSprite() {
  const ctx = get('sprite').getContext('2d');
  const pixels = [
    ['#111a25',6,2,12,16], ['#4d3046',7,2,10,3], ['#4d3046',6,5,12,4],
    ['#d5916c',8,7,9,9], ['#f1b591',9,8,7,7], ['#4d3046',7,5,4,6],
    ['#252537',10,10,1,2], ['#252537',15,10,1,2], ['#a75553',12,13,2,1],
    ['#d5916c',10,15,5,4], ['#283344',5,18,15,14], ['#3e827d',4,20,17,12],
    ['#a3e4bb',10,19,5,13], ['#296162',5,24,5,8], ['#296162',16,24,4,8],
    ['#f3c476',17,22,2,2], ['#263747',11,20,3,12]
  ];
  for (const [color,x,y,w,h] of pixels) {
    ctx.fillStyle = color;
    ctx.fillRect(x,y,w,h);
  }
}
function show(scene) {
  get('stage').dataset.scene = scene;
  get('chapter').textContent = {title:'Визуальная новелла', dialog:'Мастерская', build:'Подбор деталей', end:'Первый запуск'}[scene];
  for (const [id,screen] of [['cover','title'],['dialog','dialog'],['sprite','dialog'],['builder','build'],['ending','end']]) {
    get(id).hidden = scene !== screen;
  }
}
function showLine() {
  const [speaker, line] = lines[lineIndex];
  get('speaker').textContent = speaker;
  get('line').textContent = line;
  get('next').textContent = lineIndex === lines.length - 1 ? 'К сборке' : 'Дальше';
}
function readBuild() {
  return Object.fromEntries(Object.entries(parts).map(([key,part]) => [key,part.options[Number(get(key).value)]]));
}
function price(build) {
  return 12000 + Object.values(build).reduce((sum, part) => sum + part.price, 0);
}
function updateTotal() {
  const cost = price(readBuild());
  get('total').textContent = money.format(cost) + ' / ' + money.format(budget);
  get('total').classList.toggle('over', cost > budget);
}
function result(build) {
  const {cpu,board,gpu,ram,power} = build;
  const faults = [];
  if (cpu.socket !== board.socket) faults.push('Процессор и плата используют разные сокеты.');
  if (ram.socket !== board.socket) faults.push('Тип памяти не подходит к плате.');
  if (power.watts < Math.ceil((cpu.watts + gpu.watts + 80) * 1.25)) faults.push('Блоку питания не хватает запаса мощности.');
  if (faults.length) return ['Чёрный экран', faults.join(' ') + ' Мира предлагает заменить детали до запуска.'];
  if (price(build) > budget) return ['Пауза у кассы', 'Компьютер собран, но смета вышла за бюджет на ' + money.format(price(build) - budget) + '. Клиент просит пересмотреть выбор.'];
  if (cpu.cores < 6 || ram.gb < 32 || gpu.vram < 8) return ['Запустился, но с оговоркой', 'Компьютер работает, но для монтажа и игр клиенту нужны хотя бы 6 ядер, 32 ГБ памяти и видеокарта с 8 ГБ.'];
  return ['Первый запуск', 'Система стартовала. Сборка помещается в бюджет и подходит под задачи. Клиент забирает компьютер, а Мира отдаёт тебе ключ от мастерской на следующую смену.'];
}
for (const [key,part] of Object.entries(parts)) {
  const label = document.createElement('label');
  label.textContent = part.name;
  const select = document.createElement('select');
  select.id = key;
  for (const [i,option] of part.options.entries()) {
    select.add(new Option(option.name + ' — ' + money.format(option.price), i));
  }
  label.append(select);
  get('fields').append(label);
}
get('parts').addEventListener('change', updateTotal);
get('parts').addEventListener('submit', event => {
  event.preventDefault();
  const [title,copy] = result(readBuild());
  get('ending-title').textContent = title;
  get('ending-copy').textContent = copy;
  show('end');
  get('ending-title').focus();
});
get('start').addEventListener('click', () => {
  lineIndex = 0;
  show('dialog');
  showLine();
  get('next').focus();
});
function openBuilder() {
  show('build');
  updateTotal();
  get('cpu').focus();
}
get('next').addEventListener('click', () => {
  lineIndex += 1;
  if (lineIndex === lines.length) openBuilder();
  else showLine();
});
get('retry').addEventListener('click', openBuilder);
get('restart').addEventListener('click', () => {
  get('parts').reset();
  show('title');
  get('start').focus();
});
drawSprite();
