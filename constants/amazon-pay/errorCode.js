/**
 * Amazon Payログイン時に、リダイレクトURLのパラメータとして渡されるエラーコード
 */

// (1) クライアント側 認証・権限関連
export const ERR_INVALID_SCOPE = "invalid_scope";
export const ERR_UNAUTHORIZED_CLIENT = "unauthorized_client";
export const ERR_INVALID_GRANT = "invalid_grant";

// (2) システム側 認証・権限関連
export const ERR_ACCESS_DENIED = "access_denied"; // ユーザーの拒否が含まれる

// (3) 不正リクエスト
export const ERR_INVALID_REQUEST = "invalid_request";

// (4) Amazon利用不可
export const ERR_SERVER_ERROR = "server_error";
export const ERR_TEMPORARILY_UNAVAILABLE = "temporarily_unavailable";
