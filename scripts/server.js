const express = require("express");
const cors = require("cors");
const apiRoutes = require("./backend/routes/congress");

const app = express();
app.use(cors());

app.use("/api", apiRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});

