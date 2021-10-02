# QA_webdriverIO
무신사 스토어 로그인 테스트 부분 자동화


실행 환경 :
 - node 14
 - npm 6

실행 명령어 : npx wdio run wdio.conf.js


node, npm 설치 된 상태에서 실행 가능
npx는 npm 5.2 이상부터 지원 함





# node 버전이 16일 경우 발생할 수 있는 문제 
1. Assertion failed: (thread_id_key != 0x7777), function find_thread_id_key, file ../src/coroutine.cc, line 134.
   
node 16 버전과 fiber 호환 안 되서 발생하는 문제

해결방법 : 

// node 버전 확인
node -v

// Cache 삭제
npm cache clean --force

// n 플러그인 설치
sudo npm install -g n

// stable 버전 설치      / 최신버전 설치 : sudo n lastest  / LTS 버전 설치: sudo n lts
sudo n stable          // 특정버전 설치 : sudo n 11.4.0 

플러그인 n은 node의 버전을 관리해주는 플러그인입니다. 해당 플러그인이 있으면 노드 버전을 변경할 때, 해당 노드 삭제가 아닌 사용할 버전선택이라는 간편함이 있으니 설치해줍니다.
