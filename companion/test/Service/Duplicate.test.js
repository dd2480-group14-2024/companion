import { jest } from '@jest/globals'
import { mock } from 'jest-mock-extended'

import ControlButtonNormal from '../../lib/Controls/ControlTypes/Button/Normal.js';

const mockOptions = {
	fallbackMockImplementation: () => {
		throw new Error('not mocked')
	}
}

describe('Duplicate', () => {
	function createService() {
		const logger = mock(
			{
			info: jest.fn(),
			debug: jest.fn(),
			},
			mockOptions
		);
		const logController = mock(
			{
			createLogger: () => logger,
			},
			mockOptions
		);
		const registry = mock(
			{
				log: logController,
				surfaces: mock({}, mockOptions),
				page: mock({}, mockOptions),
				controls: mock({}, mockOptions),
				instance: mock(
					{
					variable: mock(
						{
						custom: mock({}, mockOptions),
						},
						mockOptions
					)
					},
					mockOptions),
				db: mock(
					{
						setKey: jest.fn()
					},
					mockOptions
				),
				io: mock(
					{
						countRoomMembers: jest.fn()
					}, 
					mockOptions
				),
			},
			mockOptions
		);
	
		return registry;
	}

	describe('Duplicate step test', () => {
		beforeEach(() => {
			jest.useFakeTimers()
		})

		test('Duplicate step test', async () => {
			const registry = createService();

			const controlButtonInstance = new ControlButtonNormal(registry, "0", null, false);

			const stepId = controlButtonInstance.stepAdd();

			const duplicateId = controlButtonInstance.stepDuplicate(stepId);

			const cbi = JSON.parse(JSON.stringify(controlButtonInstance, null, 2));

			expect(parseInt(stepId)).toBe(parseInt(duplicateId) - 1);
			expect(cbi.steps[stepId]).toEqual(cbi.steps[duplicateId]);
			expect(cbi.steps[stepId]).not.toBe(cbi.steps[duplicateId]);
		});
	})
})