import { cn } from "@/lib/utils";
import { useEffect } from "react";

export function Input({
	register,
	errors,
	label,
	placeholder,
	name,
	validateOptions,
	icon,
	disabled = false,
	type = "text",
	className,
}) {
	return (
		<label
			className={cn(
				"block",
				disabled && "pointer-events-none opacity-65",
				className
			)}
		>
			<span className="block mb-2 font-medium">{label}</span>
			<div className="relative">
				<input
					type={type}
					placeholder={placeholder}
					className={cn(
						"custom-input",
						errors && errors[name] && "custom-input-error",
						disabled && "pointer-events-none"
					)}
					tabIndex={disabled ? -1 : 0}
					{...register(name, validateOptions)}
				/>
				<div
					className={cn(
						"absolute top-1/2 right-0 -translate-x-1/2 -translate-y-1/2",
						errors && errors[name]
							? "text-red-500"
							: "text-gray peer-hover:text-primary-text peer-focus:text-primary-text"
					)}
				>
					{icon}
				</div>
			</div>
			{errors && errors[name] && (
				<p className="text-red-500">{errors[name].message}</p>
			)}
		</label>
	);
}

export function JumpingInput({
	register,
	errors,
	label,
	name,
	validateOptions,
	icon,
	className,
	disabled = false,
	type = "text",
}) {
	return (
		<div
			className={cn(disabled && "pointer-events-none opacity-65", className)}
		>
			<div className="relative">
				<input
					type={type}
					placeholder=""
					className={cn(
						"peer custom-input",
						errors && errors[name] && "custom-input-error",
						disabled && "pointer-events-none"
					)}
					tabIndex={disabled ? -1 : 0}
					{...register(name, validateOptions)}
				/>

				<span
					className={cn(
						`fs-sm text-gray absolute bg-background rounded-sm px-1.5 top-0 left-2 -translate-y-1/2 pointer-events-none
						peer-placeholder-shown:top-1/2 peer-hover:top-0 peer-focus:top-0 transition`,
						errors && errors[name]
							? "text-red-500"
							: "text-gray peer-hover:text-primary-text peer-focus:text-primary-text"
					)}
				>
					{label}
				</span>

				<div
					className={cn(
						"absolute top-1/2 right-0 -translate-x-1/2 -translate-y-1/2",
						errors && errors[name]
							? "text-red-500"
							: "text-gray peer-hover:text-primary-text peer-focus:text-primary-text"
					)}
				>
					{icon}
				</div>
			</div>

			{errors && errors[name] && (
				<p className="text-red-500">{errors[name].message}</p>
			)}
		</div>
	);
}

export function Select({
	register,
	errors,
	label,
	name,
	validateOptions,
	options = { key1: "sample1", key2: "sample2" },
	icon,
	disabled = false,
	className,
}) {
	return (
		<label
			className={cn(
				"block",
				disabled && "pointer-events-none opacity-65",
				className
			)}
		>
			<span className="block mb-2 font-medium">{label}</span>
			<div className="relative">
				<select
					className={cn(
						"peer appearance-none custom-input cursor-pointer",
						errors && errors[name] && "custom-input-error"
					)}
					{...register(name, validateOptions)}
				>
					{Object.keys(options).map((key) => {
						return (
							<option key={key} value={key} className="bg-background">
								{options[key]}
							</option>
						);
					})}
				</select>
				<div className="absolute top-1/2 right-0 -translate-x-1/2 -translate-y-1/2">
					{icon}
				</div>
			</div>
			{errors && errors[name] && (
				<p className="text-red-500">{errors[name].message}</p>
			)}
		</label>
	);
}

export function JumpingSelect({
	register,
	errors,
	label,
	name,
	validateOptions,
	options = { key1: "sample1", key2: "sample2" },
	icon,
	disabled = false,
	className,
}) {
	return (
		<div
			className={cn(disabled && "pointer-events-none opacity-65", className)}
		>
			<div className="relative">
				<select
					className={cn(
						"peer appearance-none custom-input cursor-pointer",
						errors && errors[name] && "custom-input-error",
						disabled && "pointer-events-none"
					)}
					tabIndex={disabled ? -1 : 0}
					{...register(name, validateOptions)}
				>
					{Object.keys(options).map((key) => {
						return (
							<option key={key} value={key} className="bg-background">
								{options[key]}
							</option>
						);
					})}
				</select>

				<span
					className={cn(
						`fs-sm text-gray absolute bg-background rounded-sm px-1.5 top-0 left-2 -translate-y-1/2 transition`,
						errors && errors[name]
							? "text-red-500"
							: "peer-hover:text-primary-text peer-focus:text-primary-text"
					)}
				>
					{label}
				</span>

				<div className="absolute top-1/2 right-0 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
					{icon}
				</div>
			</div>

			{errors && errors[name] && (
				<p className="text-red-500">{errors[name].message}</p>
			)}
		</div>
	);
}

export function TextBox({
	texboxRef,
	label,
	placeholder,
	innerHTML,
	contentEditable = true,
	onKeyDown = () => {},
	onInput = () => {},
	autoFocus = false,
	trigger = false,
	className,
	parentClassName,
}) {
	const onAutoInput = (e) => {
		if (e.target.innerHTML == "<br>") e.target.innerHTML = "";
		onInput();
	};

	useEffect(() => {
		if (autoFocus) {
			setTimeout(() => {
				if (!texboxRef.current) return;
				texboxRef.current.focus();
				const range = document.createRange();
				const selection = window.getSelection();

				if (texboxRef.current.lastChild) {
					range.setStartAfter(texboxRef.current.lastChild);
					range.collapse(true); // true => con trỏ sẽ đặt sau phần tử cuối
					selection.removeAllRanges();
					selection.addRange(range);
				}
			}, 200);
		}
	}, [trigger]);

	return (
		<div className={cn("w-full", parentClassName)}>
			{label && <span className="block mb-2 font-medium">{label}</span>}
			<div
				ref={texboxRef}
				className={cn(
					`text-base relative w-full outline-none overflow-auto scroll-pb-2
					before:absolute before:ps-0.5 empty:before:content-[attr(data-placeholder)] before:text-gray before:pointer-events-none transition`,
					className
				)}
				contentEditable={contentEditable}
				data-placeholder={placeholder}
				onKeyDown={onKeyDown}
				onInput={onAutoInput}
				dangerouslySetInnerHTML={{ __html: innerHTML }}
			></div>
		</div>
	);
}
