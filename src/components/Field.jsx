import { useEffect } from "react";

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
					className={`
					peer md:p-3 p-3.5 w-full bg-transparent ring-1 ring-inset outline-none rounded
					${
						!form[id].isTouched || form[id].isValid
							? "ring-[--gray-light-clr] hover:ring-[--gray-clr] focus:ring-[--gray-clr]"
							: "ring-red-600 focus:ring-red-600 hover:ring-red-600"
					}
					transition-all duration-100`}
					tabIndex={allowTab ? 0 : -1}
					autoComplete={autoComplete}
					onChange={handleChange}
					onFocus={form[id].isTouched ? () => {} : handleFocusField}
				/>
				<span className="absolute right-3 top-1/2 -translate-y-1/2 w-4">{children}</span>
				<label
					htmlFor={id}
					className={`
					absolute
					peer-placeholder-shown:top-1/2  peer-placeholder-shown:bg-transparent rounded-sm
					bg-[--background-clr] px-1.5 top-0 left-2 -translate-y-1/2
                	peer-hover:top-0 peer-hover:bg-[--background-clr]  
					peer-focus:top-0 peer-focus:bg-[--background-clr]  
					${
						!form[id].isTouched || form[id].isValid
							? "peer-hover:text-[--text-black-clr] peer-focus:text-[--text-black-clr] peer-placeholder-shown:text-[--gray-clr]"
							: "text-red-600 peer-hover:text-red-600 peer-focus:text-red-600"
					}
					transition-all duration-100`}
				>
					{label}
				</label>
			</div>
			<span className={`fs-xsm text-red-600 ${!form[id].isTouched || form[id].isValid ? "hidden" : "block"}`}>
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
}) {
	const { form, updateField } = store();
	const handleChange = (e) => {
		const value = e.target.value;
		console.log(value);

		updateField(id, { value });
	};
	return (
		<div className={`relative ${className} group`}>
			<select
				name={name}
				id={id}
				className="
					bg-transparent md:p-3 p-3.5 w-full ring-1 ring-[--gray-light-clr] ring-inset outline-none rounded appearance-none cursor-pointer 
					group-hover:ring-[--gray-clr] focus:ring-[--gray-clr] focus:shadow-md
					transition-all duration-100"
				tabIndex={allowTab ? 0 : -1}
				onChange={handleChange}
				value={form[id].value}
			>
				{Object.keys(options).map((key) => {
					return (
						<option key={key} value={key}>
							{options[key]}
						</option>
					);
				})}
			</select>
			<label htmlFor={id} className="absolute bg-[--background-clr] px-2 top-0 left-2 -translate-y-1/2 rounded-sm">
				{label}
			</label>
			<span className="absolute right-2 top-1/2 -translate-y-1/2 w-4">
				<svg className="w-full aspect-square" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
					<path
						className="fill-[--gray-light-clr] group-hover:fill-[--gray-clr] transition-all duration-100"
						d="M15.2357 22.2359C14.5521 22.9195 13.442 22.9195 12.7584 22.2359L2.2584 11.7359C1.5748 11.0524 1.5748 9.9422 2.2584 9.25861C2.94199 8.57501 4.05215 8.57501 4.73574 9.25861L13.9998 18.5227L23.2639 9.26407C23.9475 8.58048 25.0576 8.58048 25.7412 9.26407C26.4248 9.94767 26.4248 11.0578 25.7412 11.7414L15.2412 22.2414L15.2357 22.2359Z"
					/>
				</svg>
			</span>
		</div>
	);
}

export function TextBox({ texboxRef, placeholder, className }) {
	return (
		<div
			ref={texboxRef}
			className={`
			relative w-full py-2 outline-none overflow-auto
			before:absolute before:ps-0.5 empty:before:content-[attr(data-placeholder)] before:text-[--gray-clr] before:pointer-events-none 
			${className}`}
			contentEditable="true"
			data-placeholder={placeholder}
		></div>
	);
}
