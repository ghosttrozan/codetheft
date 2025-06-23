type SignUpData = {
  name: string;
  email: string;
  password: string;
};

export const signUp = async (data: SignUpData) => {
  const response = await fetch("/api/users", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: data.name,
      email: data.email,
      password: data.password,
    }),
  });
  const responseData = await response.json();
  return responseData;
};

export const sendCode = async (email: string) => {
  const res = await fetch("/api/verify-email/send-otp", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: email,
    }),
  });
  if (res.ok) {
    return true;
  }
  return false;
};

export const verifyCode = async (email: string, code: string) => {
  const response = await fetch("/api/verify-email/verify-otp", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, otp: code }),
  });
  if (response.ok) {
    return response;
  }
  return response;
};
