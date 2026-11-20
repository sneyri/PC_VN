const get = id => document.getElementById(id);
const rub = new Intl.NumberFormat('ru-RU', {style:'currency', currency:'RUB', maximumFractionDigits:0});
const money = value => rub.format(value);
const profiles = [
  {name:'Уложиться в накопленное', limit:113000, label:'Доступный', goal:'Full HD и обычная работа', reply:'Хорошо, соберём игровой ПК под Full HD. Для монтажа в DaVinci Resolve можно начать с проектов в 1080p. На украшениях корпуса сэкономим.'},
  {name:'Добавить деньги с подработки', limit:200000, label:'Средний', goal:'1440p и монтаж', reply:'Тогда подберём сборку для 1440p и более тяжёлых проектов в DaVinci Resolve. Я бы вложилась в видеокарту и память, а корпус взяла попроще.'},
  {name:'Взять с большим запасом', limit:459000, label:'Дорогой', goal:'4K, монтаж и 3D', reply:'Можем смотреть в сторону игр в 4K и тяжёлых проектов в Blender. Проверим габариты и охлаждение: дорогие детали тоже должны поместиться и нормально работать.'}
];
const catalog = [
  {key:'case', title:'Корпус', caption:'Начнём с корпуса. Он задаёт размер платы, длину видеокарты и то, какое охлаждение влезет.', items:[
    {name:'DeepCool CH370', price:5500, note:'Компактный Micro-ATX', compact:true, radiator:240, gpuSpace:320},
    {name:'Montech AIR 903 MAX', price:8500, note:'Продуваемая башня ATX', radiator:360, gpuSpace:400},
    {name:'Lian Li LANCOOL III', price:21000, note:'Просторный корпус ATX', radiator:360, gpuSpace:435}
  ]},
  {key:'cpu', title:'Процессор', caption:'Теперь выберем процессор. Для игр хватит шести ядер, а монтаж, рендер и компиляция могут выиграть от большего числа ядер.', items:[
    {name:'AMD Ryzen 5 7500F', price:15500, note:'6 ядер · AM5', heat:1, watts:88},
    {name:'AMD Ryzen 7 9700X', price:29500, note:'8 ядер · AM5', heat:1, watts:88},
    {name:'AMD Ryzen 9 9950X', price:68000, note:'16 ядер · AM5', heat:2, watts:230}
  ]},
  {key:'cooler', title:'Охлаждение', caption:'Процессору нужен кулер. Можно взять воздушный или жидкостный. Для жидкостного проверь, влезет ли радиатор.', items:[
    {name:'DeepCool AG400', price:2600, note:'Башенный кулер · AM5', capacity:1, radiator:0},
    {name:'DeepCool AK620', price:6400, note:'Двухбашенный кулер · AM5', capacity:1, radiator:0},
    {name:'DeepCool LS720 SE', price:13500, note:'Жидкостное охлаждение · 360 мм', capacity:2, radiator:360}
  ]},
  {key:'board', title:'Материнская плата', caption:'Все три процессора на AM5. Здесь смотри на форм-фактор платы, разъёмы и возможности расширения.', items:[
    {name:'MSI PRO B650M-A WIFI', price:15500, note:'AM5 · DDR5 · Micro-ATX', compact:true},
    {name:'MSI MAG B650 TOMAHAWK WIFI', price:23500, note:'AM5 · DDR5 · ATX'},
    {name:'ASUS ROG STRIX X870E-E GAMING WIFI', price:57500, note:'AM5 · DDR5 · ATX'}
  ]},
  {key:'ram', title:'Оперативная память', caption:'Наши платы работают с DDR5. Для игр и обычного монтажа выбирай 32 ГБ или больше, если работаешь с тяжёлыми проектами.', items:[
    {name:'Kingston Fury Beast DDR5 16 ГБ', price:5500, note:'2 × 8 ГБ · DDR5', gb:16},
    {name:'Kingston Fury Beast DDR5 32 ГБ', price:10000, note:'2 × 16 ГБ · DDR5', gb:32},
    {name:'Kingston Fury Beast DDR5 64 ГБ', price:21000, note:'2 × 32 ГБ · DDR5', gb:64}
  ]},
  {key:'gpu', title:'Видеокарта', caption:'Видеокарта сильнее всего влияет на игры. Выбирай под разрешение монитора и задачи, ради которых покупаешь компьютер.', items:[
    {name:'Palit GeForce RTX 5060 Dual', price:34000, note:'8 ГБ · ориентир на Full HD', watts:145, length:262},
    {name:'Palit GeForce RTX 5070 GamingPro', price:72000, note:'12 ГБ · ориентир на 1440p', watts:250, length:332, minPsu:650},
    {name:'Palit GeForce RTX 5090 GameRock', price:218000, note:'32 ГБ · ориентир на 4K и 3D', watts:575, length:332, minPsu:1000}
  ]},
  {key:'ssd', title:'Накопитель', caption:'Игры и исходники займут немало места. Сколько пространства тебе нужно на старте?', items:[
    {name:'WD Blue SN580 1 ТБ', price:6500, note:'NVMe · 1 ТБ'},
    {name:'Kingston KC3000 2 ТБ', price:12500, note:'NVMe · 2 ТБ'},
    {name:'Samsung 990 PRO 4 ТБ', price:33000, note:'NVMe · 4 ТБ'}
  ]},
  {key:'psu', title:'Блок питания', caption:'Последняя деталь — питание. Оставим запас по мощности и проверим, подходит ли блок к видеокарте.', items:[
    {name:'DeepCool PK650D', price:6500, note:'650 Вт', watts:650},
    {name:'MSI MAG A850GL PCIE5', price:12500, note:'850 Вт · питание для современных видеокарт', watts:850},
    {name:'be quiet! Pure Power 12 M 1000W', price:21500, note:'1000 Вт · ATX 3.0', watts:1000}
  ]}
];
const lines = [
  ['Рассказчик','Суббота, полдень. У витрины компьютерного магазина светятся системники. Соседняя кофейня пахнет свежей выпечкой, а у двери уже ждёт Артём.'],
  ['Артём','Наконец-то! Я думал, ты снова передумаешь и скажешь, что старый ноутбук ещё поживёт.'],
  ['Ты','Вчера он завис на экспорте видео. Двадцать минут я смотрел на девяносто девять процентов и размышлял о жизни.'],
  ['Артём','Значит, сегодня у нас важная миссия. Только не позволяй мне уговорить тебя на весь магазин.'],
  ['Рассказчик','Вы заходите внутрь. На полках стоят коробки с деталями, у дальней стены мерцают собранные компьютеры. К вам подходит консультант.'],
  ['Мира','Привет! Я Мира. Уже знаешь, какой компьютер ищешь, или пока присматриваешься?'],
  ['Ты','Хочу собрать свой. Играю, иногда монтирую видео, а в названиях комплектующих пока путаюсь.'],
  ['Мира','Тогда разберёмся вместе. Сначала решим, сколько тебе комфортно потратить, а потом подберём детали под твои задачи.'],
  ['Артём','И чтобы не шумел, как самолёт. Я слышал его ноутбук через голосовой чат.'],
  ['Мира','Учту. Для начала выбери бюджет. На каждом шаге объясню, за что мы платим и где можно сэкономить.']
];
const workload = [
  'Valorant и Fortnite в Full HD. Для работы — VS Code и монтаж 1080p в DaVinci Resolve.',
  'Forza Horizon 5 и Cyberpunk 2077 в 1440p с подбором настроек. Для работы — DaVinci Resolve и проекты в Blender средней сложности.',
  'Cyberpunk 2077 и другие тяжёлые игры в 4K с подбором настроек. Для работы — Blender, DaVinci Resolve и проекты с тяжёлыми сценами.'
];
let lineIndex = 0;
let step = 0;
let phase = 'choose';
let selected = null;
let tier = null;
let basket = {};

