
const testModal = require('./../../models/test')

module.exports = {
	getTestData:async function () {
        console.log("i am in controller");
		const queryJSON = {
			where: {
				d_email: 'fleet@gmail.com'
			}
        }
        const data = await testModal.get.getVehicleData();
        console.log(data);
		return queryJSON;

	}
}