# Coin-Web-Project

## Project Overview
1. COINPRA 
    
    **실제 Project Working Directory**

2. STUDY
    
    **Project에 필요한 학습내용 및 예제가 위치해있는 Directory**
    
    - Crypto
        - [비밀번호 저장에 필요한 암호화에 관한 내용 및 예제](https://github.com/juyonglee/Coin-Web-Project/tree/master/Study/Crypto)
    - MongoDB
        - [User 정보 및 거래 관련 정보 저장을 위한 MongoDB 내용 및 예제](https://github.com/juyonglee/Coin-Web-Project/tree/master/Study/MongoDB)
    - Passport
        - [아이디와 비밀번호로 로그인하기 위한 기능을 구현하기 위한 Passport 내용](https://github.com/juyonglee/Coin-Web-Project/tree/master/Study/Passport)

## Task Lists
**우리가 해야 할 업무**
- [ ] 디자인이 나오는 데로 작업 시작
- [x] 관리자 페이지를 깔끔하고 있어 보이는 레이아웃으로 만들기 
- [x] 관리자 메뉴에서 최근 업데이트 시간이 나오도록 수정
- [ ] 관리자 메뉴에서 로그아웃 기능 구현하기

**Main Page**
- [ ] 사전가입하기 클릭 시 나오는 모달 타이틀 및 이용약관 동의 및 개인 정보 취급방침 동의 만들기 
- [x] 비밀번호와 비밀번호 확인이 일치하는지 확인하는 기능

**Login Page**
- [ ] 비밀번호 재설정하는 기능 구현

**구매하기 페이지 1-3**
- [ ] 비밀번호 재설정하는 기능 구현
- [ ] 구매 수량에 0보다 큰 수만 입력 가능하도록 수정
- [ ] "유의사항을 모두 읽고 동의합니다" 체크 시에만 구매 버튼이 활성화 가능하도록 수정
- [x] 구매를 완료한 경우 출력되는 구매완료창 구현

**Manager Page**
- [x] 로고 작업 (로고가 있어야 작업 가능)
- [x] 각 페이지에 타이틀 작업
- [x] 메뉴 클릭 시 불 들어오게 Active 작업
- [x] 날짜 보기 좋게 만들기 
- [x] 판매 정보를 누적하는 DB

**회원정보 Page**
- [x] 전화번호의 가운데만 가리는 기능 (Ex>010-****-1234) 
- [x] Hover를 이용하여 전화번호를 나타내는 기능 (Ex>010-1234-1234) 
- [x] 회원 넘버 클릭 시 주문번호, 수량, 종류, 상태를 표시하는 창 만들기

**입금 대기 Page**
- [x] 회원 넘버 클릭 시 주문번호, 수량, 종류, 상태를 표시하는 창 만들기
- [x] 입금시간 입력 시 DB업데이트 및 입금 완료로 변경
- [x] 취소 버튼 클릭시 구매 신청을 취소하시겠습니까? 물어본 뒤 확인 후 취소

**판매 완료, 판매 누적액, 관리자 메뉴 Page**
- [x] 입금 완료된 내역을 DB에서 불러와 출력하는 기능
- [x] PLU, FNB의 총 누적 판매액을 보여주는 기능
- [x] 관리자 계정의 비밀번호를 변경하는 기능
