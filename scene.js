const get = id => document.getElementById(id);
let budget = 0;
const money = new Intl.NumberFormat('ru-RU', {
  style: 'currency', currency: 'RUB', maximumFractionDigits: 0
});
const parts = {
  case: {name:'Корпус', options:[
    {name:'Компактный · Micro-ATX', price:3500, size:'Micro-ATX', detail:'Подходит только для плат Micro-ATX.'},
    {name:'Башня · ATX', price:5500, size:'ATX', detail:'Вмещает платы ATX и Micro-ATX.'}
  ]},

  cpu: {name:'Процессор', options:[
    {name:'4 ядра · AM4', price:8000, socket:'AM4', watts:65, cores:4},
    {name:'6 ядер · AM4', price:11500, socket:'AM4', watts:65, cores:6},
    {name:'8 ядер · AM5', price:23500, socket:'AM5', watts:105, cores:8}
  ]},
  board: {name:'Материнская плата', options:[
    {name:'Плата AM4 · DDR4 · Micro-ATX', price:8000, socket:'AM4', size:'Micro-ATX'},
    {name:'Плата AM5 · DDR5 · ATX', price:14000, socket:'AM5', size:'ATX'}
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
  ['Мира', 'Клиент написал, что будет через час. Ему нужен компьютер для монтажа и игр, а смету нужно согласовать перед сборкой.'],
  ['Ты', 'Если взять самую дорогую видеокарту, на остальное почти ничего не останется.'],
  ['Мира', 'Вот и проверь, где нужен запас. Для этого заказа я бы взяла хотя бы шесть ядер, 32 ГБ памяти и видеокарту с 8 ГБ.'],
  ['Мира', 'Сверь сокеты и тип памяти. Блок питания бери с запасом: примерно на четверть больше, чем потребляют процессор, видеокарта и ещё 80 Вт на остальное. SSD уже в смете, он стоит 5 тысяч.']
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
const fixedPrice = 5000;
const budgets = [
  {name:'65 000 ₽', price:65000, detail:'Бюджет впритык, придётся внимательно выбирать детали.'},
  {name:'80 000 ₽', price:80000, detail:'Есть запас на память и видеокарту.'},
  {name:'100 000 ₽', price:100000, detail:'Больше свободы при выборе комплектующих.'}
];
const hints = {
  case:'Мира: начнём с корпуса. Реши, нужен ли компактный ПК или есть место для башни.',
  cpu:'Мира: для этого заказа целимся хотя бы в шесть ядер. Запомни сокет процессора.',
  board:'Мира: сверь сокет и размер платы с тем, что уже лежит в корзине.',
  gpu:'Мира: для клиента ищи видеокарту с 8 ГБ памяти или больше.',
  ram:'Мира: для монтажа пригодятся 32 ГБ. Проверь, какой тип памяти поддерживает плата.',
  power:'Мира: сложи потребление процессора, видеокарты и ещё 80 Вт на остальное. Добавь четверть про запас.'
};
const steps = [
  {key:'budget', name:'Бюджет', options:budgets, hint:'Мира: согласуй с клиентом лимит перед походом по магазину.'},
  ...Object.entries(parts).map(([key, part]) => ({key, ...part, hint:hints[key]})),
  {key:'review', name:'Проверка заказа', hint:'Мира: проверь корзину перед запуском. Если нужно что-то поменять, вернись к нужному шагу.'}
];
const choices = {};
let stepIndex = 0;

function price(build) {
  return fixedPrice + Object.values(build).reduce((sum, part) => sum + part.price, 0);
}
function readBuild() {
  return Object.fromEntries(Object.entries(parts).flatMap(([key, part]) =>
    choices[key] === undefined ? [] : [[key, part.options[choices[key]]]]
  ));
}
function renderCart() {
  const build = readBuild();
  const items = [['SSD', fixedPrice], ...Object.values(build).map(part => [part.name, part.price])];
  const rows = items.map(([name, cost]) => {
    const row = document.createElement('li');
    row.textContent = name + ' — ' + money.format(cost);
    return row;
  });
  const cost = price(build);
  get('cart-list').replaceChildren(...rows);
  get('total').textContent = budget ? money.format(cost) + ' / ' + money.format(budget) : '';
  get('total').classList.toggle('over', budget > 0 && cost > budget);
}
function renderStep() {
  const step = steps[stepIndex];
  const fields = get('fields');
  const review = !step.options;
  get('step-number').textContent = 'ШАГ ' + (stepIndex + 1) + ' / ' + steps.length;
  get('build-title').textContent = step.name;
  get('step-copy').textContent = step.hint;
  fields.querySelectorAll('label').forEach(label => label.remove());
  fields.hidden = review;
  get('back').hidden = stepIndex === 0;
  get('advance').disabled = !review && choices[step.key] === undefined;
  get('advance').textContent = review ? 'Запустить ПК' : step.key === 'budget' ? 'Подтвердить бюджет' : 'В корзину и дальше';
  get('cart').hidden = step.key === 'budget';
  if (review) get('cart').open = true;

  for (const [index, option] of (step.options ?? []).entries()) {
    const label = document.createElement('label');
    const input = document.createElement('input');
    input.type = 'radio';
    input.name = 'choice';
    input.value = index;
    input.checked = choices[step.key] === index;
    const text = document.createElement('span');
    text.textContent = step.key === 'budget' ? option.name : option.name + ' — ' + money.format(option.price);
    if (option.detail) {
      const description = document.createElement('small');
      description.textContent = option.detail;
      text.append(description);
    }
    label.append(input, text);
    fields.append(label);
  }
  renderCart();
  get('build-title').focus();
}
function result(build) {
  const {cpu,board,gpu,ram,power} = build;
  if (build.case.size === 'Micro-ATX' && board.size === 'ATX') return ['Плата не влезла', 'Для платы ATX нужен корпус ATX. Вернись к корпусу или выбери плату Micro-ATX.'];
  const faults = [];
  if (cpu.socket !== board.socket) faults.push('Процессор и плата используют разные сокеты.');
  if (ram.socket !== board.socket) faults.push('Тип памяти не подходит к плате.');
  if (power.watts < Math.ceil((cpu.watts + gpu.watts + 80) * 1.25)) faults.push('Блоку питания не хватает запаса мощности.');
  if (faults.length) return ['Чёрный экран', faults.join(' ') + ' Мира предлагает заменить детали до запуска.'];
  if (price(build) > budget) return ['Пауза у кассы', 'Компьютер собран, но смета вышла за бюджет на ' + money.format(price(build) - budget) + '. Клиент просит пересмотреть выбор.'];
  if (cpu.cores < 6 || ram.gb < 32 || gpu.vram < 8) return ['Запустился, но с оговоркой', 'Компьютер работает, но для монтажа и игр клиенту нужны хотя бы 6 ядер, 32 ГБ памяти и видеокарта с 8 ГБ.'];
  return ['Первый запуск', 'Система стартовала. Сборка помещается в бюджет и подходит под задачи. Клиент забирает компьютер, а Мира отдаёт тебе ключ от мастерской на следующую смену.'];
}
get('parts').addEventListener('change', () => {
  get('advance').disabled = false;
});
get('back').addEventListener('click', () => {
  stepIndex -= 1;
  renderStep();
});
get('parts').addEventListener('submit', event => {
  event.preventDefault();
  const step = steps[stepIndex];
  if (step.options) {
    const selected = get('fields').querySelector('input:checked');
    if (!selected) return;
    choices[step.key] = Number(selected.value);
    if (step.key === 'budget') budget = budgets[choices.budget].price;
    stepIndex += 1;
    renderStep();
    return;
  }
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
  stepIndex = 0;
  get('cart').open = false;
  renderStep();

}
get('next').addEventListener('click', () => {
  lineIndex += 1;
  if (lineIndex === lines.length) openBuilder();
  else showLine();
});
get('retry').addEventListener('click', openBuilder);
get('restart').addEventListener('click', () => {
  for (const key of Object.keys(choices)) delete choices[key];
  budget = 0;
  show('title');
  get('start').focus();
});
drawSprite();
