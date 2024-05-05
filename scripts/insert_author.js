const { db } = require('@vercel/postgres');

async function createAuthor(client, author, description) {
  try {
    await client.sql`
    INSERT INTO authors (name, description)
    VALUES (${author}, ${description ? description : null})
    ON CONFLICT (id) DO NOTHING;`;

    console.log(`Added author: ${author}`);
  } catch (error) {
    console.error(`Failed to create author: ${author}`, error);
    throw error;
  }
}

async function main() {
  const client = await db.connect();

  /*await createAuthor(client, 'Author');*/

  await client.end();
}

main().catch((err) => console.error(err));
