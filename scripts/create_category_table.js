const { db } = require('@vercel/postgres');

/*const book = {
	id: '',
	title: '',
	category: '',//category id,
	description: '',//str
	price: 0, //number
	authorName: '',
	publishingHouse: '',
	publishDate: new Date(), //date yyyy-mm-dd
	length: 0, //pages
	type: 'electronic'|'paper', //string
};

const publishingHouse = {
	id: '',
	description?: '',
	name: '',
};

category = {
	id: '',
	title: '',
};

author = {
	name: '',
	id: '',
};*/



 async function createCategoryTable(client) {
  try {
    await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
    // Create the "users" table if it doesn't exist
    await client.sql`
    CREATE TABLE IF NOT EXISTS categories (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title VARCHAR(255) NOT NULL UNIQUE
  );
    `;

    console.log(`Created "categories" table`);
    
  } catch (error) {
    console.error('Error creating categories:', error);
    throw error;
  }
}

 async function dropCategoryTable(client) {
    try {
    await client.sql`DROP TABLE IF EXISTS categories`;
    console.log(`DROPPED "categories" table`);
  } catch (error) {
    console.error('Failed to drop "categories":', error);
    throw error;
  }
}

 async function createCategory(client, category) {
	try {
	await client.sql`INSERT INTO categories (title)
	VALUES (${category})
	ON CONFLICT (id) DO NOTHING;`;
    console.log(`Added category: ${category}`);
  } catch (error) {
    console.error(`Failed to create category: ${category}:`, error);
    throw error;
  }
}


async function main() {
  const client = await db.connect();
  await dropCategoryTable(client);
  await createCategoryTable(client);
  await Promise.all([
    createCategory(client, 'Аніме'),
    createCategory(client, 'Манга'),
  ]);

  const result = await client.sql`SELECT * FROM categories`;
  console.log(result.rows);

  await client.end();
}

main().catch((err) => {
  console.error(
    'An error occurred while attempting to seed the database:',
    err,
  );
});
