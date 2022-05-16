import styled from "styled-components";
import Layout from "components/Layout";
import { createSearchParams, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useRecoilValue } from "recoil";
import { userInfoAtom } from "atoms";
import Swal from "sweetalert2";
import { getBalance } from "utils/solanaWeb3";
import { getProvider } from "utils/getProvider";
import { fetchWallet } from "utils/fetcher";

interface IDonation {
  nickname: string;
  amount: number;
  message: string;
}

function Donation() {
  const navigate = useNavigate();
  const userInfo = useRecoilValue(userInfoAtom);
  const { walletAddress } = useParams();
  const [nickName, setNickName] = useState("");
  const [amount, setAmount] = useState(0);
  const [type, setType] = useState("SOL");
  const [message, setMessage] = useState("");
  const [creatorName, setCreatorName] = useState("");
  const [creatorImgUrl, setCreatorImgUrl] = useState("");
  const params = {
    amount: amount.toString(),
    nickName,
    creatorName,
    message,
    walletAddress: walletAddress!.toString(),
    type,
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IDonation>({ mode: "onBlur" });

  const handleAmount = (e: any) => {
    e.preventDefault();
    setAmount(e.target.value);
  };
  const onClick = () => {
    // navigate({
    //   pathname: "/payment",
    //   search: `?amount=${amount}&nickName=${nickName}&message=${message}`,
    // });
    console.log(type);
    if (userInfo.walletAddress) {
      navigate({
        pathname: "/payment",
        search: `?${createSearchParams(params)}`,
      });
    } else {
      alert("지갑 연결이 필요합니다. 상단 메뉴바에서 지갑연결을 해주세요.");
    }
    // alert("도네이션을 진행하겠습니다");
  };
  console.log(nickName, amount, message, walletAddress);

  const onSubmit = (e: any) => {
    setType(e.target.value);
  };

  const getCreatorInfo = async (walletAddress: string) => {
    const provider = getProvider();

    if (provider) {
      const response = await provider.connect();
      console.log(response);

      try {
        const res = await fetchWallet(walletAddress!.toString());
        if (res.status >= 200 && res.status < 400) {
          const data = await res.json();
          return data;
        } else {
          const error = new Error(res.statusText);
          throw error;
        }
      } catch (error) {
        console.log(error);
        const res = await fetchWallet(walletAddress!.toString(), "POST");
        if (res.status >= 200 && res.status < 400) {
          const data = await res.json();
          console.log(data);
          return data;
        } else {
          const error = new Error(res.statusText);
          console.log(error);
          alert("지갑 연결이 안됩니다");
        }
      }
    } else {
      alert("팬텀 지갑 확장 프로그램을 확인해주세요!");
    }
  };

  useEffect(() => {
    const getAsyncCreatorInfo = async () => {
      const creatorInfo = await getCreatorInfo(walletAddress!);
      console.log(creatorInfo);
      setCreatorName(creatorInfo.user.twitch.displayName);
      setCreatorImgUrl(creatorInfo.user.twitch.profileImageUrl);
    };
    getAsyncCreatorInfo();
    console.log(creatorName, creatorImgUrl);
  }, [creatorName, creatorImgUrl]);

  useEffect(() => {
    const getAsyncSol = async () => {
      const sol = await getBalance(userInfo.walletAddress);
      if (sol < amount) {
        Swal.fire({
          title:
            "The Donation price is higher than your wallet has. Please set the price again 😊",
          showClass: {
            popup: "animate__animated animate__fadeInDown",
          },
          hideClass: {
            popup: "animate__animated animate__fadeOutUp",
          },
        });
        // alert("현재 잔액보다 높은 금액을 설정하셨습니다. SOL을 충전해주세요.");
        setAmount(0);
      }
    };
    getAsyncSol();
  }, [amount]);
  console.log(type);

  return (
    <Layout>
      <Container>
        <DonationWrapper>
          <CreatorWrapper>
            <CreatorInfoWrapper>
              <CreatorProfileImage src={creatorImgUrl} />
              <CreatorName>{creatorName}님께 후원</CreatorName>
            </CreatorInfoWrapper>
            <CreatorImage />
            <CreatorContent>❤솔둥이들 사랑해요❤</CreatorContent>
          </CreatorWrapper>
        </DonationWrapper>
        <DonationForm>
          <DonatorWrapper>
            <DonateNameWrapper>
              <DonateInputName>후원닉네임</DonateInputName>
            </DonateNameWrapper>
            <DonateInputWrapper>
              <Input
                {...register("nickname", {
                  required: "필수 입력정보입니다.",
                  pattern: {
                    value: /^[가-힣a-zA-Z0-9]{2,15}$/,
                    message:
                      "2~15자의 한글, 영문 대 소문자, 숫자만 사용 가능합니다.",
                  },
                  onChange: (e) => {
                    setNickName(e.target.value);
                  },
                })}
                placeholder="후원닉네임을 입력해주세요."
              />
            </DonateInputWrapper>
          </DonatorWrapper>
          <DonatorWrapper>
            <DonateNameWrapper>
              <DonateInputName>후원금액</DonateInputName>
            </DonateNameWrapper>
            <DonateInputWrapper>
              <Input
                {...register("amount", {
                  required: "필수 입력정보입니다.",
                  pattern: {
                    value: /^[0-9]*$/,
                    message: "숫자만 입력 가능합니다.",
                  },
                  onChange: (e) => {
                    setAmount(e.target.value);
                  },
                })}
                value={`${amount}`}
                style={{ display: "flex", justifyContent: "space-between" }}
                placeholder="후원금액을 입력해주세요."
              />
              <Select onChange={onSubmit}>
                <Option value="SOL">SOL</Option>
                <Option value="USDC">USDC</Option>
              </Select>
            </DonateInputWrapper>
          </DonatorWrapper>
          <PriceButtonWrapper>
            <DonatePriceButton value="0.01" onClick={handleAmount}>
              0.01
            </DonatePriceButton>
            <DonatePriceButton value="0.05" onClick={handleAmount}>
              0.05
            </DonatePriceButton>
            <DonatePriceButton value="0.1" onClick={handleAmount}>
              0.1
            </DonatePriceButton>
            <DonatePriceButton value="0.5" onClick={handleAmount}>
              0.5
            </DonatePriceButton>
            <DonatePriceButton value="1" onClick={handleAmount}>
              1
            </DonatePriceButton>
            <DonatePriceButton value="5" onClick={handleAmount}>
              5
            </DonatePriceButton>
            <DonatePriceButton value="10" onClick={handleAmount}>
              10
            </DonatePriceButton>
            <DonatePriceButton
              style={{ marginRight: "0px" }}
              value="20"
              onClick={handleAmount}
            >
              20
            </DonatePriceButton>
          </PriceButtonWrapper>
          <DonatorWrapper>
            <DoateMessageWrapper>
              <DonateMessageName>후원메시지</DonateMessageName>
            </DoateMessageWrapper>
            <DonateInputWrapper>
              <MessageTextarea
                {...register("message", {
                  required: "필수 입력정보입니다.",
                  onChange: (e) => {
                    setMessage(e.target.value);
                  },
                })}
                placeholder="후원메시지를 작성해주세요."
              />
            </DonateInputWrapper>
          </DonatorWrapper>
        </DonationForm>
        <DonationWrapper>
          <DonatorWrapper>
            <TotalPrice>Total</TotalPrice>
            <TotalUSDC>
              {amount} {type}
            </TotalUSDC>
          </DonatorWrapper>
        </DonationWrapper>
        <DonationWrapper>
          <ButtonWrapper>
            <DonateButton onClick={onClick}>Donate</DonateButton>
            {/* <DonateButton onClick={Donate}>Donate</DonateButton> */}
          </ButtonWrapper>
        </DonationWrapper>
      </Container>
    </Layout>
  );
}

const Container = styled.div`
  margin-top: 32px;

  @media screen and (max-width: 691px) {
    margin-top: 16px;
  }
`;

const DonationWrapper = styled.div`
  margin-bottom: 32px;
`;

const DonationForm = styled.form`
  margin-bottom: 32px;
  border-bottom: 1px solid ${(props) => props.theme.borderColor};
`;

const CreatorWrapper = styled.div``;
const CreatorName = styled.div`
  font-size: 32px;
  font-weight: bold;
  @media screen and (max-width: 691px) {
    font-size: 24px;
  }
`;
const CreatorContent = styled.div`
  font-size: 24px;
  @media screen and (max-width: 691px) {
    font-size: 18px;
  }
`;
const CreatorInfoWrapper = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 8px;
`;
const CreatorProfileImage = styled.img`
  width: 50px;
  border-radius: 30px;
  margin-right: 8px;
`;
const CreatorImage = styled.img.attrs({
  src: `${process.env.PUBLIC_URL}/헤이.png`,
})`
  width: 100%;
  height: auto;
`;

const DonatorWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 24px;
  @media screen and (max-width: 691px) {
    margin-bottom: 12px;
  }
`;

const Select = styled.select`
  width: 30%;
  height: 40px;
  border-radius: 4px;
  /* border-width: 1px; */
  /* border-color: whitesmoke; */
  border: 1px solid ${(props) => props.theme.borderColor};
  font-size: 16px;
  color: ${(props) => props.theme.subTextColor};
  background-color: ${(props) => props.theme.boxColor};
  /* font-weight: bold; */
  margin-left: 4px;
  @media screen and (max-width: 691px) {
    font-size: 14px;
  }
`;
const Option = styled.option`
  width: 30%;
  height: 40px;
  border-radius: 4px;
  /* border-width: 1px; */
  /* border-color: whitesmoke; */
  border: 1px solid ${(props) => props.theme.borderColor};
  font-size: 16px;
  color: ${(props) => props.theme.subTextColor};
  background-color: ${(props) => props.theme.boxColor};
  /* font-weight: bold; */
  @media screen and (max-width: 691px) {
    font-size: 14px;
  }
`;

const PriceButtonWrapper = styled.div`
  display: flex;
  justify-content: right;
  margin-bottom: 32px;
`;

const DonatePriceButton = styled.button`
  width: 20%;
  height: 30px;
  color: #ffffff;
  background-color: ${(props) => props.theme.ownColor};
  border: none;
  border-radius: 20px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  margin-right: 8px;
  @media screen and (max-width: 691px) {
    font-size: 12px;
    margin-right: 4px;
  }
`;

const DonateInputName = styled.div`
  display: flex;
  align-items: center;
  font-size: 16px;
  width: 100%;
  @media screen and (max-width: 691px) {
    font-size: 14px;
  }
`;
const DoateMessageWrapper = styled.div`
  display: flex;
  margin-top: 3px;
  font-size: 16px;
  width: 20%;
  @media screen and (max-width: 691px) {
    font-size: 14px;
  }
`;

const DonateMessageName = styled.div`
  font-size: 16px;
  @media screen and (max-width: 691px) {
    font-size: 14px;
    margin-top: 3px;
  }
`;
const DonateNameWrapper = styled.div`
  display: flex;
  align-items: center;
  font-size: 16px;
  width: 20%;
  @media screen and (max-width: 691px) {
    font-size: 14px;
  }
`;
const DonateInputWrapper = styled.div`
  width: 80%;
  display: flex;
`;

const Input = styled.input`
  width: 100%;
  height: 40px;
  border-radius: 4px;
  /* border-width: 1px; */
  /* border-color: whitesmoke; */
  border: 1px solid ${(props) => props.theme.borderColor};
  font-size: 16px;
  color: ${(props) => props.theme.subTextColor};
  background-color: ${(props) => props.theme.boxColor};
  /* font-weight: bold; */
  @media screen and (max-width: 691px) {
    font-size: 14px;
  }
`;
const MessageTextarea = styled.textarea`
  width: 100%;
  height: 100px;
  border-radius: 4px;
  border: 1px solid ${(props) => props.theme.borderColor};
  font-size: 16px;
  color: ${(props) => props.theme.subTextColor};
  background-color: ${(props) => props.theme.boxColor};
  @media screen and (max-width: 691px) {
    font-size: 14px;
  }
`;

const TotalPrice = styled.div`
  font-size: 20px;
  font-weight: bold;
  @media screen and (max-width: 691px) {
    font-size: 16px;
  }
`;
const TotalUSDC = styled.div`
  font-size: 24px;
  font-weight: bold;
  @media screen and (max-width: 691px) {
    font-size: 20px;
  }
`;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
`;
const DonateButton = styled.button`
  width: 30%;
  height: 40px;
  color: #ffffff;
  background-color: ${(props) => props.theme.ownColor};
  border: none;
  border-radius: 5px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
`;

export default Donation;
