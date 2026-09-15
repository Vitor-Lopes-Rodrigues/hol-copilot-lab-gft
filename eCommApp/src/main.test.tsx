import { ReactElement } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const { createRootMock, renderMock } = vi.hoisted(() => ({
    createRootMock: vi.fn(),
    renderMock: vi.fn()
}));

vi.mock('react-dom/client', () => ({
    default: {
        createRoot: createRootMock
    }
}));

vi.mock('./App.tsx', () => ({
    default: () => <div>App</div>
}));

describe('main entry point', () => {
    beforeEach(() => {
        vi.resetModules();
        createRootMock.mockReturnValue({ render: renderMock });
        document.body.innerHTML = '<div id="root"></div>';
    });

    it('creates the root and renders the application', async () => {
        await import('./main');

        expect(createRootMock).toHaveBeenCalledWith(document.getElementById('root'));
        expect(renderMock).toHaveBeenCalledTimes(1);
        expect((renderMock.mock.calls[0][0] as ReactElement).type).toBeDefined();
    });
});