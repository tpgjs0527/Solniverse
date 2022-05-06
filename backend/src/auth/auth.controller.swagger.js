const { StatusCodes } = require("http-status-codes");

const authControllerSwagger = {
  "/auth/accessToken": {
    get: {
      tags: ["Auth"],
      summary: "액세스 토큰을 인증함.",
      description: "",
      parameters: [],
      security: [{ bearerAuth: [] }],
      responses: {
        [StatusCodes.OK]: {
          $ref: "#/components/schemas/success",
        },
        [StatusCodes.BAD_REQUEST]: {
          $ref: "#/components/schemas/badRequest",
        },
        [StatusCodes.UNAUTHORIZED]: {
          $ref: "#/components/schemas/jwtExpired",
        },
      },
    },
  },
  "/auth/connect": {
    post: {
      tags: ["Auth"],
      summary:
        "WalletAddress와 signature를 request body로 받아 인증을 거쳐 jwt access token refresh token 반환",
      security: [],
      requestBody: {
        description: "지갑주소(기본이 base58)와 signature(base58)을 받음.",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                walletAddress: {
                  type: "string",
                  example: "walletAddress",
                },
                signature: {
                  type: "string",
                  example: "base58-based signature",
                },
              },
            },
          },
        },
        required: true,
      },
      responses: {
        [StatusCodes.OK]: {
          description: "accessToken(Body)와 refreshToken(Cookie)를 반환한다.",
          headers: {
            "Set-Cookie": {
              schema: {
                type: "string",
                example:
                  "refreshtoken=asdf2189371293...; Path=/; HttpOnly; SameSite",
              },
            },
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    result: {
                      type: "string",
                      example: "success",
                    },
                    accessToken: {
                      type: "string",
                      example: "jwt access token",
                    },
                  },
                },
              },
            },
          },
          [StatusCodes.BAD_REQUEST]: {
            $ref: "#/components/schemas/badRequest",
          },
        },
      },
    },
  },
  "/auth/connect/{walletAddress}": {
    post: {
      tags: ["Auth"],
      summary: "회원 정보를 DB에 저장한다.",
      parameters: [
        {
          name: "walletAddress",
          in: "path",
          description: "지갑 주소",
          required: true,
          schema: {
            type: "string",
          },
        },
      ],
      security: [],
      responses: {
        [StatusCodes.OK]: {
          description:
            "공개 가능 유저 정보. 여기에선 플랫폼 정보들은 보이지 않음",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  result: { type: "string", example: "success" },
                  user: { $ref: "#/components/schemas/user" },
                },
              },
            },
          },
        },
        [StatusCodes.BAD_REQUEST]: {
          $ref: "#/components/schemas/badRequest",
        },
        [StatusCodes.CONFLICT]: {
          $ref: "#/components/schemas/conflict",
        },
      },
    },
    get: {
      tags: ["Auth"],
      summary: "회원 정보를 DB에 저장한다.",
      parameters: [
        {
          name: "walletAddress",
          in: "path",
          description: "지갑 주소",
          required: true,
          schema: {
            type: "string",
          },
        },
      ],
      security: [],
      responses: {
        [StatusCodes.OK]: {
          description: "공개 가능 유저 정보",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  result: { type: "string", example: "success" },
                  user: { $ref: "#/components/schemas/user" },
                },
              },
            },
          },
        },
        [StatusCodes.BAD_REQUEST]: {
          $ref: "#/components/schemas/badRequest",
        },
        [StatusCodes.NOT_FOUND]: {
          $ref: "#/components/schemas/notFound",
        },
      },
    },
  },
  "/auth/refresh": {
    post: {
      tags: ["Auth"],
      summary: "RefreshToken을 이용해 AccessToken을 갱신받는다.",
      security: [{ cookieAuth: [] }],
      requestBody: {
        description: "지갑주소가 필요함",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                walletAddress: {
                  type: "string",
                  example: "walletAddress",
                },
              },
            },
          },
        },
        required: true,
      },
      responses: {
        [StatusCodes.OK]: {
          description: "액세스 토큰 반환",
          content: {
            "application/json": {
              type: "object",
              properties: {
                accessToken: {
                  type: "string",
                  example: "jwt access token",
                },
              },
            },
          },
        },
        [StatusCodes.BAD_REQUEST]: {
          $ref: "#/components/schemas/badRequest",
        },
        [StatusCodes.UNAUTHORIZED]: {
          $ref: "#/components/schemas/unauthorized",
        },
      },
    },
  },
  "/auth/sign/{walletAddress}": {
    get: {
      tags: ["Auth"],
      summary: "Sign할 평문을 반환한다.",
      parameters: [
        {
          name: "walletAddress",
          in: "path",
          description: "지갑 주소",
          required: true,
          schema: {
            type: "string",
          },
        },
      ],
      security: [],
      responses: {
        [StatusCodes.OK]: {
          description: "signMessage 반환",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  result: { type: "string", example: "success" },
                  signMessage: {
                    type: "string",
                    example:
                      "Sign this message for authenticating with your wallet. Nonce: 2ejsdafji3...",
                  },
                },
              },
            },
          },
        },
        [StatusCodes.BAD_REQUEST]: {
          $ref: "#/components/schemas/badRequest",
        },
        [StatusCodes.NOT_FOUND]: {
          $ref: "#/components/schemas/notFound",
        },
      },
    },
  },
  "/auth/userKey": {
    get: {
      tags: ["Auth"],
      summary: "액세스 토큰으로 유저 키를 요청함",
      description: "",
      parameters: [],
      security: [{ bearerAuth: [] }],
      responses: {
        [StatusCodes.OK]: {
          description: "userKey(길이: 32) 반환",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  result: { type: "string", example: "success" },
                  userKey: {
                    type: "string",
                    example: "aaaabbbbccccddddeeeeffffgggghhhh",
                  },
                },
              },
            },
          },
        },
        [StatusCodes.BAD_REQUEST]: {
          $ref: "#/components/schemas/badRequest",
        },
        [StatusCodes.UNAUTHORIZED]: {
          $ref: "#/components/schemas/jwtExpired",
        },
        [StatusCodes.NOT_FOUND]: {
          $ref: "#/components/schemas/notFound",
        },
      },
    },
  },
  "/auth/oauth": {
    post: {
      tags: ["Auth"],
      summary: "액세스 토큰으로 트위치 연동을 요청함",
      description: "",
      security: [{ bearerAuth: [] }],
      requestBody: {
        description: "twitch authorization code를 받음.",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                code: {
                  type: "string",
                  example: "twitch authorization code",
                },
              },
            },
          },
        },
        required: true,
      },
      responses: {
        [StatusCodes.OK]: {
          description: "변경된 공개 가능 유저 정보",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  result: { type: "string", example: "success" },
                  user: { $ref: "#/components/schemas/user" },
                },
              },
            },
          },
        },
        [StatusCodes.BAD_REQUEST]: {
          $ref: "#/components/schemas/badRequest",
        },
        [StatusCodes.UNAUTHORIZED]: {
          $ref: "#/components/schemas/jwtExpired",
        },
        [StatusCodes.NOT_FOUND]: {
          $ref: "#/components/schemas/notFound",
        },
      },
    },
  },
};

module.exports = authControllerSwagger;
