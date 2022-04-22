/**
 * Services Logics related to Digital Assets(item)
 * Service/Repository 레이어의 함수를 호출해야합니다.
 *
 * @format
 */

const UserRepository = require("./user.repository");
const userRepository = new UserRepository();

class AuthService {
  async insertUserInfo(req) {
		return {
			statusCode: 200,
			responseBody: {
				result: 'success',
				itemId: 0
			}
		}
	}
}

module.exports = AuthService;
