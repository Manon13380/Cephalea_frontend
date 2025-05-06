
export default function Button({
    children,
    type = "button",
    onClick,
    className = "",
    ...rest
  }) {
    return (
      <button
        type={type}
        onClick={onClick}
        className={`w-full py-2 px-3 bg-[#40A895] text-white rounded ${className}`}
        {...rest}
      >
        {children}
      </button>
    );
  }
  