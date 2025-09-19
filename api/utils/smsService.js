import axios from "axios";

export const sendOtp = async (phoneNumber, message) => {
  try {
    const response = await axios.post(
      "https://sms.iprogtech.com/api/v1/otp/send_otp",
      null,
      {
        params: {
          api_token: process.env.SMS_API_TOKEN,
          phone_number: phoneNumber,
          message,
        },
      }
    );
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const verifyOtp = async (phoneNumber, otp) => {
  try {
    const response = await axios.post(
      `https://sms.iprogtech.com/api/v1/otp/verify_otp`,
      null,
      {
        params: {
          api_token: process.env.SMS_API_TOKEN,
          phone_number: phoneNumber,
          otp,
        },
      }
    );
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};
