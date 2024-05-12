import { EmailTypeEnum } from "../enums/email-type.enum";

export const emailTemplateConstant = {
  [EmailTypeEnum.WELCOME]: {
    templateId: "d-01a470aa338b4a02b4e9030ebb07a8b1",
  },
  [EmailTypeEnum.RESET_PASSWORD]: {
    templateId: "d-438fa75a8d884ed2b643e96fdcc964d1",
  },
};
