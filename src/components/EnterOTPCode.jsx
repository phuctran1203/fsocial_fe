import { useEffect, useRef, useState } from "react";

import React from "react";

export default function EnterOTPCode({ OTPValue, setOTPValue, allowTab = true, autoFocus = false }) {
	// Handle nhập mã OTP xác minh email
	const inputsOTPRef = useRef([]);

	const setInputsOTPRef = (index) => (element) => {
		inputsOTPRef.current[index] = element;
	};

	const jump = (index) => {
		inputsOTPRef.current[index]?.focus();
	};

	const handleInputOTPChange = (e, currentInputIndex) => {
		const nextInputIndex = currentInputIndex + 1;
		const oldValue = OTPValue[currentInputIndex];
		const currentValue = e.target.value;

		if (currentValue === "") {
			// có kí tự vừa bị xóa trong input
			setOTPValue((prev) => {
				const arr = [...prev];
				arr[currentInputIndex] = "";
				return arr;
			});
			return;
		}
		// có kí tự vừa được nhập vào input
		// Input trước đấy đã có giá trị -> nhảy đến input kế tiếp
		if (oldValue !== "") {
			e.target.value = oldValue;
			jump(nextInputIndex);
			return;
		}
		// Input trước đấy chưa có giá trị -> update giá trị mới
		setOTPValue((prev) => {
			const arr = [...prev];
			arr[currentInputIndex] = currentValue;
			return arr;
		});
		jump(nextInputIndex);
	};

	const handleInputOTPKeyDown = (e, currentInputIndex) => {
		// Xóa giá trị mà input hiện tại đang rỗng -> tự lùi về + xóa luôn giá trị input đằng trước
		if (e.key === "Backspace" && OTPValue[currentInputIndex] === "") {
			e.preventDefault(); // ngăn onChange chạy ngay sau
			const previousInputIndex = currentInputIndex - 1;
			if (previousInputIndex < 0) return;
			inputsOTPRef.current[previousInputIndex].value = "";
			setOTPValue((prev) => {
				const arr = [...prev];
				arr[previousInputIndex] = "";
				return arr;
			});
			jump(previousInputIndex);
		}
	};

	const rendered = useRef(false);

	useEffect(() => {
		if (rendered.current && inputsOTPRef.current[0] && inputsOTPRef.current[0].value === "") {
			setTimeout(() => {
				inputsOTPRef.current[0].focus();
			}, 200);
		}
		rendered.current = true;
	}, [autoFocus]);

	return (
		<div className="px-6 flex justify-center lg:gap-6 gap-4">
			<input
				ref={setInputsOTPRef(0)}
				type="text"
				tabIndex={allowTab ? 0 : -1}
				className="bg-transparent text-xl border-2 border-[--gray-light-clr] md:size-14 size-12 text-center rounded-md focus:border-[--gray-clr] outline-none"
				inputMode="numeric"
				autoComplete="off"
				onChange={(e) => handleInputOTPChange(e, 0)}
				onKeyDown={(e) => handleInputOTPKeyDown(e, 0)}
				onPaste={(e) => e.preventDefault()}
			/>
			<input
				ref={setInputsOTPRef(1)}
				type="text"
				tabIndex={allowTab ? 0 : -1}
				className="bg-transparent text-xl border-2 border-[--gray-light-clr] md:size-14 size-12 text-center rounded-md focus:border-[--gray-clr] outline-none"
				inputMode="numeric"
				autoComplete="off"
				onChange={(e) => handleInputOTPChange(e, 1)}
				onKeyDown={(e) => handleInputOTPKeyDown(e, 1)}
				onPaste={(e) => e.preventDefault()}
			/>
			<input
				ref={setInputsOTPRef(2)}
				type="text"
				tabIndex={allowTab ? 0 : -1}
				className="bg-transparent text-xl border-2 border-[--gray-light-clr] md:size-14 size-12 text-center rounded-md focus:border-[--gray-clr] outline-none"
				inputMode="numeric"
				autoComplete="off"
				onChange={(e) => handleInputOTPChange(e, 2)}
				onKeyDown={(e) => handleInputOTPKeyDown(e, 2)}
				onPaste={(e) => e.preventDefault()}
			/>
			<input
				ref={setInputsOTPRef(3)}
				type="text"
				tabIndex={allowTab ? 0 : -1}
				className="bg-transparent text-xl border-2 border-[--gray-light-clr] md:size-14 size-12 text-center rounded-md focus:border-[--gray-clr] outline-none"
				inputMode="numeric"
				autoComplete="off"
				onChange={(e) => handleInputOTPChange(e, 3)}
				onKeyDown={(e) => handleInputOTPKeyDown(e, 3)}
				onPaste={(e) => e.preventDefault()}
			/>
		</div>
	);
}