const portraits = {'Мира':'mira', 'Артём':'artyom'};
function setPortrait(speaker) {
  const image = get('sprite');
  const portrait = portraits[speaker];
  if (!portrait) {
    image.hidden = true;
    return;
  }
  image.hidden = false;
  image.dataset.character = portrait;
  image.src = 'assets/' + portrait + '.webp';
  image.alt = speaker;
}
function show(scene) {
  const stage = get('stage');
  stage.dataset.scene = scene;
  stage.dataset.location = {title:'street', dialog:'street', build:'shop', end:'bench'}[scene];
  get('chapter').textContent = {title:'Суббота, 12:10', dialog:'У входа в магазин', build:'Торговый зал', end:'У кассы'}[scene];
  for (const [id,screen] of [['cover','title'],['dialog','dialog'],['sprite','dialog'],['builder','build'],['ending','end']]) {
    get(id).hidden = scene !== screen && !(id === 'sprite' && scene === 'build');
  }
}
function showLine() {
  const [speaker, line] = lines[lineIndex];
  const inside = lineIndex >= 4;
  get('stage').dataset.location = inside ? 'shop' : 'street';
  get('chapter').textContent = inside ? 'Торговый зал' : 'У входа в магазин';
  get('speaker').textContent = speaker;
  get('line').textContent = line;
  setPortrait(speaker);
  get('line-count').textContent = (lineIndex + 1) + ' / ' + lines.length;

  get('next').textContent = lineIndex === lines.length - 1 ? 'Обсудить бюджет' : 'Дальше';
}
function total() {
  return Object.values(basket).reduce((sum, part) => sum + part.price, 0);
}
function updateCart() {
  const cost = total();
  const profile = profiles[tier];
  get('total').textContent = profile ? money(cost) + ' / ' + money(profile.limit) : '';
  get('total').classList.toggle('over', Boolean(profile && cost > profile.limit));
  const rows = catalog.flatMap(({key,title}) => {
    const item = basket[key];
    if (!item) return [];
    const row = document.createElement('li');
    row.textContent = title + ': ' + item.name + ' — ' + money(item.price);
    return [row];
  });
  get('cart-list').replaceChildren(...rows);
  get('cart-label').textContent = 'Корзина · ' + rows.length + ' из ' + catalog.length;
}

