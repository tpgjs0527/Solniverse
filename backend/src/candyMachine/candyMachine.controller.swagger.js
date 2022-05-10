const { StatusCodes } = require("http-status-codes");

const candyMachineControllerSwagger = {
  "/candyMachine": {
    post: {
      tags: ["CandyMachine"],
      summary: "캔디머신 정보를 admin계정 주소, signature와 함께 보내고 등록함",
      description: "",
      requestBody: {
        description:
          "캔디머신 publicKey, name, admin walletAddress, signature 정보를 보냄",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                publicKey: {
                  type: "string",
                  example: "캔디머신 publicKey",
                },
                name: {
                  type: "string",
                  example: "보낼 내용",
                },
                walletAddress: {
                  type: "string",
                  example: "admin의 지갑주소",
                },
                signature: {
                  type: "string",
                  example: "admin이 서명한 bs58 문자열",
                },
              },
            },
          },
        },
        required: true,
      },
      security: [],
      produces: "application/json",
      responses: {
        [StatusCodes.OK]: {
          $ref: "#/components/schemas/success",
        },
        [StatusCodes.BAD_REQUEST]: {
          $ref: "#/components/schemas/badRequest",
        },
      },
    },
    get: {
      tags: ["CandyMachine"],
      summary: "캔디머신 리스트를 조회함.",
      description: "",
      security: [],
      produces: "application/json",
      responses: {
        [StatusCodes.OK]: {
          description:
            "요청을 토대로 트랜잭션 임시저장 후 txid 및 shopAddress 반환",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  result: { type: "string", example: "success" },
                  candyMachines: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        publicKey: {
                          type: "string",
                          example: "캔디머신 publicKey 주소",
                        },
                        name: {
                          type: "string",
                          example: "캔디머신 이름",
                        },
                      },
                    },
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
};

module.exports = candyMachineControllerSwagger;
