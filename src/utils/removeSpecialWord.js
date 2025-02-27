export function removeVietnameseAccents(str) {
	return str
		.normalize("NFD") // Tách dấu ra khỏi chữ cái
		.replace(/[\u0300-\u036f]/g, "") // Xóa dấu
		.replace(/\s+/g, "") // Xóa khoảng trắng
		.toLowerCase(); // Chuyển thành chữ thường
}
