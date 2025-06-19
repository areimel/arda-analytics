describe('ARDA Analytics Plugin Basic Tests', () => {
	test('basic test to verify Jest is working', () => {
		expect(1 + 1).toBe(2);
	});

	test('should have access to test utilities', () => {
		expect(global.testUtils).toBeDefined();
		expect(global.testUtils.createMockElement).toBeDefined();
		expect(global.testUtils.createMockEvent).toBeDefined();
		expect(global.testUtils.waitFor).toBeDefined();
	});

	test('should have mocked localStorage', () => {
		expect(global.localStorage).toBeDefined();
		expect(global.localStorage.getItem).toBeDefined();
		expect(global.localStorage.setItem).toBeDefined();
	});

	test('should have mocked sessionStorage', () => {
		expect(global.sessionStorage).toBeDefined();
		expect(global.sessionStorage.getItem).toBeDefined();
		expect(global.sessionStorage.setItem).toBeDefined();
	});
}); 