import ProductsQuestionWriteUI from "./ProductsQuestionWrite.Presenter";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { CREATE_PRODUCT_COMMENT } from "./ProductsQuestionWrite.Queries";
import { useMutation } from "@apollo/client";
import { useRouter } from "next/router";
import { FETCH_PRODUCT_COMMENTS } from "../list/ProductsQuestionList.Queries";
import { useEffect, useState } from "react";
import { Modal } from "antd";
import { useRecoilState } from "recoil";
import { userInfoState } from "../../../../../commons/store";

const schema = yup.object({
  content: yup.string().required(),
});

export default function ProductsQuestionWrite() {
  const [userInfo] = useRecoilState(userInfoState);
  const router = useRouter();
  const [created, setCreated] = useState(false);
  const { register, handleSubmit, formState, reset } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
  });
  const [createProductComment] = useMutation(CREATE_PRODUCT_COMMENT);

  useEffect(() => {
    reset({ content: "" });
  }, [created]);

  const onClickCreateComment = async (data: any) => {
    if (!userInfo.email) {
      Modal.error({ content: "로그인한 유저만 작성 가능합니다." });
    } else {
      try {
        await createProductComment({
          variables: {
            commentInput: {
              content: data.content,
            },
            productId: router.query.productId,
          },
          refetchQueries: [
            {
              query: FETCH_PRODUCT_COMMENTS,
              variables: { productId: router.query.productId, pageSize: 10 },
            },
          ],
        });
        Modal.success({
          content: "문의가 등록되었습니다.",
        });
        setCreated(true);
      } catch (error) {
        if (error instanceof Error) Modal.error({ content: error.message });
      }
    }
  };

  return (
    <ProductsQuestionWriteUI
      register={register}
      handleSubmit={handleSubmit}
      formState={formState}
      onClickCreateComment={onClickCreateComment}
    />
  );
}
