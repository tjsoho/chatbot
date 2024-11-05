import { toast as hotToast, Toast } from 'react-hot-toast';

interface ButtonConfig {
  label: string;
  onClick: () => void;
  variant: 'primary' | 'danger' | 'cancel';
}

interface CustomToastProps {
  t: Toast;
  message: string;
  buttons: ButtonConfig[];
}

// Toast helper function
const toast = ({ message, buttons }: Omit<CustomToastProps, 't'>) => {
  return hotToast.custom((t) => (
    <CustomToast t={t} message={message} buttons={buttons} />
  ));
};

export default function CustomToast({ t, message, buttons }: CustomToastProps) {
  const getButtonStyles = (variant: string) => {
    switch (variant) {
      case 'primary':
        return 'bg-blue-500 hover:bg-blue-600 text-white';
      case 'danger':
        return 'bg-red-500 hover:bg-red-600 text-white';
      case 'cancel':
        return 'bg-gray-500 hover:bg-gray-600 text-white';
      default:
        return 'bg-gray-500 hover:bg-gray-600 text-white';
    }
  };

  return (
    <div
      className={`${
        t.visible ? 'animate-enter' : 'animate-leave'
      } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
    >
      <div className="flex-1 w-0 p-4">
        <div className="flex items-start">
          <div className="ml-3 flex-1">
            <p className="text-sm text-gray-900">
              {message}
            </p>
          </div>
        </div>
      </div>
      <div className="flex border-l border-gray-200">
        {buttons.map((button, index) => (
          <button
            key={index}
            onClick={button.onClick}
            className={`px-4 py-2 text-sm font-medium rounded-md m-2 ${getButtonStyles(button.variant)}`}
          >
            {button.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export { toast }; 