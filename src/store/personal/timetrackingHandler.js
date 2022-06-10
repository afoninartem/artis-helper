export default {
	state: {
		timeTrackSenesys: null,
		employeesNames: null,
		googleData: null,
    // finalData: null,
	},
	mutations: {
		setEmployeesNames(state, payload) {
			state.employeesNames = payload;
		},
		addSenesysTimeTrackReportData(state, payload) {
			state.timeTrackSenesys = payload;
		},
		setGoogleData(state, payload) {
			state.googleData = payload;
		},
	},
	actions: {
		async addSenesysTimeTrackReportData({ commit, getters }, payload) {
			const employees = []; //{name, timeTrackData, dinners}
			const employeesNames = getters.getEmployeesNames;
			const gsData = Array.from(getters.getGoogleData);
			let start = null,
				end = null,
				name = null;
			payload.forEach((row, i) => {
				if (
					row.__EMPTY_3 === "Имя клиента:" &&
					employeesNames.includes(row.__EMPTY_4)
				) {
					start = i + 2;
					name = row.__EMPTY_4
						.split(" ")
						.map((e) => e.trim())
						.join(" ");
				}
				if (
					row.__EMPTY_3 === "Имя клиента:" &&
					!employeesNames.includes(row.__EMPTY_4)
				) {
					start = null;
					end = null;
					name = null;
				}
				if (row.__EMPTY_5 === "Итого:" && name) {
					end = i;
					const dinners = payload
						.slice(start, end)
						.filter((d) => d.__EMPTY_8 !== "00:00:00").length;
					const timeTrackData = row.__EMPTY_8.split(":");
					timeTrackData[0] -= dinners;
					employees.push({name, timeTrackData: timeTrackData.join(":"), dinners })
					start = null;
					end = null;
					name = null;
				}
			});
      gsData.forEach((d) => {
        d.employees.forEach(e => {
          const employee = e;
          const senesysInfo = employees.filter(em => em.name === e["ФИО"])[0]
          employee["Часы УРВ (без обедов)"] = senesysInfo ? senesysInfo.timeTrackData : "нет отметок";
          const normaMinutes = employee["Норма часов"] * 60;
          const totalMinutesTS = employee["Итого часов"] * 60;

          const senesysWorkTimeMinutes =
            employee["Часы УРВ (без обедов)"] !== "нет отметок"
              ? !employee["Часы УРВ (без обедов)"].includes("-")
                ? employee["Часы УРВ (без обедов)"].split(":").length === 2
                  ? +employee["Часы УРВ (без обедов)"].split(":")[0] * 60 +
                  +employee["Часы УРВ (без обедов)"].split(":")[1]
                  : +employee["Часы УРВ (без обедов)"].split(":")[0] * 60
                : employee["Часы УРВ (без обедов)"].split(":").length === 2
                ? (+employee["Часы УРВ (без обедов)"]
                    .split("-")
                    .filter((f) => f != "")
                    .join("")
                    .split(":")[0] *
                    60 +
                    -employee["Часы УРВ (без обедов)"].split(":")[1])
                : +employee["Часы УРВ (без обедов)"]
                    .split("-")
                    .filter((f) => f != "")
                    .join("")
                    .split(":")[0] * -60
              : employee["Часы УРВ (без обедов)"];

          const diff =
            typeof totalMinutesTS === "number" &&
            typeof senesysWorkTimeMinutes === "number"
              ? totalMinutesTS - senesysWorkTimeMinutes
              : "нет отметок";

          employee["Расхождение табель - УРВ"] =
            typeof diff === "number"
              ? `${
                  diff > 0 ? Math.floor(diff / 60) : -Math.floor(-diff / 60)
              }:${
                  Math.abs(diff % 60) > 9
                    ? Math.abs(diff % 60)
                    : "0" + Math.abs(diff % 60)
              }`
              : "нет отметок";

        const overJobHoursSenesys = typeof senesysWorkTimeMinutes === "number"
              ? senesysWorkTimeMinutes - normaMinutes
              : senesysWorkTimeMinutes;

          employee["Переработка по УРВ"] = typeof senesysWorkTimeMinutes === "number"
          ? overJobHoursSenesys > 0
            ? overJobHoursSenesys % 60
              ? `${Math.floor(overJobHoursSenesys / 60)}:${
                  overJobHoursSenesys % 60 > 9
                    ? overJobHoursSenesys % 60
                    : "0" + (overJobHoursSenesys % 60)
                }`
              : overJobHoursSenesys / 60
            : overJobHoursSenesys % 60
            ? `${-Math.floor(-overJobHoursSenesys / 60)}:${
                -overJobHoursSenesys % 60 > 9
                  ? -overJobHoursSenesys % 60
                  : "0" + (-overJobHoursSenesys % 60)
              }`
            : overJobHoursSenesys / 60
          : senesysWorkTimeMinutes;
        }) 
      });
      gsData.push({department: "Уволенные", employees: []})
      
			// return await commit("addSenesysTimeTrackReportData", employees);
			return await commit("addSenesysTimeTrackReportData", gsData);
		},
		async setEmployeesNames(context, payload) {
			return await context.commit("setEmployeesNames", payload);
		},
		async setGoogleData(context, payload) {
			return await context.commit("setGoogleData", payload);
		},
	},
	getters: {
		getTimeTrackSenesys: (state) => {
			return state.timeTrackSenesys;
		},
		getEmployeesNames: (state) => {
			return state.employeesNames;
		},
		getGoogleData: (state) => {
			return state.googleData;
		},
	},
};
