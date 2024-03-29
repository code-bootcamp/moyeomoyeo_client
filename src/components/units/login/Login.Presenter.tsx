import Link from "next/link";
import { useMoveToPage } from "../../commons/hooks/useMoveToPage";
import CommonInput from "../../commons/inputs/infoInputs";
import * as S from "./Login.Styles";
import { ILoginNew } from "./Login.Types";

export default function LoginPageUI(props: ILoginNew) {
  const { onClickMoveToPage } = useMoveToPage();
  return (
    <S.OutWrapper>
      <S.Wrapper onSubmit={props.handleSubmit(props.onClickToLogin)}>
        <S.HeaderTitle>로그인</S.HeaderTitle>
        <S.SubWrapper>
          <S.SubTitle>잠깐,관계자 회원이신가요?</S.SubTitle>
          <S.SubBtn onClick={onClickMoveToPage("/login/newStaff")}>
            관계자회원 로그인
          </S.SubBtn>
        </S.SubWrapper>
        <CommonInput
          type="text"
          placeholder={"이메일(ID)을 입력해주세요"}
          register={props.register("email")}
        />
        <S.Error>{props.formState.errors.email?.message}</S.Error>
        <CommonInput
          type="password"
          placeholder={"비밀번호를 입력해주세요"}
          register={props.register("password")}
        />
        <S.Error>{props.formState.errors.password?.message}</S.Error>
        <S.SubmitBtn>로그인</S.SubmitBtn>
        <S.findPassword onClick={onClickMoveToPage("/login/findpw")}>
          비밀번호찾기
        </S.findPassword>
        <S.CommonTitle>소셜 계정으로 1초만에 로그인</S.CommonTitle>
        <S.SnsWrapper>
          <Link href="https://momoyeo.site/login/kakao">
            <a>
              <S.SnsLogo src="/signUp/kakao.png" />
            </a>
          </Link>
          <Link href="https://momoyeo.site/login/naver">
            <a>
              <S.SnsLogo src="/signUp/naver.png" />
            </a>
          </Link>
          <Link href="https://momoyeo.site/login/google">
            <a>
              <S.SnsLogo src="/signUp/ico-google.svg" />
            </a>
          </Link>
        </S.SnsWrapper>
        <S.FooterWrapper>
          <S.FooterTitle>아직 모여?모여!계정이 없으신가요?</S.FooterTitle>
          <S.FooterBtn onClick={onClickMoveToPage("/signup")}>
            회원가입
          </S.FooterBtn>
        </S.FooterWrapper>
      </S.Wrapper>
    </S.OutWrapper>
  );
}
