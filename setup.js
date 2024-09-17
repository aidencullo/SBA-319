import { connectDb, disconnectDb } from './db/connect.js';

before(async () => {
  await connectDb();
});

after(async function () {
  await disconnectDb();
});
