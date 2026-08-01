"use client";

import Swal, { type SweetAlertIcon } from "sweetalert2";

export function showToast(title: string, icon: SweetAlertIcon = "success") {
  return Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 2800,
    timerProgressBar: true,
    customClass: {
      popup: "rounded-lg"
    }
  }).fire({
    icon,
    title
  });
}

export function showErrorToast(title: string) {
  return showToast(title, "error");
}

export function showSuccessAlert(title: string, text?: string) {
  return Swal.fire({
    icon: "success",
    title,
    text,
    timer: 1100,
    timerProgressBar: true,
    showConfirmButton: false,
    customClass: {
      popup: "rounded-lg"
    }
  });
}

export function showErrorAlert(title: string, text?: string) {
  return Swal.fire({
    icon: "error",
    title,
    text,
    confirmButtonText: "ตกลง",
    confirmButtonColor: "#1f7a5c",
    customClass: {
      popup: "rounded-lg"
    }
  });
}

export function showInfoAlert(title: string, text?: string) {
  return Swal.fire({
    icon: "info",
    title,
    text,
    timer: 900,
    timerProgressBar: true,
    showConfirmButton: false,
    customClass: {
      popup: "rounded-lg"
    }
  });
}
