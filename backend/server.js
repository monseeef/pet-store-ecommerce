const app = require('./app');
const { PORT } = require('./config/env');

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
