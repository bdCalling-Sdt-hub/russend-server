const app = require("./app");
const socketIO = require("./helpers/socketIO");
require("dotenv").config();

const port = process.env.PORT || 3001;

const server = app.listen(port, () => {
  console.log(`Russend Server is listening on port: ${port}`);
});

//initializing socket io
const socketIo = require("socket.io");
const io = socketIo(server, {
  cors: {
    origin: "*",
    //[
    //   process.env.ALLOWED_CLIENT_URL_DASHBOARD,
    //   process.env.ALLOWED_CLIENT_URL_WEB,
    //   process.env.ALLOWED_CLIENT_URL_SUB_DASHBOARD
    // ]
  },
});

socketIO(io);

global.io = io;

// 240901-014	September 1, 2024 at 12:00 PM	tuiio fyu	+2428966	Repubilc of Congo	35555
