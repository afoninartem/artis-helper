export default {
	state: { board: null },
	mutations: {
		generateGameBoard(state, payload) {
			state.board = payload;
		},
		swapRows(state, payload) {
			state.board = payload;
		},
	},
	actions: {
		async generateGameBoard(context, payload) {
			const nums = [];
			const range = Math.sqrt(payload.size);
			for (let i = 0; i < payload.size; i += 1) {
				for (let j = 0; j < payload.size; j += 1) {
					nums.push(Math.floor(((i * range + i / range + j) % range ** 2) + 1));
				}
			}
			const board = [];
			for (let i = 0; i < nums.length; i += payload.size) {
				board.push([...nums.slice(i, i + payload.size)]);
			}
			return await context.commit("generateGameBoard", board);
		},
		async swapRows({ getters, commit, dispatch }) {
			const board = getters.getBoard;
			const rowZones = [];
			for (let i = 0; i < board.length; i += Math.sqrt(board.length)) {
				rowZones.push(board.slice(i, i + Math.sqrt(board.length)));
			}
      // const swaped = rowZones.map(async zone => {return await dispatch("shuffle", zone).then(console.log("ok"))})
      console.log(rowZones)
      const swaped = [];
      rowZones.forEach(zone => dispatch("shuffle", zone).then(swaped.push(zone)))
			return await commit("swapRows", swaped);
		},
    async shuffle(context, payload) {
      const array = Array.from(payload);
      // const shuffleArray = array => {
        for (let i = array.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          const temp = array[i];
          array[i] = array[j];
          array[j] = temp;
        }
      // }
      console.log(array)
    }
		// async shuffle(context, payload) {
    //   // payload = [1, 2, 3]
    //   console.log('origin array ↓')
    //   console.log(payload)
		// 	let currentIndex = payload.length, randomIndex;
		// 		randomIndex;
		// 	while (currentIndex != 0) {
		// 		randomIndex = Math.floor(Math.random() * currentIndex);
		// 		currentIndex -= 1;
		// 		[payload[currentIndex], payload[randomIndex]] = [
		// 			payload[randomIndex],
		// 			payload[currentIndex],
		// 		];
		// 	}
    //   console.log("shuffled array ↓")
    //   console.log(payload)
		// 	return await payload;
		// },
		// async generateGameBoard(context, payload) {
		// 	const registry = [];
		// 	const nums = [];
		// 	for (let x = 1; x <= payload.size; x += 1) {
		// 		nums.push(x);
		// 		for (let y = 1; y <= payload.size; y += 1) {
		// 			registry.push({ x: x, y: y, value: null });
		// 		}
		// 	}
		// 	registry.forEach((cell, i) => {
		//     const range1 = [1, 2, 3];
		//     const range2 = [4, 5, 6];
		//     const range3 = [7, 8, 9];
		//     const curRangeX = range1.includes(cell.x) ? range1 : range2.includes(cell.x) ? range2 : range3;
		//     const curRangeY = range1.includes(cell.y) ? range1 : range2.includes(cell.y) ? range2 : range3;
		//     const sector_values = registry.filter(el => curRangeX.includes(el.x) && curRangeY.includes(el.y)).map(el => el.value).filter(val => val != null)
		// 		const x_values = registry.filter(el => el.x === cell.x).map(el => el.value).filter(val => val != null);
		//     console.log(`x_values: ${x_values}`)
		//     const y_values = registry.filter(el => el.y === cell.y).map(el => el.value).filter(val => val != null);
		//     console.log(`y_values: ${y_values}`)
		//     const invalidValues = x_values.concat(y_values, sector_values);
		//     console.log(`invalidValues: ${invalidValues}`)
		//     const leftNums = Array.from(nums).filter(el => !invalidValues.includes(el));
		//     console.log(i, leftNums, nums)
		//     cell.value = leftNums[Math.floor(Math.random() * (leftNums.length))];
		// 	});
		//   console.log(registry)
		//   return await context.commit("generateGameBoard", registry)
		// },
		// async generateGameBoard(context, payload) {
		// 	const registry = {};
		// 	const board = [];
		// 	const nums = [];
		// 	for (let i = 1; i <= payload.size; i += 1) {
		// 		nums.push(i);
		// 		registry[i] = [];
		// 	}
		// 	// console.log(registry);
		// 	for (let j = 0; j < payload.size; j += 1) {
		// 		const numsCopy = Array.from(nums);
		// 		const row = [];
		// 		for (let i = 0; i < payload.size; i += 1) {
		// 			let randomIndex, prop, rowNextIndex;
		// 			do {
		// 				randomIndex = Math.floor(Math.random() * numsCopy.length);
		// 				prop = numsCopy[randomIndex];
		//         console.log(`prop: ${prop}; row_next_index: ${row.length}`)
		//         rowNextIndex = row.length
		// 			} while (row.includes(prop) && registry[prop].includes(rowNextIndex));
		// 			if (registry[prop].includes(row.length - 1)) console.log("fuck");
		// 			const resultNumber = numsCopy.splice(randomIndex, 1)[0];
		// 			row.push(resultNumber);
		// 			registry[prop].push(rowNextIndex);
		//       console.log(`REGISTRY[PROP]: for prop = ${prop}`, registry[prop])
		// 		}
		// 		console.log(row)
		// 		board.push(row);
		// 	}
		// 	console.log(registry);
		// 	return await context.commit("generateGameBoard", board);
		// },
	},
	getters: {
		getBoard: (state) => {
			return state.board;
		},
	},
};
