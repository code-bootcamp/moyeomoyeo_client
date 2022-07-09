import LoginNewStaffPageUI from "./LoginNewStaff.Presenter";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useRouter } from "next/router";
import { useApolloClient } from "@apollo/client";
import { useRecoilState } from "recoil";
import { accessTokenState, userInfoState } from "../../../../commons/store";

const schema = yup.object({
  email: yup
    .string()
    .email("이메일 형식이 적합하지 않습니다")
    .required("이메일은 필수 입력사항입니다."),
  password: yup
    .string()
    .required("비밀번호는 필수 입력 사항입니다.")
    .matches(
      /^(?=.*[a-zA-Z])((?=.*\d)|(?=.*\W))(?=.*[!@#$%^*+=-]).{8,16}$/,
      "비밀번호는 영문, 숫자, 특수문자를 포함한 8~16자리로 입력바랍니다."
    ),
});
export default function LoginNewStaffPage() {
  const router = useRouter();
  const client = useApolloClient();
  const [, setAccessToken] = useRecoilState(accessTokenState);
  const [, setUserInfo] = useRecoilState(userInfoState);
  const { register, handleSubmit, formState, setValue, trigger, reset, watch } =
    useForm({
      resolver: yupResolver(schema),
      mode: "onChange",
    });

  // 관계자회원가입
  const onClickToSignUp = () => {
    router.push("/signup/newStaff");
  };
  // 일반 로그인
  const onClickToLoginNewStaff = () => {
    router.push("/login");
  };
  // 비밀번호 찾기
  const onClickToFindPw = () => {
    router.push("/login/findpw");
  };
  // 로그인
  const onClickToLogin = async (data: any) => {
    try {
      const result = await loginUser({
        variables: {
          email: data.email,
          password: data.password,
        },
      });

      const Token = result.data.loginUser.accessToken;
      const resultUserInfo = await client.query({
        query: FETCH_USER_LOGGED_IN,
        context: {
          headers: {
            Authorization: `Bearer ${Token}`,
          },
        },
      });
      setAccessToken(result.data?.loginUser.accessToken);
      localStorage.setItem("refreshToken", "true");
      const userInfo = resultUserInfo.data?.fetchUserLoggedIn;
      setUserInfo(userInfo);
      alert("로그인이 되었습니다.");
      router.push("/");
    } catch (error) {
      alert("로그인 정보가 일치하지 않습니다.");
      router.push("/login");
    }
  };

  return (
    <LoginNewStaffPageUI
      // hookform
      handleSubmit={handleSubmit}
      register={register}
      formState={formState}
      // router
      onClickToSignUp={onClickToSignUp}
      onClickToLoginNewStaff={onClickToLoginNewStaff}
      onClickToFindPw={onClickToFindPw}
      // login
      onClickToLogin={onClickToLogin}
    />
  );
}
