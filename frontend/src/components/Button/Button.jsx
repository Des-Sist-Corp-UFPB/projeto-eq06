import "./Button.css";

function Button({ 
  btnText, 
  btnFunction, 
  imageIcon, 
  variant = "primary",
  typeBtn = "button", 
  ...rest
}) {
  return (
    <button 
      onClick={btnFunction} 
      type={typeBtn} 
      className={`btn${variant}`} 
      {...rest}
    >
      {imageIcon && <img src={imageIcon} alt="" />} 
      <span>{btnText}</span>
    </button>
  );
}

export default Button;