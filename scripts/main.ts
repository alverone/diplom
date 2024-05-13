import { $Enums } from '@prisma/client';
import prisma from '../lib/prisma';

type AuthorPayload = {
  name: string;
  description: string | null;
};

type CategoryPayload = {
  title: string;
  description: string | null;
};

type PublisherPayload = {
  name: string;
  description: string | null;
};

type BookPayload = {
  title: string;
  description: string;
  price: number;
  publishDate: Date;
  pageLength: number;
  type: $Enums.BookType;
  authorName: string;
  authorDescription: string | null;
  publisherName: string;
  publisherDescription: string | null;
  categoryTitle: string;
  categoryDescription: string | null;
};

async function createAuthors(authors: AuthorPayload[]): Promise<Author[]> {
  try {
    await prisma.author.createMany({
      data: authors,
      skipDuplicates: true,
    });

    const created = await prisma.author.findMany({
      where: {
        name: {
          in: authors.map((author) => author.name),
        },
      },
    });

    if (!created) {
      return [];
    } else {
      return created;
    }
  } catch (e) {
    console.error('DatabaseError:', e);
    return [];
  }
}

async function upsertAuthor(author: AuthorPayload): Promise<Author> {
  try {
    return await prisma.author.upsert({
      where: {
        name: author.name,
      },
      create: author,
      update: author,
    });
  } catch (e) {
    console.error('DatabaseError:', e);
    throw e;
  }
}

async function upsertCategory(category: CategoryPayload): Promise<Category> {
  try {
    return await prisma.category.upsert({
      where: {
        title: category.title,
      },
      create: category,
      update: category,
    });
  } catch (e) {
    console.error('DatabaseError:', e);
    throw e;
  }
}

async function upsertPublisher(
  publisher: PublisherPayload,
): Promise<Publisher> {
  try {
    return await prisma.publisher.upsert({
      where: {
        name: publisher.name,
      },
      create: publisher,
      update: publisher,
    });
  } catch (e) {
    console.error('DatabaseError:', e);
    throw e;
  }
}

async function createCategories(
  categories: CategoryPayload[],
): Promise<Category[]> {
  try {
    await prisma.category.createMany({
      data: categories,
      skipDuplicates: true,
    });

    const created = await prisma.category.findMany({
      where: {
        title: {
          in: categories.map((category) => category.title),
        },
      },
    });

    if (!created) {
      return [];
    } else {
      return created;
    }
  } catch (e) {
    console.error('DatabaseError:', e);
    return [];
  }
}

async function createPublishers(
  publishers: PublisherPayload[],
): Promise<Publisher[]> {
  try {
    await prisma.publisher.createMany({
      data: publishers,
      skipDuplicates: true,
    });

    const created = await prisma.publisher.findMany({
      where: {
        name: {
          in: publishers.map((publisher) => publisher.name),
        },
      },
    });

    if (!created) {
      return [];
    } else {
      return created;
    }
  } catch (e) {
    console.error('DatabaseError:', e);
    return [];
  }
}

async function createBook(bookPayload: BookPayload) {
  try {
    const [author, publisher, category] = await Promise.all([
      upsertAuthor({
        name: bookPayload.authorName,
        description: bookPayload.authorDescription,
      }),

      upsertPublisher({
        name: bookPayload.publisherName,
        description: bookPayload.publisherDescription,
      }),
      upsertCategory({
        title: bookPayload.categoryTitle,
        description: bookPayload.categoryDescription,
      }),
    ]);

    const { title, description, price, publishDate, pageLength, type } =
      bookPayload;

    await prisma.book.create({
      data: {
        title: title,
        description: description,
        price: price,
        publishDate: publishDate,
        pageLength: pageLength,
        type: type,
        authorId: author.id,
        publisherId: publisher.id,
        categoryId: category.id,
      },
    });
  } catch (e) {
    console.error('DatabaseError:', e);
  }
}

