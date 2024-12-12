const firebaseErrorMessages = {
  "auth/invalid-credential":
    "The provided user and password are not correct. Please try again.",
  "auth/user-not-found": "No account found with this email. Please sign up.",
  "auth/wrong-password": "The password is incorrect. Please try again.",
  "auth/too-many-requests": "Too many login attempts. Please try again later.",
  "auth/email-already-in-use":
    "This email is already associated with another account.",
  "auth/weak-password":
    "The password is too weak. Please use a stronger password.",
  "auth/network-request-failed":
    "A network error occurred. Please check your connection.",
};

export const getFriendlyErrorMessage = (errorCode) => {
  return (
    firebaseErrorMessages[errorCode] ||
    "An unexpected error occurred. Please try again."
  );
};
