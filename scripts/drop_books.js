const { db } = require('@vercel/postgres');

async function dropBooksTable(client) {
  try {
    await client.sql`DROP TABLE IF EXISTS books;`;

    console.log(`dropped "books" table`);
  } catch (error) {
    console.error('Failed to drop "books":', error);
    throw error;
  }
}

async function main() {
  const client = await db.connect();

  /* await dropBooksTable(client); */

  await client.end();
}

main().catch((err) => {
  console.error(err);
});