function makeArt(key) {
  const image = document.createElement('img');
  image.src = 'assets/parts/' + key + '.webp';
  image.className = 'part-art';
  image.alt = '';
  image.width = 320;
  image.height = 320;
  image.decoding = 'async';
  return image;
}
function makeCard(item, index, key) {
  const card = document.createElement('article');
  card.className = 'choice-card';
  if (key) card.append(makeArt(key));
  const label = document.createElement('label');
  const radio = document.createElement('input');
  radio.type = 'radio';
  radio.name = 'choice';
  radio.value = index;
  radio.checked = selected === index;
  const name = document.createElement('strong');
  name.textContent = item.name;
  const detail = document.createElement('small');
  detail.textContent = key ? item.note + ' · ' + money(item.price) : item.label + ' · ' + money(item.limit) + ' · ' + item.goal;
  const body = document.createElement('span');
  body.append(name,detail);
  if (key && index === tier) {
    const badge = document.createElement('small');
    badge.className = 'recommend';
    badge.textContent = 'Под твой бюджет';
    body.append(badge);
  }
  label.append(radio,body);
  card.append(label);
  if (key) {
    const link = document.createElement('a');
    link.href = 'https://www.dns-shop.ru/search/?q=' + encodeURIComponent(item.name);
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.textContent = 'Открыть в DNS';
    card.append(link);
  }
  return card;
}
function renderStep() {
  const current = catalog[step - 1];
  const review = step > catalog.length;
  phase = 'choose';
  selected = step === 0 ? tier : current ? current.items.indexOf(basket[current.key]) : null;
  if (selected === -1) selected = null;
  get('step-number').textContent = step === 0 ? 'РАЗГОВОР О БЮДЖЕТЕ' : review ? 'ПРОВЕРКА КОРЗИНЫ' : 'ДЕТАЛЬ ' + step + ' ИЗ ' + catalog.length;
  get('build-title').textContent = step === 0 ? 'На какую сумму рассчитываешь?' : review ? 'Готов к пробному запуску?' : current.title;
  get('step-copy').textContent = step === 0 ? 'Расскажи, как планируешь потратить деньги. От этого зависит, что я предложу в первую очередь.' :
    review ? 'В корзине все детали. Можем вернуться и что-то заменить или проверить, что получится.' : current.caption;
  get('your-line').hidden = true;
  const items = review ? [] : current ? current.items : profiles;
  get('fields').replaceChildren(...items.map((item,index) => makeCard(item,index,current?.key)));
  get('fields').hidden = review;
  get('back').hidden = step === 0;
  get('advance').disabled = !review && selected === null;
  get('advance').textContent = step === 0 ? 'Ответить' : review ? 'Сделать пробный запуск' : 'Добавить в корзину';
  get('cart').hidden = tier === null;
  get('cart').open = review;
  updateCart();
  get('build-title').focus();
}
function componentReply(key, item) {
  switch (key) {
    case 'case': return item.compact ? 'Хороший вариант для небольшого стола. Дальше ищем плату Micro-ATX и поглядываем на длину видеокарты.' : 'В этой башне есть место для полноразмерной платы. Теперь решим, какой процессор поставим.';
    case 'cpu': return item.heat === 2 ? 'Этот 16-ядерник пригодится для рендера. На охлаждении здесь лучше не экономить.' : 'Взяли процессор под AM5. Теперь выберем кулер и плату под него.';
    case 'cooler':
      if (item.radiator > basket.case.radiator) return 'Радиатор не помещается в выбранный корпус. Можешь вернуться к корпусу или заменить охлаждение.';
      return item.capacity < basket.cpu.heat ? 'Для этого процессора я бы взяла охлаждение с большим запасом.' : 'По нашей смете это охлаждение подходит. Переходим к плате.';
    case 'board': return basket.case.compact && !item.compact ? 'Плата ATX не влезет в компактный корпус. Вернись к корпусу или выбери плату Micro-ATX.' : 'Плата входит в корпус и работает с выбранным процессором. Ищем память DDR5.';
    case 'ram': return item.gb < 32 ? 'Для игр можно начать с 16 ГБ. Если часто монтируешь видео, я бы всё же рассмотрела 32 ГБ.' : 'С памятью есть запас для монтажа и приложений, которые ты держишь открытыми одновременно.';
    case 'gpu': return (item.length > basket.case.gpuSpace ? 'Проверь корпус: эта видеокарта длиннее нашего лимита. ' : '') + workload[catalog.find(entry => entry.key === 'gpu').items.indexOf(item)] + ' Это ориентир, настройки и скорость зависят от всей сборки.';
    case 'ssd': return 'Накопитель в корзине. Осталось подобрать питание для всего компьютера.';
    case 'psu': return item.watts >= requiredPower() ? 'По нашему расчёту запас мощности есть. Переходим к итоговой корзине.' : 'По нашему расчёту нужно от ' + requiredPower() + ' Вт. Лучше вернуться и выбрать блок с запасом.';
  }
}
function requiredPower() {
  const estimate = Math.ceil((basket.cpu.watts + basket.gpu.watts + 70) * 1.1 / 10) * 10;
  return Math.max(estimate, basket.gpu.minPsu ?? 0);
}
function finish() {
  const faults = [];
  if (basket.case.compact && !basket.board.compact) faults.push('Плата не входит в корпус.');
  if (basket.gpu.length > basket.case.gpuSpace) faults.push('Видеокарта длиннее, чем позволяет корпус.');
  if (basket.cooler.radiator > basket.case.radiator) faults.push('Радиатор не помещается в корпус.');
  if (basket.cooler.capacity < basket.cpu.heat) faults.push('Для процессора нужно более мощное охлаждение.');
  if (basket.psu.watts < requiredPower()) faults.push('Блоку питания не хватает запаса.');
  const gpuTier = catalog.find(entry => entry.key === 'gpu').items.indexOf(basket.gpu);
  const over = total() - profiles[tier].limit;
  let title = 'Первый запуск';
  let copy = 'Мира запускает тест, и монитор загорается. Ты оплачиваешь сборку. Артём уже спрашивает, во что вы сыграете вечером.';
  if (faults.length) {
    title = 'Мира остановила сборку';
    copy = faults.join(' ') + ' Вы решаете поправить корзину до оплаты.';
  } else if (over > 0) {
    title = 'Пауза у кассы';
    copy = 'Мира разворачивает монитор с чеком. Сборка стоит на ' + money(over) + ' больше, чем ты планировал. Можно обсудить бюджет снова или заменить детали.';
  } else if (gpuTier < tier || basket.ram.gb < [16,32,64][tier]) {
    title = 'Покупка с компромиссом';
    copy = 'ПК проходит пробный запуск. Мира объясняет, где выбранная сборка уступает твоей цели. Ты можешь забрать её и позже обновить детали или пересмотреть корзину сейчас. ' + workload[gpuTier];
  } else {
    copy += ' ' + workload[gpuTier];
  }
  get('ending-title').textContent = title;
  get('ending-copy').textContent = copy;
  show('end');
  get('ending-title').focus();
}

