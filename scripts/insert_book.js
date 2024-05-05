const { db } = require('@vercel/postgres');

async function createBook(
  client,
  title,
  category,
  description,
  price,
  author,
  publisher,
  publishDate,
  pageLength,
  type,
  imageUrl,
) {
  try {
    await client.sql`
    INSERT INTO books (
      title,
      category,
      description,
      price,
      author,
      publisher,
      publish_date,
      page_length,
      type,
      imageUrl
    )
    VALUES (
      ${title},
      ${category},
      ${description},
      ${price},
      ${author},
      ${publisher},
      ${publishDate},
      ${pageLength},
      ${type},
      ${imageUrl}
    )
    ON CONFLICT (id) DO NOTHING;`;
  } catch (error) {
    console.error(`Failed to create a book: ${title}:`, error);
    throw error;
  }
}

async function main() {
  const client = await db.connect();

  /*await createBook(client, {
    author_name: 'Малґожата Мицельська Олександра',
    title: 'ОЦЕ ТАК ПАТЕНТ! Книга неймовірних винаходів',
    category_title: 'Пізнавальні книги',
    publisher_name: 'Видавництво Старого Лева',
    description:
      'Коли на зламі XV і XVI століть Леонардо да Вінчі вигадав танк, автомобіль, вертоліт, дельтаплан, парашут, підводний човен, ліфт і телескоп, його, очевидно, вважали за мрійника. Або навіть шаленця. Нині кажуть, що він — геній, який випередив свій час... Неймовірний огляд давніх і сучасних винаходів — новаторських, переломних, кумедних, невдалих чи навіть нездійсненних. Але вони всі про людську фантазію.',
    page_length: 128,
    publish_date: new Date('2023'),
    type: 'paper',
    price: 600.0,
  });*/

  await client.end();
}

main().catch((err) => console.error(err));
