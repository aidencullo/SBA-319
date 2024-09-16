import connectDB from './db/connect.js';
import seedData from './db/seed.js';

import app from './app.js';

app.listen(3000, async () => {
  console.log('Server is running on port 3000');
  connectDB();
  await seedData();
});
