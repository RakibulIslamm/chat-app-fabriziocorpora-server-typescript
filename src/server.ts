import 'colors';
import http from 'http';
import app from './app/app';
import mongoose from 'mongoose';
import config from './config';
import { Server, Socket } from 'socket.io';
import Message from './app/modules/message/message.model';
import User from './app/modules/user/user.model';
import Conversation from './app/modules/conversation/conversation.model';

declare module 'socket.io' {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface Socket {
    userId: string;
  }
}

const server = http.createServer(app);

const io = new Server(server, {
  pingTimeout: 60000,
  pingInterval: 25000,
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  },
});

async function run() {
  try {
    const conn = await mongoose.connect(config.database_url as string);
    console.log(`Database connected on host: ${conn.connection.host}`.bgBlue);
    server.listen(config.port, () => {
      console.log(`Server listening on port ${config.port}`);
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
}

run();

const connectedUsers: { [key: string]: Socket } = {};

io.on('connection', socket => {
  //* New user
  socket.on('new_user', async function (id) {
    socket.userId = id;
    connectedUsers[id] = socket;
    const user = await User.findByIdAndUpdate(
      id,
      { status: 'online' },
      { new: true }
    );
    if (user) {
      io.emit('online', user._id);
    }
  });

  //* Join room
  socket.on('room', id => {
    socket.join(id);
  });

  //* Heartbeat
  socket.on('heartbeat', () => {
    // console.log(socket.userId);
  });

  //* Leave user
  socket.on('leavedUser', async id => {
    delete connectedUsers[id];
    const user = await User.findByIdAndUpdate(
      id,
      { status: 'offline', lastActive: Date.now() },
      { new: true }
    );
    if (user) {
      io.emit('offline', { id: user._id, lastActive: user.lastActive });
    }
  });

  //* Disconnect
  socket.on('disconnect', async () => {
    delete connectedUsers[socket.userId];
    const user = await User.findByIdAndUpdate(
      socket.userId,
      { status: 'offline', lastActive: Date.now() },
      { new: true }
    );

    if (user) {
      io.emit('offline', { id: user._id, lastActive: user.lastActive });
    }
  });

  //* Message delivering
  socket.on('delivering', async conversationId => {
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
    const updateResult = await Message.updateMany(filter, update, options);
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
  });

  //* Message seen
  socket.on('seen-m', async ({ id, userId }) => {
    const seenMessage = await Message.findByIdAndUpdate(
      id,
      { status: 'seen', $push: { seen: userId } },
      { new: true }
    );
    io.emit('seen-m', { message: seenMessage, id });
  });

  //* unseen messages count seen
  socket.on('seen-c', async ({ conversationId, userId }) => {
    const conversation = await Conversation.findById(conversationId);

    if (conversation && conversation.sender !== userId) {
      const updateConversation = await Conversation.findByIdAndUpdate(
        conversationId,
        { unseenMessages: 0 },
        { new: true }
      );
      io.emit('seen-c', updateConversation);
    }
  });
});

export function findSocketByUserId(userId: string) {
  if (Object.prototype.hasOwnProperty.call(connectedUsers, userId)) {
    return connectedUsers[userId];
  }
  return null;
}

process.on('SIGTERM', () => {
  console.log('Sigterm is received');
  if (server) {
    server.close();
  }
});

declare const global: { io: Server };
global.io = io;
export default global;
