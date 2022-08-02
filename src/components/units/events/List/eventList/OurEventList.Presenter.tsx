import * as S from "./OurEventList.Styles";
import InfiniteScroll from "react-infinite-scroller";

import { IOurEventListUI } from "./OurEventList.Types";
import OurEventListUIAdd from "./OurEventList.PresenterAdd";
export default function OurEventListUI(props: IOurEventListUI) {
  return (
    <>
      <S.Wrapper>
        <S.Select>
          <option>등록 순</option>
          <option>예정된 행사</option>
          <option>종료된 행사</option>
        </S.Select>

        <InfiniteScroll
          pageStart={0}
          loadMore={props.ToloadFunc}
          hasMore={true}
          useWindow={true}
        >
          <S.InsideWrapper>
            {props.data?.fetchPosts?.map((el: any) => (
              <OurEventListUIAdd key={el.id} el={el} />
            ))}
          </S.InsideWrapper>
        </InfiniteScroll>
      </S.Wrapper>
    </>
  );
}