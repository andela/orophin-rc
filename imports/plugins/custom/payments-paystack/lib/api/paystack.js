import request from "request";

const paystackHeaders = (secret) => ({
  "Authorization": `Bearer ${secret}`,
  "Content-Type": "application/json"
});

export const Paystack = {
  verify: function (reference, secretKey, callback) {
    const headers = paystackHeaders(secretKey);
    const url = `https://api.paystack.co/transaction/verify/${reference}`;
    request.get(url, { headers }, (err, response, body) =>  {
      const res = JSON.parse(body);
      if (res.status) {
        callback(null, res);
      } else {
        callback(res, null);
      }
    });
  }
};

