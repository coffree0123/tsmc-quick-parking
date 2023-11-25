'''Authentication module for JWT'''
from fastapi import Request
import httpx
from jose import jwt

TENANT_ID = "0caea1cb-f419-4010-afc6-cb055deaf201"
CLIENT_ID = "445f1017-2318-4b79-a470-9164afe1738b"

class AuthError(Exception):
    '''Authentication error exception'''
    def __init__(self, error_msg:str, status_code:int):
        super().__init__(error_msg)

        self.error_msg = error_msg
        self.status_code = status_code

def get_jwt_token(request: Request):
    '''Return JWT in request header'''
    authorization = request.headers.get('authorization', None)
    if not authorization:
        raise AuthError("Authentication error: Authorization header is missing", 401)

    parts = authorization.split()

    if parts[0].lower() != "bearer":
        raise AuthError("Authentication error: Authorization header must start with 'Bearer'", 401)
    if len(parts) == 1:
        raise AuthError("Authentication error: Token not found", 401)
    if len(parts) > 2:
        raise AuthError("Authentication error: Authorization header must be 'Bearer <token>'", 401)

    token = parts[1]
    return token

async def verify_and_decode_jwt_token(jwt_token):
    '''Verify JWT and decode it. Will raise AuthError if failed'''
    try:
        unverified_header = jwt.get_unverified_header(jwt_token)
    except Exception as exc:
        raise AuthError("Token error: Unable to parse authentication", 401) from exc

    jwks_url = f'https://login.microsoftonline.com/{TENANT_ID}/discovery/v2.0/keys'
    async with httpx.AsyncClient() as client:
        resp = await client.get(jwks_url)
        if resp.status_code != 200:
            raise AuthError("Problem with Azure AD discovery URL", status_code=404)

    jwks = resp.json()
    rsa_key = {}
    for key in jwks["keys"]:
        if key["kid"] == unverified_header["kid"]:
            rsa_key = {
                "kty": key["kty"],
                "kid": key["kid"],
                "use": key["use"],
                "n": key["n"],
                "e": key["e"]
            }

    try:
        payload = jwt.decode(
            jwt_token,
            rsa_key,
            algorithms=["RS256"],
            audience=CLIENT_ID,
            issuer=f'https://login.microsoftonline.com/{TENANT_ID}/v2.0'
        )
    except jwt.ExpiredSignatureError as exc:
        raise AuthError("Token error: The token has expired", 401) from exc
    except jwt.JWTClaimsError as exc:
        raise AuthError("Token error: Please check the audience and issuer", 401) from exc
    except Exception as exc:
        raise AuthError("Token error: Unable to parse authentication", 401) from exc

    return payload
