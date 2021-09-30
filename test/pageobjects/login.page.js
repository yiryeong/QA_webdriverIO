const Page = require('./page')
const EC = require('wdio-wait-for')


/**
 * sub page containing specific selectors and methods for a specific page
 */
class LoginPage extends Page {
    /**
     * define selectors using getter methods
     */
    get inputUserid () { return $('input[name="id"]') }
    get inputPassword () { return $('input[name="pw"]') }
    get btnSubmit () { return $('button[type="submit"]') }
    get existingMember() { return $('#login-tab') }
    get nonMember () { return $('#buy-search-tab') }
    get autoLogin () { return $('#tooltipAutoLogin') }
    get searchID () { return $('#id-search') }
    get searchPW () { return $('#pw-search') }
    get loginWithKakao () { return $('#loginWithKakao') }
    get loginWithApple () { return $('a=Apple로 로그인') }
    get benefits () { return $('a=회원 혜택') }
    get join () { return $('#member-join') }
    /**
     * a method to encapsule automation code to interact with the page
     * e.g. to login using userid and password
     */

    // 회원가입한 계정으로 로그인 테스트
    async loginWithValid (userid, password) {
        await this.inputUserid.setValue(userid)
        await this.inputPassword.setValue(password)
        //로봇방지문항
        const elem = $('#recaptcha-anchor')
        const isExisting = await elem.isExisting()
        if (isExisting) {
            elem.click().pause(3000)
            expect(elem).toBeChecked()
        }
        await this.btnSubmit.click()
    }

    // 존재하지 않는 계정으로 로그인 테스트
    async loginWithInvalid (userid, password) {
        await this.btnSubmit.click()
        browser.waitUntil(EC.alertIsPresent(), { timeout: 5000, timeoutMsg: '아이디를 입력해 주세요.' })
        await browser.acceptAlert()
        await this.inputUserid.setValue(userid)

        await this.btnSubmit.click()
        browser.waitUntil(EC.alertIsPresent(), { timeout: 5000, timeoutMsg: '비밀번호를 입력해 주세요.' })
        await browser.acceptAlert()
        await this.inputPassword.setValue(password)

        //로봇방지문항
        const elem = $('#recaptcha-anchor')
        const isExisting = await elem.isExisting()
        if (isExisting) {
            elem.click().pause(3000)
            expect(elem).toBeChecked()
        }
        await this.btnSubmit.click()
        browser.waitUntil(EC.alertIsPresent(), { timeout: 5000, timeoutMsg: '아이디 또는 패스워드를 확인하세요.' })
        await browser.acceptAlert()

        await this.inputUserid
        await this.inputPassword
        await this.btnSubmit
    }

    // 자동로그인, 카카오 로그인, Apple로 로그인, 로봇방지문항, 회원 혜택, 회원가입 링크들 확인
    async loginETC () {
        // 자동로그인
        await this.autoLogin.click()
        browser.waitUntil(EC.alertIsPresent(), { timeout: 5000, timeoutMsg: '개인 정보 보호를 위해 본인 기기에서만 이용해주세요.' })
        const autoElem = await $('#tooltipAutoLogin')
        expect(autoElem).toHaveAttribute('class', 'ui-toggle-btn is-active')
        await this.autoLogin.click()
        expect(autoElem).toHaveAttribute('class', 'ui-toggle-btn')

        //카카오 로그인
        await this.loginWithKakao.click()
        const kakaoElem = await $('p.info_tip')
        expect(kakaoElem).toHaveText('TIP 카카오메일이 있다면 메일 아이디만 입력해 보세요.')
        await browser.back()
        await browser.pause(2000)

        //Apple로 로그인
        await this.loginWithApple.click()
        await $('#account_name_text_field')
        const appleElem = await $('#apple_id_field_label')
        expect(appleElem).toHaveText('Apple ID')
        await browser.back()
        await browser.pause(2000)

        //회원가입
        await this.join.click()
        await $('#memberId')
        await $('#password')
        const joinElem = await $('p.text-kakao.font-mss')
        expect(joinElem).toHaveText('회원가입')
        await browser.back()
        await browser.pause(2000)


        //회원 혜택
        await this.benefits.click()
        const benefitEle = await $('h4.CBenefitLevel__title')
        expect(benefitEle).toHaveText('등급 혜택')
        const url = browser.getUrl()
        expect(url).toHaveText('https://my.musinsa.com/member/v2/benefit')
        await browser.back()
        await browser.pause(2000)
    }

