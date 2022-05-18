const socketio = require("socket.io");
const logger = require("./config/logger");
const io = socketio();

const UserRepository = require("./src/auth/user.repository");
const userRepository = new UserRepository();

/** 객체이기에 참조전달이므로 값이 변해도 적용됨. */
const sockapp = { io };

/**
 * 이 부분은 controller, service, repository 패턴으로 작성할 수 없음.
 * repository만 사용하는 것으로 통일하고 function이 복잡해지면 선언형으로 처리
 */
io.on("connection", async function (socket) {
  const userKey = socket.handshake.query.userKey;
  try {
    const { walletAddress } = await userRepository.getWalletAddressByUserKey(
      userKey,
    );
    if (!walletAddress) {
      socket.disconnect(true);
      return;
    }
    //연결된 소켓을 user._id로 emit받기 위해서 room에 입장.
    socket.join(walletAddress.toString());
    /**
     * 연결 체크 완료
     */
    logger.info(`유저가 소켓 연결함: wallet=${walletAddress.toString()}`);
  } catch (err) {
    socket.disconnect(true);
  }
});

module.exports = sockapp;
