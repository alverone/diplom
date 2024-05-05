const { db } = require('@vercel/postgres');

async function createPublisher(client, publisher, description) {
  try {
    await client.sql`
    INSERT INTO publishers (name, description)
    VALUES (${publisher}, ${description ? description : null})
    ON CONFLICT (id) DO NOTHING;`;

    console.log(`Added publisher: ${publisher}`);
  } catch (error) {
    console.error(`Failed to create publisher: ${publisher}`, error);
    throw error;
  }
}

async function main() {
  const client = await db.connect();

  /*await createPublisher(client, 'Publisher');*/

  await client.end();
}

main().catch((err) => console.error(err));
