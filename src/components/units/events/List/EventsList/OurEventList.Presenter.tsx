import * as S from "./OurEventList.Styles";

export default function OurEventListUI(props) {
  return (
    <>
      <S.Wrapper>
        <S.ListWrapper isActive={props.ourEvents}>
          <S.ListImg isActive={props.ourEvents} src="/배너이미지_동행1.png" />
          <S.FlexWrapper>
            <S.Title>축제이름</S.Title>
            <S.Period>2020.07.01부터 2020.07.31까지</S.Period>
            <S.ContentsWrapper>
              한줄 소개 한줄 소개 한줄 소개 한줄 소개 한줄 소개 한줄 소개
            </S.ContentsWrapper>
            <S.FooterWrapper>
              <>
                <S.Counter>조회수</S.Counter>
                <S.Counter>좋아요</S.Counter>
              </>
              <S.Btn isActive={props.ourEvents}>자세히보기</S.Btn>
            </S.FooterWrapper>
          </S.FlexWrapper>
        </S.ListWrapper>
      </S.Wrapper>
    </>
  );
}