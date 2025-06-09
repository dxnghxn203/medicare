import {NextResponse} from 'next/server';
import type {NextRequest} from 'next/server';

export function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname;

    const publicPaths = [
        '/',
        '/dang-nhap',
        '/register',
        '/contact',
        '/api/',
    ];
    const privatePaths = [
        '/gio-hang',
        '/thanh-toan',
        '/thong-tin-don-hang',
        '/thong-tin-ca-nhan',
    ]

    const isStaticFile = /\.(js|css|png|jpg|jpeg|gif|svg|ico|webp)$/.test(path);

    const isPathMatched = publicPaths.some(publicPath => {
        if (publicPath.endsWith('/')) {
            return path.startsWith(publicPath);
        }
        return path === publicPath;
    });


    if (!isStaticFile && !isPathMatched) {
        const url = request.nextUrl.clone();
        url.pathname = '/error';
        url.searchParams.set('code', '404');
        return NextResponse.rewrite(url);
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico).*)',
    ],
};
