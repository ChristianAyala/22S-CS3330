const fs = require('fs');
const random = new (require('chance'));

const mixins = {
    store: (options = {}) => ({
        id: random.guid(),
        name: `Store ${random.word()}`,
        ...options
    }),
    product: (options = {}) => ({
        id: random.guid(),
        name: random.word(),
        price: random.floating({ min: 10, max: 1000 }),
        ...options,
    })
};

random.mixin(mixins);

console.log('Generating stores');
const stores = random.n(random.store, 1000);

console.log('Generating products');
const products = random.n(() => {
    return random.product({
        store_id: random.pickone(stores).id
    });
}, 1000000);

console.log('Creating store SQL');
const storeSQL = `INSERT INTO store (id, name) VALUES ${stores.map(store => `('${store.id}', '${store.name}')`).join(',\n')}`;
fs.writeFileSync('./stores.sql', storeSQL);

console.log('Creating product SQL');
const productSQL = `INSERT INTO product (id, name, price, store_id) VALUES ${products.map(product => `('${product.id}', '${product.name}', ${product.price}, '${product.store_id}')`).join(',\n')}`;
fs.writeFileSync('./products.sql', productSQL);
console.log('All done!');