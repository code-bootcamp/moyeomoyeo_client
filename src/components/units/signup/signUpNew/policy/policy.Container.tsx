import { useState } from "react";
import * as S from "./policy.Styles";
declare const window: typeof globalThis & {
  IMP: any;
};
interface IPolicyProps {
  setVisible?: any;
}

export default function Policy(props: IPolicyProps) {
  return (
    <S.OutWapper>
      <S.Wrapper>
        <S.Header>
          <S.Policy>* 이용 약관</S.Policy>
          <S.CancelIcon
            src="/icon/delete.png"
            onClick={() => {
              props.setVisible(false);
            }}
          />
        </S.Header>
        <S.PolicyContents>
          ① 정보통신산업진흥원은 이 약관의 내용과 주소지, 대표자명,
          개인정보관리책임자명, 연락처(전화, 팩스, 전자우편주소 등) 등을
          이용자가 알 수 있도록 당 사이트의 초기화면(전면)에 게시합니다. ②
          정보통신산업진흥원은 약관의규제에관한법률, 전자거래기본법, 전자서명법,
          정보통신망이용 촉진 및 정보보호이용등에관한법률, 방문판매등에관한법률,
          소비자보호법 등 관련법을 위배하지 않는 범위에서 이 약관을 개정할 수
          있습니다. 약관을 개정할 경우에는 적용일자 등을 명시하여 현행약관과
          함께 당 사이트에 그 적용일자 7일이전부터 적용일자 전일까지 공지합니다.
          ③ 정보통신산업진흥원은 귀하가 본 약관 내용에 동의하는 것을 조건으로
          귀하에게 서비스를 제공할 것이며, 귀하가 본 약관의 내용에 동의하는
          경우, 당 사이트의 서비스 제공 행위 및 귀하의 서비스 사용 행위에는 본
          약관이 우선적으로 적용될 것입니다. ④ 이 약관에 동의하는 것은
          정기적으로 당 사이트를 방문하여 약관의 변경사항을 확인하는 것에
          동의함을 의미합니다. 변경된 약관에 대한 정보를 알지 못해 발생하는
          이용자의 피해는 당 사이트에서 책임지지 않습니다. ⑤ 당 사이트 회원은
          변경된 약관에 동의하지 않을 경우 회원 탈퇴(해지)를 요청할 수 있으며,
          변경된 약관의 효력 발생일로부터 7일 이후에도 거부의사를 표시하지
          아니하고 서비스를 계속 사용할 경우 약관의 변경 사항에 동의한 것으로
          간주됩니다. ⑥ 본 약관에 명시되지 않은 사항은 관계 법령에 규정 되어있을
          경우 그 규정에 따르며, 그렇지 않은 경우에는 일반적인 관례에 따릅니다.
        </S.PolicyContents>
      </S.Wrapper>
    </S.OutWapper>
  );
}