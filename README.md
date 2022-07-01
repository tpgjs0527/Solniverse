# README

# 1. Solniverse 서비스 이름 & 소개

## 1.1. 서비스 이름

### Solniverse

```
Solana 블록체인을 활용한 인터넷 방송 서드파티 후원 플랫폼
```

## 1.2. Overview

### 1) 기획배경

- 기존의 인터넷 방송 후원은 수수료가 너무 비싸다.
- 해외에 있는 스트리머에게 후원하기엔 Youtube 플랫폼 독점적인 서비스 말곤 어려움이 있다.
- 후원하는데 회원가입, 로그인, 충전, 인증의 절차를 거쳐 후원하는 불편함이 있다.

### 2) 고객층 & 서비스 내용

- 인터넷 스트리머
- 스트리머 후원자

### 3) 핵심 기능

- 도네이션 결제 기능
    - 인터넷 방송에 후원하기 위해 Solana Pay를 활용한 결제 시스템
    - Phantom Wallet으로 편리한 결제 기능
        - QR코드 결제
        - 모바일 결제
        - 크롬 익스텐션 결제
- 도네이션 확인 기능
    - Webhook을 통한 사용자 이벤트 감지 후, 소켓 socket 연결을 통한 도네이션 알림
    - 이벤트 감지 후, 해당 데이터를 저장해 그래프와 텍스트로 후원 내역 확인
- Gamification 기능
    - 서비스 이용을 활성화 시킬 수 있는 요소로 Gamification 적용
    - 유저 등급, 유저 랭킹, 포인트 제도, NFT Candy Drop 제공으로 서비스 이용 만족도 향상
- Elastic Stack을 활용한 Log 분석 시스템
    - 이동평균을 활용한 실시간 결제량 추이 파악
    - 결제 요청 대비 실제 결제량을 활용한 시스템 장애 모니터링

### 4) 기대효과

- 국가 제한 없는 이용
    - 세상 어느 곳에서도 이용할 수 있는 글로벌 도네이션 결제 플랫폼
- 제로 수수료
    - 0%대의 수수료로 이용할 수 있는 효율적인 서비스
- 무한한 확장성
    - 유튜브, 트위터, 페이스북 등 다양한 플랫폼과의 연동 가능성

## 1.3. 주요 서비스 화면 (프론트 → 각자 맡은 화면 gif)

### 1.3.1. 랜딩페이지

- 인터렉션 UI
    
    ![랜딩페이지12.gif](README%20e2cf99467c85465daae0ad49bdba7fce/%EB%9E%9C%EB%94%A9%ED%8E%98%EC%9D%B4%EC%A7%8012.gif)
    
- 팬텀 지갑 연결
    
    ![랜딩페이지.gif](README%20e2cf99467c85465daae0ad49bdba7fce/%EB%9E%9C%EB%94%A9%ED%8E%98%EC%9D%B4%EC%A7%80.gif)
    

### 1.3.2. 서비스 안내

![서비스 안내.gif](README%20e2cf99467c85465daae0ad49bdba7fce/%EC%84%9C%EB%B9%84%EC%8A%A4_%EC%95%88%EB%82%B4.gif)

### 1.3.3. 메인 레이아웃 및 Navbar

![레이아웃.gif](README%20e2cf99467c85465daae0ad49bdba7fce/%EB%A0%88%EC%9D%B4%EC%95%84%EC%9B%83.gif)

### 1.3.4. 메인 페이지 (대시보드, 등급표, 순위표)

![대시보드.gif](README%20e2cf99467c85465daae0ad49bdba7fce/%EB%8C%80%EC%8B%9C%EB%B3%B4%EB%93%9C.gif)

### 1.3.5. 후원 내역

![후원 내역.gif](README%20e2cf99467c85465daae0ad49bdba7fce/%ED%9B%84%EC%9B%90_%EB%82%B4%EC%97%AD.gif)

### 1.3.6. 계정

- 계정 상세 (지갑 정보, OAuth 연동)

![계정 상세.gif](README%20e2cf99467c85465daae0ad49bdba7fce/%EA%B3%84%EC%A0%95_%EC%83%81%EC%84%B8.gif)

- 후원 설정

