-- Let's create a simple database to save some data around stores and products.
-- In this example, a store has many products, but a product is tied to a single
-- store. In this same directory is a script that will generate lots of store
-- and product data, so be sure to run the commands in the README and generate
-- data.

-- From here, a store is just an ID and a name, while a product has an ID, name,
-- price, and the store_id that it belongs to. Run these queries first.
CREATE DATABASE product_data;

CREATE TABLE store (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(50)
);

CREATE TABLE product (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(50),
    price FLOAT,
    store_id VARCHAR(50) REFERENCES store(id)
);

-- Then, run the node script following the instructions in the README.
-- Once you do, you'll have two files: stores.sql and products.sql.
-- Run both of those SQL files, which will insert 1,000 stores and 1,000,000
-- products into those two tables.

-- Once you do, this query should give us 1,000 stores...
SELECT COUNT(*) FROM store;

-- And this one should give us 1,000,000 products
SELECT COUNT(*) FROM product;

-- Now let's take the ID of the first store. The LIMIT keyword limits the
-- number of results to some amount, in this case 1:
SELECT id FROM store
LIMIT 1;

-- And use it to filter for products that belong to that store. We should get
-- roughly +/- 1,000 products here, since they were randomly assigned stores.
SELECT COUNT(*) FROM product
WHERE store_id = (
    SELECT id FROM store LIMIT 1
);

-- store_id is a foreign key on product, and thus gets an index by default.
-- Querying for things against an index is fast! This is because the DB can
-- load a B-tree index in memory and query for records that match the condition
-- using that in-memory data structure. Those leaves in the B-tree point to records
-- on disk, so rather than loading EVERY record to see IF a condition is satisfied,
-- we DEFER loading those records until we KNOW they match a condition.
SELECT * FROM product
WHERE store_id = (
    SELECT id FROM store LIMIT 1
);

-- Let's dive into a query using an EXPLAIN query.
EXPLAIN SELECT * FROM product
WHERE store_id = (
    SELECT id FROM store LIMIT 1
);

-- This gives a breakdown of how the engine approaches a query. We see there are
-- two records, because there are two queries. One is a subquery, which runs against
-- the primary key. The other is a query that runs against a store_id foreign key,
-- which is backed by an index. In both cases, rows is under 1,000 entries because
-- there are 1000 unique store ID's

-- Now let's look at this query, which filters for products based on a price. We
-- see that the various key columns are all null. So those 1,000,000 rows are going
-- to have to be loaded from disk before we apply a condition... Yikes.
EXPLAIN SELECT * FROM product
WHERE price < 500;

-- But we expect this to be a frequently used filter by our customers, so let's
-- add an index!
ALTER TABLE product
ADD INDEX product_price (`price`);

-- If we run the same EXPLAIN statement, we now see that it will reference a key called
-- product_price, which is our new index. It still has to scan all 1,000,000 rows,
-- but this index will be MUCH lighter in terms of memory usage and can be stored
-- and queried all in memory.
EXPLAIN SELECT * FROM product
WHERE price < 500;

-- So there's a tradeoff: better performance at the expense of memory usage. So to
-- determine whether or not an index is worth it, consider the question:
-- How often will users query based on the value in this column? If the answer
-- is "regularly", then an index can be worth it. How "regular" is "enough" is
-- entirely up to you, the size of your dataset, the amount of traffic you get,
-- and much more, so it can be tricky to confidently say it's needed.

-- If we want to remove the index, we can run the following
ALTER TABLE product
DROP INDEX product_price;
