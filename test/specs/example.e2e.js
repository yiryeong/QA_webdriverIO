const LoginPage = require('../pageobjects/login.page');
const SecurePage = require('../pageobjects/secure.page');


describe('musinsa -> login Test', () => {
    // 비회원 주문조회
    it('login nonMember', async () => {
        await LoginPage.open();
        await LoginPage.nonMemberSearch('이영자','123123123123')
    })

    // 존재하지 않는 계정으로 로그인 테스트
    it('login with invalid account', async () => {
        await LoginPage.open();
        await LoginPage.loginWithInvalid('test', 'test');
    })

    // 자동로그인, 카카오 로그인, Apple로 로그인, 로봇방지문항, 회원 혜택, 회원가입 링크들 확인
    it('ETC', async () => {
        await LoginPage.open();
        await LoginPage.loginETC();
    })

    // 아이디 찾기 -> 폰 번호로
    it('searchID with phoneNumber', async() => {
         await LoginPage.open();
         await LoginPage.searchMemberID('test','01012341234');
    })

    // 아이디 찾기 -> 이미일로
    it('searchID with email', async() => {
         await LoginPage.open();
         await LoginPage.searchMemberID(1,1,'test123@gmail.com');
    })

    // 비밀번호 찾기
    it('searchPW', async() => {
         await LoginPage.open();
         await LoginPage.searchMemberPW();
    })

    // 회원가입한 계정으로 로그인 테스트
    it('login with valid account', async () => {
        await browser.url('https://www.musinsa.com');
        expect(browser).toHaveTitle('무신사 - No.1 온라인 패션 플랫폼');
        const ele = await $('a=로그인');
        await ele.click();
        await LoginPage.loginWithValid('test123123', 'test123123');
        await expect($('a=로그아웃')).toBeExisting();
        await $('a=로그아웃').click();
    })
});


