// Development mode flag - set to true for debugging
const devMode = false;

interface ParameterState {
	paramValue: string;
	utm_state: string;
}

interface ParameterData {
	paramValue: string;
	utm_state: string;
	timestamp: string;
}

/* parameterState - detects the state of a URL parameter and handles storage operations */
function parameterState(param: string): ParameterState {
	const searchParams = new URLSearchParams(window.location.search);
	let paramValue = "";
	let utm_state = "";

	// determines "state" of UTM parameter - in URL, sessionStorage, or localStorage
	if (searchParams.has(param)) {
		//if UTM parameters are present in URL
		//console.log("===== UTM values detected - in URL =====");
		utm_state = "url";
		paramValue = searchParams.get(param) || "";
		sessionStorage.setItem(param, paramValue);
		localStorage.setItem(param, paramValue);
	} else if (sessionStorage.getItem(param)) {
		//if UTM parameters are not present in URL, but are in SessionStorage
		//console.log("===== UTM values detected - in short-term session =====");
		utm_state = "sessionStorage";
		paramValue = sessionStorage.getItem(param) || "";
	} else if (localStorage.getItem(param)) {
		//if UTM parameters are not present in URL or SessionStorage, but are in LocalStorage
		//console.log("===== UTM values detected - in long-term session =====");
		utm_state = "localStorage";
		paramValue = localStorage.getItem(param) || "";
	}

	return { paramValue, utm_state };
}

/* parameterLogger - primary function that logs the value of individual UTM parameters and adds timestamp */
function parameterLogger(param: string): ParameterData {
	const parameterStateResult = parameterState(param);
	const timestamp = new Date().toISOString();
	
	//NOTES:
	//paramValue: actual value of the UTM
	//utm_state: context state of the individual value
	//timestamp: when the parameter was accessed

	return { 
		paramValue: parameterStateResult.paramValue, 
		utm_state: parameterStateResult.utm_state,
		timestamp: timestamp
	};
}

interface UTMValues {
	utm_campaign: string;
	utm_content: string;
	utm_medium: string;
	utm_source: string;
	utm_term: string;
	utm_state: string;
	timestamp: string;
}

/* ===== Get UTMS -  ===== */
function GetUTMs(): UTMValues {
	/* ===== Grab UTMs ===== */
	const utm_source_data = parameterLogger("utm_source");
	const utm_medium_data = parameterLogger("utm_medium");
	const utm_campaign_data = parameterLogger("utm_campaign");
	const utm_term_data = parameterLogger("utm_term");
	const utm_content_data = parameterLogger("utm_content");
	const utm_state = utm_source_data.utm_state;
	const timestamp = utm_source_data.timestamp;

	/* ===== Formatting for Ease Of Use ===== */
	const utm_source = utm_source_data.paramValue;
	const utm_medium = utm_medium_data.paramValue;
	const utm_campaign = utm_campaign_data.paramValue;
	const utm_term = utm_term_data.paramValue;
	const utm_content = utm_content_data.paramValue;

	/* ===== Package up data into a single object ===== */
	const utm_values: UTMValues = {
		utm_campaign: utm_campaign,
		utm_content: utm_content,
		utm_medium: utm_medium,
		utm_source: utm_source,
		utm_term: utm_term,
		utm_state: utm_state,
		timestamp: timestamp,
	};

	/* ===== console log tester ===== */
	if (devMode) {
		console.groupCollapsed("===== UTM Tracking Present =====");
		console.log("utm_source: [" + utm_values.utm_source + "]");
		console.log("utm_medium: [" + utm_values.utm_medium + "]");
		console.log("utm_campaign: [" + utm_values.utm_campaign + "]");
		console.log("utm_term: [" + utm_values.utm_term + "]");
		console.log("utm_content: [" + utm_values.utm_content + "]");
		console.log("utm_state: [" + utm_values.utm_state + "]");
		console.log("timestamp: [" + utm_values.timestamp + "]");
		console.groupEnd();
	}

	/* ===== function output ===== */
	return utm_values;
}

// Export the functions for use in other modules
export { parameterState, parameterLogger, GetUTMs };
export type { ParameterState, ParameterData, UTMValues };