![후원 설정.gif](README%20e2cf99467c85465daae0ad49bdba7fce/%ED%9B%84%EC%9B%90_%EC%84%A4%EC%A0%95.gif)

### 1.3.7. 알림창

![알림창.gif](README%20e2cf99467c85465daae0ad49bdba7fce/%EC%95%8C%EB%A6%BC%EC%B0%BD.gif)

### 1.3.7. SNV World

- NFT 랜덤 뽑기(NFT Candy Drop)
    
    ![NFT랜덤뽑기.gif](README%20e2cf99467c85465daae0ad49bdba7fce/NFT%EB%9E%9C%EB%8D%A4%EB%BD%91%EA%B8%B0.gif)
    

# 2. 주요 기술 스택

## 2.1. 개발환경

| 분류 | 환경 | 버전 |
| --- | --- | --- |
| Database | MongoDB | 5.0.x |
| Back | Nodejs | 16.x (LTS) |
|  | Express.js | 4.16.1 |
|  | mongoose | ^6.3.0 |
|  | solana/web3 | 1.41.3 |
|  | socket.io | 2.3.0 |
| Frontend | React | 17.0.2 |
|  | Nodejs | 16.x(LTS) |
|  | TypeScript | 4.4.4 |
|  | styled-components | 5.3.5 |
|  | Recoil | 0.6.1 |
|  | solana/web3.js | 1.37.2 |
|  | socket.io | 2.4.0 |
| Server | AWS EC2 |  |
|  | docker | 20.x |
|  | nginx | 16.14.1 |
| Log | Filebeat | 7.3.2 |
|  | Logstash | 7.3.2 |
|  | Elasticsearch | 7.3.2 |
|  | Opendistro | 7.3.2 |
|  | slack |  |

## 2.2. 서비스 아키텍처

![solniverse architecture.png](README%20e2cf99467c85465daae0ad49bdba7fce/solniverse_architecture.png)

## 2.3. ERD

각 팀원 역할

- 오세헌
    - `Infra Leader`
    - 인프라 구축
        - AWS EC2
        - 도커로 jenkins 설치 및 CI/CD 구축
        - nginx 구축
        - 도커로 mongoDB 설치
    - Twitch Oauth 연동
        
        Twitch Oauth 연동을 통해 유저의 정보를 가져옴
        
    - 메인페이지 기능
        - 후원받은 것, 후원한 것을 기준으로 횟수, 총 금액, 등급, 전체 유저 중 순위
    - 그래프
        
        유저가 후원했거나 받은 usdc, sol을 그래프로 나타냄
        
    - 프로젝트 UCC 제작
- 윤관
    - `Team Leader`
    - 후원 작성
        - 후원 내용 작성 페이지
    - 후원 결제
        - QR코드 결제
            - 후원 정보가 담긴 Url을 solana pay 패키지의 createQR을 통해 QR코드로 만들어 딥링크를 통한 결제가 가능
        - 모바일 결제
            - 모바일 앱으로 바로 결제되는 딥링크를 통해 결제 진행
        - 크롬 익스텐션 결제
            - 최초 web3.js의 createTransaction 메서드를 사용해 tx 생성
                - fresh wallet(사용기록이 없는 지갑)의 경우 해당 트랜잭션을 생성하지 못하고 후원받지 못하는 버그 발생
                - 직접 해당 트랜잭션을 만들어줌에 따라 fresh wallet도 바로 후원 받을 수 있게 진행
    - 후원 완료
        - Web3.js를 통한 결제 확인 및 결제 완료
            - account 주소로 signature를 조회해 해당 결제 내용이 실제로 블록체인에 올라갔고 해당 내용이 결제 진행(confirmed) ⇒ 결제 완료(finalized)되는지 체크하여 결제 완료 알림 제공
    - NFT 랜덤 뽑기 (NFT Candy Drop)
        - NFT 민팅
            - NFT Candy Machine을 통해 에셋을 NFT 민팅할 수 있는 이미지로 arweave 네트워크에 올리고 트랜잭션 승인을 통해 해당 이미지 중 민팅 횟수에 맞는 이미지가 발급되는 시스템
        - NFT 에셋 생성
            - 직접 png와 json 파일을 페어로 제작해 NFT 민팅이 가능하게끔 메타데이터 작성
    - UI/UX
        - 후원 페이지, 결제 페이지, 결제 완료 페이지, NFT 랜덤 뽑기 페이지
            - 반응형 페이지 구현
            - 
