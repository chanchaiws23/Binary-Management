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

