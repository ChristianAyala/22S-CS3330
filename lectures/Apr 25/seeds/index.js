const { seed: seed0 } = require('./000_clear_db');
const { seed: seed1 } = require('./001_users');

const runSeeds = async () => {
    await seed0();
    await seed1();
}

runSeeds();