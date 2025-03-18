import {
	InputOTP,
	InputOTPGroup,
	InputOTPSlot,
} from "@/components/ui/input-otp";
import { REGEXP_ONLY_DIGITS_AND_CHARS } from "input-otp";

export default function InputOTP4Digit({ value, setValue, autoFocus = false }) {
	return (
		<InputOTP
			maxLength={4}
			pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
			value={value}
			onChange={(value) => setValue(value)}
			autoFocus={autoFocus}
		>
			{[0, 1, 2, 3].map((_, index) => (
				<InputOTPGroup key={index} className="mx-1">
					<InputOTPSlot index={index} className="size-12 text-[18px]" />
				</InputOTPGroup>
			))}
		</InputOTP>
	);
}
