describe('API Handler', () => {
  describe('module loading', () => {
    it('should export a handler function', () => {
      const handlerModule = require('../../../infrastructure/handlers/api.handler');
      expect(handlerModule.handler).toBeDefined();
      expect(typeof handlerModule.handler).toBe('function');
    });

    it('should be compatible with AWS Lambda signature', () => {
      const handlerModule = require('../../../infrastructure/handlers/api.handler');
      expect(typeof handlerModule.handler).toBe('function');
      expect(handlerModule.handler.length).toBeGreaterThanOrEqual(1); // At least event parameter
    });
  });
});
