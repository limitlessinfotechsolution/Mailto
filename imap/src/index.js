import net from 'net';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import { User, Folder, Message, logger } from '@mailo/shared';

dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/mailo')
  .then(() => console.log('MongoDB Connected (IMAP)'))
  .catch(err => console.error('MongoDB Connection Error:', err));

const CAPABILITIES = 'IMAP4rev1 AUTH=PLAIN LITERAL+ SASL-IR';

const server = net.createServer((socket) => {
  logger.info('IMAP Client connected');
  
  socket.write(`* OK [CAPABILITY ${CAPABILITIES}] MailO IMAP4rev1 Service Ready\r\n`);

  let user = null;
  let selectedFolder = null;
  let buffer = '';

  socket.on('data', async (chunk) => {
    buffer += chunk.toString();
    
    // Process lines
    let lineEnd;
    while ((lineEnd = buffer.indexOf('\r\n')) !== -1) {
      const line = buffer.substring(0, lineEnd);
      buffer = buffer.substring(lineEnd + 2);
      
      if (line.length > 0) {
        await handleCommand(socket, line);
      }
    }
  });

  socket.on('end', () => {
    logger.info('IMAP Client disconnected');
  });

  socket.on('error', (err) => {
    logger.error('IMAP Socket Error', err);
  });

  const handleCommand = async (socket, line) => {
    const parts = line.split(' ');
    const tag = parts[0];
    const command = parts[1].toUpperCase();
    const args = parts.slice(2);

    try {
      switch (command) {
        case 'CAPABILITY':
          socket.write(`* CAPABILITY ${CAPABILITIES}\r\n`);
          socket.write(`${tag} OK CAPABILITY completed\r\n`);
          break;

        case 'LOGIN':
          if (args.length < 2) {
            socket.write(`${tag} BAD Invalid arguments\r\n`);
            return;
          }
          // Handle quoted strings roughly
          const username = args[0].replace(/"/g, '');
          const password = args[1].replace(/"/g, '');
          
          const dbUser = await User.findOne({ email: username });
          if (dbUser && await bcrypt.compare(password, dbUser.passwordHash)) {
            user = dbUser;
            socket.write(`${tag} OK [CAPABILITY ${CAPABILITIES}] LOGIN completed\r\n`);
            logger.info(`User ${username} logged in`);
          } else {
            socket.write(`${tag} NO [AUTHENTICATIONFAILED] Invalid credentials\r\n`);
          }
          break;

        case 'LOGOUT':
          socket.write(`* BYE IMAP4rev1 Server logging out\r\n`);
          socket.write(`${tag} OK LOGOUT completed\r\n`);
          socket.end();
          break;

        case 'LIST':
          if (!user) {
            socket.write(`${tag} NO Not authenticated\r\n`);
            return;
          }
          const folders = await Folder.find({ user: user._id });
          for (const folder of folders) {
            socket.write(`* LIST (\\HasNoChildren) "/" "${folder.name}"\r\n`);
          }
          socket.write(`${tag} OK LIST completed\r\n`);
          break;

        case 'SELECT':
          if (!user) {
            socket.write(`${tag} NO Not authenticated\r\n`);
            return;
          }
          const folderName = args[0].replace(/"/g, '');
          selectedFolder = await Folder.findOne({ user: user._id, name: folderName });
          
          if (selectedFolder) {
            const count = await Message.countDocuments({ folder: selectedFolder._id });
            socket.write(`* ${count} EXISTS\r\n`);
            socket.write(`* ${count} RECENT\r\n`);
            socket.write(`* OK [UNSEEN 0] Message 0 is first unseen\r\n`);
            socket.write(`* OK [UIDVALIDITY ${Date.now()}] UIDs valid\r\n`);
            socket.write(`* FLAGS (\\Answered \\Flagged \\Deleted \\Seen \\Draft)\r\n`);
            socket.write(`${tag} OK [READ-WRITE] SELECT completed\r\n`);
          } else {
            socket.write(`${tag} NO Folder not found\r\n`);
          }
          break;

        default:
          socket.write(`${tag} BAD Command not understood\r\n`);
          break;
      }
    } catch (err) {
      logger.error('IMAP Command Error', err);
      socket.write(`${tag} NO Internal error\r\n`);
    }
  };
});

const PORT = 143;
server.listen(PORT, () => {
  console.log(`IMAP Server running on port ${PORT}`);
});
