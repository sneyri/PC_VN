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
  ['Мира', 'Привет! Ищешь готовый компьютер или хочешь собрать свой?'],
  ['Ты', 'Хочу собрать свой. Буду играть и иногда монтировать видео, но в деталях пока не разбираюсь.'],
  ['Мира', 'Давай подберём вместе. Для твоих задач я бы ориентировалась на шесть ядер, 32 ГБ памяти и видеокарту с 8 ГБ. Начнём с суммы, которую тебе удобно потратить.']
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
    get(id).hidden = scene !== screen && !(id === 'sprite' && scene === 'build');
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
const questions = {
  case:'Где будет стоять твой компьютер? Для маленького стола есть компактный корпус. Если места хватает, башня даст больше свободы с выбором платы.',
  cpu:'Что возьмём для твоих игр и монтажа? Шесть ядер — разумная середина. Восемь быстрее в тяжёлых задачах, но потянут за собой более дорогую плату.',
  board:'Теперь подберём плату. Посмотри на сокет выбранного процессора и проверь, влезет ли плата в твой корпус.',
  gpu:'Что важнее для тебя — сэкономить или взять карту с запасом? Для твоих игр и монтажа я бы начала с 8 ГБ видеопамяти.',
  ram:'Для монтажа я бы взяла 32 ГБ. Какой комплект выбираешь? Тип DDR должен совпадать с тем, что поддерживает твоя плата.',
  power:'Остался блок питания. Какой берём? Я посчитаю, хватит ли мощности с запасом.'
};
const steps = [
  {key:'budget', name:'Бюджет', options:budgets, hint:'Какой у тебя бюджет на весь компьютер? SSD за 5 000 ₽ я уже включила в смету.'},
  ...Object.entries(parts).map(([key, part]) => ({key, ...part, hint:questions[key]})),
  {key:'review', name:'У кассы', hint:'Вот твоя сборка. Хочешь что-то заменить или сделаем пробный запуск перед покупкой?'}
];
const choices = {};
let stepIndex = 0;
let awaitingNext = false;

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
function reply(key, pick) {
  const build = readBuild();
  switch (key) {
    case 'budget': return 'Договорились, держимся в пределах ' + money.format(budget) + '. Теперь посмотрим корпуса.';
    case 'case': return pick.size === 'ATX' ? 'В эту башню влезут обе наши платы.' : 'Компактный вариант. Тогда нам понадобится плата Micro-ATX.';
    case 'cpu': return 'Записала процессор на ' + pick.socket + '. Под него ищем плату с тем же сокетом.';
    case 'board':
      if (pick.socket !== build.cpu.socket) return 'У этой платы другой сокет. Можно положить её в корзину, но перед покупкой придётся заменить плату или процессор.';
      if (pick.size === 'ATX' && build.case.size !== 'ATX') return 'По сокету подходит, но плата не влезет в твой корпус. Потом можно вернуться и поменять один из вариантов.';
      return 'Отлично, плата подходит к процессору и помещается в корпус.';
    case 'gpu': return pick.vram < 8 ? 'Сэкономим на видеокарте. Для лёгких игр хватит, но в тяжёлых проектах 6 ГБ могут стать ограничением.' : 'Для твоих задач видеопамяти достаточно. Учтём её потребление, когда дойдём до блока питания.';
    case 'ram': return pick.socket !== build.board.socket ? 'Этот тип памяти не подходит к выбранной плате. Вернёмся к нему перед покупкой.' : pick.gb < 32 ? '16 ГБ хватит для обычной работы, но на монтаже запас будет меньше.' : '32 ГБ, и тип памяти подходит. Для монтажа хороший выбор.';
    case 'power': {
      const needed = Math.ceil((build.cpu.watts + build.gpu.watts + 80) * 1.25);
      return pick.watts >= needed ? 'По моей прикидке нужно от ' + needed + ' Вт. У выбранного блока есть запас.' : 'С запасом я бы взяла от ' + needed + ' Вт. Этот блок слабоват, можешь вернуться и выбрать другой.';
    }
  }
}
function renderStep() {
  const step = steps[stepIndex];
  const fields = get('fields');
  const review = !step.options;
  awaitingNext = false;
  get('your-line').hidden = true;
  get('step-number').textContent = 'ШАГ ' + (stepIndex + 1) + ' / ' + steps.length;
  get('build-title').textContent = step.name;
  get('step-copy').textContent = step.hint;
  fields.querySelectorAll('label').forEach(label => label.remove());
  fields.hidden = review;
  get('back').hidden = stepIndex === 0;
  get('advance').disabled = !review && choices[step.key] === undefined;
  get('advance').textContent = review ? 'Сделать пробный запуск' : 'Ответить';
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
  if (price(build) > budget) return ['Пауза у кассы', 'Компьютер собран, но смета вышла за бюджет на ' + money.format(price(build) - budget) + '. Ты можешь убрать дорогую деталь или вернуться к обсуждению бюджета.'];
  if (cpu.cores < 6 || ram.gb < 32 || gpu.vram < 8) return ['Запустился, но с оговоркой', 'Компьютер работает, но для твоих игр и монтажа Мира советует хотя бы 6 ядер, 32 ГБ памяти и видеокарта с 8 ГБ.'];
  return ['Первый запуск', 'Система стартовала. Сборка помещается в бюджет и подходит под задачи. Ты оплачиваешь свой первый ПК. Мира отдаёт тебе коробку и напоминает снять плёнку с корпуса дома.'];
}
get('parts').addEventListener('change', () => {
  get('advance').disabled = false;
});
get('back').addEventListener('click', () => {
  if (!awaitingNext) stepIndex -= 1;
  renderStep();
});
get('parts').addEventListener('submit', event => {
  event.preventDefault();
  const step = steps[stepIndex];
  if (awaitingNext) {
    stepIndex += 1;
    renderStep();
    return;
  }
  if (step.options) {
    const selected = get('fields').querySelector('input:checked');
    if (!selected) return;
    choices[step.key] = Number(selected.value);
    if (step.key === 'budget') budget = budgets[choices.budget].price;
    const pick = step.options[choices[step.key]];
    const line = get('your-line');
    line.textContent = step.key === 'budget' ? 'Ты: мой бюджет — ' + pick.name + '.' : 'Ты: давай возьмём этот вариант — ' + pick.name + '.';
    line.hidden = false;
    get('step-copy').textContent = reply(step.key, pick);
    get('fields').hidden = true;
    get('back').hidden = false;
    get('cart').hidden = false;
    get('advance').textContent = 'Дальше';
    awaitingNext = true;
    renderCart();
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
