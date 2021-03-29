import mailer from '@sendgrid/mail';

export class Emailing {
  private to: string;
  private from: string;

  constructor(to: string, from: string) {
    this.to = to;
    this.from = from || String(process.env.SUPPORT_EMAIL);
    // Init the mailer instance
    mailer.setApiKey(String(process.env.SENDGRID_API_KEY));
  }

  async resetPasswordRequest(
    username: string,
    resetUrl: string,
  ): Promise<void> {
    await mailer.send([
      {
        to: this.to,
        from: this.from,
        templateId: String(process.env.SENDGRID_USER_PASSWORD_RESET_REQUEST),
        dynamicTemplateData: {
          username,
          resetUrl,
        },
      },
    ]);
  }

  async resetPasswordNotification(username: string): Promise<void> {
    await mailer.send([
      {
        to: this.to,
        from: this.from,
        templateId: String(process.env.SENDGRID_USER_PASSWORD_RESET_REQUEST),
        dynamicTemplateData: {
          username,
        },
      },
    ]);
  }
}
