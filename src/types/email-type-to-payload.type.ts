import { EmailTypeEnum } from "../enums/email-type.enum";
import { EmailCombinedPayloadType } from "./email-combined-payload.type";
import { PickRequiredType } from "./pick-required.type";

export type EmailTypeToPayloadType = {
  [EmailTypeEnum.WELCOME]: PickRequiredType<
    EmailCombinedPayloadType,
    "name" | "frontUrl" | "actionToken"
  >;
  [EmailTypeEnum.RESET_PASSWORD]: PickRequiredType<
    EmailCombinedPayloadType,
    "frontUrl" | "actionToken"
  >;
};
