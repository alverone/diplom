import {
  Author,
  BookPayload,
  BookRaw,
  Category,
  Publisher,
} from '@/app/lib/definitions';

const { db } = require('@vercel/postgres');

async function createIfNotExistsAuthor(
  client: any,
  authorName: string,
): Promise<Author | undefined> {
  try {
    await client.sql`INSERT INTO authors (name)
    SELECT ${authorName}
    WHERE NOT EXISTS (
      SELECT name FROM authors WHERE UPPER(name)=UPPER(${authorName})
    );`;

    const data = await client.sql<Author>`SELECT *
      FROM authors
      WHERE UPPER(name)=UPPER(${authorName})
      LIMIT 1;`;

    return data.rows[0];
  } catch (e) {
    console.error('DatabaseError:', e);
  }
}

async function createIfNotExistsCategory(
  client: any,
  categoryTitle: string,
): Promise<Category | undefined> {
  try {
    await client.sql`INSERT INTO categories (title)
    VALUES(${categoryTitle})
    ON CONFLICT DO NOTHING;`;
    const data = await client.sql<Category>`SELECT *
      FROM categories
      WHERE title=${categoryTitle}
      LIMIT 1;`;

    return data.rows[0];
  } catch (e) {
    console.error('DatabaseError:', e);
  }
}

async function createIfNotExistsPublisher(
  client: any,
  publisherName: string,
  description?: string,
): Promise<Publisher | undefined> {
  try {
    await client.sql`INSERT INTO publishers (name, description)
    VALUES(${publisherName}, ${!description ? '' : description})
    ON CONFLICT DO NOTHING;`;
    const data = await client.sql<Publisher>`SELECT *
      FROM publishers
      WHERE name=${publisherName}
      LIMIT 1;`;

    return data.rows[0];
  } catch (e) {
    console.error('DatabaseError:', e);
  }
}

async function createBook(client: any, bookPayload: BookPayload) {
  try {
    const [author, publisher, category] = await Promise.all([
      createIfNotExistsAuthor(client, bookPayload.author_name),
      createIfNotExistsCategory(client, bookPayload.category_title),
      createIfNotExistsPublisher(client, bookPayload.publisher_name),
    ]);

    const {
      title,
      description,
      price,
      publish_date,
      page_length,
      type,
      imageUrl,
    } = bookPayload;

    await client.sql`
    INSERT INTO books (title, description, price, publish_date, page_length, type, imageUrl, author, publisher, category)
    VALUES(${title}, ${description}, ${price}, ${
      publish_date.toISOString().split('T')[0]
    }, ${page_length}, ${type}, ${!imageUrl ? null : imageUrl}, ${
      author!.id
    }, ${category!.id}, ${publisher!.id});`;

    const book = await client.sql<BookRaw>`
    SELECT *
    FROM books
    WHERE title=${title} LIMIT 1;`;
  } catch (e) {
    console.error('DatabaseError:', e);
  }
}

async function main() {
  const client = await db.connect();

  await createBook(client, {
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
  });

  await client.end();
}

main().catch((err) => console.error(err));
