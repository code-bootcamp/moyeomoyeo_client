import { useRouter } from "next/router";
import { useState, useRef, useEffect, MouseEvent } from "react";
import BoardDetailPresenter from "./BoardDetail.presenter";
import _, { throttle } from "lodash";
import {
  FETCH_BOARD,
  FETCH_LOGIN_USER,
  FETCH_REQUEST_USERS,
  DELETE_BOARD,
  MAKE_BOARD_FULL,
} from "./BoardDetail.queries";
import { UPDATE_BOARD } from "../boardWrite/BoardWrite.queries";
import { useMutation, useQuery } from "@apollo/client";
import { useMoveToPage } from "../../../../commons/hooks/useMoveToPage";
import { Modal } from "antd";

export default function BoardDetailContainer() {
  const { onClickMoveToPage } = useMoveToPage();
  const router = useRouter();
  const [updateBoard] = useMutation(UPDATE_BOARD);
  const { data } = useQuery(FETCH_BOARD, {
    variables: {
      boardId: router.query.boardId,
    },
  });
  const { data: userData } = useQuery(FETCH_LOGIN_USER);
  const { data: requestUserData } = useQuery(FETCH_REQUEST_USERS, {
    variables: {
      boardId: router.query.boardId,
    },
  });

  // 유저종류에 따른 랜더링 변경부분
  const [isMyBoard, setIsMyBoard] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isSendRequestUser, setIsSendRequestUser] = useState(false);
  useEffect(() => {
    setIsSendRequestUser(
      [...JSON.parse(localStorage.getItem("requested") || "[]")].includes(
        router.query.boardId
      )
    );
  }, []);

  useEffect(() => {
    const writerId = data?.fetchBoard.writer.id;
    const userId = userData?.fetchLoginUser.id;
    const isCompletedBoard = data?.fetchBoard.isFull;
    const requestUsersId = requestUserData?.fetchBoardRequest.map(
      (el: any) => el.reqUser.id
    );
    if (writerId === userId) {
      setIsMyBoard(true);
      if (isCompletedBoard) setIsCompleted(true);
    } else {
      setIsMyBoard(false);
      if (requestUsersId?.includes(userId)) setIsSendRequestUser(true);
    }
  }, [userData, data, requestUserData]);

  // 네비 부분
  const [activeTab, setActiveTab] = useState("detail");
  const navRef = useRef(null);
  const detailRef = useRef(null);
  const eventRef = useRef(null);
  const commentRef = useRef(null);

  useEffect(() => {
    window.addEventListener("scroll", myThrottle);
    return window.removeEventListener("scroll", () => {
      myThrottle();
    });
  });

  const myThrottle = _.throttle(() => {
    if (!navRef.current) return;
    document.documentElement.scrollTop > 130
      ? (navRef.current.style = "top:0")
      : (navRef.current.style = "top:-200px");

    if (
      commentRef.current?.getBoundingClientRect().top <
      navRef.current?.clientHeight + 100
    ) {
      setActiveTab("comment");
    } else if (
      eventRef.current?.getBoundingClientRect().top <
      navRef.current?.clientHeight + 100
    ) {
      setActiveTab("event");
    } else {
      setActiveTab("detail");
    }
  }, 50);

  const onClickDetail = (event: MouseEvent<HTMLDivElement>) => {
    const detailAbsoluteTop =
      window.pageYOffset +
      detailRef.current?.getBoundingClientRect().top -
      navRef.current?.clientHeight;
    window.scrollTo({
      top: detailAbsoluteTop,
      behavior: "smooth",
    });
    throttle(() => {
      setActiveTab(event.currentTarget.id);
    }, 500);
  };
  const onClickEvent = (event: MouseEvent<HTMLDivElement>) => {
    const eventAbsoluteTop =
      window.pageYOffset +
      eventRef.current?.getBoundingClientRect().top -
      navRef.current?.clientHeight;
    window.scrollTo({
      top: eventAbsoluteTop,
      behavior: "smooth",
    });
    throttle(() => {
      setActiveTab(event.currentTarget.id);
    }, 500);
  };
  const onClickComment = (event: MouseEvent<HTMLDivElement>) => {
    const commentAbsoluteTop =
      window.pageYOffset +
      commentRef.current?.getBoundingClientRect().top -
      navRef.current?.clientHeight;
    window.scrollTo({
      top: commentAbsoluteTop,
      behavior: "smooth",
    });
    throttle(() => {
      setActiveTab(event.currentTarget.id);
    }, 500);
  };

  // 우측 날개부분

  // 작성자인 경우
  // 요청수락/거절 부분
  const [requestAccepted, setRequestAccepted] = useState("");
  const [requestRefused, setRequestRefused] = useState("");
  const [accompanyList, setAccompanyList] = useState([]);
  const [animationPauseState, setAnimationPauseState] = useState("");
  const onClickAcceptRequest = (el: string) => () => {
    setTimeout(() => {
      setAnimationPauseState(el);
    }, 1510);
    setRequestAccepted(el);
    setAccompanyList((prev: string[]) => [...prev, el]);
  };
  const onClickRefuseRequest = (el: string) => () => {
    setTimeout(() => {
      setAnimationPauseState(el);
    }, 1510);
    setRequestRefused(el);
  };
  // 인원 변경 모달 부분
  const [isModalVisible, setIsModalVisible] = useState(false);
  const onClickChangeMaxCount = () => {
    setIsModalVisible(true);
  };
  const handleOk = async () => {
    try {
      await updateBoard({
        variables: {
          boardId: router.query.boardId,
          updateBoardInput: {
            personCount: maxHeadCount,
            boardAddress: {
              address_description:
                data.fetchBoard.boardAddress.address_description,
            },
          },
        },
      });
    } catch (error) {
      if (error instanceof Error) Modal.error({ content: error.message });
    }
    setIsModalVisible(false);
  };
  const [maxHeadCount, setMaxHeadCount] = useState(0);
  useEffect(() => {
    setMaxHeadCount(data?.fetchBoard.personCount);
  }, [data?.fetchBoard.personCount]);
  const onClickCount = (event: MouseEvent<HTMLDivElement>) => {
    (event.target as HTMLDivElement).id === "+" &&
      setMaxHeadCount((prev) => prev + 1);
    (event.target as HTMLDivElement).id === "-" &&
      maxHeadCount > 1 &&
      setMaxHeadCount((prev) => prev - 1);
  };
  // 모집완료/취소 부분
  const [makeBoardFull] = useMutation(MAKE_BOARD_FULL);
  const onClickChangeRecruitState = (state: string) => async () => {
    if (state === "complete") {
      try {
        await makeBoardFull({ variables: { boardId: router.query.boardId } });
      } catch (error) {
        if (error instanceof Error) Modal.error({ content: error.message });
      }
    }
    setIsCompleted((prev) => !prev);
  };

  // 열람자인 경우
  // 요청하기/요청취소 부분 api 안된다......
  // const [requestAccompany] = useMutation(REQUEST_ACCOMPANY);
  const onClickRequestAccompany = (state: string) => async () => {
    if (state === "request") {
      const requested = [
        ...JSON.parse(localStorage.getItem("requested") || "[]"),
      ];
      requested.push(data?.fetchBoard.id);
      localStorage.setItem("requested", JSON.stringify(requested));
    }
    if (state === "cancel") {
      const requested = [
        ...JSON.parse(localStorage.getItem("requested") || "[]"),
      ].filter((el) => el !== data?.fetchBoard.id);
      localStorage.setItem("requested", JSON.stringify(requested));
    }
    setIsSendRequestUser((prev) => !prev);
  };

  // 로드뷰 부분
  const [roadView, setRoadView] = useState(false);
  const onClickRoadView = () => {
    setRoadView(true);
  };
  const onClickExitRoadView = () => {
    setRoadView(false);
  };

  // 게시글삭제 부분
  const [deleteBoard] = useMutation(DELETE_BOARD);
  const onClickDelete = async () => {
    await deleteBoard({
      variables: {
        boardId: router.query.boardId,
      },
    });
    Modal.success({ content: "게시글이 삭제되었습니다." });
    router.push("/boards");
  };

  return (
    <BoardDetailPresenter
      data={data}
      userData={userData}
      requestUserData={requestUserData}
      isMyBoard={isMyBoard}
      isCompleted={isCompleted}
      isSendRequestUser={isSendRequestUser}
      navRef={navRef}
      detailRef={detailRef}
      commentRef={commentRef}
      eventRef={eventRef}
      activeTab={activeTab}
      onClickDetail={onClickDetail}
      onClickEvent={onClickEvent}
      onClickComment={onClickComment}
      roadView={roadView}
      onClickRoadView={onClickRoadView}
      onClickExitRoadView={onClickExitRoadView}
      isModalVisible={isModalVisible}
      setIsModalVisible={setIsModalVisible}
      onClickChangeMaxCount={onClickChangeMaxCount}
      handleOk={handleOk}
      maxHeadCount={maxHeadCount}
      onClickCount={onClickCount}
      onClickChangeRecruitState={onClickChangeRecruitState}
      onClickRequestAccompany={onClickRequestAccompany}
      onClickAcceptRequest={onClickAcceptRequest}
      onClickRefuseRequest={onClickRefuseRequest}
      requestAccepted={requestAccepted}
      requestRefused={requestRefused}
      onClickMoveToPage={onClickMoveToPage}
      onClickDelete={onClickDelete}
      accompanyList={accompanyList}
      animationPauseState={animationPauseState}
    />
  );
}
