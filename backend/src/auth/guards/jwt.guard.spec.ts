import { JwtGuard } from './jwt.guard';
import { Reflector } from '@nestjs/core';

type JwtGuardWithMock = JwtGuard & { _mockSuperCanActivate?: jest.Mock };

describe('JwtGuard', () => {
    let reflector: Reflector;
    let guard: JwtGuardWithMock;
    let context: any;
    let superCanActivateSpy: jest.SpyInstance;
    let mockSuperCanActivate: jest.Mock;

    beforeAll(() => {
        // Mock the parent AuthGuard('jwt') canActivate globally
        superCanActivateSpy = jest
            .spyOn(Object.getPrototypeOf(JwtGuard.prototype), 'canActivate')
            .mockImplementation(function (
                this: JwtGuardWithMock,
                ...args: any[]
            ): any {
                if (this && typeof this._mockSuperCanActivate === 'function') {
                    return this._mockSuperCanActivate(...args);
                }
                return 'super-result';
            });
    });

    afterAll(() => {
        superCanActivateSpy.mockRestore();
    });

    beforeEach(() => {
        reflector = { getAllAndOverride: jest.fn() } as any;
        guard = new JwtGuard(reflector) as JwtGuardWithMock;
        mockSuperCanActivate = jest.fn().mockReturnValue('super-result');
        guard._mockSuperCanActivate = mockSuperCanActivate;
        context = {
            getHandler: jest.fn(),
            getClass: jest.fn(),
            switchToHttp: jest.fn().mockReturnThis(),
            getRequest: jest.fn().mockReturnValue({ logIn: jest.fn() }),
        };
    });

    it('should be defined', () => {
        expect(guard).toBeDefined();
    });

    it('should return true if isPublic is true', () => {
        (reflector.getAllAndOverride as jest.Mock).mockReturnValue(true);
        expect(guard.canActivate(context)).toBe(true);
    });

    it('should call super.canActivate if isPublic is false', () => {
        (reflector.getAllAndOverride as jest.Mock).mockReturnValue(false);
        mockSuperCanActivate.mockReturnValue('mocked-super');
        const result = guard.canActivate(context);
        expect(mockSuperCanActivate).toHaveBeenCalledWith(context);
        expect(result).toBe('mocked-super');
    });
});