- 장원종
    - `Front Leader`
    - 프로젝트 세팅
        - 버전 및 폴더 구조
        - Theme light/dark
        - Main Layout & Navbar
        - Recoil
    - 메인 페이지 (대시보드)
        - 등급표
        - 순위표
    - 후원 내역
        - 그래프
        - 리스트
    - 계정
        - 계정 상세
            - 지갑 정보
            - OAuth 연동
        - 후원 설정
- 장예찬
    - `Backend Leader`
    - `Technical architect`
    - 전반적 기술 확인 및 기간 내 구현 가능성 검토
        - sol, usdc 후원, socket 통신을 이용한 후원 알림, 그래프 기능, token point 기능, nft 기능, 로그 시스템 등
    - solana tech 팀 디스코드 커뮤니티를 통한 문제해결
    - 백엔드 기반 구성
        - express-generator, express 라우팅
        - morgan+winston 로깅
        - MongoDB connection 구성
        - BaseResponse 클래스 및 swagger 구성
        - prettier+eslint 구성
        - jwt 구성
        - MongoDB 스키마 추가 작성
        - express-validator 비동기 요청 유효성 검사
    - nginx log 분기 설정, 비허가 요청 deny 작성
    - 백엔드 API
        - 연결된 지갑의 정보 조회
        - Jwt 기반 api
            - signMessage 시그니처 검증 및 Jwt 발급
            - refreshToken을 이용한 accessToken 갱신
            - accessToken 검증
            - twitch 연동(리팩터링)
            - donation alert url용 userKey(uuid v5  + uuid v4) 구현
        - Memo에 저장될 정보 저장 및 id 반환
        - 랭킹 리스트 기능
    - web3
        - SNV point token 발행 기능
            - SNV 토큰을 Solana Token List Devnet에 등재
        - 트랜잭션 감지 및 처리 로직 작성
        - 미감지 트랜잭션 복구 로직 작성(홍지범 팀원과 협업)
    - 백엔드 코드 리팩터링, 최적화
    - 프론트에 보낼 후원 알림 socket 통신 및 room을 이용한 다중 소켓 알림 기능 구현
    - Front 보조
        - 백엔드 Socket 통신 데모 코드 작성(최소희 팀원과 협업)
        - 프론트 기반 그래프 출력 데모 코드 작성(장원종 팀원과 협업)
        - 캔디머신 구성 및 사용 전파(윤관 팀원과 협업)
        - NFT 뽑기 데모 코드 작성(윤관 팀원과 협업)
        - solana pay 버그로 인한 커스텀 트랜잭션 생성 코드 작성
- 최소희
    - `UX Leader`
    - 팬텀 지갑 연결 및 시그니처 검증
        - 솔라나 네트워크 감지하여 provider 반환 함수 getProvider
        - 입장 시, 지갑 연결
        - 유저 확인을 위한 기능 수행 전, 시그니처 검증
    - 토큰 관리
        - accessToken과 refreshToken에 대한 발급, 재발급 함수 반환하는 useToken 훅 구현
    - 랜딩페이지
        - 인터렉션 UI 작업
    - 서비스 안내
        - 각 서비스 가이드 콘텐츠 및 UI 작업
    - 후원창
        - socket 방 연결 및 퇴장처리하는 useSocket 훅 구현
        - message queue 로직으로 데이터 축적
        - setTimeout으로 차례대로 알림음과 함께 송출
    - 협업툴 관리
        - 노션 템플릿 제작 및 관리
        - 프로젝트 문서 관리
- 홍지범
    - `Data Analyze Leader`
    - MongoDB 스키마 작성
    - web3
        - 미감지 트랜잭션 복구 로직 작성
    - Elatic Stack Log Analyze System
        - Filebeat : 로그 수집, 태깅
        - Logstash : 로그 필터링
        - Elasticsearch : 로그 저장 및 집계
        - Kibana : 시각화
        - Opendistro : 알림 모니터링, 트리거, 액션
        - Slack : 알림창
        - 결제 요청 대비 결제량으로 시스템 에러 감지 로직 작성 : 220519 장예찬 팀원과 시스템 장애 감지 후 보완
        - Monstache : DB와 동기화 ⇒ DB를 일정 시간마다 탐색(to: now - 일정시간, from : now)  업데이트 누락된 트랜잭션 알림

