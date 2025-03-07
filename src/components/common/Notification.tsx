import { Snackbar, Alert } from "@mui/material";
import React, { Dispatch, SetStateAction } from "react";

function Notification({
  message,
  setMessage,
}: {
  message: { message: string; severity: "error" | "info" | "success" | "warning"; open: boolean };
  setMessage: Dispatch<SetStateAction<{ message: string; severity: "error" | "info" | "success" | "warning"; open: boolean }>>;
}) {
  return (
    <Snackbar
      open={message?.open}
      autoHideDuration={3500}
      onClose={() => {
        setMessage({ ...message, open: false });
      }}
    >
      <Alert
        onClose={() => {
          setMessage({ ...message, open: false });
        }}
        severity={message?.severity}
        variant="filled"
        sx={{ width: "100%" }}
      >
        {message?.message}
      </Alert>
    </Snackbar>
  );
}

export default Notification;
