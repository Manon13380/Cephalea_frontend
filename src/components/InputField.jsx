
export default function InputField({
    type = "text",
    value,
    onChange,
    placeholder,
    className = "",
    ...rest
  }) {
    return (
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full py-2 px-3 rounded bg-transparent border border-white/30 text-white placeholder-white/60 text-center ${className}`}
        {...rest}
      />
    );
  }
  