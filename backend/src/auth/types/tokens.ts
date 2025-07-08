export type AccessToken = {
    access_token: string;
};

export type AccessTokenPayload = {
    sub: number;
    username: string;
    iat: Date;
    exp: Date;
};
