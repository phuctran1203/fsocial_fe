import DOMPurify from "dompurify";

export function getTextboxData(textbox) {
	const childNodes = Array.from(textbox.current.childNodes);
	let start = null;
	let end = null;
	let index = 0;
	while (true) {
		if (index > childNodes.length - 1) {
			console.log("Không có gì để gửi");
			return { innerText: null, innerHTML: null };
		}

		if (childNodes[index].textContent.trim() != "") {
			if (start === null) {
				start = index;
				index = childNodes.length - 1;
				continue;
			} else {
				end = index;
				break;
			}
		}
		if (start !== null) {
			index -= 1;
		} else {
			index += 1;
		}
	}

	const processed = childNodes.slice(start, end + 1);
	// console.log("after process: ", processed);
	const innerText = processed.map((el) => el.textContent).join("");
	let innerHTML = processed
		.map((el) => (el.nodeType === 3 ? el.textContent : el.outerHTML))
		.join("");
	innerHTML = DOMPurify.sanitize(innerHTML); // Loại bỏ mã độc hại
	return { innerText, innerHTML };
}
