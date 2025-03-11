import { Link } from "react-router-dom";
import "./Button.scss";
import { cn } from "@/lib/utils";

export default function Button({
  to,
  onClick = () => {},
  className,
  children = "Need content",
  allowTab = true,
}) {
  if (to) {
    return (
      <Link
        to={to}
        className={cn(className)}
        tabIndex={allowTab ? 0 : -1}
        onClick={onClick}
      >
        {children}
      </Link>
    );
  }

  return (
    <button
      className={cn(className)}
      tabIndex={allowTab ? 0 : -1}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
