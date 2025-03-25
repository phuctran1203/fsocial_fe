import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

export function Field({
	type = "text",
	name,
	id,
	label = "Label",
	initValue,
	className = "",
	pattern = ".*",
	required = false,
	compareFunction = () => true,
	errorMessage = "Hãy bổ sung lỗi",
	children,
	store,
	allowTab = true,
	autoComplete = "off",
}) {
	const { form, updateField } = store();

	const validate = (value) => {
		let compareResult = false;
		compareResult = required ? value !== "" : true;
		compareResult = compareResult ? new RegExp(pattern).test(value) : false;
		compareResult = compareResult ? compareFunction(value) : false;
		return compareResult;
	};

	const handleChange = (e) => {
		let value = e.target.value;
		let compareResult = validate(value);
		updateField(id, { value: value, isValid: compareResult });
	};

	const handleFocusField = (e) => {
		if (form[id].isValid || form[id].isTouched) return;
		let value = e.target.value;
		let compareResult = validate(value);
		updateField(id, { value: value, isValid: compareResult, isTouched: true });
	};

	useEffect(() => {
		if (initValue) {
			updateField(id, { value: initValue, isValid: true, isTouched: true });
		}
	}, [initValue]);

	return (
		<div className={className}>
			<div className="relative">
				<input
					type={type}
					name={name}
					id={id}
					placeholder=""
					value={form[id].value}
					className={cn(
						"peer md:p-3 p-3.5 w-full bg-transparent border outline-none rounded transition-all duration-100",
						!form[id].isTouched || form[id].isValid
							? "hover:border-hover focus:border-hover"
							: "border-red-600 focus:border-red-600 hover:border-red-600"
					)}
					tabIndex={allowTab ? 0 : -1}
					autoComplete={autoComplete}
					onChange={handleChange}
					onFocus={form[id].isTouched ? () => {} : handleFocusField}
				/>
				<span className="absolute right-3 top-1/2 -translate-y-1/2 w-4">
					{children}
				</span>
				<label
					htmlFor={id}
					className={cn(
						`absolute bg-background rounded-sm px-1.5 top-0 left-2 -translate-y-1/2 
						peer-placeholder-shown:top-1/2 peer-hover:top-0 peer-focus:top-0 transition`,
						!form[id].isTouched || form[id].isValid
							? "peer-hover:text-primary-text peer-focus:text-primary-text peer-placeholder-shown:text-gray"
							: "text-red-600 peer-hover:text-red-600 peer-focus:text-red-600"
					)}
				>
					{label}
				</label>
			</div>
			<span
				className={cn(
					"fs-xs text-red-600",
					!form[id].isTouched || form[id].isValid ? "hidden" : "block"
				)}
			>
				*{errorMessage}
			</span>
		</div>
	);
}

export function Select({
	name,
	id,
	label = "Label",
	className = "",
	store,
	options = { key1: "sample1", key2: "sample2" },
	allowTab = true,
	disable = false,
}) {
	const { form, updateField } = store();
	const handleChange = (e) => {
		const value = e.target.value;
		console.log(value);

		updateField(id, { value });
	};
	return (
		<div
			className={`relative ${className} group ${
				disable && "pointer-events-none opacity-60"
			}`}
		>
			<select
				name={name}
				id={id}
				className={`
					bg-transparent md:p-3 p-3.5 w-full ring-1 ring-gray-light ring-inset outline-none rounded appearance-none cursor-pointer 
					${
						!disable
							? "group-hover:ring-gray focus:ring-gray focus:shadow-md"
							: "pointer-events-none"
					}
					transition-all duration-100 `}
				tabIndex={allowTab ? 0 : -1}
				onChange={disable ? () => {} : handleChange}
				value={form[id].value}
			>
				{Object.keys(options).map((key) => {
					return (
						<option key={key} value={key} className="bg-background">
							{options[key]}
						</option>
					);
				})}
			</select>
			<label
				htmlFor={id}
				className="absolute bg-background px-2 top-0 left-2 -translate-y-1/2 rounded-sm"
			>
				{label}
			</label>
			<span className="absolute right-2 top-1/2 -translate-y-1/2 w-4">
				<svg
					className="w-full aspect-square"
					viewBox="0 0 28 28"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						className="fill-gray-light ring-gray-light group-hover:fill-gray transition-all duration-100"
						d="M15.2357 22.2359C14.5521 22.9195 13.442 22.9195 12.7584 22.2359L2.2584 11.7359C1.5748 11.0524 1.5748 9.9422 2.2584 9.25861C2.94199 8.57501 4.05215 8.57501 4.73574 9.25861L13.9998 18.5227L23.2639 9.26407C23.9475 8.58048 25.0576 8.58048 25.7412 9.26407C26.4248 9.94767 26.4248 11.0578 25.7412 11.7414L15.2412 22.2414L15.2357 22.2359Z"
					/>
				</svg>
			</span>
		</div>
	);
}

export function TextBox({
	texboxRef,
	placeholder,
	innerHTML,
	contentEditable = true,
	onKeyDown = () => {},
	autoFocus = false,
	trigger = false,
	className,
}) {
	const onInput = (e) => {
		if (e.target.innerHTML == "<br>") e.target.innerHTML = "";
	};

	useEffect(() => {
		if (autoFocus) {
			setTimeout(() => {
				if (!texboxRef.current) return;
				texboxRef.current.focus();
				const range = document.createRange();
				const selection = window.getSelection();

				if (texboxRef.current.lastChild) {
					range.setStartAfter(texboxRef.current.lastChild); // Đặt con trỏ sau thẻ <a>
					range.collapse(true); // true => con trỏ sẽ đặt sau phần tử cuối
					selection.removeAllRanges();
					selection.addRange(range);
				}
			}, 200);
		}
	}, [trigger]);

	return (
		<div
			ref={texboxRef}
			className={cn(
				`
			relative w-full outline-none overflow-auto scroll-pb-2
			before:absolute before:ps-0.5 empty:before:content-[attr(data-placeholder)] before:text-gray before:pointer-events-none transition`,
				className
			)}
			contentEditable={contentEditable}
			data-placeholder={placeholder}
			onKeyDown={onKeyDown}
			onInput={onInput}
			dangerouslySetInnerHTML={{ __html: innerHTML }}
		></div>
	);
}
