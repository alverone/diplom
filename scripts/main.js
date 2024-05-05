async function createAuthorsTable(client) {
  try {
    await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
    // Create the "users" table if it doesn't exist
    await client.sql`
    CREATE TABLE IF NOT EXISTS authors (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL
  );
    `;

    console.log(`Created "authors" table`);
  } catch (error) {
    console.error('Error creating "authors":', error);
    throw error;
  }
}

async function dropAuthorsTable(client) {
  try {
    await client.sql`DROP TABLE IF EXISTS authors`;
    console.log(`DROPPED "authors" table`);
  } catch (error) {
    console.error('Failed to drop "authors":', error);
    throw error;
  }
}

async function createAuthor(client, author) {
  try {
    await client.sql`INSERT INTO authors (name)
	VALUES (${author})
	ON CONFLICT (id) DO NOTHING;`;
    console.log(`Added author: ${author}`);
  } catch (error) {
    console.error(`Failed to create author: ${author}`, error);
    throw error;
  }
}

async function createBooksTable(client) {
  try {
    await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
    await client.sql`
    CREATE TABLE IF NOT EXISTS books (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title VARCHAR(255) NOT NULL UNIQUE,
		category UUID NOT NULL,
		description TEXT NOT NULL,
		price FLOAT(53) NOT NULL,
		author UUID NOT NULL,
		publisher UUID NOT NULL,
		publish_date DATE NOT NULL,
		page_length INT NOT NULL,
		type VARCHAR(100) NOT NULL,
		imageUrl TEXT
  );
    `;

    console.log(`Created "books" table`);
  } catch (error) {
    console.error('Error creating books:', error);
    throw error;
  }
}

async function dropBooksTable(client) {
  try {
    await client.sql`DROP TABLE IF EXISTS books`;
    console.log(`DROPPED "books" table`);
  } catch (error) {
    console.error('Failed to drop "books":', error);
    throw error;
  }
}

//new Date(new Date().toISOString())

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
    await client.sql`INSERT INTO books (title, category, description, price, author, publisher, publish_date, page_length, type, imageUrl)
	VALUES (${title}, ${category}, ${description}, ${price}, ${author}, ${publisher}, ${publishDate}, ${pageLength}, ${type}, ${imageUrl})
	ON CONFLICT (id) DO NOTHING;`;
  } catch (error) {
    console.error(`Failed to create a book: ${title}:`, error);
    throw error;
  }
}

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

async function createPublishersTable(client) {
  try {
    await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
    await client.sql`
    CREATE TABLE IF NOT EXISTS publishers (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    description TEXT NOT NULL,
		name VARCHAR(255) NOT NULL UNIQUE
  );
    `;

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
