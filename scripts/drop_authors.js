const { db } = require('@vercel/postgres');

async function dropAuthorsTable(client) {
  try {
    await client.sql`DROP TABLE IF EXISTS authors;`;

    console.log(`dropped "authors" table`);
  } catch (error) {
    console.error('Failed to drop "authors":', error);
    throw error;
  }
}

async function main() {
  const client = await db.connect();

  /* await dropAuthorsTable(client); */

  await client.end();
}

main().catch((err) => {
  console.error(err);
});
