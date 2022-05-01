const { StatusCodes } = require("http-status-codes");

const donationControllerSwagger = {
  "/donation/send": {
    post: {
      tags: ["Donation"],
      summary: "도네이션 정보를 보내고 해당 txid를 반환받음",
      description: "",
      requestBody: {
        description:
          "후원표시이름, 메시지, 플랫폼 정보를 보냄. 제한(현재 100kb)",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                displayName: {
                  type: "string",
                  description: "스트리머에게 표시할 이름",
                  example: "표시이름",
                },
                message: {
                  type: "string",
                  description: "메시지",
                  example: "보낼 내용",
                },
                platform: {
                  type: "string",
                  description: "플랫폼",
                  enum: ["", "twitch"],
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
          description:
            "요청을 토대로 트랜잭션 임시저장 후 txid 및 shopAddress 반환",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  result: { type: "string", example: "success" },
                  txid: {
                    type: "string",
                    example: "0000000000000000000",
                  },
                  shopAddress: {
                    type: "string",
                    example: "C11hWWx6Zhn4Vhx1qpbnFazWQYNpuz9CFv269QC4vDba",
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

module.exports = donationControllerSwagger;