async function main() {
  const authors: AuthorPayload[] = [
    { name: 'Юрко Іздрик', description: null },
    { name: 'Террі Пратчетт', description: null },
    { name: 'Генрі Марш', description: null },
    { name: 'Росс Монтґомері', description: null },
    { name: 'Моллі Клейпул', description: null },
    { name: 'Кейсі Макквістон', description: null },
    { name: 'Фредрік Бакман', description: null },
    { name: 'Том Флетчер', description: null },
    { name: 'Джоан Ролінґ', description: null },
    { name: 'Елізабет Ґілберт', description: null },
    { name: 'Едіт Еґер', description: null },
    { name: 'Джордж Орвелл', description: null },
    { name: 'Фенні Флеґґ', description: null },
    { name: 'Богдан Логвиненко', description: null },
    { name: 'Маркіян Прохасько', description: null },
    { name: 'Керрі Лін Сперров', description: null },
    { name: 'Малґожата Мицельська Олександра', description: null },
  ];

  const books: BookPayload[] = [
    {
      title: 'ОЦЕ ТАК ПАТЕНТ! Книга неймовірних винаходів',
      categoryTitle: 'Пізнавальні книги',
      description:
        'Коли на зламі XV і XVI століть Леонардо да Вінчі вигадав танк, автомобіль, вертоліт, дельтаплан, парашут, підводний човен, ліфт і телескоп, його, очевидно, вважали за мрійника. Або навіть шаленця. Нині кажуть, що він — геній, який випередив свій час... Неймовірний огляд давніх і сучасних винаходів — новаторських, переломних, кумедних, невдалих чи навіть нездійсненних. Але вони всі про людську фантазію.',
      price: 600,
      authorName: 'Малґожата Мицельська Олександра',
      publisherName: 'Видавництво Старого Лева',
      publishDate: new Date(2023, 1, 1),
      pageLength: 128,
      type: $Enums.BookType.PAPER,
      authorDescription: null,
      publisherDescription: null,
      categoryDescription: null,
    },
    {
      title: 'Третій рай',
      categoryTitle: 'Поезія',
      description:
        '«Третій рай» — це спроба поетичного шаманізму, намагання зібрати воєдино корпус текстів, що став би своєрідним каноном земного раю, як його собі уявляє Автор. Слово «візуалізація» також буде доречним, хоча в збірці не бракує і власне візуальної компоненти — збірка проілюстрована серією розмальованих Іздриком сірникових коробочок. Незайве буде додати, що серія створена під час блекаутів 2022-го, що додає «візії раю» специфічного забарвлення та настрою.',
      price: 380,
      authorName: 'Юрко Ідзрик',
      publisherName: 'Видавництво Старого Лева',
      publishDate: new Date(2023, 12, 11),
      pageLength: 248,
      type: $Enums.BookType.PAPER,
      authorDescription: null,
      publisherDescription: null,
      categoryDescription: null,
    },
    {
      title: 'Зимар',
      categoryTitle: 'Художня проза',
      description:
        '«Зимар» — роман із серії «Дискосвіт» Террі Пратчетта, продов­ження пригод маленької відьмочки Тіфані Болячки. \n Як так сталося, що Тіфані Болячка помінялася місцями з самою Володаркою Літа? А все тому, що не слухала старших, точніше, свою наставницю пані Зрадоньку. Та що вона могла вдіяти, якщо ноги самі затягли її у темний морріс денс й витанцьовували так, що у неї закохався стихійник Зимар? \n Баланс Дискосвіту знову порушено, звичний порядок речей став дуже незвичним, а на додачу засніженим та холоднючим. Тіфані разом з малолюдцями — а куди ж без них? — доведеться врятувати світ від вічного холоду.',
      price: 380,
      authorName: 'Террі Пратчетт',
      publisherName: 'Видавництво Старого Лева',
      publishDate: new Date(2023, 12, 11),
      pageLength: 368,
      type: $Enums.BookType.PAPER,
      authorDescription: null,
      publisherDescription: null,
      categoryDescription: null,
    },
    {
      title: 'І наостанок',
      categoryTitle: 'Художня проза',
      description:
        'Генрі Марш, нейрохірург із багаторічним стажем, уже на пенсії. Він боровся за людські життя, а тепер сам опинився в ситуації, що може стати його смертним вироком. У цій книжці він пише про заплутаний шлях від лікаря до пацієнта, бо тепер він — уже не в лікарському халаті, а на картці хворого — його прізвище. Генрі Марш нотує спогади про минуле та розмірковує про справи, які треба завершити. І зараз він більше, ніж будь-коли, зачарований таємницями науки і мозку, красою світу природи та любов’ю до своєї родини.\n«І наостанок» — елегійна, відверта, світла і пронизлива книжка про життя, смерть і те, що, зрештою, має значення.',
      price: 280,
      authorName: 'Генрі Марш	Видавництво',
      publisherName: 'Старого Лева',
      publishDate: new Date(2023, 12, 11),
      pageLength: 26,
      type: $Enums.BookType.ELECTRONIC,
      authorDescription: null,
      publisherDescription: null,
      categoryDescription: null,
    },
    {
      title: 'Пінгвінокупка',
      categoryTitle: 'Книги-картинки',
      description:
        'Коли сонце заходить за обрій і на Північному полюсі настає холодна ніч, зграя пінгвінів збирається у ПІНГВІНОКУПКУ, щоб їм було тепло й затишно. Та якось уночі здійнявся крижаний буревій. А наступного ранку пінгвіни змерзлися, немов велетенське ПІНГВІНЯЧЕ морозиво! Оце так пінгвіняча задачка! Та в найменшого з них, Писклика, є ідея...\nЦе безтурботна історія про кумедних пінгвінів, силу дружби й готовність допомогти тим, хто потрапив у біду.',
      price: 280,
      authorName: 'Росс Монтґомері',
      publisherName: 'Видавництво Старого Лева',
      publishDate: new Date(2023, 12, 11),
      pageLength: 40,
      type: $Enums.BookType.PAPER,
      authorDescription: null,
      publisherDescription: null,
      categoryDescription: null,
    },
    {
      title: 'Це Ґауді',
      categoryTitle: 'Мистецтво і культура',
      description:
        'Архітектурні творіння Антоніо Ґауді визначають міський ландшафт Барселони, вони революційні за інженерією і дивовижні за простором.\nЗа життя Ґауді здобув репутацію божевільного святенника. Та насправді він був художником-майстром у вищому сенсі цього слова, генієм, якого надихала природа і божественне начало, а також каталонська культура, яку він відстоював протягом усього життя.\nЦя книжка — популярний життєпис Ґауді, доповнений ілюстраціями та світлинами його витворів.',
      price: 350,
      authorName: 'Моллі Клейпул',
      publisherName: 'Видавництво Старого Лева',
      publishDate: new Date(2023, 12, 11),
      pageLength: 80,
      type: $Enums.BookType.PAPER,
      authorDescription: null,
      publisherDescription: null,
      categoryDescription: null,
    },
    {
      title: 'Червоний, білий та королівський синій',
      categoryTitle: 'Мистецтво і культура',
      description:
        'Алекс — син президентки Сполучених Штатів Еллен Клермонт-Діаз, американський еквівалент принца. Він, його сестра Джун та онука віцепрезидента Нора — це Тріо Білого дому, найближчий аналог королівської сім’ї. Тож коли Еллен розпочинає передвиборчу кампанію, вона розуміє, що кращих помічників їй годі й шукати. Але коли до таблоїдів потрапляє фото імовірної бійки між Алексом та британським принцом Генрі, якого вважають давнім Алексовим суперником, та ще й на королівському весіллі, ситуація різко ускладнюється. Єдиний спосіб запобігти міжнародному скандалу — вдати, ніби насправді Алекс і Генрі найкращі друзі.\nВтім, те, що починалося як інсценування, зрештою переростає в дещо набагато більше і ризикованіше.',
      price: 544,
      authorName: 'Кейсі Макквістон',
      publisherName: 'Артбукс',
      publishDate: new Date(2023, 12, 11),
      pageLength: 80,
      type: $Enums.BookType.PAPER,
      authorDescription: null,
      publisherDescription: null,
      categoryDescription: null,
    },
    {
      title: 'Переможці',
      categoryTitle: 'Художня проза',
      description:
        'Сильна і зворушлива історія, події якої відбуваються у маленькому містечку. \n Вона про жорстокість і чуттєвість, про вірність і відданість, про насильство і дружбу, про прагнення помсти й жагу до ПЕРЕМОГИ. Книжка від автора бестселерів № 1 за версією New York Times, на яку зачекався увесь український буктюб і не тільки. «Переможці» — завершальна частина трилогії про хокейну команду та життя містечка Бйорнстад. Сюжет: Минуло два роки після подій, які досі ніхто не хоче згадувати. Кожен намагався йти далі, але в цьому місті завжди щось цьому заважає. Мешканці хокейного містечка продовжують шукати відповіді на найважливіші запитання: Що таке сім’я? Що таке спільнота? І чим вони готові пожертвувати, щоб захистити їх? Поки жителі містечка Бйорнстад намагаються подолати минуле, великі зміни вже на горизонті. Хтось повертається додому після тривалої відсутності, хтось закохається, хтось спробує налагодити шлюб, а хтось піде на все, щоб врятувати своїх дітей...',
      price: 500,
      authorName: 'Фредрік Бакман',
      publisherName: 'Книголав',
      publishDate: new Date(2023, 12, 11),
      pageLength: 70,
      type: $Enums.BookType.PAPER,
      authorDescription: null,
      publisherDescription: null,
      categoryDescription: null,
    },
    {
      title: 'Пес Патрон та Шкарпетковий монстр. Книга 1',
      categoryTitle: 'Комікси',
      description:
        'Всі чули про собаку-сапера Патрона, героя війни та національного кумира. Всі знають, як він рятує тисячі життів, знаходячи міни та вибухівку.\nАле чи знаєте ви, що Патрон ще врятував Землю від здоровезного Шкарпеткового Монстра, який прилетів з далекої галактики? Ні? Тоді розгортайте цей фантастичний комікс, і ви довідаєтесь про те, що сталося, коли Патрон натрапив на Монстра, чим небезпечні шкарпетки і як Патрон та його друзі, Святе Каченя й робот Григорій, перемогли рибульців-агресорів. Такі пригоди — це справжня фантастика! Але у Патрона всі пригоди неймовірно фантастичні!',
      price: 174,
      authorName: 'Фредрік Бакман',
      publisherName: 'Ранок',
      publishDate: new Date(2023, 12, 11),
      pageLength: 32,
      type: $Enums.BookType.PAPER,
      authorDescription: null,
      publisherDescription: null,
      categoryDescription: null,
    },
    {
      title: 'Різдвозавр та список Нечемнюхів',
      categoryTitle: 'Дитяча проза',
      description:
        'Різдвозавр повертається! Приготуйтеся до НОВОЇ різдвяної пригоди від автора бестселерів Тома Флетчера!\nУсі вже знають про списки Чемненьких та Нечемнюхів, правда ж? А про суперсекретний пристрій Санти, який він ЗАВЖДИ звіряє двічі? Що ж, цьогоріч Різдвозаврові доведеться відшукати дітлахів, які опинились у списку Нечемнюхів, аби допомогти їм пізнати справжній дух Різдва, виправити помилки, вугільні грудки обернути на цукерки... а з Нечемнюхів перетворитися на Чемненьких! Адже Санта вірить, що всі діти заслуговують на другий шанс.',
      price: 285,
      authorName: 'Том Флетчер',
      publisherName: 'Видавництво Старого Лева',
      publishDate: new Date(2022, 1, 1),
      pageLength: 43,
      type: $Enums.BookType.PAPER,
      authorDescription: null,
      publisherDescription: null,
      categoryDescription: null,
    },
    {
      title: 'Різдвяна свинка',
      categoryTitle: 'Дитяча проза',
      description:
        '«Різдвяна свинка» — перший дитячий роман Дж. К. Ролінґ після серії про Гаррі Поттера.\n…Джек дуже любить свою дитячу іграшку, Галну Слинку, яку він кличе ГС. Вона завжди була біля нього — у добрі й лихі часи. Але одного Святвечора сталася жахлива річ – ГС пропала. Однак у Ніч перед Різдвом стаються різні дива й несподіванки, і все довкола оживає, навіть іграшки… У найновішої Джекової іграшки на ім’я Різдвяна Свинка народжується зухвала ідея – вони разом із Джеком вирушають у страшенно ризиковану подорож до чарівної Країни Загублених, щоб порятувати улюблену ГС від жахливого Згубника...\n«Різдвяна Свинка» — зворушлива гостросюжетна історія, адресована наймолодшим школярам, проте її захоплено «проковтне» ціла родина, адже її написала найкраща оповідачка світу.',
      price: 420,
      authorName: 'Джоан Ролінґ',
      publisherName: 'А-БА-БА-ГА-ЛА-МА-ГА',
      publishDate: new Date(2022, 1, 1),
      pageLength: 32,
      type: $Enums.BookType.PAPER,
      authorDescription: null,
      publisherDescription: null,
      categoryDescription: null,
    },
    {
      title: 'Ану спи, овечко!',
      categoryTitle: 'Дитяча проза',
      description:
        'Чого тільки не придумують ввечері діти, лише б не лягати спати. Коли один з таких малих вигадників, хлопчик по імені Данкен, таки вкладається нарешті до сну, то, щоб швидше задрімати, починає вважати овечок, що перестрибують через його ліжко. Але одна вівця-хитрунка знай придумує то те, то се, тільки б не стрибати: то їй захотілося пити, то в туалет захотілося, то шкарпетки не ті ... Ця забавна історія порадує як маленьких, так і дорослих читачів, а неповторні ілюстрації додадуть особливого настрою вашої спільної читання.',
      price: 316,
      authorName: 'Керрі Лін',
      publisherName: 'Сперров	А - БА - БА - ГА - ЛА - МА - ГА',
      publishDate: new Date(2022, 1, 1),
      pageLength: 32,
      type: $Enums.BookType.PAPER,
      authorDescription: null,
      publisherDescription: null,
      categoryDescription: null,
    },
    {
      title: 'Ukraїner. Країна зсередини',
      categoryTitle: 'Альбоми і артбуки',
      description:
        '«Ukraїner. Країна зсередини» — ​книга за мотивами першого кола масштабної експедиції Украї­ною, яка тривала з літа 2016-го до зими 2018-го року й охопила всі історичні регіони — ​від Слобожанщини до Поділля, від Волині до Таврії. У книзі зібрано найяскравіші моменти з манд­рівок унікальними куточками країни: історії людей та місць, що надихають, зворушують і дивують, а також вражаючі фото, які показують Україну справжньою, несподіваною, цікавою та автентичною. Ініціатор проєкту та автор ідеї книги — Богдан Логвиненко.',
      price: 900,
      authorName: 'Богдан Логвиненко',
      publisherName: 'Видавництво Старого Лева',
      publishDate: new Date(2019, 1, 1),
      pageLength: 31,
      type: $Enums.BookType.PAPER,
      authorDescription: null,
      publisherDescription: null,
      categoryDescription: null,
    },
    {
      title: 'Місто дівчат',
      categoryTitle: 'Художня проза',
      description:
        '«Місто дівчат» — новий бестселер Елізабет Ґілберт, яка підкорила світ романами «Їсти, молитися, кохати» та «Природа всіх речей». Це інтригуючий роман про жіночу сексуальність і свободу, про відвагу бути собою і право жити так, як тобі хочеться. А ще — історія дуже незвичайного кохання, на яке наклала свою тінь війна, та справжньої дружби, яку нелегко знайти, зрозуміти та оцінити, особливо в такому непростому і мінливому місті, як Нью-Йорк. Роман «Місто дівчат» починається 1940 року, коли дев’ятнадцятилітню Вівіан Морріс виганяють з престижного коледжу. Батьки відправляють доньку на Мангеттен до тітки — власниці невеликого, проте дуже ексцентричного театру. Несподівано для себе Вівіан опиняється у справжньому вирі довоєнного богемного життя. Знайомства із зірками, незвичайні театральні постановки, нестримний секс, ріки алкоголю і відчуття цілковитої свободи спершу заворожують та спокушають, а потім вибивають землю з-під ніг. І це лише початок шляху Вівіан довжиною в життя, який необхідно пройти...',
      price: 392,
      authorName: 'Елізабет Ґілберт',
      publisherName: 'Видавництво Старого Лева',
      publishDate: new Date(2023, 12, 11),
      pageLength: 53,
      type: $Enums.BookType.ELECTRONIC,
      authorDescription: null,
      publisherDescription: null,
      categoryDescription: null,
    },
    {
      title: 'Дар. 14 уроків, які врятують ваше життя',
      categoryTitle: 'Нон-фікшн',
      description:
        'Едіт Еґер написала цю книжку на прохання читачів її бестселера «Вибір» і це практичний посібник як подбати про своє ментальне здоров’я – як жити повноцінно і не застрягати у в’язниці власного розуму.\nЦе своєрідні 12 сеансів від видатної психотерапевтки, які дають підказки як сприймати свої емоції, як позбутись комплексу жертви, зцілитись від дитячих травм, переживати втрати та горе, як виходити з конфліктних ситуацій чи не потрапляти у них, як прийняти і полюбити себе, як позбутися відчуття вини, як навчитись контролювати свої страхи та впоратись з тривожністю.\nУ кожному розділі докторка Еґер ділиться історіями з власного життя та історіями своїх пацієнтів, а в кінці пропонує ключі до звільнення від проблеми. Це установки, вправи або питання, які допоможуть знайти шлях з наших ментальних в’язниць до свободи і радіти життю.',
      price: 310,
      authorName: 'Едіт Еґер',
      publisherName: 'Книголав',
      publishDate: new Date(2022, 1, 1),
      pageLength: 26,
      type: $Enums.BookType.PAPER,
      authorDescription: null,
      publisherDescription: null,
      categoryDescription: null,
    },
    {
      title: '1984 (Класика)',
      categoryTitle: 'Зарубіжна класика',
      description:
        'Джордж Орвелл (справжнє ім’я — Ерік Артур Блер) — англійський прозаїк, есеїст, журналіст і критик. Його творчість характеризується пронизливою соціальною критикою, опозиційністю до тоталітаризму та відвертою підтримкою демократичних прагнень людства. Автор та популяризатор в політичному дискурсі терміна «холодна війна». «1984» — без сумніву, найвідоміша в світі антиутопія, вперше опублікована в 1949 році. Книга оповідає про життя Вінстона Сміта, низькорангового члена Партії, який розчарований повсякденним життям та всюдисущими очима Партії та її зловісного очільника — Старшого Брата. Старший Брат контролює всі аспекти життя: впровадив спрощений новоговір, намагаючись повністю задушити навіть можливість спротиву системі; криміналізував думкозлочини, щоб люди навіть помислити не сміли про бунт проти влади. Партія контролює все: що люди читають, говорять, роблять, погрожуючи відправляти неслухів до страхітливої «кімнати сто один».',
      price: 143,
      authorName: 'Джордж Орвелл',
      publisherName: 'Book Chef',
      publishDate: new Date(2022, 1, 1),
      pageLength: 36,
      type: $Enums.BookType.PAPER,
      authorDescription: null,
      publisherDescription: null,
      categoryDescription: null,
    },
    {
      title: 'Різдво з червоним кардиналом',
      categoryTitle: 'Художня проза',
      description:
        'Живеш, плануєш, відкладаєш гроші на відпустку, а тоді… Невтішний діагноз ставить крапку в планах. Від свого лікаря Освальд дізнається, що жити йому лишається небагато. Буденні проблеми враз стають смішними й неважливими. Освальд вирішує: до дідька похмурий Чикаго! Попереду — Різдво. Останнє для Освальда. І зустріти його він планує в чарівному віддаленому містечку під назвою Лост-Ривер. Здається, що навіть час забув про це місце. Тут листоноші пересуваються човнами, а місцеві жінки — членкині таємничої спільноти, яка підпільно робить добрі справи. Люди неспішні й загадкові, і в повітрі витає аромат лимонного пирога. Одного дня Освальд зазирає до місцевої крамнички, у якій мешкає пташка. Маленька червона пташка на ім’я Джек. Та це лише одне з див, які чекають на Освальда в Лост-Ривері. Усе-таки він опинився тут зовсім не випадково…',
      price: 207,
      authorName: 'Фенні Флеґґ',
      publisherName: 'Книжковий клуб «Клуб Сімейного Дозвілля»',
      publishDate: new Date(2022, 1, 1),
      pageLength: 19,
      type: $Enums.BookType.ELECTRONIC,
      authorDescription: null,
      publisherDescription: null,
      categoryDescription: null,
    },
    {
      title: 'Мрія про Антарктиду',
      categoryTitle: 'Біографії та мемуари',
      description:
        'У цій книзі здійснено спробу без замаху на вичерпність синтезувати і передати читачу цілісний світ Антарктики — холодного, скутого льодом, ненаселеного і досі маловивченого краю. Він простягається на континент Антарктиди та Південний океан із безліччю островів. Зануритись у мандрівку дивовижним світом криги та снігу допоможуть неповторні краєвиди регіону, незвичайні пригоди людей, історії відчайдушних першопрохідців, неймовірні наукові дослідження, загрозливі глобальні проблеми, краса живої первозданної природи, яскраві відчуття у подорожі океаном.\nВ основі книги — живі враження автора, який здійснив велику мрію і подався у захопливу подорож до української станції «Академік Вернадський» в Антарктиді. Текст насичений великою кількістю інформації, пов’язаною із континентом: від того, як люди знайшли південну землю 200 років тому, — до того, як потрапити на континент у наш час; від мальовничих описів навколишнього світу у Антарктиці — до пояснення складних процесів, які безпосередньо стосуються кожного мешканця планети.',
      price: 650,
      authorName: 'Маркіян Прохасько',
      publisherName: 'Видавництво Старого Лева',
      publishDate: new Date(2022, 1, 1),
      pageLength: 65,
      type: $Enums.BookType.PAPER,
      authorDescription: null,
      publisherDescription: null,
      categoryDescription: null,
    },
  ];

  for (const book of books) {
    await createBook(book);
  }
}

main().catch((err) => console.error(err));