    // 비회원 주문조회
    async nonMemberSearch (name, orderNo) {
        await this.nonMember.click()
        const nonMemberButton = await $('button=비회원 주문조회')
        const nonMemberName = await $('#order_name')
        const nonMemberNo = await $('#order_no')
        const benefitName = await $('label[for="order_name"]')
        expect(benefitName).toHaveText('이름')
        const benefitNo = await $('label[for="order_no"]')
        expect(benefitNo).toHaveText('주문번호')

        await nonMemberName.setValue('')
        await nonMemberButton.click()
        browser.waitUntil(EC.alertIsPresent(), { timeout: 5000, timeoutMsg: '주문자 성함을 입력해 주십시오.' })
        await browser.acceptAlert()
        await browser.pause(2000)
        await this.nonMember.click()
        await browser.pause(2000)
        expect(benefitName).toHaveText('이름')
        expect(benefitNo).toHaveText('주문번호')
        await nonMemberName.setValue(name)

        await nonMemberButton.click()
        browser.waitUntil(EC.alertIsPresent(), { timeout: 5000, timeoutMsg: '입력하신 주문번호와 일치하는 주문 내역을 찾을 수 없습니다.' })
        await browser.acceptAlert()
    }

    // 아이디 찾기
    async searchMemberID(name=1, phoneNumber=1, emailAccount=1){
        await this.searchID.click()
        const phone = await $('label=휴대전화')
        const email = await $('label=이메일')
        const self = await $('label=본인인증')
        const certify = await $('button=인증요청')
        const memberName = await $('#memberName')
        const phoneNo = await $('#phoneNumber')
        const idSearch = await $('button=아이디 찾기')
        expect($('h2.title')).toHaveText('아이디 찾기')
        expect(certify).toHaveText('인증요청')
        expect(idSearch).toBeDisabled()
        await certify.click()
        expect($('#searchValidMemberName')).not.toBeDisabled()
        expect($('#searchValidMemberName')).toHaveText('이름을 입력해 주세요')

        if (name != 1){
            await memberName.setValue(name)
            await certify.click()
            expect($('#searchValidMemberName')).toBeDisabled()
            expect($('#searchValidPhone')).toBeDisabled()
            expect($('#searchValidPhone')).toHaveText('휴대전화 번호를 확인해 주세요')
            if (phoneNumber != 1) {
                await phoneNo.setValue(phoneNumber)
            }
        }

        const emailInput = $('#email')
        await self.click()
        expect(self).toBeSelected()
        expect(emailInput).toBeDisabled()
        expect(idSearch).toBeEnabled()
        expect($('#selfCertMessage')).toHaveText('본인명의의 휴대폰으로 아이디를 찾는 방법입니다.\n 기존에 본인인증을 완료한 아이디만 찾으실 수 있습니다.')

        await email.click()
        expect(email).toBeSelected()
        expect(certify).toBeDisabled()
        expect(emailInput).toBeEnabled()
        if (emailAccount != 1){
            await emailInput.setValue(emailAccount)
            expect(idSearch).not.toBeDisabled()
            await idSearch.click()
            expect($('a=로그인')).toBeEnabled()
            expect(idSearch).toBeDisabled()
            expect($('a.link')).toHaveText('비밀번호가 기억나지 않으세요?')
            await $('button[onclick="commonHistoryBack();"]').click()
            browser.pause(2000)
            expect($('a=로그인')).toBeDisabled()
            expect(idSearch).toBeEnabled()
        }
    }

    // 비밀번호 찾기
    async searchMemberPW(){
        await this.searchPW.click()
        const phone = await $('label=휴대전화')
        const email = await $('label=이메일')
        const self = await $('label=본인인증')
        const certify = await $('button=인증요청')
//        const id = $('#memberId')
//        const name = $('#memberName')
//        const phoneNumber = #('#phoneNumber')
        const searchPWBtn = $('button=비밀번호 찾기')
        expect(searchPWBtn).toBeDisabled()

        await certify.click()
        expect($('#searchValidMemberId')).toHaveText('아이디를 입력해 주세요')

        await email.click()
        expect(certify).toBeDisabled()

        await self.click()
        expect($('#selfCertMessage')).toHaveText('본인명의의 휴대폰으로 비밀번호를 찾는 방법입니다.\n 기존에 본인인증을 완료한 아이디만 찾으실 수 있습니다.')
    }

    /**
     * overwrite specifc options to adapt it to page object
     */
    open () {
        return super.open();
    }
}

module.exports = new LoginPage();
