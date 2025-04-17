import Swal from "sweetalert2";

type DialogProps = {
  title?: string;
  text?: string;
  showConfirmButton?: boolean;
  confirmText?: string;
  showCancelText?: boolean;
  cancelText?: string;
  timer?: number
};

export const ConfirmDialog = async (data: DialogProps) => {
  return Swal.fire({
    title: data.title || "",
    text: data.text || "",
    icon: "question",
    showConfirmButton: data.showConfirmButton || false,
    confirmButtonText: data.confirmText || "Yes",
    showCancelButton: data.showCancelText || false,
    cancelButtonText: data.cancelText || "No",
    timer: data.timer || undefined
  });
};

export const SuccessDialog = async (data: DialogProps) => {
  return Swal.fire({
    title: data.title || "Success",
    text: data.text || "",
    icon: "success",
    showConfirmButton: data.showConfirmButton || false,
    confirmButtonText: data.confirmText || "Yes",
    showCancelButton: data.showCancelText || false,
    cancelButtonText: data.cancelText || "No",
    timer: data.timer || undefined,
  });
};

export const WarningDialog = async (data: DialogProps) => {
  return Swal.fire({
    title: data.title || "Warning",
    text: data.text || "",
    icon: "warning",
    showConfirmButton: data.showConfirmButton || false,
    confirmButtonText: data.confirmText || "Yes",
    showCancelButton: data.showCancelText || false,
    cancelButtonText: data.cancelText || "No",
    timer: data.timer || undefined,
  });
};
