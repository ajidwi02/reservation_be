const express = require("express");
app.use(express.json());

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server Listening on PORT:", port);
});

app.get(
  "/status",
  app.get("/status", (request, response) => {
    const status = {
      Status: "Running",
    };

    response.send(status);
  })
);