# 4. 기술 특이점

## 4.1. 후원 결제 방식

- Backend
    - sol, usdc 후원 트랜잭션 감지
        - 이외의 사용자 임의적 결제방식 트랜잭션은 에러처리
    - ELK 분석 시스템을 이용한 후원 중 장애사항 Slack 알림
    - 후원시 SNV(Solniverse) spl-token 지급
- Frontend

## 4.2. Socket을 활용한 알림창 기능

- Backend
    - [socket.io](http://socket.io) room을 활용한 다중 사용자 접속 및 다중 사용자 이벤트 전송
- Frontend
    - socket.io로 백엔드에서 보내는 donation 이벤트 감지
    - message queue 로직으로 데이터를 쌓은 후, setTimeout으로 차례로 알림 송출

## 4.3. 로그 분석

- 이동평균을 활용한 실시간 결제량 추이 파악
    - 이동평균 대비 현재 결제량을 통해 임계치 이하로 떨어졌을 때 사용자 이탈 혹은 시스템 에러로 감지해 슬랙 개발자 채널에 알림 전송
- 결제 요청 대비 실제 결재량을 활용한 시스템 장애 모니터링
    - DDD 서비스는 결제 결과를 Websocket subscribe기능을 통해 받기 때문에 클라이언트가 한 결제 요청(post) 대비 실제 결제 결과를 통해 임계치 이하로 떨어졌을 때 사용자 이탈 혹은 시스템 에러로 감지해 슬랙 개발자 채널에 알림 전송
- 서비스 향상에 필요한 데이터 시각화
    - 결제 요청 시간, 블록에 기록된 시간, DB에 저장된 시간을 통해 시간대별 요청이 걸리는 시간(Epoch)를 측정해 향후 서비스 향상시키기 위한 지표로서 활용

# 5. 서비스 배포 주소 및 테스트 계정

- 배포주소
    - [https://solniverse.net/](https://solniverse.net/)
- 테스트 계정
    - **첫 번째 방법 (팬텀 월렛이 없는 경우)**
        1. 팬텀 월렛을 설치한다.
        2. 새 계정을 생성하여 네트워크를 devnet으로 변경한다.
            
            ![Untitled](README%20e2cf99467c85465daae0ad49bdba7fce/Untitled.png)
            
            ![Untitled](README%20e2cf99467c85465daae0ad49bdba7fce/Untitled%201.png)
            
            ![Untitled](README%20e2cf99467c85465daae0ad49bdba7fce/Untitled%202.png)
            
        3. airdrop으로 solana를 충전한다. 
            1. 아래 링크 입력란에 충전하고자 하는 계정을 넣어 충전한다.
            
            [Sol Faucet! The premium Solana faucet for all your devnet and testnet needs.](https://solfaucet.com/)
            
        4. 자유롭게 Solniverse 서비스를 이용한다.
    
    - **두 번째 방법 (이미 팬텀 월렛이 있는 경우)**
        1. 팬텀 월렛을 설치한다.
        2. **월렛이 이미 있습니다** 클릭
        
        ![Untitled](README%20e2cf99467c85465daae0ad49bdba7fce/Untitled%203.png)
        
        1. 복구용 키를 입력한다
        2. 계정을 선택한다.
        
        ![Untitled](README%20e2cf99467c85465daae0ad49bdba7fce/Untitled%204.png)
        
        1. 네트워크를 Devnet으로 변경한다.

- 배포
    - BackEnd
        
        ```jsx
        yarn 
        //or
        yarn install
        ```
        
        ```jsx
        //env 설정
        DB_URI=<MongoDB 접속 링크>
        
        SOLANA_NET=<devnet 등 solana rpc 그룹 문자열>
        
        JWT_SECRET=<JWT 용 Secret key>
        
        TWITCH_CLIENT_ID=<트위치 developer client id>
        TWITCH_CLIENT_SECRET=<트위치 developer Secret key>
        
        SERVER_URL=http://localhost:3000
        
        DDD_SHOP_WALLET=<상점으로 이용할 지갑 Public Key>
        
        DDD_MINT_SECRET_KEY=<민팅할 때 사용할 Private Key>
        
        DDD_SNV_TOKEN=<발행한 Spl Token 주소>
        
        USDC_TOKEN=<USDC Token 주소>
        ```
        
        ```jsx
        yarn start
        //or
        yarn pm2 //pm2 설치 필요
        ```
        
    - FrontEnd
        
        ```jsx
        npm i 
        
        npm start
        ```
        
        ```jsx
        // env 설정 
        REACT_APP_BASE_URL= http://localhost:3000
        
        REACT_APP_CLIENT_ID= <트위치 developer client id>
        REACT_APP_REDIRECT_URI= <트위치 인증 코드 반환 URI>
        REACT_APP_SOCKET_URL= <Server URL>
        
        REACT_APP_SPL_TOKEN_TO_MINT_DECIMALS= <토큰 계산을 위한 DECIMAL>
        REACT_APP_SPL_TOKEN_TO_MINT_NAME= <TOKEN 민트한 ID>
        REACT_APP_CANDY_MACHINE_ID= <솔라나 캔디머신 ID>
        REACT_APP_SOLANA_NETWORK=devnet <연결 네트워크>
        REACT_APP_SOLANA_RPC_HOST=https://api.devnet.solana.com
        REACT_APP_USDC_TOKEN_ACCOUNT= <USDC 토큰 주소>
        REACT_APP_SNV_TOKEN_ACCOUNT= <SNV 토큰 주소>
        REACT_APP_SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID= <TOKEN ACCOUNT 찾기 위한 PROGRAM_ID>
        ```
        

# 6. 프로젝트 빌드 전 설치요소(특이사항)

## 6.1. 방화벽 설정

서비에서 사용할 포트를 미리 열어줍니다.

|  |  |
| --- | --- |
| 80/TCP | nginx |
| 443/TCP | nginx |
| 3000/TCP | ExpressJS |
| 9090/TCP | jenkins |
| 20000/TCP | MongoDB |
| 5601/TCP | kibana |
| 9200, 9300/TCP | elastic search |
| 5000, 9600/TCP | logstash |
| 5044/TCP | filebeat |

## 6.2. Jenkins

```bash
### Docker

- 필수 패키지 설치

```bash
sudo apt-get install apt-transport-https ca-certificates curl gnupg-agent software-properties-common
```

- GPG Key 인증

```bash
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
```

- docker repository 등록

```bash
sudo add-apt-repository \
"deb [arch=amd64] https://download.docker.com/linux/ubuntu \
$(lsb_release -cs) \
stable"
```

- docker 설치

```bash
sudo apt-get update && sudo apt-get install docker-ce docker-ce-cli containerd.io
```

- docker 설치 확인

```bash
docker -v
```

### Jenkin 컨테이너 설치

<aside>
💡 privileged : 도커 컨테이너 내부에서 host 시스템에 접근 권한을 주는 옵션(default: false)

</aside>

- run 명령어

```bash
sudo docker run -d --name jenkins -u root --privileged \
-p '9090:8080' \
-v '/home/ubuntu/docker-volume/jenkins:/var/jenkins_home' \
-v '/var/run/docker.sock:/var/run/docker.sock' \
-v '/usr/bin/docker:/usr/bin/docker' \
jenkins/jenkins
```

- Docker 사용 확인

```bash
# 컨테이너 내부 bash 접근
sudo docker exec -it jenkins bash

# Docker 확인
docker -v
```

### Jenkins 컨테이너 내부 docker-compose 설치

```bash
# 컨테이너 내부 bash 접근
docker exec -it jenkins bash

# 버전의 경우 호스트와 맞춰서 설치하는 것을 추천합니다.
curl -L "https://github.com/docker/compose/releases/download/1.27.4/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose

# jenkins 유저 docker-compose 사용 권한 부여
chmod +x /usr/local/bin/docker-compose

# 설치 확인
docker-compose -v
```

---

### Jenkins 환경설정

1. `도메인:9090` 접속
2. `sudo docker logs jenkins` 명령어 입력 → root 계정 비밀번호 확인 후 입력

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/eb8af3e2-08d7-4d86-8348-77cdfd0c4d63/Untitled.png)

1. `Install suggested plugins` 선택
2. 계정 생성
```

## 6.3. 인증서

```bash
# letsencrypt 설치
sudo apt-get update
sudo apt-get install letsencrypt

# 인증서 발급
# sudo letsencrypt certonly --standalone -d 도메인
sudo letsencrypt certonly --standalone -d i6e201.p.ssafy.io

# root 계정 로그인
sudo su

# 인증서 위치 폴더 이동
#cd /etc/letsencrypt/live/도메인
cd /etc/letsencrypt/live/i6e201.p.ssafy.io

# 인증서 형식 변경 pem -> PKCS12 
# export용 암호 입력
openssl pkcs12 -export -in fullchain.pem \
-inkey privkey.pem \
-out key.p12 \
-name airpageserver \
-CAfile chain.pem \
-caname root

# 인증서 복사
# sudo cp [파일이름] [인증서를 보관 할 docker volume 폴더] 
sudo cp fullchain.pem /home/ubuntu/docker-volume/ssl
sudo cp privkey.pem /home/ubuntu/docker-volume/ssl
sudo cp key.p12 /home/ubuntu/docker-volume/ssl
```

# 7. 빌드 시 사용되는 환경 변수 등

## 7.1. Docker-compose(front)

```jsx
version: '3.7'

services: 
  frontend:
    image: frontend-react
    build:
      context: frontend/
      dockerfile: Dockerfile
    ports:
      - "80:80"
      - "443:443"
    # [인증서 파일 저장 경로]:/var/www/html
    volumes:
      - /home/ubuntu/docker-volume/ssl2:/var/www/html
      - /home/ubuntu/log:/var/log/nginx
```

## 7.2. Docker-compose(back)

```jsx
version: '3.7'

services: 
  
  backend:
    image: backend-nodejs
    build:
      context: backend/
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    volumes:
      - /home/ubuntu/docker-volume/ssl2:/var/www/html
      - /home/ubuntu/backlog:/usr/app/logs
    container_name: "backend"
    hostname: "backend"
```

# 8. 협업Tool 링크

### 1) 노션

[DDD (Don’t Defy Defi)](https://www.notion.so/DDD-Don-t-Defy-Defi-e1441567e728438584cf3a88e396ea2b) 

### 2) 게더타운

[https://app.gather.town/app/6yB6VoVQcyfdUe0a/JPMP](https://app.gather.town/app/6yB6VoVQcyfdUe0a/JPMP)

### 3) 와이어프레임

[https://www.figma.com/file/jyskeu7jfTKFs3jUsoCjW8/Wireframe?node-id=0%3A1](https://www.figma.com/file/jyskeu7jfTKFs3jUsoCjW8/Wireframe?node-id=0%3A1)

### 4) 기능명세서 & API 명세서

[https://docs.google.com/spreadsheets/d/1qzjpPkPe-NFa5Q7LsGl0rv9DBEYfOHZ2lgwORTfclHk/edit#gid=0](https://docs.google.com/spreadsheets/d/1qzjpPkPe-NFa5Q7LsGl0rv9DBEYfOHZ2lgwORTfclHk/edit#gid=0)

### 5) ERD 설계

[https://www.erdcloud.com/d/iEdL3kiQZi8QWGXyS](https://www.erdcloud.com/d/iEdL3kiQZi8QWGXyS)

### 6) WBS

[https://docs.google.com/spreadsheets/d/1JV5ZdyaO5YTygk448-XMl6zteYk4Qpgsj3rlFjf33fo/edit?usp=sharing](https://docs.google.com/spreadsheets/d/1JV5ZdyaO5YTygk448-XMl6zteYk4Qpgsj3rlFjf33fo/edit?usp=sharing)

### 7) 테스트 시나리오

[https://docs.google.com/spreadsheets/d/1aUiCmc8n9IByfJmg_lR1GsLvTa25JbdhI4ihXYy5zgg/edit?usp=sharing](https://docs.google.com/spreadsheets/d/1aUiCmc8n9IByfJmg_lR1GsLvTa25JbdhI4ihXYy5zgg/edit?usp=sharing)
