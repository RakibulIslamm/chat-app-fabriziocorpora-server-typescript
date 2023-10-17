'use strict';
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator['throw'](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
const http_1 = __importDefault(require('http'));
const app_1 = __importDefault(require('./app/app'));
const mongoose_1 = __importDefault(require('mongoose'));
const config_1 = __importDefault(require('./config'));
const socket_io_1 = require('socket.io');
const message_model_1 = __importDefault(
  require('./app/modules/message/message.model')
);
const user_model_1 = __importDefault(require('./app/modules/user/user.model'));
const server = http_1.default.createServer(app_1.default);
const io = new socket_io_1.Server(server, {
  pingTimeout: 60000,
  pingInterval: 25000,
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  },
});
function run() {
  return __awaiter(this, void 0, void 0, function* () {
    try {
      const conn = yield mongoose_1.default.connect(
        config_1.default.database_url
      );
      console.log(`Database connected on host: ${conn.connection.host}`);
      server.listen(config_1.default.port, () => {
        console.log(`Server listening on port ${config_1.default.port}`);
      });
    } catch (error) {
      if (error instanceof Error) {
        console.log(`Database connection error: ${error.message}`.bgRed);
      } else {
        console.log(error);
      }
    }
    process.on('unhandledRejection', error => {
      if (server) {
        server.close(() => {
          console.log('unhandled');
          console.log(error);
          process.exit(1);
        });
      } else {
        console.log(error);
        process.exit(1);
      }
    });
  });
}
run();
io.on('connection', socket => {
  //* New user
  socket.on('new_user', function (id) {
    return __awaiter(this, void 0, void 0, function* () {
      socket.userId = id;
      const user = yield user_model_1.default.findByIdAndUpdate(
        id,
        { status: 'online' },
        { new: true }
      );
      if (user) {
        io.emit('online', user._id);
      }
    });
  });
  //* Heartbeat
  socket.on('heartbeat', () => {
    // console.log(socket.userId);
  });
  //* Leave user
  socket.on('leavedUser', id =>
    __awaiter(void 0, void 0, void 0, function* () {
      const user = yield user_model_1.default.findByIdAndUpdate(
        id,
        { status: 'offline', lastActive: Date.now() },
        { new: true }
      );
      if (user) {
        io.emit('offline', { id: user._id, lastActive: user.lastActive });
      }
    })
  );
  //* Disconnect
  socket.on('disconnect', () =>
    __awaiter(void 0, void 0, void 0, function* () {
      const user = yield user_model_1.default.findByIdAndUpdate(
        socket.userId,
        { status: 'offline', lastActive: Date.now() },
        { new: true }
      );
      if (user) {
        io.emit('offline', { id: user._id, lastActive: user.lastActive });
      }
    })
  );
  //* Message delivering
  socket.on('delivering', conversationId =>
    __awaiter(void 0, void 0, void 0, function* () {
      const filter = {
        conversationId: conversationId,
        status: 'sent',
      };
      const update = {
        $set: { status: 'delivered' },
      };
      const options = {
        multi: true,
      };
      const updateResult = yield message_model_1.default.updateMany(
        filter,
        update,
        options
      );
      if (updateResult.modifiedCount > 0) {
        io.emit('delivered', {
          delivered: true,
          convId: conversationId,
        });
      } else {
        io.emit('delivered', {
          delivered: false,
          convId: conversationId,
        });
      }
    })
  );
  //* Message seen
  socket.on('seen', ({ id, user }) =>
    __awaiter(void 0, void 0, void 0, function* () {
      const seenMessage = yield message_model_1.default.findByIdAndUpdate(
        id,
        { status: 'seen', $push: { seen: user } },
        { new: true }
      );
      io.emit('seen', { message: seenMessage, id });
    })
  );
});
process.on('SIGTERM', () => {
  console.log('Sigterm is received');
  if (server) {
    server.close();
  }
});
global.io = io;
exports.default = global;
