const senderEmail = import.meta.env.SENDER_EMAIL_ADDRESS;
const senderName = import.meta.env.SENDER_EMAIL_NAME;
const TemplateID = Number(import.meta.env.MAILJET_TEMPLATE_ID);
const TemplateIDNotComing = Number(import.meta.env.MAILJET_REJECT_TEMPLATE_ID);


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


export const sendNotComingEmail = async (email: string, firstName: string, lastName: string): Promise<void> => {
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
                Email: import.meta.env.TEST_EMAIL, // TODO: Replace with user email
                Name: `${firstName} ${lastName}`
              }
            ],
            Variables: {
              first_name: firstName,
              last_name: lastName
            },
            TemplateID: TemplateIDNotComing,
            TemplateLanguage: true,
            Subject: `H&G | We'll Miss Ya!`,
            CustomID: "WeddingEmail"
          }
        ]
      });

    console.log(result.body);
  } catch (err) {
    console.error('Failed to send reject email', err);
  }
}

export const sendEmail = async (email: string, firstName: string, lastName: string, dietary_requirements: string): Promise<void> => {
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
                Email: import.meta.env.TEST_EMAIL, // TODO: Replace with user email
                Name: `${firstName} ${lastName}`
              }
            ],
            Variables: {
              first_name: firstName,
              last_name: lastName,
              dietary_requirements: dietary_requirements
            },
            TemplateID: TemplateID,
            TemplateLanguage: true,
            Subject: `H&G | You're on the Guest List!`,
            CustomID: "WeddingEmail"
          }
        ]
      });

    console.log(result.body);
  } catch (err) {
    console.error('Failed to send email', err);
  }
};
