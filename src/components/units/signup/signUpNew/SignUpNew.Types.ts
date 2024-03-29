import { Dispatch, SetStateAction } from "react";
import {
  UseFormRegister,
  UseFormHandleSubmit,
  FormState,
  FieldValues,
  UseFormWatch,
} from "react-hook-form";

export interface ISignUpNew {
  watch: UseFormWatch<FieldValues>;
  register: UseFormRegister<FieldValues>;
  handleSubmit: UseFormHandleSubmit<FieldValues>;
  formState: FormState<FieldValues>;
  onClickCreateUser: (data: any) => void;
  onClickConfirm: () => void;
  onClickGetNumber: () => void;
  isDone?: boolean;
  isActive?: boolean;
  isReadyForNum?: boolean;
  setChecked?: Dispatch<SetStateAction<boolean>>;
  setSecondChecked?: Dispatch<SetStateAction<boolean>>;
}
