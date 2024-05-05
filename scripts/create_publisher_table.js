const { db } = require('@vercel/postgres');

async function createPublishersTable(client) {
  try {
    await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
    await client.sql`
    CREATE TABLE IF NOT EXISTS publishers (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      description TEXT NOT NULL,
		  name VARCHAR(255) NOT NULL UNIQUE
    );`;

    console.log(`Created "publishers" table`);
  } catch (error) {
    console.error('Error creating "publishers":', error);
    throw error;
  }
}

async function dropPublishersTable(client) {
  try {
    await client.sql`DROP TABLE IF EXISTS publishers`;
    console.log(`DROPPED "publishers" table`);
  } catch (error) {
    console.error('Failed to drop "publishers":', error);
    throw error;
  }
}

async function createPublisher(client, name, description) {
  try {
    await client.sql`INSERT INTO publishers (name, description)
	VALUES (${name}, ${description})
	ON CONFLICT (id) DO NOTHING;`;
    console.log(`Added publisher: ${name}`);
  } catch (error) {
    console.error(`Failed to create publisher: ${name}`, error);
    throw error;
  }
}

async function main() {
  const client = await db.connect();

  await dropPublishersTable(client);
  await createPublishersTable(client);
  await Promise.all([
    createPublisher(client, 'Видавництво Старого Лева', ''),
    createPublisher(client, 'А-БА-БА-ГА-ЛА-МА-ГА', 'foobar'),
  ]);

  const result = await client.sql`SELECT * FROM publishers`;
  console.log(result.rows);

  await client.end();
}

main().catch((err) => {
  console.error(
    'An error occurred while attempting to seed the database:',
    err,
  );
});
