const express = require('express');
const app = express();
const sequelize = require('./db/connection');

app.use(express.json()); 


const apiRoutes = require('./routes/api');
app.use('/api', apiRoutes);

sequelize.sync()
  .then(() => {
    const port = process.env.PORT || 3000;
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((err) => {
    console.error('An error occurred while synchronizing the database:', err);
  });
