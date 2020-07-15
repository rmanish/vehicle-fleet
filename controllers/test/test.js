

module.exports = {
	getTestData: function () {
        console.log("i am in controller");
		const queryJSON = {
			where: {
				d_email: 'fleet@gmail.com'
			}
		}
			return queryJSON;

	}
}