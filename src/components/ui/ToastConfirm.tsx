/*********************************************************************
                            IMPORTS
*********************************************************************/
import { Toast } from 'react-hot-toast';
import toast from 'react-hot-toast';

/*********************************************************************
                            INTERFACES
*********************************************************************/
export interface ToastConfirmProps {
  message: string;
  subMessage?: string;
  onConfirm: () => Promise<void>;
  onCancel?: () => void;
  t: Toast;
  confirmText?: string;
  cancelText?: string;
}

/*********************************************************************
                            COMPONENT
*********************************************************************/
export const ToastConfirm = ({
  message,
  subMessage,
  onConfirm,
  onCancel,
  t,
  confirmText = 'Delete',
  cancelText = 'Cancel'
}: ToastConfirmProps) => {
  return (
    <div className="flex flex-col gap-4 bg-white p-4 rounded-lg shadow-lg border border-gray-200">
      <p className="text-black font-medium">{message}</p>
      {subMessage && (
        <p className="text-sm text-gray-600">{subMessage}</p>
      )}
      <div className="flex justify-end gap-2">
        <button
          className="px-4 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
          onClick={() => {
            if (onCancel) onCancel();
            toast.dismiss(t.id);
          }}
        >
          {cancelText}
        </button>
        <button
          className="px-4 py-2 text-sm bg-red-500 hover:bg-red-600 text-white rounded-md transition-colors"
          onClick={async () => {
            await onConfirm();
            toast.dismiss(t.id);
          }}
        >
          {confirmText}
        </button>
      </div>
    </div>
  );
}; 