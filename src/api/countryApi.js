import axios from "axios";

export async function getAllCountries() {
	const query = `
        [out:json][timeout:25];
        relation["admin_level"="2"]["ISO3166-1"~"^(ID|MY|TH|VN|SG|PH|MM|KH|LA|BN|TL)$"];
        out tags;
        `;
	try {
		const resp = await axios.post(
			"https://overpass-api.de/api/interpreter",
			query
		);
		console.log("Resp getAllCountries: ", resp);
		if (resp.status !== 200) {
			console.error(`Error ${resp.status}: ${resp}`);
			return null;
		}
		return resp;
	} catch (error) {
		console.error("Error at getAllCountries: ", error);
		return error.response || null;
	}
}

export async function getAllProvinces(countryCode) {
	const query = `
        [out:json];
        area["ISO3166-1"="${countryCode}"]->.searchArea;
        relation["admin_level"="4"](area.searchArea);
        out tags;
        `;
	try {
		const resp = await axios.post(
			"https://overpass-api.de/api/interpreter",
			query
		);
		console.log("Resp getAllProvinces: ", resp);
		if (resp.status !== 200) {
			console.error(`Error ${resp.status}: ${resp}`);
			return null;
		}
		return resp;
	} catch (error) {
		console.error("Error at getAllProvinces: ", error);
		return error.response || null;
	}
}
