import { Dispatch, SetStateAction } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/ui/alert-dialog';

export interface ConfirmDialogProps {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>> | ((open: boolean) => void);
  onConfirm: () => void;
  message: string;
}

export function ConfirmDialog({ open, setOpen, message, onConfirm }: ConfirmDialogProps) {
  return (
    <AlertDialog data-testid="confirm-dialog" open={open}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>{message}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            data-testid="cancel-delete"
            className="cursor-pointer"
            onClick={() => {
              setOpen(false);
            }}
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            data-testid="confirm-delete"
            className="cursor-pointer"
            onClick={() => {
              onConfirm();
              setOpen(false);
            }}
          >
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
