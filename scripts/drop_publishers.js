const { db } = require('@vercel/postgres');

async function dropPublishersTable(client) {
  try {
    await client.sql`DROP TABLE IF EXISTS publishers;`;

    console.log(`dropped "publishers" table`);
  } catch (error) {
    console.error('Failed to drop "publishers":', error);
    throw error;
  }
}

async function main() {
  const client = await db.connect();

  /* await dropPublishersTable(client); */

  await client.end();
}

main().catch((err) => {
  console.error(err);
});
