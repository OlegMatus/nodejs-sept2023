import { EmailTypeEnum } from "../enums/email-type.enum";

export const emailTemplateConstant = {
  [EmailTypeEnum.WELCOME]: {
    templateId: "d-d2fad44ebb0b4e52b855c816b3773443",
  },
  [EmailTypeEnum.DELETE_ACCOUNT]: {
    templateId: "d-731182e227fe4ec391e16cb7831ff410",
  },
  [EmailTypeEnum.RESET_PASSWORD]: {
    templateId: "d-438fa75a8d884ed2b643e96fdcc964d1",
  },
};
