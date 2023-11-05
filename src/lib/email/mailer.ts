const senderEmail = import.meta.env.SENDER_EMAIL_ADDRESS;
const senderName = import.meta.env.SENDER_EMAIL_NAME;

const mailjetPromise = import('node-mailjet')
  .then(mailjetModule => {
    const Mailjet = mailjetModule.default;
    return new Mailjet({
      apiKey: import.meta.env.MAILJET_API_KEY,
      apiSecret: import.meta.env.MAILJET_SECRET_KEY
    });
  })
  .catch(error => {
    console.error('Failed to load mailjet module', error);
    throw error;
  });

export const sendEmail = async (email: string, firstName: string, lastName: string): Promise<void> => {
  try {
    const mailjet = await mailjetPromise;
    const result = await mailjet
      .post("send", { version: 'v3.1' })
      .request({
        Messages: [
          {
            From: {
              Email: senderEmail,
              Name: senderName
            },
            To: [
              {
                Email: email,
                Name: `${firstName} ${lastName}`
              }
            ],
            Subject: `You are coming to ${senderName}'s wedding!`,
            HTMLPart: `<h3>We are excited to see you at the wedding, ${firstName}!</h3>`,
            CustomID: "WeddingEmail"
          }
        ]
      });

    console.log(result.body);
  } catch (err) {
    console.error('Failed to send email', err);
    throw err;
  }
};
