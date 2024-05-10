import { MailDataRequired } from "@sendgrid/helpers/classes/mail";
import SendGrid from "@sendgrid/mail";

import { config } from "../configs/config";
import { emailTemplateConstant } from "../constants/email-template.constant";
import { EmailTypeEnum } from "../enums/email-type.enum";

class SendMailService {
  constructor() {
    SendGrid.setApiKey(config.SENDGRID_API_KEY);
  }
  public async sendByType(
    to: string,
    type: EmailTypeEnum,
    dynamicTemplateData: any,
  ): Promise<void> {
    try {
      const templateId = emailTemplateConstant[type].templateId;
      await this.send({
        from: config.SENDGRID_FROM_EMAIL,
        to,
        templateId,
        dynamicTemplateData,
      });
    } catch (e) {
      console.error("Error email:", e);
    }
  }
  private async send(email: MailDataRequired) {
    try {
      await SendGrid.send(email);
    } catch (e) {
      console.error("Error email:", e);
    }
  }
}

export const sendMailService = new SendMailService();
