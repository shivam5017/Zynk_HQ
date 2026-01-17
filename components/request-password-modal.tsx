"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { RequestPasswordForm } from "./request-password-form";

export function RequestPasswordModal({ open, setOpen }: { open: boolean; setOpen: (v: boolean) => void }) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-md backdrop-blur-xl ">
        <DialogHeader>
          <DialogTitle>Request password reset</DialogTitle>
        </DialogHeader>

        <RequestPasswordForm isModal />
      </DialogContent>
    </Dialog>
  );
}