get('start').addEventListener('click', () => {
  lineIndex = 0;
  show('dialog');
  showLine();
  get('next').focus();
});
get('next').addEventListener('click', () => {
  lineIndex += 1;
  if (lineIndex < lines.length) { showLine(); return; }
  step = 0;
  show('build');
  setPortrait('Мира');
  renderStep();
});
get('parts').addEventListener('change', event => {
  if (event.target.name !== 'choice') return;
  selected = Number(event.target.value);
  get('advance').disabled = false;
});
get('back').addEventListener('click', () => {
  if (phase === 'choose' && step > 0) step -= 1;
  renderStep();
});
get('parts').addEventListener('submit', event => {
  event.preventDefault();
  if (phase === 'reply') {
    step += 1;
    renderStep();
    return;
  }
  if (step > catalog.length) { finish(); return; }
  if (selected === null) return;
  const current = catalog[step - 1];
  if (current) {
    const item = current.items[selected];
    basket[current.key] = item;
    get('your-line').textContent = 'Ты: беру ' + item.name + '.';
    get('step-copy').textContent = componentReply(current.key,item);
  } else {
    tier = selected;
    get('your-line').textContent = 'Ты: мой лимит — ' + money(profiles[tier].limit) + '. ' + ['Хочу уложиться в накопленное.','Могу добавить деньги с подработки.','Готов заплатить за запас на несколько лет.'][tier];
    get('step-copy').textContent = profiles[tier].reply;
  }
  phase = 'reply';
  get('your-line').hidden = false;
  get('fields').hidden = true;
  get('back').hidden = false;
  get('cart').hidden = false;
  get('advance').textContent = 'Готов к разговору';
  updateCart();
});
get('retry').addEventListener('click', () => {
  step = catalog.length + 1;
  show('build');
  setPortrait('Мира');
  renderStep();
});
get('restart').addEventListener('click', () => {
  tier = null;
  basket = {};
  show('title');
  get('start').focus();
});
